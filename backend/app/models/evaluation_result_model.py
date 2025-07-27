from sqlalchemy import Table, Column, Integer, String, Float, DateTime, ForeignKey, Enum
from app.database import metadata
from datetime import datetime, timezone
import enum

# 평가 상태 enum
class EvaluationStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

# 평가 요청 테이블 (새로 추가)
evaluation_requests = Table(
    "evaluation_requests",
    metadata,
    Column("id", String(36), primary_key=True, index=True),  # UUID
    Column("node_name", String(50), nullable=False),
    Column("version", String(20), nullable=False),  # "production" or version number
    Column("dataset_id", Integer, ForeignKey("datasets.id"), nullable=False),
    Column("metrics", String(500), nullable=False),  # JSON string of metric list
    Column("status", Enum(EvaluationStatus), default=EvaluationStatus.PENDING),
    Column("callback_url", String(255), nullable=True),
    Column("error_message", String(1000), nullable=True),
    Column(
        "created_at",
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    ),
    Column(
        "completed_at",
        DateTime(timezone=True),
        nullable=True
    ),
)

# 기존 평가 결과 테이블
evaluation_results = Table(
    "evaluation_results",
    metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("evaluation_request_id", String(36), ForeignKey("evaluation_requests.id"), nullable=True),  # 새로 추가
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