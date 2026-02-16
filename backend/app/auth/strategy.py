"""
JWT strategy for fastapi-users: token generation and validation.
"""

from fastapi_users.authentication import JWTStrategy

from app.config import settings


def get_jwt_strategy() -> JWTStrategy:
    """Return JWT strategy with app secret and 1h lifetime."""
    return JWTStrategy(secret=settings.SECRET, lifetime_seconds=3600)
