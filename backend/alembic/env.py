# Alembic migration environment.
# Uses app.config for DATABASE_URL and app.models.base.Base for target_metadata.
# Runs migrations with async engine (create_async_engine + run_sync).

import asyncio
import sys
from pathlib import Path

# Ensure backend root is on path (whether run from backend/ or project root)
_backend_root = Path(__file__).resolve().parent.parent
if str(_backend_root) not in sys.path:
    sys.path.insert(0, str(_backend_root))

from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import create_async_engine

from app.config import settings
from app.models.base import Base
from app.models.category import Category  # noqa: F401 – for autogenerate
from app.models.product import Product  # noqa: F401 – for autogenerate
from app.models.user import User  # noqa: F401 – for autogenerate
from app.models.address import Address  # noqa: F401 – for autogenerate
from app.models.wishlist import Wishlist  # noqa: F401 – for autogenerate
from app.models.order import Order  # noqa: F401 – for autogenerate
from app.models.order_item import OrderItem  # noqa: F401 – for autogenerate

# Alembic Config object
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# For autogenerate: all models that inherit Base will be reflected.
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (generate SQL only, no DB connection)."""
    context.configure(
        url=settings.async_database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    """Sync callback: configure context and run migrations (used with async connection.run_sync)."""
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Create async engine from app config and run migrations inside an async connection."""
    engine = create_async_engine(
        settings.async_database_url,
        poolclass=pool.NullPool,
    )
    async with engine.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await engine.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode (connect to DB and apply)."""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
