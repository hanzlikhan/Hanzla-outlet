"""
User manager and DB adapter for fastapi-users (async).
get_user_db yields SQLAlchemyUserDatabase; get_user_manager yields UserManager.
"""

from collections.abc import AsyncGenerator

from fastapi import Depends
from fastapi_users import BaseUserManager, IntegerIDMixin
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.user import User


async def get_user_db(
    session: AsyncSession = Depends(get_db),
) -> AsyncGenerator[SQLAlchemyUserDatabase, None]:
    """FastAPI dependency: yields fastapi-users DB adapter for User table."""
    yield SQLAlchemyUserDatabase(session, User)


async def get_user_manager(
    user_db: SQLAlchemyUserDatabase = Depends(get_user_db),
) -> AsyncGenerator[BaseUserManager[User, int], None]:
    """FastAPI dependency: yields UserManager for auth logic."""
    yield UserManager(user_db)


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    """User manager: reset/verify token secrets from app config."""

    reset_password_token_secret = settings.SECRET
    verification_token_secret = settings.SECRET
