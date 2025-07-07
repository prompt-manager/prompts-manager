from sqlalchemy import Table, Column, Integer, String, Float, DateTime, ForeignKey
from app.database import metadata
from datetime import datetime, timezone

evaluation_results = Table(
    "evaluation_results",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("prompt_id", Integer, ForeignKey("prompts.id"), nullable=False),
    Column("dataset_id", Integer, ForeignKey("datasets.id"), nullable=False),
    Column("metric_name", String(100), nullable=False),
    Column("score", Float, nullable=False),
    Column(
        "created_at",
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    ),
)