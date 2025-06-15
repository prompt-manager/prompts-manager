from logging.config import fileConfig
import asyncio
import sys
import os

from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context

sys.path.append(os.path.abspath('.'))

# ✅ 정확히 database에서 metadata를 가져옴
from app.database import metadata  

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = metadata
DATABASE_URL = config.get_main_option("sqlalchemy.url")

def run_migrations_offline():
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online():
    connectable = create_async_engine(DATABASE_URL, future=True)

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
