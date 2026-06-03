"""Patepic — game review blog backend.

Endpoints
=========
Public
- GET    /api/                 health ping
- GET    /api/health           detailed status (resend / r2 / db)
- POST   /api/contact          send contact form via Resend
- GET    /api/reviews          list reviews (supports ?q&platform&genre&sort)
- GET    /api/reviews/{slug}   single review

Auth (admin only)
- POST   /api/auth/login       email/password → JWT bearer token
- GET    /api/auth/me          current admin (requires Authorization)

Admin (Authorization: Bearer <token>)
- POST   /api/admin/upload     upload image to Cloudflare R2 (multipart)
- POST   /api/admin/reviews            create review
- PUT    /api/admin/reviews/{slug}     update review
- DELETE /api/admin/reviews/{slug}     delete review
"""
from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import re
import asyncio
import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional

import resend
from fastapi import FastAPI, APIRouter, HTTPException, Depends, File, UploadFile, Form, Query
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field, ConfigDict

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    require_admin,
)
from storage import upload_image, delete_image_by_url

# ── Setup ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("patepic")

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
CONTACT_RECIPIENT_EMAIL = os.environ.get("CONTACT_RECIPIENT_EMAIL", "")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "").lower().strip()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")

resend.api_key = RESEND_API_KEY

mongo_url = os.environ["MONGO_URL"]
mongo_client = AsyncIOMotorClient(mongo_url)
db = mongo_client[os.environ["DB_NAME"]]

app = FastAPI(title="Patepic API")
api_router = APIRouter(prefix="/api")

DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://patepic.com",
    "https://www.patepic.com",
]


def get_cors_origins() -> list[str]:
    configured = os.environ.get("CORS_ORIGINS", "")
    origins = [origin.strip() for origin in configured.split(",") if origin.strip()]
    return sorted(set(DEFAULT_CORS_ORIGINS + origins))


# ── Models ───────────────────────────────────────────────────────────────────
class ReviewIn(BaseModel):
    model_config = ConfigDict(extra="ignore")

    title: str = Field(..., min_length=1, max_length=200)
    platform: str = Field("", max_length=60)
    genre: List[str] = Field(default_factory=list)
    rating: str = Field("", max_length=20)
    date: str = Field("", max_length=50)
    summary: str = Field("", max_length=400)
    body: str = Field("", max_length=20000)
    cover_url: str = Field("", max_length=1024)
    recommended: Optional[str] = None
    contentType: Optional[str] = None
    pros: List[str] = Field(default_factory=list)
    cons: List[str] = Field(default_factory=list)


class ReviewOut(ReviewIn):
    id: str
    slug: str
    created_at: str
    updated_at: str


class ReviewUpdate(BaseModel):
    model_config = ConfigDict(extra="ignore")

    title: Optional[str] = None
    platform: Optional[str] = None
    genre: Optional[List[str]] = None
    rating: Optional[str] = None
    date: Optional[str] = None
    summary: Optional[str] = None
    body: Optional[str] = None
    cover_url: Optional[str] = None
    recommended: Optional[str] = None
    contentType: Optional[str] = None
    pros: Optional[List[str]] = None
    cons: Optional[List[str]] = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)


# ── Helpers ──────────────────────────────────────────────────────────────────
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def slugify(value: str) -> str:
    value = re.sub(r"[^\w\s-]", "", value.lower()).strip()
    value = re.sub(r"[\s_-]+", "-", value)
    return value or uuid.uuid4().hex[:8]


def serialize_review(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


async def unique_slug(base: str, exclude_slug: Optional[str] = None) -> str:
    candidate = base
    suffix = 2
    while True:
        existing = await db.reviews.find_one({"slug": candidate}, {"_id": 1})
        if not existing or candidate == exclude_slug:
            return candidate
        candidate = f"{base}-{suffix}"
        suffix += 1


# ── Public: health & contact ────────────────────────────────────────────────
@api_router.get("/")
async def root():
    return {"message": "Patepic API up"}


@api_router.get("/health")
async def health():
    try:
        await db.command("ping")
        db_ok = True
    except Exception:
        db_ok = False
    return {
        "status": "ok",
        "db": db_ok,
        "resend_configured": bool(RESEND_API_KEY) and not RESEND_API_KEY.startswith("re_placeholder"),
        "r2_configured": bool(os.environ.get("R2_ACCOUNT_ID")),
    }


@api_router.post("/contact")
async def send_contact(req: ContactRequest):
    if not RESEND_API_KEY or RESEND_API_KEY.startswith("re_placeholder"):
        logger.info(f"[DEV MODE] Contact form from {req.email}: {req.subject}")
        return {"status": "queued", "dev_mode": True}

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; background:#f4f8fb; color:#1e293b; padding:24px; border-radius:12px;">
      <h2 style="color:#0284c7; margin-top:0;">New Patepic Contact Submission</h2>
      <table style="width:100%; border-collapse:collapse;">
        <tr><td style="padding:8px 0; color:#64748b;">Name</td><td style="padding:8px 0;">{req.name}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b;">Email</td><td style="padding:8px 0;">{req.email}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b;">Subject</td><td style="padding:8px 0;">{req.subject}</td></tr>
      </table>
      <hr style="border:none; border-top:1px solid #e2e8f0; margin:16px 0;" />
      <p style="white-space:pre-wrap; line-height:1.6;">{req.message}</p>
    </div>
    """
    params = {
        "from": SENDER_EMAIL,
        "to": [CONTACT_RECIPIENT_EMAIL],
        "reply_to": req.email,
        "subject": f"[Patepic] {req.subject}",
        "html": html,
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        return {"status": "success", "email_id": result.get("id")}
    except Exception as e:
        logger.error(f"Resend send failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")


# ── Public: reviews ─────────────────────────────────────────────────────────
@api_router.get("/reviews")
async def list_reviews(
    q: Optional[str] = Query(None),
    platform: Optional[str] = Query(None),
    genre: Optional[str] = Query(None),
    sort: str = Query("recent"),
):
    query = {}
    if platform:
        query["platform"] = platform
    if genre:
        query["genre"] = genre
    if q:
        query["$or"] = [
            {"title": {"$regex": re.escape(q), "$options": "i"}},
            {"studio": {"$regex": re.escape(q), "$options": "i"}},
            {"genre": {"$regex": re.escape(q), "$options": "i"}},
        ]

    sort_map = {
        "recent": [("year", -1), ("created_at", -1)],
        "score-desc": [("score", -1)],
        "score-asc": [("score", 1)],
        "a-z": [("title", 1)],
    }
    cursor = db.reviews.find(query, {"_id": 0}).sort(sort_map.get(sort, sort_map["recent"]))
    docs = await cursor.to_list(length=500)
    return docs


@api_router.get("/reviews/{slug}")
async def get_review(slug: str):
    doc = await db.reviews.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Review not found")
    return doc


# ── Auth ────────────────────────────────────────────────────────────────────
@api_router.post("/auth/login")
async def login(payload: LoginIn):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user_id=user["id"], email=user["email"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "email": user["email"], "role": user.get("role", "admin")},
    }


@api_router.get("/auth/me")
async def me(admin=Depends(require_admin)):
    return {"id": admin.get("sub"), "email": admin.get("email"), "role": "admin"}


# ── Admin: image upload ─────────────────────────────────────────────────────
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5 MB


@api_router.post("/admin/upload")
async def admin_upload(
    admin=Depends(require_admin),
    file: UploadFile = File(...),
):
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 5 MB)")
    try:
        url = await asyncio.to_thread(upload_image, data, file.filename, file.content_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"R2 upload failed: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {e}")
    return {"url": url, "filename": file.filename, "size": len(data)}


# ── Admin: review CRUD ──────────────────────────────────────────────────────
@api_router.post("/admin/reviews")
async def create_review(payload: ReviewIn, admin=Depends(require_admin)):
    slug = await unique_slug(slugify(payload.title))
    doc = payload.model_dump()
    doc.update(
        {
            "id": str(uuid.uuid4()),
            "slug": slug,
            "created_at": now_iso(),
            "updated_at": now_iso(),
        }
    )
    await db.reviews.insert_one(doc)
    return serialize_review(doc)


@api_router.put("/admin/reviews/{slug}")
async def update_review(slug: str, payload: ReviewUpdate, admin=Depends(require_admin)):
    existing = await db.reviews.find_one({"slug": slug})
    if not existing:
        raise HTTPException(status_code=404, detail="Review not found")

    updates = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    new_slug = slug
    if "title" in updates and updates["title"] != existing.get("title"):
        new_slug = await unique_slug(slugify(updates["title"]), exclude_slug=slug)
    updates["slug"] = new_slug
    updates["updated_at"] = now_iso()

    await db.reviews.update_one({"slug": slug}, {"$set": updates})
    doc = await db.reviews.find_one({"slug": new_slug}, {"_id": 0})
    return doc


@api_router.delete("/admin/reviews/{slug}")
async def delete_review(slug: str, admin=Depends(require_admin)):
    existing = await db.reviews.find_one({"slug": slug})
    if not existing:
        raise HTTPException(status_code=404, detail="Review not found")
    # Best-effort delete the cover from R2 too
    cover = existing.get("cover_url", "")
    if cover:
        await asyncio.to_thread(delete_image_by_url, cover)
    await db.reviews.delete_one({"slug": slug})
    return {"deleted": True, "slug": slug}


# ── Mount + CORS ────────────────────────────────────────────────────────────
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=get_cors_origins(),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Startup: seed admin + indexes ───────────────────────────────────────────
@app.on_event("startup")
async def startup():
    try:
        await db.users.create_index("email", unique=True)
        await db.reviews.create_index("slug", unique=True)
    except Exception as e:
        logger.warning(f"Index creation: {e}")

    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        logger.warning("ADMIN_EMAIL or ADMIN_PASSWORD not set — admin seeding skipped.")
        return

    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if existing is None:
        await db.users.insert_one(
            {
                "id": str(uuid.uuid4()),
                "email": ADMIN_EMAIL,
                "password_hash": hash_password(ADMIN_PASSWORD),
                "role": "admin",
                "created_at": now_iso(),
            }
        )
        logger.info(f"Seeded admin user: {ADMIN_EMAIL}")
    elif not verify_password(ADMIN_PASSWORD, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": ADMIN_EMAIL},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )
        logger.info("Admin password updated from .env")


@app.on_event("shutdown")
async def shutdown():
    mongo_client.close()
