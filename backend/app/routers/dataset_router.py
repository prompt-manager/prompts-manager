from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Body
from typing import List, Optional
from app.database import database
from app.models.dataset_model import datasets
from app.schemas.dataset_schema import DatasetRead, DatasetUpdate
from app.schemas.response_schema import ResponseSchema
from app.utils.response_utils import create_success_response, create_error_response
from sqlalchemy import select, insert, delete, update, or_
from datetime import datetime, timezone
from fastapi.responses import Response, JSONResponse

router = APIRouter(prefix="/datasets", tags=["Datasets"])


# CSV 파일을 업로드하여 데이터셋 생성
@router.post(
    "/",
    summary="데이터셋 업로드 (CSV)",
    description="CSV 파일을 업로드하여 새로운 데이터셋을 생성합니다. 데이터셋 이름은 중복될 수 없습니다.",
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
        raise HTTPException(
            status_code=400, detail=f"Dataset with name '{name}' already exists."
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
    return create_success_response(created_dataset, "데이터셋이 성공적으로 생성되었습니다.")


# 모든 데이터셋 조회
@router.get(
    "/",
    summary="모든 데이터셋 조회",
    description="시스템에 저장된 모든 데이터셋의 목록을 조회합니다.",
)
async def get_datasets():
    """
    저장된 모든 데이터셋의 리스트를 반환합니다.
    데이터셋이 없으면 빈 리스트가 반환됩니다.
    """
    query = select(datasets)
    all_datasets = await database.fetch_all(query)
    return create_success_response(all_datasets, "모든 데이터셋을 성공적으로 조회했습니다.")


# 특정 데이터셋 삭제
@router.delete(
    "/{dataset_id}",
    summary="특정 데이터셋 삭제",
    description="ID를 사용하여 특정 데이터셋을 삭제합니다.",
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
    query = delete(datasets).where(datasets.c.id == dataset_id)
    result = await database.execute(query)

    if result:
        return JSONResponse(
            status_code=200,
            content={"detail": f"Dataset {dataset_id} has been deleted."},
        )
    raise HTTPException(status_code=404, detail="Dataset not found.")


@router.get(
    "/{dataset_id}",
    summary="특정 데이터셋 조회",
    description="데이터셋의 고유 ID로 특정 데이터셋의 상세 정보를 조회합니다.",
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


@router.put(
    "/{dataset_id}",
    summary="데이터셋 수정",
    description=(
        "데이터셋의 이름과 설명만 수정합니다. CSV 내용 수정은 지원하지 않습니다. "
        "변경할 필드만 요청 본문에 포함시키세요."
    ),
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
            status_code=400,
            detail="Content field cannot be updated via this API."
        )

    if not update_data:
        raise HTTPException(status_code=400, detail="No update fields provided.")

    # 업데이트 수행
    update_query = (
        update(datasets)
        .where(datasets.c.id == dataset_id)
        .values(**update_data)
        .returning(datasets)
    )

    updated_dataset = await database.fetch_one(update_query)

    return create_success_response(updated_dataset, "데이터셋이 성공적으로 수정되었습니다.")


@router.get(
    "/{dataset_id}/download",
    summary="데이터셋 다운로드",
    description="지정한 데이터셋을 CSV 파일로 다운로드합니다. 브라우저에서 직접 다운로드하거나 API 클라이언트에서 파일로 저장할 수 있습니다.",
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


@router.get(
    "/search/",
    summary="데이터셋 검색",
    description="데이터셋의 이름이나 설명에서 키워드를 기준으로 검색합니다."
)
async def search_datasets(query: str):
    query_stmt = select(datasets).where(
        or_(
            datasets.c.name.ilike(f"%{query}%"),
            datasets.c.description.ilike(f"%{query}%")
        )
    )

    search_results = await database.fetch_all(query_stmt)

    return create_success_response(search_results, "데이터셋 검색이 성공적으로 완료되었습니다.")