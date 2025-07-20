from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List, Any
from math import ceil

T = TypeVar("T")

class PaginationParams(BaseModel):
    """페이지네이션 요청 파라미터"""
    page: int = Field(default=1, ge=1, description="페이지 번호 (1부터 시작)")
    size: int = Field(default=10, ge=1, le=100, description="페이지당 항목 수 (1-100)")

class PaginatedResponse(BaseModel, Generic[T]):
    """페이지네이션 응답 스키마"""
    status: str = "success"
    data: "PaginationData[T]"
    message: str = "요청이 성공적으로 처리되었습니다."

class PaginationData(BaseModel, Generic[T]):
    """페이지네이션 데이터"""
    items: List[T]
    page: int = Field(description="현재 페이지 번호")
    size: int = Field(description="페이지당 항목 수")
    total: int = Field(description="전체 항목 수")
    total_pages: int = Field(description="전체 페이지 수")
    has_next: bool = Field(description="다음 페이지 존재 여부")
    has_prev: bool = Field(description="이전 페이지 존재 여부")

def create_pagination_data(
    items: List[Any], 
    page: int, 
    size: int, 
    total: int
) -> PaginationData:
    """페이지네이션 데이터 생성"""
    total_pages = ceil(total / size) if total > 0 else 1
    
    return PaginationData(
        items=items,
        page=page,
        size=size,
        total=total,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_prev=page > 1
    ) 