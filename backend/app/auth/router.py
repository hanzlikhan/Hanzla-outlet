"""
Auth routes: JWT login/logout, register, reset-password, verify.
Mount this router under the desired prefix (e.g. /api/v1).
"""

from fastapi import APIRouter

from app.schemas.user import UserCreate, UserRead

from .backend import auth_backend, fastapi_users

router = APIRouter(prefix="/auth", tags=["auth"])

router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt",
    tags=["auth"],
)
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    tags=["auth"],
)
router.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/reset-password",
    tags=["auth"],
)
router.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/verify",
    tags=["auth"],
)
