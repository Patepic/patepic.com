import os
import uuid
import logging
from typing import Optional
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

R2_ACCOUNT_ID = os.environ.get("R2_ACCOUNT_ID", "")
R2_ACCESS_KEY_ID = os.environ.get("R2_ACCESS_KEY_ID", "")
R2_SECRET_ACCESS_KEY = os.environ.get("R2_SECRET_ACCESS_KEY", "")
R2_BUCKET_NAME = os.environ.get("R2_BUCKET_NAME", "")
R2_PUBLIC_BASE_URL = os.environ.get("R2_PUBLIC_BASE_URL", "").rstrip("/")

R2_ENDPOINT = f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com" if R2_ACCOUNT_ID else ""

_client = None


def get_client():
    """Lazy-init S3 client for R2."""
    global _client
    if _client is None:
        if not all([R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME]):
            raise RuntimeError("R2 credentials are not fully configured. Check .env")
        _client = boto3.client(
            "s3",
            endpoint_url=R2_ENDPOINT,
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY,
            config=Config(signature_version="s3v4", region_name="auto"),
        )
    return _client


EXT_TO_MIME = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "webp": "image/webp",
    "gif": "image/gif",
}
ALLOWED_EXTS = set(EXT_TO_MIME.keys())


def upload_image(data: bytes, filename: str, content_type: Optional[str] = None) -> str:
    """Upload image bytes to R2. Returns the public URL."""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "bin"
    if ext not in ALLOWED_EXTS:
        raise ValueError(f"Unsupported file extension: .{ext}. Allowed: {', '.join(sorted(ALLOWED_EXTS))}")

    object_key = f"reviews/{uuid.uuid4().hex}.{ext}"
    mime = content_type or EXT_TO_MIME.get(ext, "application/octet-stream")

    client = get_client()
    try:
        client.put_object(
            Bucket=R2_BUCKET_NAME,
            Key=object_key,
            Body=data,
            ContentType=mime,
            CacheControl="public, max-age=31536000, immutable",
        )
    except ClientError as e:
        logger.error(f"R2 upload failed: {e}")
        raise

    if not R2_PUBLIC_BASE_URL:
        raise RuntimeError("R2_PUBLIC_BASE_URL is not set; public URL cannot be returned.")
    return f"{R2_PUBLIC_BASE_URL}/{object_key}"


def delete_image_by_url(url: str) -> bool:
    """Best-effort delete by parsing the object key out of the public URL."""
    if not url or not R2_PUBLIC_BASE_URL or not url.startswith(R2_PUBLIC_BASE_URL + "/"):
        return False
    object_key = url[len(R2_PUBLIC_BASE_URL) + 1:]
    try:
        get_client().delete_object(Bucket=R2_BUCKET_NAME, Key=object_key)
        return True
    except ClientError as e:
        logger.warning(f"R2 delete failed for {object_key}: {e}")
        return False
