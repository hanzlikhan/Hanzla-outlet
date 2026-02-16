# API v1: auth, users, categories, products, admin, addresses, wishlist, orders.

from app.api.v1.admin import admin_router
from app.api.v1.auth import router as auth_router
from app.api.v1.categories import router as categories_router
from app.api.v1.products import router as products_router
from app.api.v1.users import router as users_router
from app.api.v1.addresses import router as addresses_router
from app.api.v1.wishlist import router as wishlist_router
from app.api.v1.orders import router as orders_router
from app.api.v1.ai import router as ai_router

__all__ = [
    "admin_router",
    "auth_router",
    "categories_router",
    "products_router",
    "users_router",
    "addresses_router",
    "wishlist_router",
    "orders_router",
    "ai_router",
]
