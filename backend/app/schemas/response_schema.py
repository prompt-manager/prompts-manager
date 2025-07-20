from pydantic import BaseModel
from typing import Generic, TypeVar, Optional

T = TypeVar("T")

class ResponseSchema(BaseModel, Generic[T]):
    status: str = "success"  # 기본값 설정
    data: Optional[T]
    message: str = "요청이 성공적으로 처리되었습니다."

