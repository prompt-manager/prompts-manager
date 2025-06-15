from fastapi import APIRouter, HTTPException, Body, Path, status
from typing import List
from app.database import database
from app.models.prompt_model import prompts
from app.schemas.prompt_schema import PromptCreate, PromptRead, PromptUpdate
from sqlalchemy import select, insert, update, delete
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/prompts", tags=["prompts"])


# 프롬프트 추가 (System 필수, User/Assistant 선택)
@router.post(
    "/",
    response_model=PromptRead,
    status_code=status.HTTP_201_CREATED,
    summary="프롬프트 추가",
    description="새로운 프롬프트를 추가합니다. System 메시지는 필수이며, User와 Assistant 메시지는 선택적으로 추가할 수 있습니다.",
)
async def create_prompt(
    prompt: PromptCreate = Body(
        ...,
        openapi_examples={
            "기본": {
                "summary": "시스템 프롬프트만 있는 경우",
                "value": {
                    "node_name": "검색노드",
                    "model_name": "gpt-4o-mini",
                    "title": "v1.0-검색 특화",
                    "content": {
                        "system": "당신은 질문에 답변하고 작업을 도와줄 수 있는 도움이 되는 어시스턴트입니다."
                    },
                },
            },
            "전체": {
                "summary": "모든 종류의 프롬프트가 있는 경우",
                "value": {
                    "node_name": "요약노드",
                    "model_name": "gpt-4o-mini",
                    "title": "v1.0-요약 특화",
                    "content": {
                        "system": "당신은 제공된 텍스트를 간결하게 요약하는 전문 어시스턴트입니다.",
                        "user": "이 보고서는 최신 시장 동향을 분석하고 있으며, 주요 경쟁사의 전략과 소비자 행동 변화에 초점을 맞추고 있습니다.",
                        "assistant": "보고서는 시장 동향, 경쟁사 전략, 소비자 행동 변화를 분석합니다.",
                    },
                },
            },
        },
    ),
):
    if not prompt.content.system.strip():
        raise HTTPException(status_code=400, detail="System prompt is required.")

    now = datetime.now(timezone.utc)
    query = (
        insert(prompts)
        .values(
            node_name=prompt.node_name,
            model_name=prompt.model_name,
            title=prompt.title,
            content=prompt.content.model_dump(),
            is_active=False,
            created_at=now,
            updated_at=now,
        )
        .returning(prompts)
    )

    created_prompt = await database.fetch_one(query)
    return created_prompt


# 특정 노드와 모델 이름을 기준으로 프롬프트 조회 (모든 버전 조회)
@router.get(
    "/{node_name}/{model_name}",
    response_model=List[PromptRead],
    summary="특정 노드/모델의 모든 프롬프트 버전 조회",
    description="특정 `node_name`과 `model_name`에 해당하는 모든 프롬프트의 이력을 조회합니다. 버전에 따라 여러 프롬프트가 반환될 수 있습니다.",
)
async def read_prompts_by_node_and_model(
    node_name: str = Path(..., description="조회할 노드의 이름", example="검색노드"),
    model_name: str = Path(
        ..., description="사용된 모델의 이름", example="gpt-4o-mini"
    ),
):
    query = select(prompts).where(
        prompts.c.node_name == node_name, prompts.c.model_name == model_name
    )
    result = await database.fetch_all(query)
    return result


# 특정 프롬프트 조회 (Read)
@router.get(
    "/{prompt_id}",
    response_model=PromptRead,
    summary="특정 ID의 프롬프트 조회",
    description="고유한 `prompt_id`를 사용하여 특정 프롬프트를 조회합니다.",
)
async def read_prompt(
    prompt_id: int = Path(..., description="조회할 프롬프트의 고유 ID", example=1),
):
    query = select(prompts).where(prompts.c.id == prompt_id)
    prompt = await database.fetch_one(query)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return prompt


# 프롬프트 수정 (Update)
@router.put(
    "/{prompt_id}",
    response_model=PromptRead,
    summary="특정 프롬프트 수정",
    description="`prompt_id`를 사용하여 기존 프롬프트를 수정합니다. 수정할 필드만 요청 본문에 포함하면 됩니다.",
)
async def update_prompt(
    prompt_id: int = Path(..., description="수정할 프롬프트의 고유 ID", example=1),
    prompt_update: PromptUpdate = Body(
        ...,
        openapi_examples={
            "타이틀만 수정": {
                "summary": "타이틀만 변경하는 경우",
                "value": {"title": "v1.1-검색 최적화"},
            },
            "콘텐츠 수정": {
                "summary": "콘텐츠를 변경하는 경우",
                "value": {
                    "content": {
                        "system": "You are a helpful assistant for searching.",
                        "user": "What is the capital of France?",
                    }
                },
            },
        },
    ),
):
    query = select(prompts).where(prompts.c.id == prompt_id)
    existing_prompt = await database.fetch_one(query)

    if not existing_prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")

    update_data = prompt_update.model_dump(exclude_unset=True)

    # 프롬프트가 실제로 변경된 내용이 있는지 확인
    if not update_data:
        raise HTTPException(status_code=400, detail="No update fields provided")

    update_data["updated_at"] = datetime.now(timezone(timedelta(hours=9)))

    update_query = (
        update(prompts)
        .where(prompts.c.id == prompt_id)
        .values(**update_data)
        .returning(prompts)
    )

    updated_prompt = await database.fetch_one(update_query)
    return updated_prompt


# 프롬프트 삭제 (Delete)
@router.delete(
    "/{prompt_id}",
    status_code=status.HTTP_200_OK,
    summary="특정 프롬프트 삭제",
    description="`prompt_id`를 사용하여 특정 프롬프트를 삭제합니다.",
)
async def delete_prompt(
    prompt_id: int = Path(..., description="삭제할 프롬프트의 고유 ID", example=1),
):
    query = select(prompts).where(prompts.c.id == prompt_id)
    existing_prompt = await database.fetch_one(query)

    if not existing_prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")

    # 프롬프트 삭제
    await database.execute(delete(prompts).where(prompts.c.id == prompt_id))

    return {"detail": f"Prompt with id {prompt_id} has been deleted."}


# 특정 프롬프트를 활성화 처리 (다른 버전은 비활성화 처리)
@router.post(
    "/{prompt_id}/activate",
    response_model=PromptRead,
    summary="특정 프롬프트 활성화",
    description="`prompt_id`에 해당하는 프롬프트를 활성 상태로 설정합니다. 이 작업은 동일한 `node_name`과 `model_name`을 가진 다른 모든 프롬프트를 자동으로 비활성화시킵니다.",
)
async def activate_prompt(
    prompt_id: int = Path(..., description="활성화할 프롬프트의 고유 ID", example=1),
):
    # 선택된 프롬프트 정보 가져오기
    query_prompt = select(prompts).where(prompts.c.id == prompt_id)
    prompt_to_activate = await database.fetch_one(query_prompt)

    if not prompt_to_activate:
        raise HTTPException(status_code=404, detail="Prompt not found")

    # 기존 활성화된 프롬프트 비활성화
    deactivate_query = (
        update(prompts)
        .where(
            prompts.c.node_name == prompt_to_activate.node_name,
            prompts.c.model_name == prompt_to_activate.model_name,
            prompts.c.is_active,
        )
        .values(is_active=False)
    )
    await database.execute(deactivate_query)

    # 선택된 프롬프트 활성화 처리
    activate_query = (
        update(prompts)
        .where(prompts.c.id == prompt_id)
        .values(is_active=True)
        .returning(prompts)
    )
    activated_prompt = await database.fetch_one(activate_query)

    return activated_prompt
