import asyncio
import io
import math
import time
import logging
from pathlib import Path
from typing import Optional

import httpx
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

logger = logging.getLogger(__name__)

WIDTH, HEIGHT = 1200, 630
FONT_DIR = Path(__file__).parent.parent / "public" / "fonts"
FONT_URL = "https://patepic.com/fonts"

CHARCOAL_BROWN = (80, 68, 64)
WHITE = (255, 248, 235)
STRAW = (251, 221, 166)
CHARCOAL_BROWN_MUTED = (80, 68, 64, 200)
TIER_INK = (23, 28, 26)

TIER_COLOR = {
    "★": (244, 197, 66),
    "S+": (255, 111, 97),
    "S": (255, 162, 76),
    "A": (155, 214, 106),
    "B": (79, 199, 179),
    "C": (107, 163, 242),
    "D": (165, 139, 242),
    "F": (156, 165, 180),
}

TIER_LABEL = {
    "★": "Favorite",
    "S+": "Masterpiece",
    "S": "Elite",
    "A": "Excellent",
    "B": "Great",
    "C": "Above Average",
    "D": "Below Average",
    "F": "Avoid",
}

_cache: dict[str, tuple[str, bytes]] = {}
_CACHE_LIMIT = 200


def get_tier(review: dict) -> str:
    if review.get("isFeatured"):
        return "★"
    try:
        score = float(review.get("rating") or "nan")
    except ValueError:
        score = float("nan")
    cons = review.get("cons") if isinstance(review.get("cons"), list) else None
    flaws = len(cons) if cons is not None else 0
    no_flaws = cons is not None and "Hard to point to any real flaws" in cons
    if score <= 3 or review.get("recommended") == "no":
        return "F"
    if score <= 5:
        return "D"
    if score <= 6:
        return "C"
    if score == 7:
        return "B" if flaws <= 2 else "C"
    if score == 8:
        return "A" if flaws <= 2 else "B"
    if score == 9:
        if no_flaws:
            return "S+"
        return "S" if flaws <= 2 else "A"
    if score == 10:
        return "S+" if no_flaws else "S"
    return "C"


FONT_FILES = {"SemiBold": "Medium", "Bold": "Bold", "ExtraBold": "Black"}
_font_bytes: dict[str, bytes] = {}
_font_failed_at: dict[str, float] = {}


def _load_font_bytes(name: str) -> Optional[bytes]:
    if name in _font_bytes:
        return _font_bytes[name]
    if time.time() - _font_failed_at.get(name, 0) < 600:
        return None
    local = FONT_DIR / f"MADEOkineSans-{name}.woff2"
    try:
        if local.exists():
            data = local.read_bytes()
        else:
            res = httpx.get(f"{FONT_URL}/MADEOkineSans-{name}.woff2", timeout=10)
            res.raise_for_status()
            data = res.content
        ImageFont.truetype(io.BytesIO(data), 12)
    except Exception as e:
        logger.warning("Share image: font %s unavailable: %s", name, e)
        _font_failed_at[name] = time.time()
        return None
    _font_bytes[name] = data
    return data


def _font(weight: str, size: int) -> ImageFont.FreeTypeFont:
    data = _load_font_bytes(FONT_FILES[weight])
    if data is None:
        return ImageFont.load_default(size)
    return ImageFont.truetype(io.BytesIO(data), size)


def _mix(a: tuple, b: tuple, t: float) -> tuple:
    return tuple(round(a[i] * t + b[i] * (1 - t)) for i in range(3))


def _wrap(draw: ImageDraw.ImageDraw, text: str, font, width: int, max_lines: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    line = ""
    for word in words:
        candidate = f"{line} {word}".strip()
        if draw.textlength(candidate, font=font) <= width:
            line = candidate
            continue
        if line:
            lines.append(line)
        line = word
        if len(lines) == max_lines:
            break
    if line and len(lines) < max_lines:
        lines.append(line)
    if len(lines) == max_lines and " ".join(lines) != " ".join(words):
        last = lines[-1]
        while last and draw.textlength(last + "...", font=font) > width:
            last = last[:-1]
        lines[-1] = last.rstrip() + "..."
    return lines


def _hexagon(cx: int, cy: int, w: int, h: int) -> list[tuple[float, float]]:
    return [
        (cx, cy - h / 2),
        (cx + w / 2, cy - h / 4),
        (cx + w / 2, cy + h / 4),
        (cx, cy + h / 2),
        (cx - w / 2, cy + h / 4),
        (cx - w / 2, cy - h / 4),
    ]


def _star(cx: float, cy: float, r: float) -> list[tuple[float, float]]:
    points = []
    for i in range(10):
        radius = r if i % 2 == 0 else r * 0.45
        angle = -math.pi / 2 + i * math.pi / 5
        points.append((cx + radius * math.cos(angle), cy + radius * math.sin(angle)))
    return points


def _cover_url(review: dict) -> Optional[str]:
    url = (review.get("cover_url") or "").strip()
    if not url:
        return None
    return url if url.startswith("http") else f"https://{url}"


async def _fetch_cover(review: dict) -> Optional[Image.Image]:
    url = _cover_url(review)
    if not url:
        return None
    try:
        async with httpx.AsyncClient(timeout=8, follow_redirects=True) as client:
            res = await client.get(url)
            res.raise_for_status()
        return Image.open(io.BytesIO(res.content)).convert("RGB")
    except Exception as e:
        logger.warning("Share image: cover fetch failed for %s: %s", url, e)
        return None


def _render(review: dict, cover: Optional[Image.Image]) -> bytes:
    tier = get_tier(review)
    tier_rgb = TIER_COLOR[tier]
    label = TIER_LABEL[tier]

    img = Image.new("RGB", (WIDTH, HEIGHT), WHITE)
    draw = ImageDraw.Draw(img, "RGBA")

    for r, alpha in ((520, 26), (380, 20)):
        draw.ellipse((-r // 2 - 120, -r // 2 - 140, r // 2 + r - 120, r // 2 + r - 140), outline=(*STRAW, alpha * 3), width=26)
    draw.rectangle((0, HEIGHT - 18, WIDTH, HEIGHT), fill=tier_rgb)

    card_w, card_h = 380, 540
    cx0, cy0 = 90, (HEIGHT - card_h) // 2 - 6
    cx1, cy1 = cx0 + card_w, cy0 + card_h
    border = 14

    shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((cx0 + 10, cy0 + 24, cx1 - 10, cy1 + 14), radius=28, fill=(*CHARCOAL_BROWN, 90))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    img.paste(shadow, (0, 0), shadow)
    draw = ImageDraw.Draw(img, "RGBA")

    draw.rounded_rectangle((cx0, cy0, cx1, cy1), radius=28, fill=tier_rgb)
    draw.rounded_rectangle((cx0 + border, cy0 + border, cx1 - border, cy1 - border), radius=16, fill=_mix(tier_rgb, WHITE, 0.14))

    ix0, ix1 = cx0 + border + 12, cx1 - border - 12
    inner_w = ix1 - ix0

    stage_font = _font("ExtraBold", 18)
    name_font = _font("Bold", 22)
    stage_w = max(40, int(draw.textlength(tier, font=stage_font)) + 22)
    head_y = cy0 + border + 12
    draw.rounded_rectangle((ix0, head_y, ix0 + stage_w, head_y + 40), radius=20, fill=tier_rgb, outline=(*TIER_INK, 150), width=2)
    if tier == "★":
        draw.polygon(_star(ix0 + stage_w / 2, head_y + 21, 11), fill=TIER_INK)
    else:
        draw.text((ix0 + stage_w / 2, head_y + 20), tier, font=stage_font, fill=TIER_INK, anchor="mm")
    name_lines = _wrap(draw, review.get("title") or "", name_font, inner_w - stage_w - 12, 2)
    line_h = 26
    ny = head_y + 20 - (len(name_lines) * line_h) / 2
    for i, line in enumerate(name_lines):
        draw.text((ix0 + stage_w + 12, ny + i * line_h + line_h / 2), line, font=name_font, fill=CHARCOAL_BROWN, anchor="lm")

    art_y0 = head_y + 54
    art_h = round(inner_w * 3 / 4)
    art_box = (ix0, art_y0, ix1, art_y0 + art_h)
    draw.rectangle((art_box[0] - 4, art_box[1] - 4, art_box[2] + 4, art_box[3] + 4), fill=_mix(tier_rgb, WHITE, 0.6))
    if cover is not None:
        img.paste(ImageOps.fit(cover, (inner_w, art_h), Image.LANCZOS), (ix0, art_y0))
    else:
        draw.rectangle(art_box, fill=_mix(tier_rgb, WHITE, 0.3))
    draw = ImageDraw.Draw(img, "RGBA")

    hx, hy = ix1 - 38, art_y0 + 44
    draw.polygon(_hexagon(hx, hy, 62, 70), fill=TIER_INK)
    draw.polygon(_hexagon(hx, hy, 52, 60), fill=tier_rgb)
    draw.text((hx, hy + 1), str(review.get("rating") or "?"), font=_font("ExtraBold", 24), fill=TIER_INK, anchor="mm")

    verdict_font = _font("SemiBold", 17)
    vy = art_y0 + art_h + 18
    summary = (review.get("summary") or "").strip()
    if summary:
        for i, line in enumerate(_wrap(draw, summary, verdict_font, inner_w, 4)):
            draw.text((ix0, vy + i * 24), line, font=verdict_font, fill=(*CHARCOAL_BROWN, 215))

    set_y = cy1 - border - 30
    draw.line((ix0, set_y - 10, ix1, set_y - 10), fill=(*CHARCOAL_BROWN, 50), width=1)
    draw.text((ix0, set_y + 6), label, font=_font("Bold", 16), fill=CHARCOAL_BROWN, anchor="lm")
    draw.text((ix1, set_y + 6), "patepic.com", font=_font("SemiBold", 14), fill=CHARCOAL_BROWN_MUTED, anchor="rm")

    tx = cx1 + 80
    tw = WIDTH - tx - 70
    draw.text((tx, 120), "PATEPIC REVIEW", font=_font("Bold", 20), fill=CHARCOAL_BROWN_MUTED)

    title_font = _font("ExtraBold", 58)
    title_lines = _wrap(draw, review.get("title") or "", title_font, tw, 3)
    if len(title_lines) == 3:
        title_font = _font("ExtraBold", 46)
        title_lines = _wrap(draw, review.get("title") or "", title_font, tw, 3)
    ty = 156
    step = int(title_font.size * 1.12)
    for line in title_lines:
        draw.text((tx, ty), line, font=title_font, fill=CHARCOAL_BROWN)
        ty += step

    ty += 22
    score_text = f"{review.get('rating')}/10" if review.get("rating") else ""
    badge_font = _font("Bold", 24)
    badge_text = label if tier == "★" else f"{tier}  {label}"
    bw = int(draw.textlength(badge_text, font=badge_font)) + 40
    draw.rounded_rectangle((tx, ty, tx + bw, ty + 50), radius=25, fill=tier_rgb, outline=TIER_INK, width=3)
    draw.text((tx + bw / 2, ty + 25), badge_text, font=badge_font, fill=TIER_INK, anchor="mm")
    if score_text:
        draw.text((tx + bw + 20, ty + 25), score_text, font=_font("ExtraBold", 30), fill=CHARCOAL_BROWN, anchor="lm")

    genres = review.get("genre") or []
    if isinstance(genres, str):
        genres = [genres]
    facts = " / ".join(x for x in [review.get("platform") or "", ", ".join(g for g in genres if g)] if x)
    if facts:
        fact_lines = _wrap(draw, facts, _font("SemiBold", 22), tw, 2)
        for i, line in enumerate(fact_lines):
            draw.text((tx, ty + 76 + i * 32), line, font=_font("SemiBold", 22), fill=CHARCOAL_BROWN_MUTED)

    out = io.BytesIO()
    img.save(out, "PNG", optimize=True)
    return out.getvalue()


async def render_share_image(review: dict) -> bytes:
    slug = review.get("slug") or ""
    version = review.get("updated_at") or ""
    hit = _cache.get(slug)
    if hit and hit[0] == version:
        return hit[1]
    cover = await _fetch_cover(review)
    png = await asyncio.to_thread(_render, review, cover)
    if len(_cache) >= _CACHE_LIMIT:
        _cache.pop(next(iter(_cache)))
    _cache[slug] = (version, png)
    return png
