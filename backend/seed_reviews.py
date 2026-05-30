"""One-shot seed script: migrate the 8 sample reviews into MongoDB.

Run with:  python /app/backend/seed_reviews.py
Idempotent — re-running won't duplicate.
"""
import asyncio
import os
import re
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from motor.motor_asyncio import AsyncIOMotorClient


REVIEWS = [
    {
        "title": "Baldur's Gate 3",
        "studio": "Larian Studios",
        "year": 2023,
        "platform": "PC",
        "platforms": ["PC", "PS5", "Xbox Series X|S"],
        "genre": "RPG",
        "score": 9.8,
        "cover_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
        "verdict": "A once-in-a-generation CRPG that respects your time, your choices, and your imagination.",
        "pros": [
            "Staggering depth of player agency",
            "Performance-grade voice acting",
            "Turn-based combat that finally feels cinematic",
            "Co-op that actually works",
        ],
        "cons": [
            "Act 3 performance dips on lower-end rigs",
            "UI can feel cluttered during long fights",
        ],
        "body": "## A new high water mark for the genre\n\nLarian didn't just adapt 5th Edition D&D — they translated the joy of a great tabletop night into pixels. Every encounter feels authored, every NPC remembered, every dumb decision applauded with consequences.\n\n### Combat that breathes\nThe turn-based system is **patient with newcomers** but rewards system mastery. Surfaces, height, and verticality turn arenas into puzzles you solve with violence.\n\n### Companions worth caring about\nShadowheart, Karlach, Astarion — each has an arc that competes with the main plot.\n\n> \"The best Dungeon Master is the one who lets the players surprise themselves.\"\n\nBG3 lives that ethos for 100+ hours.",
    },
    {
        "title": "Elden Ring",
        "studio": "FromSoftware",
        "year": 2022,
        "platform": "PS5",
        "platforms": ["PC", "PS5", "Xbox Series X|S"],
        "genre": "Action",
        "score": 9.6,
        "cover_url": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80",
        "verdict": "Open-world design reinvented through the lens of a studio that doesn't make tutorials.",
        "pros": ["World density without map clutter", "Combat finally given room to breathe", "Genuinely surprising late-game vistas"],
        "cons": ["Late-game performance hitches", "Some legacy dungeons feel reused"],
        "body": "## Welcome to the Lands Between\n\nFromSoftware's open-world experiment doesn't hold your hand. That's the point. Every reward is earned, every shortcut self-discovered, every boss a story you'll tell your friends.\n\n### Spectacle with substance\nThe game's silhouettes are unforgettable.",
    },
    {
        "title": "Tears of the Kingdom",
        "studio": "Nintendo EPD",
        "year": 2023,
        "platform": "Switch",
        "platforms": ["Switch"],
        "genre": "Adventure",
        "score": 9.5,
        "cover_url": "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=1600&q=80",
        "verdict": "Breath of the Wild's playground, now with a physics engine you can break in half.",
        "pros": ["Ultrahand turns the world into LEGO", "Sky islands feel genuinely new", "Best dungeon design in 20 years"],
        "cons": ["Performance hitches in the Depths", "Weapon durability remains divisive"],
        "body": "## A toy box of impossible scale\n\nUltrahand isn't a gimmick — it's the **entire game**.",
    },
    {
        "title": "Hades II",
        "studio": "Supergiant Games",
        "year": 2024,
        "platform": "PC",
        "platforms": ["PC"],
        "genre": "Roguelike",
        "score": 9.2,
        "cover_url": "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=1600&q=80",
        "verdict": "A sequel that refuses to coast. Bigger, weirder, witchier.",
        "pros": ["Melinoë is instantly iconic", "Two distinct overworld paths", "Cast still has Supergiant magic"],
        "cons": ["Early access pacing is uneven", "Some weapons outshine others"],
        "body": "## Witchcraft, but make it speedrunnable\n\nSupergiant didn't reinvent the wheel — they just made it cast spells.",
    },
    {
        "title": "Marvel's Spider-Man 2",
        "studio": "Insomniac Games",
        "year": 2023,
        "platform": "PS5",
        "platforms": ["PS5"],
        "genre": "Action",
        "score": 8.9,
        "cover_url": "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1600&q=80",
        "verdict": "Two Spider-Men, one polished triple-A blockbuster. Predictably excellent.",
        "pros": ["Web-wings are a revelation", "Venom presence looms thrillingly", "Character switching done right"],
        "cons": ["Side activities feel familiar", "Story rushes its third act"],
        "body": "## Webhead, evolved\n\nThe wings transform traversal from *fun* to *meditative*.",
    },
    {
        "title": "Cyberpunk 2077: Phantom Liberty",
        "studio": "CD Projekt Red",
        "year": 2023,
        "platform": "PC",
        "platforms": ["PC", "PS5", "Xbox Series X|S"],
        "genre": "RPG",
        "score": 8.7,
        "cover_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
        "verdict": "The expansion Cyberpunk always deserved. Idris Elba sells every line.",
        "pros": ["Dogtown is a masterclass in vertical level design", "Spy-thriller tone lands", "Idris Elba"],
        "cons": ["Requires a beefy GPU for path tracing", "Endings will leave you hollow"],
        "body": "## Redemption arc, completed\n\nCDPR didn't fix Cyberpunk by adding more — they fixed it by curating.",
    },
    {
        "title": "Stardew Valley",
        "studio": "ConcernedApe",
        "year": 2016,
        "platform": "Switch",
        "platforms": ["PC", "Switch", "PS5", "Xbox Series X|S", "Mobile"],
        "genre": "Simulation",
        "score": 9.7,
        "cover_url": "https://images.unsplash.com/photo-1601987177651-8edfe6c20009?auto=format&fit=crop&w=1600&q=80",
        "verdict": "A solo dev built the coziest game on Earth. Then kept updating it. Forever.",
        "pros": ["Endlessly approachable", "Genuine emotional anchors", "Free updates that put AAA studios to shame"],
        "cons": ["Late-game can feel directionless", "Marriage UI is still a bit clunky"],
        "body": "## A farm, a town, a quiet revolution\n\nStardew is the rare game that **respects your bedtime**.",
    },
    {
        "title": "Starfield",
        "studio": "Bethesda",
        "year": 2023,
        "platform": "Xbox Series X|S",
        "platforms": ["PC", "Xbox Series X|S"],
        "genre": "RPG",
        "score": 7.2,
        "cover_url": "https://images.pexels.com/photos/32977036/pexels-photo-32977036.jpeg",
        "verdict": "A thousand planets, a hundred good ideas, and one tired engine holding it back.",
        "pros": ["Ship building is a sandbox", "Some quest lines genuinely shine"],
        "cons": ["Loading screens, loading screens, loading screens", "Procedural worlds feel hollow", "Aged dialogue tech"],
        "body": "## The galaxy is big. Sometimes too big.\n\nThere's a wonderful game inside Starfield — it's just buried under fast-travel menus and procedural sameness.",
    },
]


def slugify(value: str) -> str:
    value = re.sub(r"[^\w\s-]", "", value.lower()).strip()
    return re.sub(r"[\s_-]+", "-", value) or uuid.uuid4().hex[:8]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


async def main():
    client = AsyncIOMotorClient(os.environ["MONGO_URL"])
    db = client[os.environ["DB_NAME"]]

    inserted = 0
    skipped = 0
    for r in REVIEWS:
        slug = slugify(r["title"])
        if await db.reviews.find_one({"slug": slug}, {"_id": 1}):
            skipped += 1
            continue
        doc = {
            **r,
            "id": str(uuid.uuid4()),
            "slug": slug,
            "created_at": now_iso(),
            "updated_at": now_iso(),
        }
        await db.reviews.insert_one(doc)
        inserted += 1

    total = await db.reviews.count_documents({})
    print(f"Seeded: {inserted} inserted, {skipped} skipped. Total in DB: {total}")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
