from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import re
import html
import json
import hashlib
import time
import asyncio
import logging
import uuid
import email.utils
from collections import defaultdict
from datetime import datetime, timezone
from typing import List, Optional

import resend
from fastapi import FastAPI, APIRouter, HTTPException, Depends, File, UploadFile, Query, Response, Request
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
from twitch import get_live_status, get_playing_game
from youtube import get_recent_videos
from og import render_share_image

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("patepic")

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "").lower().strip()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")


def normalize_email_address(value: str, fallback: str) -> str:
    value = (value or "").strip()
    name, addr = email.utils.parseaddr(value)
    return addr or fallback

SENDER_EMAIL = normalize_email_address(os.environ.get("SENDER_EMAIL", "contact@patepic.com"), "contact@patepic.com")
CONTACT_RECIPIENT_EMAIL = normalize_email_address(os.environ.get("CONTACT_RECIPIENT_EMAIL", "contact@patepic.com"), "contact@patepic.com").lower()

if not RESEND_API_KEY or RESEND_API_KEY.startswith("re_placeholder"):
    logger.warning("RESEND_API_KEY is missing or placeholder; contact email will be disabled.")
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


class AwardIn(BaseModel):
    model_config = ConfigDict(extra="ignore")

    name: str = Field(..., min_length=1, max_length=100)
    explanation: str = Field("", max_length=2000)


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
    isFeatured: bool = False
    playTime: str = Field("", max_length=60)
    awards: List[AwardIn] = Field(default_factory=list)

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
    isFeatured: Optional[bool] = None
    playTime: Optional[str] = None
    awards: Optional[List[AwardIn]] = None

class NowPlayingIn(BaseModel):
    model_config = ConfigDict(extra="ignore")

    title: str = Field(..., min_length=1, max_length=200)
    cover_url: str = Field("", max_length=1024)
    platform: str = Field("", max_length=60)
    note: str = Field("", max_length=120)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


FIRST_AWARD_YEAR = 2026
TWITCH_HANDLE = os.environ.get("TWITCH_HANDLE", "Patepic")


def extract_review_year(date_str: Optional[str]) -> Optional[int]:
    if not date_str:
        return None
    match = re.search(r"(\d{4})", date_str)
    return int(match.group(1)) if match else None


def normalize_awards(awards: Optional[list]) -> list:
    cleaned = []
    for award in awards or []:
        if isinstance(award, str):
            name = award.strip()
            explanation = ""
        else:
            name = (getattr(award, "name", None) or "").strip()
            explanation = (getattr(award, "explanation", None) or "").strip()
        if name:
            cleaned.append({"name": name, "explanation": explanation})
    return cleaned


def validate_awards(date_str: Optional[str], awards: Optional[list]) -> None:
    if not awards:
        return
    year = extract_review_year(date_str)
    if year is None or year < FIRST_AWARD_YEAR:
        raise HTTPException(
            status_code=400,
            detail=f"Game Awards are only available for reviews dated {FIRST_AWARD_YEAR} or later.",
        )


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


def same_title(a: Optional[str], b: Optional[str]) -> bool:
    norm = lambda v: re.sub(r"[^a-z0-9]+", "", (v or "").lower())
    return bool(norm(a)) and norm(a) == norm(b)


async def clear_now_playing_if_reviewed(title: str) -> None:
    current = await db.settings.find_one({"_id": "now_playing"})
    if current and same_title(current.get("title"), title):
        await db.settings.delete_one({"_id": "now_playing"})


def url_variants(url: str) -> list[str]:
    bare = (url or "").strip().split("://", 1)[-1]
    return [bare, f"https://{bare}", f"http://{bare}"]


def full_url(url: str) -> str:
    url = (url or "").strip()
    return url if not url or url.startswith("http") else f"https://{url}"


async def delete_image_if_unused(url: Optional[str]) -> bool:
    if not url:
        return False
    variants = url_variants(url)
    if await db.reviews.find_one({"cover_url": {"$in": variants}}, {"_id": 1}):
        return False
    if await db.settings.find_one({"_id": "now_playing", "cover_url": {"$in": variants}}, {"_id": 1}):
        return False
    return await asyncio.to_thread(delete_image_by_url, full_url(url))


async def clear_other_featured(slug: str) -> None:
    await db.reviews.update_many(
        {"slug": {"$ne": slug}, "isFeatured": True},
        {"$set": {"isFeatured": False, "updated_at": now_iso()}},
    )


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
    safe_name = html.escape(req.name)
    safe_email = html.escape(req.email)
    safe_subject = html.escape(req.subject)
    safe_message = html.escape(req.message)
    email_html = f"""
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; background:#f4f8fb; color:#1e293b; padding:24px; border-radius:12px;">
      <h2 style="color:#0284c7; margin-top:0;">New Patepic Contact Submission</h2>
      <table style="width:100%; border-collapse:collapse;">
        <tr><td style="padding:8px 0; color:#64748b;">Name</td><td style="padding:8px 0;">{safe_name}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b;">Email</td><td style="padding:8px 0;">{safe_email}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b;">Subject</td><td style="padding:8px 0;">{safe_subject}</td></tr>
      </table>
      <hr style="border:none; border-top:1px solid #e2e8f0; margin:16px 0;" />
      <p style="white-space:pre-wrap; line-height:1.6;">{safe_message}</p>
    </div>
    """
    if not SENDER_EMAIL:
        raise HTTPException(status_code=500, detail="Sender email is not configured.")
    if not CONTACT_RECIPIENT_EMAIL:
        raise HTTPException(status_code=500, detail="Contact recipient email is not configured.")

    logger.info("Sending contact email from %s to %s", SENDER_EMAIL, CONTACT_RECIPIENT_EMAIL)
    params = {
        "from": SENDER_EMAIL,
        "to": [CONTACT_RECIPIENT_EMAIL],
        "reply_to": req.email,
        "subject": f"{req.subject}",
        "html": email_html,
        "text": f"Name: {req.name}\nEmail: {req.email}\nSubject: {req.subject}\n\n{req.message}",
    }
    try:
        result = await resend.Emails.send_async(params)
        return {"status": "success", "email_id": result.get("id")}
    except Exception as e:
        logger.error(f"Resend send failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")


@app.post("/contact")
async def send_contact_root(req: ContactRequest):
    return await send_contact(req)


@api_router.get("/reviews")
async def list_reviews(
    response: Response,
    q: Optional[str] = Query(None),
    platform: Optional[str] = Query(None),
    genre: Optional[str] = Query(None),
    sort: str = Query("recent"),
):
    response.headers["Cache-Control"] = "public, max-age=60"
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
async def get_review(slug: str, response: Response):
    doc = await db.reviews.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Review not found")
    response.headers["Cache-Control"] = "public, max-age=60"
    return doc


@api_router.get("/og/{slug}.png")
async def share_image(slug: str):
    doc = await db.reviews.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Review not found")
    png = await render_share_image(doc)
    return Response(content=png, media_type="image/png", headers={"Cache-Control": "public, max-age=3600"})


@api_router.get("/now-playing")
async def now_playing(response: Response):
    response.headers["Cache-Control"] = "public, max-age=60"
    doc = await db.settings.find_one({"_id": "now_playing"}, {"_id": 0})
    if doc:
        return {**doc, "source": "manual"}
    game = await get_playing_game(TWITCH_HANDLE)
    if game:
        return {**game, "platform": "", "note": "Live on Twitch now", "source": "twitch"}
    return None


@api_router.get("/twitch/live")
async def twitch_live(handle: str = Query(...)):
    return await get_live_status(handle)


@api_router.get("/youtube/recent")
async def youtube_recent(request: Request):
    data = await get_recent_videos()
    body = json.dumps(data, separators=(",", ":"), sort_keys=True)
    etag = '"' + hashlib.sha1(body.encode()).hexdigest() + '"'
    headers = {"Cache-Control": "no-cache", "ETag": etag}
    if request.headers.get("if-none-match") == etag:
        return Response(status_code=304, headers=headers)
    return Response(content=body, media_type="application/json", headers=headers)


LOGIN_MAX_ATTEMPTS = 5
LOGIN_WINDOW_SECONDS = 900
_login_attempts: dict[str, list[float]] = defaultdict(list)


def _check_login_rate_limit(ip: str) -> None:
    now = time.time()
    attempts = _login_attempts[ip]
    attempts[:] = [t for t in attempts if now - t < LOGIN_WINDOW_SECONDS]
    if len(attempts) >= LOGIN_MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="Too many login attempts. Try again later.")
    attempts.append(now)


@api_router.post("/auth/login")
async def login(request: Request, payload: LoginIn):
    _check_login_rate_limit(request.client.host if request.client else "unknown")
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


MAX_UPLOAD_BYTES = 5 * 1024 * 1024


@api_router.delete("/admin/upload")
async def admin_discard_upload(url: str = Query(...), admin=Depends(require_admin)):
    return {"deleted": await delete_image_if_unused(url)}


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


@api_router.post("/admin/reviews")
async def create_review(payload: ReviewIn, admin=Depends(require_admin)):
    validate_awards(payload.date, payload.awards)
    slug = await unique_slug(slugify(payload.title))
    doc = payload.model_dump()
    doc["awards"] = normalize_awards(payload.awards)
    doc.update(
        {
            "id": str(uuid.uuid4()),
            "slug": slug,
            "created_at": now_iso(),
            "updated_at": now_iso(),
        }
    )
    await db.reviews.insert_one(doc)
    await clear_now_playing_if_reviewed(doc["title"])
    if doc.get("isFeatured"):
        await clear_other_featured(slug)
    return serialize_review(doc)


@api_router.put("/admin/reviews/{slug}")
async def update_review(slug: str, payload: ReviewUpdate, admin=Depends(require_admin)):
    existing = await db.reviews.find_one({"slug": slug})
    if not existing:
        raise HTTPException(status_code=404, detail="Review not found")

    updates = payload.model_dump(exclude_unset=True)
    old_cover = existing.get("cover_url") or ""

    date = updates.get("date", existing.get("date"))
    awards = updates.get("awards", existing.get("awards") or [])
    validate_awards(date, awards)
    if "awards" in updates:
        updates["awards"] = normalize_awards(updates["awards"])

    new_slug = slug

    if "title" in updates and updates["title"] != existing.get("title"):
        new_slug = await unique_slug(
            slugify(updates["title"]),
            exclude_slug=slug
        )

    updates["slug"] = new_slug
    updates["updated_at"] = now_iso()

    await db.reviews.update_one(
        {"slug": slug},
        {"$set": updates}
    )

    doc = await db.reviews.find_one({"slug": new_slug}, {"_id": 0})
    if doc and "title" in updates:
        await clear_now_playing_if_reviewed(doc["title"])
    if "cover_url" in updates and old_cover and url_variants(old_cover)[0] != url_variants(updates["cover_url"] or "")[0]:
        await delete_image_if_unused(old_cover)
    return doc


@api_router.get("/admin/now-playing")
async def admin_get_now_playing(admin=Depends(require_admin)):
    return await db.settings.find_one({"_id": "now_playing"}, {"_id": 0})


@api_router.put("/admin/now-playing")
async def admin_set_now_playing(payload: NowPlayingIn, admin=Depends(require_admin)):
    doc = {k: v.strip() for k, v in payload.model_dump().items()}
    doc["updated_at"] = now_iso()
    previous = await db.settings.find_one({"_id": "now_playing"}) or {}
    await db.settings.update_one({"_id": "now_playing"}, {"$set": doc}, upsert=True)
    old_cover = previous.get("cover_url") or ""
    if old_cover and url_variants(old_cover)[0] != url_variants(doc["cover_url"])[0]:
        await delete_image_if_unused(old_cover)
    return doc


@api_router.delete("/admin/now-playing")
async def admin_clear_now_playing(admin=Depends(require_admin)):
    previous = await db.settings.find_one({"_id": "now_playing"}) or {}
    await db.settings.delete_one({"_id": "now_playing"})
    await delete_image_if_unused(previous.get("cover_url"))
    return {"cleared": True}


@api_router.delete("/admin/reviews/{slug}")
async def delete_review(slug: str, admin=Depends(require_admin)):
    existing = await db.reviews.find_one({"slug": slug})
    if not existing:
        raise HTTPException(status_code=404, detail="Review not found")
    await db.reviews.delete_one({"slug": slug})
    await delete_image_if_unused(existing.get("cover_url"))
    return {"deleted": True, "slug": slug}


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=get_cors_origins(),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    try:
        await db.users.create_index("email", unique=True)
        await db.reviews.create_index("slug", unique=True)
    except Exception as e:
        logger.warning(f"Index creation: {e}")

    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        logger.warning("ADMIN_EMAIL or ADMIN_PASSWORD not set, so admin seeding was skipped.")
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
