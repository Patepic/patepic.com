import os
import time
import logging
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

TWITCH_CLIENT_ID = os.environ.get("TWITCH_CLIENT_ID", "")
TWITCH_CLIENT_SECRET = os.environ.get("TWITCH_CLIENT_SECRET", "")

_token_cache = {"value": None, "expires_at": 0.0}


async def _get_app_token() -> Optional[str]:
    if not TWITCH_CLIENT_ID or not TWITCH_CLIENT_SECRET:
        return None
    if _token_cache["value"] and _token_cache["expires_at"] > time.time() + 60:
        return _token_cache["value"]

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post(
            "https://id.twitch.tv/oauth2/token",
            params={
                "client_id": TWITCH_CLIENT_ID,
                "client_secret": TWITCH_CLIENT_SECRET,
                "grant_type": "client_credentials",
            },
        )
    resp.raise_for_status()
    data = resp.json()
    _token_cache["value"] = data["access_token"]
    _token_cache["expires_at"] = time.time() + data.get("expires_in", 0)
    return _token_cache["value"]


async def get_live_status(handle: str) -> dict:
    empty = {"isLive": False, "title": "", "game": "", "viewers": 0}
    token = await _get_app_token()
    if not token:
        return empty

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://api.twitch.tv/helix/streams",
                params={"user_login": handle},
                headers={"Client-Id": TWITCH_CLIENT_ID, "Authorization": f"Bearer {token}"},
            )
        resp.raise_for_status()
        streams = resp.json().get("data", [])
    except Exception as e:
        logger.warning(f"Twitch live check failed: {e}")
        return empty

    stream = streams[0] if streams else None
    if not stream:
        return empty
    return {
        "isLive": True,
        "title": stream.get("title", ""),
        "game": stream.get("game_name", ""),
        "gameId": stream.get("game_id", ""),
        "viewers": stream.get("viewer_count", 0),
    }


NON_GAME_CATEGORIES = {"just chatting"}
_game_cache: dict[str, dict] = {}


async def get_playing_game(handle: str) -> Optional[dict]:
    status = await get_live_status(handle)
    name = status.get("game") or ""
    game_id = status.get("gameId") or ""
    if not status.get("isLive") or not game_id or name.strip().lower() in NON_GAME_CATEGORIES:
        return None

    game = _game_cache.get(game_id)
    if game is None:
        token = await _get_app_token()
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(
                    "https://api.twitch.tv/helix/games",
                    params={"id": game_id},
                    headers={"Client-Id": TWITCH_CLIENT_ID, "Authorization": f"Bearer {token}"},
                )
            resp.raise_for_status()
            data = resp.json().get("data", [])
        except Exception as e:
            logger.warning(f"Twitch game lookup failed: {e}")
            return None
        if not data:
            return None
        game = data[0]
        _game_cache[game_id] = game

    if not game.get("igdb_id"):
        return None
    cover = (game.get("box_art_url") or "").replace("{width}", "600").replace("{height}", "800")
    return {"title": game.get("name") or name, "cover_url": cover}
