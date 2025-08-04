from sqlalchemy import Table, Column, Integer, String, DateTime, Text
from app.database import metadata
from datetime import datetime, timezone

datasets = Table(
    "datasets",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String(100), nullable=False),
    Column("description", String(255), nullable=True),
    Column("content", Text, nullable=False),  # CSV 내용 저장
    Column(
        "created_at",
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    ),
    Column(
        "updated_at",
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    ),
)