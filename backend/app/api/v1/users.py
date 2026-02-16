"""
Users API v1: profile (GET/PATCH/DELETE /me) via fastapi-users.
"""

from fastapi import APIRouter

from app.auth.backend import fastapi_users
from app.schemas.user import UserRead, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])

# GET /me, PATCH /me, DELETE /me (current user)
router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
)
