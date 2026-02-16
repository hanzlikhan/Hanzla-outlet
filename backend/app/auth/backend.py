"""
Authentication backend and FastAPIUsers instance.
Bearer transport + JWT strategy; current_user dependencies.
"""

from fastapi_users import FastAPIUsers
from fastapi_users.authentication import AuthenticationBackend, BearerTransport

from app.models.user import User

from .manager import UserManager, get_user_db, get_user_manager
from .strategy import get_jwt_strategy

# Token in Authorization: Bearer <token>; login URL for OpenAPI (full path)
bearer_transport = BearerTransport(tokenUrl="/api/v1/auth/jwt/login")

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, int](get_user_manager, [auth_backend])

# Dependencies for protected routes
current_user = fastapi_users.current_user()
current_active_user = fastapi_users.current_user(active=True)
current_superuser = fastapi_users.current_user(active=True, superuser=True)
