from sqlalchemy import Column, Integer, String, DateTime, Boolean, Table, JSON
from app.database import metadata
from datetime import datetime, timezone

prompts = Table(
    "prompts",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("node_name", String(50), nullable=False),
    Column("content", JSON, nullable=False),
    Column("message", String(255), nullable=True),
    Column("production", Boolean, default=False),
    Column("version", Integer, nullable=False, default=1),
    Column(
        "created_at",
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    ),
    Column(
        "updated_at",
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    ),
)
