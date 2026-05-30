from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
CONTACT_RECIPIENT_EMAIL = os.environ.get('CONTACT_RECIPIENT_EMAIL', 'you@example.com')

resend.api_key = RESEND_API_KEY

app = FastAPI(title="Frostbyte API")
api_router = APIRouter(prefix="/api")


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)


@api_router.get("/")
async def root():
    return {"message": "Frostbyte API up"}


@api_router.get("/health")
async def health():
    return {
        "status": "ok",
        "resend_configured": bool(RESEND_API_KEY) and not RESEND_API_KEY.startswith("re_placeholder"),
    }


@api_router.post("/contact")
async def send_contact(req: ContactRequest):
    if not RESEND_API_KEY or RESEND_API_KEY.startswith("re_placeholder"):
        # Simulate success in dev mode (no real key set) so UI flow works
        logger.info(f"[DEV MODE] Contact form submission from {req.email}: {req.subject}")
        return {
            "status": "queued",
            "dev_mode": True,
            "detail": "Resend API key not configured. Submission logged but not emailed."
        }

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; background:#0f172a; color:#f8fafc; padding:24px; border-radius:12px;">
      <h2 style="color:#22d3ee; margin-top:0;">New Frostbyte Contact Submission</h2>
      <table style="width:100%; border-collapse:collapse;">
        <tr><td style="padding:8px 0; color:#94a3b8;">Name</td><td style="padding:8px 0;">{req.name}</td></tr>
        <tr><td style="padding:8px 0; color:#94a3b8;">Email</td><td style="padding:8px 0;">{req.email}</td></tr>
        <tr><td style="padding:8px 0; color:#94a3b8;">Subject</td><td style="padding:8px 0;">{req.subject}</td></tr>
      </table>
      <hr style="border:none; border-top:1px solid #1e293b; margin:16px 0;" />
      <p style="white-space:pre-wrap; line-height:1.6;">{req.message}</p>
    </div>
    """

    params = {
        "from": SENDER_EMAIL,
        "to": [CONTACT_RECIPIENT_EMAIL],
        "reply_to": req.email,
        "subject": f"[Frostbyte] {req.subject}",
        "html": html,
    }

    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        return {"status": "success", "email_id": result.get("id")}
    except Exception as e:
        logger.error(f"Resend send failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
