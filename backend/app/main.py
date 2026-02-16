"""
Hanzla Outlet API – FastAPI application entry point.
CORS and config driven from app.config; auth and users under /api/v1.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import (
    admin_router,
    addresses_router,
    auth_router,
    categories_router,
    orders_router,
    products_router,
    users_router,
    wishlist_router,
    ai_router,
)
from app.config import settings

app = FastAPI(title="Hanzla Outlet API")

# CORS: origins from config (.env CORS_ORIGINS or default localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API v1: auth, users, categories, products, admin, addresses, wishlist, orders
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(categories_router, prefix="/api/v1")
app.include_router(products_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(addresses_router, prefix="/api/v1")
app.include_router(wishlist_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")
app.include_router(ai_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Health-style root route to verify backend is running."""
    return {"message": "Hanzla Outlet Backend is running"}

