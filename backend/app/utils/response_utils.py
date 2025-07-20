from typing import Any, List, Union, Dict
from app.schemas.response_schema import ResponseSchema
from datetime import datetime


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