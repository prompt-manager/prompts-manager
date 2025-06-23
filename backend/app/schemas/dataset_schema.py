from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# 데이터셋 생성 시 사용하는 스키마
class DatasetCreate(BaseModel):
    name: str
    description: Optional[str] = None
    content: str  # CSV 파일 내용을 문자열로 직접 저장


# 데이터셋 조회 및 반환 시 사용하는 스키마
class DatasetRead(DatasetCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# 데이터셋 업데이트 시 사용하는 스키마
class DatasetUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
