from sqlalchemy import Column, Integer, String, DateTime, Boolean, Table, JSON
from app.database import metadata
from datetime import datetime, timezone

prompts = Table(
    "prompts",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("node_name", String(50), nullable=False),
    Column("model_name", String(50), nullable=False),
    Column("title", String(100), nullable=False),
    Column("content", JSON, nullable=False),  # JSON 타입으로 변경
    Column("is_active", Boolean, default=False),
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
