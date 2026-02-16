"""
Application settings loaded from environment variables.
Uses Pydantic BaseSettings for validation and .env loading.
.env is always loaded from backend/ so it works no matter where you run from.
"""

from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Backend root (parent of app/) – .env lives here
_BACKEND_ROOT = Path(__file__).resolve().parent.parent
_ENV_FILE = _BACKEND_ROOT / ".env"


class Settings(BaseSettings):
    """App configuration. All values can be overridden via env vars or .env file."""

    model_config = SettingsConfigDict(
        env_file=_ENV_FILE if _ENV_FILE.exists() else ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Required: PostgreSQL URL (accepts postgresql:// or postgresql+asyncpg://)
    DATABASE_URL: str = Field(..., min_length=1)

    # Required: secret used for JWT signing and session security
    SECRET: str = Field(..., min_length=1)

    # Optional: Gemini AI key for Stylist feature
    GOOGLE_API_KEY: str | None = None

    # CORS allowed origins: in .env use comma-separated string; we expose as list
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def async_database_url(self) -> str:
        """DATABASE_URL guaranteed to use the asyncpg driver.

        Supabase gives 'postgresql://…' but SQLAlchemy async needs
        'postgresql+asyncpg://…'. This property auto-converts so users
        can paste the Supabase URL directly.
        """
        url = self.DATABASE_URL
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url

    @property
    def cors_origins_list(self) -> list[str]:
        """CORS origins as list (split from comma-separated string)."""
        return [x.strip() for x in self.CORS_ORIGINS.split(",") if x.strip()] or [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]


# Singleton used across the app. Loaded once at import.
settings = Settings()
