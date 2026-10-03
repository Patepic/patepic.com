import re
import time
import asyncio
import logging
from datetime import datetime
from typing import Optional
from xml.etree import ElementTree as ET

import httpx

logger = logging.getLogger(__name__)

YOUTUBE_CHANNEL_ID = "UC4dSp0pH0jfntIfKmlbw_BQ"

SUCCESS_TTL_SECONDS = 45 * 60
FAILURE_TTL_SECONDS = 5 * 60

_FEED_URL = "https://www.youtube.com/feeds/videos.xml"
_HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; PatepicBot/1.0; +https://patepic.com)"}

_NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "media": "http://search.yahoo.com/mrss/",
    "yt": "http://www.youtube.com/xml/schemas/2015",
}

_cache: dict = {"channel_id": None, "data": None, "expires_at": 0.0}
_lock = asyncio.Lock()

_channel_url_cache: dict[str, str] = {}

_HANDLE_RE = re.compile(
    r'"vanityChannelUrl":"https?://(?:www\.)?youtube\.com/(@[^"/?]+)"'
    r'|"canonicalBaseUrl":"/(@[^"/?]+)"'
)


def _uploads_playlist_id(channel_id: str) -> Optional[str]:
    if not channel_id.startswith("UC"):
        return None
    return "UULF" + channel_id[2:]


def _thumbnails(video_id: str) -> tuple[str, str]:
    return (
        f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg",
        f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
    )


def _parse_feed(xml_bytes: bytes) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    videos = []
    for entry in root.findall("atom:entry", _NS):
        video_id_el = entry.find("yt:videoId", _NS)
        title_el = entry.find("atom:title", _NS)
        link_el = entry.find("atom:link", _NS)
        published_el = entry.find("atom:published", _NS)
        if video_id_el is None or title_el is None or link_el is None or published_el is None:
            continue
        if not (video_id_el.text and published_el.text):
            continue

        url = link_el.get("href") or f"https://www.youtube.com/watch?v={video_id_el.text}"
        if "/shorts/" in url:
            continue

        try:
            published_dt = datetime.fromisoformat(published_el.text)
        except ValueError:
            continue

        thumb, thumb_fallback = _thumbnails(video_id_el.text)
        videos.append({
            "id": video_id_el.text,
            "title": (title_el.text or "").strip(),
            "url": url,
            "publishedAt": published_el.text,
            "thumbnail": thumb,
            "thumbnailFallback": thumb_fallback,
            "_published_dt": published_dt,
        })

    videos.sort(key=lambda v: v["_published_dt"], reverse=True)
    for v in videos:
        del v["_published_dt"]
    return videos


async def _fetch_uploads_feed(client: httpx.AsyncClient) -> list[dict]:
    playlist_id = _uploads_playlist_id(YOUTUBE_CHANNEL_ID)
    if not playlist_id:
        raise ValueError(f"YOUTUBE_CHANNEL_ID {YOUTUBE_CHANNEL_ID!r} doesn't start with 'UC'")
    resp = await client.get(_FEED_URL, params={"playlist_id": playlist_id})
    resp.raise_for_status()
    return _parse_feed(resp.content)


async def _is_short(client: httpx.AsyncClient, video_id: str) -> bool:
    try:
        resp = await client.get(f"https://www.youtube.com/shorts/{video_id}", follow_redirects=False)
        return resp.status_code == 200
    except Exception:
        return True


async def _fetch_channel_feed_filtered(client: httpx.AsyncClient) -> list[dict]:
    resp = await client.get(_FEED_URL, params={"channel_id": YOUTUBE_CHANNEL_ID})
    resp.raise_for_status()
    videos = _parse_feed(resp.content)
    is_short_flags = await asyncio.gather(*(_is_short(client, v["id"]) for v in videos))
    return [v for v, is_short in zip(videos, is_short_flags) if not is_short]


async def _fetch_videos() -> list[dict]:
    try:
        async with httpx.AsyncClient(timeout=10, headers=_HEADERS) as client:
            return await _fetch_uploads_feed(client)
    except Exception as e:
        logger.warning(f"YouTube uploads-playlist feed failed, falling back to channel feed: {e}")

    try:
        async with httpx.AsyncClient(timeout=20, headers=_HEADERS) as client:
            return await _fetch_channel_feed_filtered(client)
    except Exception as e:
        logger.warning(f"YouTube channel feed fallback also failed: {e}")
        return []


async def _channel_url() -> str:
    if YOUTUBE_CHANNEL_ID in _channel_url_cache:
        return _channel_url_cache[YOUTUBE_CHANNEL_ID]
    fallback = f"https://www.youtube.com/channel/{YOUTUBE_CHANNEL_ID}"
    try:
        async with httpx.AsyncClient(
            timeout=10, headers={**_HEADERS, "Accept-Language": "en"}, follow_redirects=True
        ) as client:
            resp = await client.get(fallback)
            resp.raise_for_status()
        match = _HANDLE_RE.search(resp.text)
        if match:
            url = f"https://www.youtube.com/{match.group(1) or match.group(2)}"
            _channel_url_cache[YOUTUBE_CHANNEL_ID] = url
            return url
        logger.warning("YouTube channel page had no @handle; using the /channel/ URL")
    except Exception as e:
        logger.warning(f"Couldn't resolve the YouTube @handle, using the /channel/ URL: {e}")
    return fallback


async def get_recent_videos() -> dict:
    def _fresh() -> bool:
        return (
            _cache["data"] is not None
            and _cache["channel_id"] == YOUTUBE_CHANNEL_ID
            and _cache["expires_at"] > time.time()
        )

    if _fresh():
        return _cache["data"]

    async with _lock:
        if _fresh():
            return _cache["data"]

        videos = await _fetch_videos()
        data = {
            "latest": videos[0] if videos else None,
            "recent": videos[1:7],
            "channelUrl": await _channel_url(),
        }

        _cache["channel_id"] = YOUTUBE_CHANNEL_ID
        _cache["data"] = data
        _cache["expires_at"] = time.time() + (SUCCESS_TTL_SECONDS if videos else FAILURE_TTL_SECONDS)
        return data
