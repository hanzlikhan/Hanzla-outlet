"""
Quick DB connection check.

Run from backend/:
  python scripts/check_db.py

If connection fails and your password contains @ or #, use URL encoding in .env:
  @  →  %40
  #  →  %23
Example: password "pass@word" → postgresql+asyncpg://user:pass%40word@host:5432/db
"""

import asyncio
import sys
from pathlib import Path

# Add backend root to path so "app" is found when running: python scripts/check_db.py
_backend_root = Path(__file__).resolve().parent.parent
if str(_backend_root) not in sys.path:
    sys.path.insert(0, str(_backend_root))


def main() -> None:
    async def run() -> None:
        try:
            from app.database import engine
            async with engine.connect() as conn:
                await conn.run_sync(lambda _: None)
            print("Database connection OK.")
        except Exception as e:
            print("Database connection failed:", e, file=sys.stderr)
            if "@" in str(getattr(e, "orig", None) or ""):
                pass
            # Check if DATABASE_URL might have unencoded @ in password
            try:
                from app.config import settings
                url = settings.DATABASE_URL
                if "://" in url:
                    rest = url.split("://", 1)[1]
                    if "@" in rest and rest.count("@") >= 2:
                        print("\nTip: If your password contains @ or #, URL-encode it in DATABASE_URL:\n  @  ->  %40\n  #  ->  %23", file=sys.stderr)
            except Exception:
                pass
            sys.exit(1)

    asyncio.run(run())


if __name__ == "__main__":
    main()
