"""
Async SQLAlchemy engine and session factory.
Use get_db() as a FastAPI dependency for request-scoped DB sessions.
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings
from app.models.base import Base

# Async engine: echo=False in production to avoid logging every SQL statement.
engine = create_async_engine(
    settings.async_database_url,
    echo=False,
    future=True,
)

# Session factory: expire_on_commit=False so we can access attributes after commit.
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency: yields a DB session; caller should commit or rollback."""
    async with async_session_maker() as session:
        yield session
