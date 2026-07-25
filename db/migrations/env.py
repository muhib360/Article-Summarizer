import asyncio
from logging.config import fileConfig

from sqlalchemy.ext.asyncio import async_engine_from_config
from sqlalchemy import pool

from alembic import context

# Import Base so Alembic can detect our models for autogenerate
from db.db import Base

# Import all models here so their tables are registered on Base.metadata
from db.models.User import User      # noqa: F401
from db.models.Article import Article  # noqa: F401

# ---------------------------------------------------------------------------
# Alembic Config object (wraps alembic.ini)
# ---------------------------------------------------------------------------
config = context.config

# Set up Python logging from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Point autogenerate at our metadata
target_metadata = Base.metadata

# ---------------------------------------------------------------------------
# Inject the DB URL from settings so we never hardcode credentials here
# ---------------------------------------------------------------------------
from settings import db_settings

config.set_main_option("sqlalchemy.url", db_settings.db_url)


# ---------------------------------------------------------------------------
# Offline mode – generate SQL without a live DB connection
# ---------------------------------------------------------------------------
def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (generates SQL scripts)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


# ---------------------------------------------------------------------------
# Online mode – connect to the real DB and apply migrations (async)
# ---------------------------------------------------------------------------
def do_run_migrations(connection):
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,       # detect column type changes
        compare_server_default=True,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Run migrations in 'online' mode using an async engine."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,   # no connection pool for migrations
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
