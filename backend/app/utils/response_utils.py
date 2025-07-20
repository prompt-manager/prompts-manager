from typing import Any, List, Union, Dict
from app.schemas.response_schema import ResponseSchema
from app.schemas.pagination_schema import PaginatedResponse, PaginationData, create_pagination_data
from datetime import datetime
from sqlalchemy import func, select


def convert_record_to_dict(record: Any) -> Dict[str, Any]:
    """데이터베이스 레코드를 딕셔너리로 변환"""
    if record is None:
        return None
    
    result = {}
    for key in record._mapping.keys():
        value = getattr(record, key)
        if isinstance(value, datetime):
            result[key] = int(value.timestamp())
        else:
            result[key] = value
    return result


def convert_records_to_list(records: List[Any]) -> List[Dict[str, Any]]:
    """데이터베이스 레코드 리스트를 딕셔너리 리스트로 변환"""
    return [convert_record_to_dict(record) for record in records]


def create_success_response(data: Any, message: str = "요청이 성공적으로 처리되었습니다.") -> ResponseSchema:
    """성공 응답 ResponseSchema 생성"""
    if isinstance(data, list):
        converted_data = convert_records_to_list(data)
    elif hasattr(data, '_mapping'):  # Database record
        converted_data = convert_record_to_dict(data)
    else:
        converted_data = data
    
    return ResponseSchema(
        status="success",
        data=converted_data,
        message=message
    )


def create_error_response(message: str, data: Any = None) -> ResponseSchema:
    """에러 응답 ResponseSchema 생성"""
    return ResponseSchema(
        status="error",
        data=data,
        message=message
    )


def create_paginated_response(
    items: List[Any], 
    page: int, 
    size: int, 
    total: int,
    message: str = "페이지네이션 조회가 성공적으로 완료되었습니다."
) -> PaginatedResponse:
    """페이지네이션 응답 생성"""
    # 아이템들을 딕셔너리로 변환
    converted_items = []
    for item in items:
        if isinstance(item, list):
            converted_items.extend(convert_records_to_list(item))
        elif hasattr(item, '_mapping'):  # Database record
            converted_items.append(convert_record_to_dict(item))
        else:
            converted_items.append(item)
    
    pagination_data = create_pagination_data(converted_items, page, size, total)
    
    return PaginatedResponse(
        status="success",
        data=pagination_data,
        message=message
    )


async def get_total_count(database, table) -> int:
    """테이블의 전체 레코드 수 조회"""
    count_query = select(func.count()).select_from(table)
    result = await database.fetch_one(count_query)
    return result[0] if result else 0


async def get_total_count_with_filter(database, query) -> int:
    """필터가 적용된 쿼리의 전체 레코드 수 조회"""
    # 기존 쿼리에서 SELECT 부분만 COUNT로 변경
    count_query = select(func.count()).select_from(query.alias())
    result = await database.fetch_one(count_query)
    return result[0] if result else 0 