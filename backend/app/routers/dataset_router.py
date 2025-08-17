from fastapi import (
    APIRouter,
    HTTPException,
    UploadFile,
    File,
    Form,
    Body,
    Query,
    Depends,
)
from typing import List, Optional
from app.database import database
from app.models.dataset_model import datasets
from app.schemas.dataset_schema import DatasetRead, DatasetUpdate
from app.schemas.response_schema import ResponseSchema
from app.schemas.pagination_schema import PaginationParams, PaginatedResponse
from app.utils.response_utils import (
    create_success_response,
    create_error_response,
    create_paginated_response,
    get_total_count,
)
from sqlalchemy import select, insert, delete, update, or_, func
from datetime import datetime, timezone
from fastapi.responses import Response, JSONResponse

router = APIRouter(prefix="/datasets", tags=["📊 2. 데이터셋 관리"])


# 데이터셋 업로드
@router.post(
    "/",
    tags=["📊 2. 데이터셋 관리"],
    summary="📤 데이터셋 업로드 (CSV)",
    description="CSV 파일을 업로드하여 새로운 데이터셋을 생성합니다.",
)
async def upload_dataset(
    name: str = Form(
        ...,
        description="데이터셋의 이름. 이 이름은 시스템에서 고유해야 합니다.",
        example="dataset1",
    ),
    description: Optional[str] = Form(
        None,
        description="데이터셋에 대한 상세 설명 (선택 사항).",
        example="설명1",
    ),
    file: UploadFile = File(..., description="업로드할 CSV 형식의 파일."),
):
    """
    새로운 데이터셋을 생성합니다.

    - **name**: 데이터셋의 고유한 이름.
    - **description**: 데이터셋에 대한 설명.
    - **file**: `.csv` 확장자를 가진 파일.

    파일 내용은 UTF-8로 인코딩되어야 합니다.
    성공적으로 생성되면, 생성된 데이터셋의 정보를 반환합니다.
    """
    # 중복 이름 체크 추가
    existing_dataset = await database.fetch_one(
        select(datasets).where(datasets.c.name == name)
    )

    if existing_dataset:
        # 중복 시에도 성공 응답으로 처리 (프론트엔드에서 message로 판단)
        return ResponseSchema(
            status="success",
            data=None,
            message=f"Dataset with name '{name}' already exists.",
        )

    if file.content_type != "text/csv":
        raise HTTPException(status_code=400, detail="CSV 파일만 업로드 가능합니다.")

    content_bytes = await file.read()
    try:
        content_str = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="파일 인코딩이 올바르지 않습니다. UTF-8로 인코딩된 파일이어야 합니다.",
        )

    now = datetime.now(timezone.utc)

    query = (
        insert(datasets)
        .values(name=name, description=description, content=content_str, created_at=now)
        .returning(datasets)
    )

    created_dataset = await database.fetch_one(query)

    # 성공 시 message를 null로 설정 (프론트엔드 에러 감지용)
    if isinstance(created_dataset, dict):
        converted_data = created_dataset
    elif hasattr(created_dataset, "_mapping"):  # Database record
        from app.utils.response_utils import convert_record_to_dict

        converted_data = convert_record_to_dict(created_dataset)
    else:
        converted_data = created_dataset

    return ResponseSchema(
        status="success",
        data=converted_data,
        message=None,  # 성공 시 null로 설정
    )


# 모든 데이터셋 페이지네이션 조회
@router.get(
    "/",
    tags=["📋 4. 조회 및 검색"],
    summary="📋 모든 데이터셋 페이지네이션 조회",
    description="페이지네이션으로 데이터셋 목록을 조회합니다. search로 이름/설명 검색 가능합니다.",
    responses={
        200: {
            "description": "데이터셋 페이지네이션 조회 성공",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "data": {
                            "items": [
                                {
                                    "id": 1,
                                    "name": "dataset1",
                                    "description": "설명",
                                    "created_at": 1750064190,
                                }
                            ],
                            "page": 1,
                            "size": 10,
                            "total": 5,
                            "total_pages": 1,
                            "has_next": False,
                            "has_prev": False,
                        },
                        "message": "데이터셋 목록을 성공적으로 조회했습니다.",
                    }
                }
            },
        }
    },
)
async def get_datasets_paginated(
    pagination: PaginationParams = Depends(),
    search: str = Query(None, description="이름이나 설명으로 검색"),
):
    """
    모든 데이터셋을 페이지네이션으로 조회합니다.
    검색어로 필터링도 가능합니다.
    """
    try:
        # 기본 쿼리 구성
        base_query = select(datasets)

        # 검색 필터링 적용
        if search:
            base_query = base_query.where(
                or_(
                    datasets.c.name.ilike(f"%{search}%"),
                    datasets.c.description.ilike(f"%{search}%"),
                )
            )

        # 전체 개수 조회
        count_query = select(func.count()).select_from(base_query.alias())
        total = await database.fetch_one(count_query)
        total_count = total[0] if total else 0

        # 페이지네이션 적용된 데이터 조회
        paginated_query = (
            base_query.order_by(datasets.c.created_at.desc())
            .limit(pagination.size)
            .offset((pagination.page - 1) * pagination.size)
        )

        items = await database.fetch_all(paginated_query)

        filter_message = f" (검색: {search})" if search else ""
        message = f"데이터셋 목록을 성공적으로 조회했습니다{filter_message}."

        return create_paginated_response(
            items=items,
            page=pagination.page,
            size=pagination.size,
            total=total_count,
            message=message,
        )

    except Exception as e:
        return create_error_response(
            f"데이터셋 목록 조회 중 오류가 발생했습니다: {str(e)}"
        )


# 간단한 데이터셋 목록 조회 (드롭다운용)
@router.get(
    "/list",
    tags=["📋 4. 조회 및 검색"],
    summary="📋 간단한 데이터셋 목록 조회",
    description="드롭다운이나 선택 목록용으로 사용할 수 있는 간단한 데이터셋 목록을 조회합니다.",
    responses={
        200: {
            "description": "간단한 데이터셋 목록 조회 성공",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "data": [
                            {"id": 1, "name": "dataset1"},
                            {"id": 2, "name": "dataset2"},
                            {"id": 3, "name": "dataset3"},
                        ],
                        "message": "데이터셋 목록을 성공적으로 조회했습니다.",
                    }
                }
            },
        }
    },
)
async def get_datasets_list():
    """
    드롭다운이나 선택 목록용 간단한 데이터셋 목록을 조회합니다.

    id와 name만 포함된 가벼운 응답을 반환합니다.
    모든 데이터셋을 최신 생성순으로 정렬하여 반환합니다.
    """
    try:
        # id와 name만 선택하여 조회
        query = select(datasets.c.id, datasets.c.name).order_by(
            datasets.c.created_at.desc()
        )

        items = await database.fetch_all(query)

        # 딕셔너리 형태로 수동 변환
        dataset_list = [{"id": item[0], "name": item[1]} for item in items]

        # 직접 딕셔너리 반환 (ResponseSchema 사용하지 않음)
        return {
            "status": "success",
            "data": dataset_list,
            "message": "데이터셋 목록을 성공적으로 조회했습니다.",
        }

    except Exception as e:
        return {
            "status": "error",
            "data": None,
            "message": f"데이터셋 목록 조회 중 오류가 발생했습니다: {str(e)}",
        }


# 데이터셋 삭제
@router.delete(
    "/{dataset_id}",
    tags=["📊 2. 데이터셋 관리"],
    summary="🗑️ 특정 데이터셋 삭제",
    description="데이터셋 ID로 특정 데이터셋을 영구 삭제합니다.",
    responses={
        200: {
            "description": "데이터셋이 성공적으로 삭제됨",
            "content": {
                "application/json": {
                    "example": {"detail": "Dataset 1 has been deleted."}
                }
            },
        },
        404: {
            "description": "데이터셋을 찾을 수 없음",
            "content": {
                "application/json": {"example": {"detail": "Dataset not found."}}
            },
        },
    },
)
async def delete_dataset(dataset_id: int):
    """
    지정된 ID의 데이터셋을 삭제합니다.

    - **dataset_id**: 삭제할 데이터셋의 고유 ID.

    데이터셋이 존재하지 않으면 404 오류를 반환합니다.
    """
    # 먼저 데이터셋이 존재하는지 확인
    query = select(datasets).where(datasets.c.id == dataset_id)
    existing_dataset = await database.fetch_one(query)

    if not existing_dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    # 데이터셋 삭제
    delete_query = delete(datasets).where(datasets.c.id == dataset_id)
    await database.execute(delete_query)

    return create_success_response(
        {"detail": f"Dataset {dataset_id} has been deleted."},
        "데이터셋이 성공적으로 삭제되었습니다.",
    )


# 특정 데이터셋 조회
@router.get(
    "/{dataset_id}",
    tags=["📊 2. 데이터셋 관리"],
    summary="🔍 특정 데이터셋 조회",
    description="데이터셋 ID로 특정 데이터셋의 상세 정보를 조회합니다.",
)
async def get_dataset(dataset_id: int):
    """
    지정된 ID를 가진 데이터셋의 상세 정보를 반환합니다.

    - **dataset_id**: 조회할 데이터셋의 고유 ID.

    데이터셋 내용(`content`)을 포함한 모든 정보를 반환합니다.
    데이터셋이 존재하지 않으면 404 오류를 반환합니다.
    """
    query = select(datasets).where(datasets.c.id == dataset_id)
    dataset = await database.fetch_one(query)

    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    return create_success_response(dataset, "데이터셋을 성공적으로 조회했습니다.")


# 데이터셋 수정
@router.put(
    "/{dataset_id}",
    tags=["📊 2. 데이터셋 관리"],
    summary="✏️ 데이터셋 수정",
    description="데이터셋의 이름과 설명을 수정합니다. CSV 내용은 수정할 수 없습니다.",
)
async def update_dataset(
    dataset_id: int,
    dataset_update: DatasetUpdate = Body(
        ...,
        examples={
            "이름만 변경": {
                "summary": "이름만 변경하는 경우",
                "value": {"name": "새로운 데이터셋 이름"},
            },
            "설명만 변경": {
                "summary": "설명만 변경하는 경우",
                "value": {"description": "업데이트된 데이터셋 설명입니다."},
            },
            "이름과 설명 모두 변경": {
                "summary": "이름과 설명을 함께 변경하는 경우",
                "value": {
                    "name": "새로운 데이터셋 이름",
                    "description": "업데이트된 데이터셋 설명입니다.",
                },
            },
        },
    ),
):
    """
    지정된 ID의 데이터셋의 이름과 설명만 수정합니다.

    - **dataset_id**: 수정할 데이터셋의 고유 ID.
    - **dataset_update**: 업데이트할 내용으로 `name`, `description` 필드를 포함할 수 있습니다.

    CSV 파일 내용은 이 API에서 수정할 수 없습니다.
    """

    # 기존 데이터셋 조회
    query = select(datasets).where(datasets.c.id == dataset_id)
    existing_dataset = await database.fetch_one(query)

    if not existing_dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    # 수정 가능한 필드만 추출 (name, description)
    update_data = dataset_update.model_dump(exclude_unset=True)

    # 만약 content를 요청에 포함했다면 에러 처리
    if "content" in update_data:
        raise HTTPException(
            status_code=400, detail="Content field cannot be updated via this API."
        )

    if not update_data:
        raise HTTPException(status_code=400, detail="No update fields provided.")

    # 이름 중복 체크 (이름이 변경되는 경우에만)
    if "name" in update_data and update_data["name"] != existing_dataset.name:
        duplicate_check = await database.fetch_one(
            select(datasets).where(
                datasets.c.name == update_data["name"], datasets.c.id != dataset_id
            )
        )
        if duplicate_check:
            raise HTTPException(
                status_code=400,
                detail=f"Dataset with name '{update_data['name']}' already exists.",
            )

    # updated_at 필드 추가
    update_data["updated_at"] = datetime.now(timezone.utc)

    # 업데이트 수행
    update_query = (
        update(datasets)
        .where(datasets.c.id == dataset_id)
        .values(**update_data)
        .returning(datasets)
    )

    updated_dataset = await database.fetch_one(update_query)

    return create_success_response(
        updated_dataset, "데이터셋이 성공적으로 수정되었습니다."
    )


# 데이터셋 다운로드
@router.get(
    "/{dataset_id}/download",
    tags=["📊 2. 데이터셋 관리"],
    summary="📥 데이터셋 다운로드",
    description="데이터셋을 CSV 파일로 다운로드합니다.",
    responses={
        200: {
            "description": "데이터셋의 CSV 파일 내용",
            "content": {
                "text/csv": {
                    "schema": {"type": "string", "format": "binary"},
                    "example": "header1,header2\nvalue1,value2\nvalue3,value4",
                }
            },
        },
        404: {
            "description": "데이터셋을 찾을 수 없음",
            "content": {
                "application/json": {"example": {"detail": "Dataset not found."}}
            },
        },
    },
)
async def download_dataset(dataset_id: int):
    """
    지정된 ID의 데이터셋을 `.csv` 파일로 다운로드합니다.

    - **dataset_id**: 다운로드할 데이터셋의 고유 ID.

    `Content-Disposition` 헤더가 `attachment`로 설정되어 브라우저에서 파일 다운로드를 유도합니다.
    """
    query = select(datasets).where(datasets.c.id == dataset_id)
    dataset = await database.fetch_one(query)

    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    csv_content = dataset.content
    filename = f"{dataset.name}.csv"

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


# 데이터셋 검색
@router.get(
    "/search/",
    tags=["📋 4. 조회 및 검색"],
    summary="🔍 데이터셋 검색",
    description="이름이나 설명에서 키워드로 데이터셋을 검색합니다.",
)
async def search_datasets(query: str = Query(..., description="검색할 키워드")):
    query_stmt = select(datasets).where(
        or_(
            datasets.c.name.ilike(f"%{query}%"),
            datasets.c.description.ilike(f"%{query}%"),
        )
    )

    search_results = await database.fetch_all(query_stmt)

    return create_success_response(
        search_results, "데이터셋 검색이 성공적으로 완료되었습니다."
    )
