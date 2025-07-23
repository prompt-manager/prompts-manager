from fastapi import APIRouter, HTTPException, Body, Path, status, Query, Depends
from typing import List
from app.database import database
from app.models.prompt_model import prompts
from app.schemas.prompt_schema import PromptCreate, PromptRead, PromptUpdate
from app.schemas.response_schema import ResponseSchema
from app.schemas.pagination_schema import PaginationParams, PaginatedResponse
from app.utils.response_utils import create_success_response, create_error_response, create_paginated_response, get_total_count

from sqlalchemy import select, insert, update, delete, func, distinct
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/prompts", tags=["📝 1. 프롬프트 관리"])


# 모든 프롬프트 페이지네이션 조회
@router.get(
    "/",
    tags=["📋 4. 조회 및 검색"],
    summary="📋 모든 프롬프트 페이지네이션 조회",
    description="페이지네이션으로 프롬프트 목록을 조회합니다. node_name으로 필터링 가능합니다.",
    responses={
        200: {
            "description": "프롬프트 페이지네이션 조회 성공",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "data": {
                            "items": [
                                {
                                    "id": 1,
                                    "node_name": "검색노드",
                                    "content": {
                                        "system": {"order": 1, "prompt": "검색 어시스턴트"},
                                        "user": {"order": 2, "prompt": "오늘 날씨 어때?"},
                                        "assistant": {"order": None, "prompt": None}
                                    },
                                    "production": True,
                                    "version": 1
                                }
                            ],
                            "page": 1,
                            "size": 10,
                            "total": 50,
                            "total_pages": 5,
                            "has_next": True,
                            "has_prev": False
                        },
                        "message": "프롬프트 목록을 성공적으로 조회했습니다."
                    }
                }
            },
        }
    },
)
async def get_prompts_paginated(
    pagination: PaginationParams = Depends(),
    node_name: str = Query(None, description="특정 노드로 필터링")
):
    """
    모든 프롬프트를 페이지네이션으로 조회합니다.
    노드 이름으로 필터링도 가능합니다.
    """
    try:
        # 기본 쿼리 구성
        base_query = select(prompts)
        
        # 노드 필터링 적용
        if node_name:
            base_query = base_query.where(prompts.c.node_name == node_name)
        
        # 전체 개수 조회
        count_query = select(func.count()).select_from(
            base_query.alias()
        )
        total = await database.fetch_one(count_query)
        total_count = total[0] if total else 0
        
        # 페이지네이션 적용된 데이터 조회
        paginated_query = (
            base_query
            .order_by(prompts.c.created_at.desc())
            .limit(pagination.size)
            .offset((pagination.page - 1) * pagination.size)
        )
        
        items = await database.fetch_all(paginated_query)
        
        filter_message = f" (노드: {node_name})" if node_name else ""
        message = f"프롬프트 목록을 성공적으로 조회했습니다{filter_message}."
        
        return create_paginated_response(
            items=items,
            page=pagination.page,
            size=pagination.size,
            total=total_count,
            message=message
        )
        
    except Exception as e:
        return create_error_response(f"프롬프트 목록 조회 중 오류가 발생했습니다: {str(e)}")


# 새 프롬프트 생성
@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    tags=["📝 1. 프롬프트 관리"],
    summary="🆕 새 프롬프트 생성",
    description="새로운 프롬프트를 생성합니다. node_name과 content는 필수입니다.",
    responses={
        201: {
            "description": "프롬프트가 성공적으로 생성됨",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "node_name": "검색노드",
                        "content": {
                            "system": {
                                "order": 1,
                                "prompt": "당신은 검색을 도와주는 어시스턴트입니다."
                            },
                            "user": {"order": 2, "prompt": None},
                            "assistant": {"order": None, "prompt": None}
                        },
                        "message": "검색 기능 프롬프트 v1.0",
                        "production": False,
                        "version": 1,
                        "created_at": "2024-01-01T12:00:00Z",
                        "updated_at": "2024-01-01T12:00:00Z",
                    }
                }
            },
        },
        400: {
            "description": "잘못된 요청 (System 프롬프트 누락 등)",
            "content": {
                "application/json": {
                    "example": {"detail": "System prompt is required."}
                }
            },
        },
    },
)
async def create_prompt(
    prompt: PromptCreate = Body(
        ...,
        openapi_examples={
            "기본_시스템만": {
                "summary": "📝 기본 - 시스템 프롬프트만",
                "description": "가장 간단한 형태의 프롬프트 생성",
                "value": {
                    "node_name": "검색노드",
                    "content": {
                        "system": {
                            "order": 1,
                            "prompt": "당신은 질문에 답변하고 작업을 도와줄 수 있는 도움이 되는 어시스턴트입니다."
                        },
                        "user": {"order": 2, "prompt": None},
                        "assistant": {"order": None, "prompt": None}
                    },
                },
            },
            "완전한_대화형": {
                "summary": "💬 완전한 대화형 프롬프트",
                "description": "System, User, Assistant 메시지가 모두 포함된 완전한 예시",
                "value": {
                    "node_name": "요약노드",
                    "content": {
                        "system": {
                            "order": 1,
                            "prompt": "당신은 제공된 텍스트를 간결하게 요약하는 전문 어시스턴트입니다."
                        },
                        "user": {
                            "order": 2,
                            "prompt": "이 보고서는 최신 시장 동향을 분석하고 있으며, 주요 경쟁사의 전략과 소비자 행동 변화에 초점을 맞추고 있습니다."
                        },
                        "assistant": {
                            "order": 3,
                            "prompt": "보고서는 시장 동향, 경쟁사 전략, 소비자 행동 변화를 분석합니다."
                        }
                    },
                    "message": "📊 요약 노드의 신규 버전 프롬프트 - 더 간결한 요약을 위해 개선",
                },
            },
        },
    ),
):
    if not prompt.content.system.prompt or not prompt.content.system.prompt.strip():
        raise HTTPException(status_code=400, detail="System prompt is required.")

    # 현재 가장 최신 버전 조회
    query_latest_version = (
        select(prompts.c.version)
        .where(prompts.c.node_name == prompt.node_name)
        .order_by(prompts.c.version.desc())
        .limit(1)
    )

    latest_version = await database.fetch_one(query_latest_version)
    new_version = latest_version.version + 1 if latest_version else 1

    now = datetime.now(timezone.utc)

    query = (
        insert(prompts)
        .values(
            node_name=prompt.node_name,
            content=prompt.content.model_dump(),
            message=prompt.message,
            production=False,
            version=new_version,
            created_at=now,
            updated_at=now,
        )
        .returning(prompts)
    )

    created_prompt = await database.fetch_one(query)
    return create_success_response(created_prompt, "프롬프트가 성공적으로 생성되었습니다.")


# ID로 프롬프트 조회
@router.get(
    "/id/{prompt_id}",
    tags=["📝 1. 프롬프트 관리"],
    summary="🔍 ID로 프롬프트 조회",
    description="프롬프트 ID로 특정 프롬프트의 상세 정보를 조회합니다.",
    responses={
        200: {
            "description": "프롬프트 조회 성공",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "node_name": "검색노드",
                        "content": {
                            "system": {"order": 1, "prompt": "검색을 도와주는 어시스턴트입니다."},
                            "user": {"order": 2, "prompt": "파리의 날씨는 어때요?"},
                            "assistant": {"order": 3, "prompt": "파리의 현재 날씨를 확인해드리겠습니다."}
                        },
                        "message": "검색 기능 개선",
                        "production": True,
                        "version": 3,
                        "created_at": "2024-01-01T12:00:00Z",
                        "updated_at": "2024-01-02T14:30:00Z",
                    }
                }
            },
        },
        404: {
            "description": "프롬프트를 찾을 수 없음",
            "content": {
                "application/json": {"example": {"detail": "Prompt not found"}}
            },
        },
    },
)
async def read_prompt(
    prompt_id: int = Path(
        ..., description="🆔 조회할 프롬프트의 고유 ID", example=1, gt=0
    ),
):
    query = select(prompts).where(prompts.c.id == prompt_id)
    prompt = await database.fetch_one(query)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return create_success_response(prompt, "프롬프트를 성공적으로 조회했습니다.")


# 노드별 모든 프롬프트 조회
@router.get(
    "/node/{node_name}",
    tags=["📋 4. 조회 및 검색"],
    summary="📦 노드별 모든 프롬프트 조회",
    description="특정 노드에 속한 모든 프롬프트를 조회합니다.",
    responses={
        200: {
            "description": "노드의 모든 프롬프트 목록",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "id": 3,
                            "node_name": "검색노드",
                            "content": {
                                "system": {"order": 1, "prompt": "최신 검색 어시스턴트"},
                                "user": {"order": 2, "prompt": None},
                                "assistant": {"order": None, "prompt": None}
                            },
                            "message": "성능 최적화 버전",
                            "production": True,
                            "version": 3,
                            "created_at": "2024-01-03T10:00:00Z",
                            "updated_at": "2024-01-03T10:00:00Z",
                        },
                        {
                            "id": 2,
                            "node_name": "검색노드",
                            "content": {
                                "system": {"order": 1, "prompt": "검색 도우미"},
                                "user": {"order": 2, "prompt": None},
                                "assistant": {"order": None, "prompt": None}
                            },
                            "message": "기능 개선",
                            "production": False,
                            "version": 2,
                            "created_at": "2024-01-02T15:30:00Z",
                            "updated_at": "2024-01-02T15:30:00Z",
                        },
                    ]
                }
            },
        }
    },
)
async def read_prompts_by_node(
    node_name: str = Path(
        ...,
        description="🏷️ 조회할 노드의 이름 (대소문자 구분)",
        example="검색노드",
        min_length=1,
        max_length=50,
    ),
):
    query = (
        select(prompts)
        .where(prompts.c.node_name == node_name)
        .order_by(prompts.c.version.desc())
    )
    result = await database.fetch_all(query)
    return create_success_response(result, "노드의 프롬프트 목록을 성공적으로 조회했습니다.")


# 프롬프트 수정
@router.put(
    "/id/{prompt_id}",
    tags=["📝 1. 프롬프트 관리"],
    summary="✏️ 프롬프트 수정",
    description="기존 프롬프트를 수정합니다. node_name과 version은 수정할 수 없습니다.",
    responses={
        200: {
            "description": "프롬프트 수정 성공",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "node_name": "검색노드",
                        "content": {
                            "system": {"order": 1, "prompt": "향상된 검색 어시스턴트입니다."},
                            "user": {"order": 2, "prompt": None},
                            "assistant": {"order": None, "prompt": None}
                        },
                        "message": "성능 최적화 완료",
                        "production": False,
                        "version": 1,
                        "created_at": "2024-01-01T12:00:00Z",
                        "updated_at": "2024-01-02T16:45:00Z",
                    }
                }
            },
        },
        400: {
            "description": "잘못된 요청 (수정할 필드 없음)",
            "content": {
                "application/json": {"example": {"detail": "No update fields provided"}}
            },
        },
        404: {
            "description": "프롬프트를 찾을 수 없음",
            "content": {
                "application/json": {"example": {"detail": "Prompt not found"}}
            },
        },
    },
)
async def update_prompt(
    prompt_id: int = Path(
        ..., description="🆔 수정할 프롬프트의 고유 ID", example=1, gt=0
    ),
    prompt_update: PromptUpdate = Body(
        ...,
        openapi_examples={
            "콘텐츠_업데이트": {
                "summary": "📝 콘텐츠만 수정",
                "description": "프롬프트의 내용만 업데이트하는 경우",
                "value": {
                    "content": {
                        "system": {
                            "order": 1,
                            "prompt": "당신은 개선된 검색 전문 어시스턴트입니다. 정확하고 관련성 높은 결과를 제공해주세요."
                        },
                        "user": {
                            "order": 2,
                            "prompt": "최신 기술 트렌드에 대해 알려주세요."
                        },
                        "assistant": {
                            "order": 3,
                            "prompt": "최신 기술 트렌드를 정확한 데이터와 함께 설명드리겠습니다."
                        }
                    }
                },
            },
            "메시지_업데이트": {
                "summary": "💬 메시지만 수정",
                "description": "프롬프트 설명이나 메모만 변경하는 경우",
                "value": {
                    "message": "🚀 검색 기능 대폭 개선 - 응답 속도 30% 향상, 정확도 95% 달성"
                },
            },
            "프로덕션_설정": {
                "summary": "🎯 프로덕션 상태 변경",
                "description": "프로덕션 배포 상태를 변경하는 경우",
                "value": {
                    "production": True,
                    "message": "✅ 품질 검증 완료 - 프로덕션 배포 승인",
                },
            },
            "전체_업데이트": {
                "summary": "🔄 종합 업데이트",
                "description": "여러 필드를 동시에 수정하는 경우",
                "value": {
                    "content": {
                        "system": {
                            "order": 1,
                            "prompt": "당신은 최첨단 AI 검색 어시스턴트입니다. 사용자의 질문을 정확히 이해하고 최적의 답변을 제공합니다."
                        },
                        "user": {"order": 2, "prompt": None},
                        "assistant": {"order": None, "prompt": None}
                    },
                    "message": "🎉 v2.0 메이저 업데이트 - AI 모델 업그레이드 완료",
                    "production": False,
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

    update_data["updated_at"] = datetime.now(timezone.utc)

    update_query = (
        update(prompts)
        .where(prompts.c.id == prompt_id)
        .values(**update_data)
        .returning(prompts)
    )

    updated_prompt = await database.fetch_one(update_query)
    return create_success_response(updated_prompt, "프롬프트가 성공적으로 수정되었습니다.")


# 프롬프트 삭제
@router.delete(
    "/id/{prompt_id}",
    status_code=status.HTTP_200_OK,
    tags=["📝 1. 프롬프트 관리"],
    summary="🗑️ 프롬프트 삭제",
    description="프롬프트 ID로 특정 프롬프트를 영구 삭제합니다.",
    responses={
        200: {
            "description": "프롬프트 삭제 성공",
            "content": {
                "application/json": {
                    "example": {"detail": "Prompt with id 1 has been deleted."}
                }
            },
        },
        404: {
            "description": "프롬프트를 찾을 수 없음",
            "content": {
                "application/json": {"example": {"detail": "Prompt not found"}}
            },
        },
    },
)
async def delete_prompt(
    prompt_id: int = Path(
        ..., description="🆔 삭제할 프롬프트의 고유 ID", example=1, gt=0
    ),
):
    query = select(prompts).where(prompts.c.id == prompt_id)
    existing_prompt = await database.fetch_one(query)

    if not existing_prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")

    # 프롬프트 삭제
    await database.execute(delete(prompts).where(prompts.c.id == prompt_id))

    return create_success_response({"detail": f"Prompt with id {prompt_id} has been deleted."}, "프롬프트가 성공적으로 삭제되었습니다.")


# 프로덕션 배포
@router.post(
    "/{prompt_id}/production",
    tags=["⚙️ 5. 고급 관리"],
    summary="🚀 프로덕션 배포",
    description="특정 프롬프트를 프로덕션 환경에 배포합니다.",
    responses={
        200: {
            "description": "프로덕션 배포 성공",
            "content": {
                "application/json": {
                    "example": {
                        "id": 5,
                        "node_name": "검색노드",
                        "content": {
                            "system": {"order": 1, "prompt": "최신 프로덕션 검색 어시스턴트"},
                            "user": {"order": 2, "prompt": None},
                            "assistant": {"order": None, "prompt": None}
                        },
                        "message": "v3.0 정식 배포",
                        "production": True,
                        "version": 3,
                        "created_at": "2024-01-01T12:00:00Z",
                        "updated_at": "2024-01-01T12:00:00Z",
                    }
                }
            },
        },
        404: {
            "description": "프롬프트를 찾을 수 없음",
            "content": {
                "application/json": {"example": {"detail": "Prompt not found"}}
            },
        },
    },
)
async def set_production_prompt(
    prompt_id: int = Path(
        ..., description="🚀 프로덕션으로 배포할 프롬프트의 고유 ID", example=1, gt=0
    ),
):
    # 선택된 프롬프트 정보 가져오기
    query_prompt = select(prompts).where(prompts.c.id == prompt_id)
    prompt_to_activate = await database.fetch_one(query_prompt)

    if not prompt_to_activate:
        raise HTTPException(status_code=404, detail="Prompt not found")

    # 기존 프로덕션 프롬프트 비활성화
    deactivate_query = (
        update(prompts)
        .where(
            prompts.c.node_name == prompt_to_activate.node_name,
            prompts.c.production == True,
        )
        .values(production=False)
    )
    await database.execute(deactivate_query)

    # 선택된 프롬프트 프로덕션으로 설정
    activate_query = (
        update(prompts)
        .where(prompts.c.id == prompt_id)
        .values(production=True)
        .returning(prompts)
    )
    activated_prompt = await database.fetch_one(activate_query)

    return create_success_response(activated_prompt, "프롬프트가 성공적으로 프로덕션으로 배포되었습니다.")


# 모든 노드 목록 조회
@router.get(
    "/nodes",
    tags=["📋 4. 조회 및 검색"],
    summary="📋 모든 노드 목록 조회",
    description="프롬프트 개수, 프로덕션 ID, 최신 버전 등 노드 정보를 조회합니다.",
    responses={
        200: {
            "description": "노드 목록 조회 성공",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "node_name": "검색노드",
                            "prompt_count": 5,
                            "production_prompt_id": 3,
                            "latest_version": 5
                        },
                        {
                            "node_name": "요약노드", 
                            "prompt_count": 2,
                            "production_prompt_id": None,
                            "latest_version": 2
                        }
                    ]
                }
            },
        }
    },
)
async def get_all_nodes():
    """
    시스템에 등록된 모든 노드의 목록과 기본 통계를 반환합니다.
    각 노드별로 프롬프트 개수, 프로덕션 프롬프트, 최신 버전 정보를 포함합니다.
    """
    try:
        # 모든 노드 이름과 기본 통계 정보 조회
        query = select(
            prompts.c.node_name,
            func.count(prompts.c.id).label('prompt_count'),
            func.max(prompts.c.version).label('latest_version')
        ).group_by(prompts.c.node_name).order_by(prompts.c.node_name)
        
        nodes_stats = await database.fetch_all(query)
        
        result = []
        for node_stat in nodes_stats:
            # 각 노드의 프로덕션 프롬프트 ID 조회
            production_query = select(prompts.c.id).where(
                prompts.c.node_name == node_stat.node_name,
                prompts.c.production == True
            )
            production_prompt = await database.fetch_one(production_query)
            
            node_info = {
                "node_name": node_stat.node_name,
                "prompt_count": node_stat.prompt_count,
                "production_prompt_id": production_prompt.id if production_prompt else None,
                "latest_version": node_stat.latest_version
            }
            result.append(node_info)
        
        # 결과를 직접 반환 (이미 딕셔너리 형태이므로 convert 불필요)
        return ResponseSchema(
            status="success",
            data=result,
            message="노드 목록을 성공적으로 조회했습니다."
        )
        
    except Exception as e:
        return create_error_response(f"노드 목록 조회 중 오류가 발생했습니다: {str(e)}")


# 노드 요약 정보 조회 (새 API)
@router.get(
    "/nodes-summary",
    tags=["📋 4. 조회 및 검색"],
    summary="📊 노드 요약 정보 조회",
    description="각 노드별 프롬프트 개수와 가장 최근 생성 시간을 조회합니다.",
    responses={
        200: {
            "description": "노드 요약 정보 조회 성공",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "node_name": "Prompt1",
                            "prompt_count": 1,
                            "latest_created_at": 1621073400
                        },
                        {
                            "node_name": "Prompt2", 
                            "prompt_count": 2,
                            "latest_created_at": 1621159800
                        },
                        {
                            "node_name": "Prompt3",
                            "prompt_count": 3,
                            "latest_created_at": 1735689600
                        }
                    ]
                }
            },
        }
    },
)
async def get_nodes_summary():
    """
    시스템에 등록된 모든 노드의 목록과 기본 통계를 반환합니다.
    각 노드별로 프롬프트 개수, 프로덕션 프롬프트, 최신 버전 정보를 포함합니다.
    """
    try:
        # 모든 노드 이름과 기본 통계 정보 조회
        query = select(
            prompts.c.node_name,
            func.count(prompts.c.id).label('prompt_count'),
            func.max(prompts.c.created_at).label('latest_created_at')
        ).group_by(prompts.c.node_name).order_by(prompts.c.node_name)
        
        nodes_stats = await database.fetch_all(query)
        
        result = []
        for node_stat in nodes_stats:
            # 각 노드의 프로덕션 프롬프트 ID 조회
            production_query = select(prompts.c.id).where(
                prompts.c.node_name == node_stat.node_name,
                prompts.c.production == True
            )
            production_prompt = await database.fetch_one(production_query)
            
            node_info = {
                "node_name": node_stat.node_name,
                "prompt_count": node_stat.prompt_count,
                "latest_created_at": int(node_stat.latest_created_at.timestamp()) if node_stat.latest_created_at else None
            }
            result.append(node_info)
        
        # 결과를 직접 반환 (이미 딕셔너리 형태이므로 convert 불필요)
        return ResponseSchema(
            status="success",
            data=result,
            message="노드 요약 정보를 성공적으로 조회했습니다."
        )
        
    except Exception as e:
        return create_error_response(f"노드 요약 정보 조회 중 오류가 발생했습니다: {str(e)}")


# 노드별 프롬프트 개수 조회
@router.get(
    "/count/{node_name}",
    tags=["📋 4. 조회 및 검색"],
    summary="📊 노드별 프롬프트 개수",
    description="특정 노드에 속한 프롬프트 개수를 조회합니다.",
    responses={
        200: {
            "description": "프롬프트 개수 조회 성공",
            "content": {
                "application/json": {"example": {"node_name": "검색노드", "count": 5}}
            },
        }
    },
)
async def count_prompts_by_node_name(
    node_name: str = Path(
        ..., description="🏷️ 개수를 조회할 노드 이름", example="검색노드"
    ),
):
    query = select(prompts).where(prompts.c.node_name == node_name)
    result = await database.fetch_all(query)
    count = len(result)
    return create_success_response({"node_name": node_name, "count": count}, "프롬프트 개수를 성공적으로 조회했습니다.")


@router.delete(
    "/delete-all/{node_name}",
    tags=["⚙️ 5. 고급 관리"],
    summary="💣 노드 전체 삭제",
    description="⚠️ 주의: 특정 노드의 모든 프롬프트를 영구 삭제합니다.",
    responses={
        200: {
            "description": "노드의 모든 프롬프트 삭제 성공",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "All prompts with node_name '검색노드' deleted."
                    }
                }
            },
        }
    },
)
async def delete_prompts_by_node_name(
    node_name: str = Path(
        ..., description="🗑️ 모든 프롬프트를 삭제할 노드 이름", example="테스트노드"
    ),
):
    query = delete(prompts).where(prompts.c.node_name == node_name)
    result = await database.execute(query)
    return create_success_response({"detail": f"All prompts with node_name '{node_name}' deleted."}, "노드의 모든 프롬프트가 성공적으로 삭제되었습니다.")


# 특정 버전 프롬프트 조회
@router.get(
    "/node/{node_name}/version/{version}",
    tags=["⚙️ 5. 고급 관리"],
    summary="🔢 특정 버전 프롬프트 조회",
    description="노드명과 버전으로 특정 버전의 프롬프트를 조회합니다.",
    responses={
        200: {
            "description": "특정 버전 프롬프트 조회 성공",
            "content": {
                "application/json": {
                    "example": {
                        "id": 2,
                        "node_name": "검색노드",
                        "content": {
                            "system": {"order": 1, "prompt": "이전 버전의 검색 어시스턴트"},
                            "user": {"order": 2, "prompt": None},
                            "assistant": {"order": None, "prompt": None}
                        },
                        "message": "v1.5 안정화 버전",
                        "production": False,
                        "version": 2,
                        "created_at": "2024-01-01T12:00:00Z",
                        "updated_at": "2024-01-01T12:00:00Z",
                    }
                }
            },
        },
        404: {
            "description": "해당 버전의 프롬프트를 찾을 수 없음",
            "content": {
                "application/json": {"example": {"detail": "Prompt version not found"}}
            },
        },
    },
)
async def read_prompt_by_version(
    node_name: str = Path(..., description="🏷️ 노드 이름", example="검색노드"),
    version: int = Path(..., description="🔢 조회할 버전 번호", example=2, ge=1),
):
    query = select(prompts).where(
        prompts.c.node_name == node_name, prompts.c.version == version
    )
    prompt = await database.fetch_one(query)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt version not found")
    return create_success_response(prompt, "특정 버전의 프롬프트를 성공적으로 조회했습니다.")


# 특정 버전 삭제
@router.delete(
    "/node/{node_name}/version/{version}",
    status_code=status.HTTP_200_OK,
    tags=["⚙️ 5. 고급 관리"],
    summary="🗑️ 특정 버전 삭제",
    description="노드의 특정 버전 프롬프트만 삭제합니다.",
    responses={
        200: {
            "description": "특정 버전 삭제 성공",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Prompt with node '검색노드' and version '2' has been deleted."
                    }
                }
            },
        },
        404: {
            "description": "해당 버전의 프롬프트를 찾을 수 없음",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Prompt with node '검색노드' and version '2' not found."
                    }
                }
            },
        },
    },
)
async def delete_prompt_by_version(
    node_name: str = Path(..., description="🏷️ 노드 이름", example="검색노드"),
    version: int = Path(
        ..., description="🔢 삭제할 프롬프트의 버전 번호", example=3, ge=1
    ),
):
    # 프롬프트 존재 여부 확인
    query = select(prompts).where(
        prompts.c.node_name == node_name, prompts.c.version == version
    )
    existing_prompt = await database.fetch_one(query)

    if not existing_prompt:
        raise HTTPException(
            status_code=404,
            detail=f"Prompt with node '{node_name}' and version '{version}' not found.",
        )

    # 프롬프트 삭제 수행
    delete_query = delete(prompts).where(
        prompts.c.node_name == node_name, prompts.c.version == version
    )
    await database.execute(delete_query)

    return create_success_response({
        "detail": f"Prompt with node '{node_name}' and version '{version}' has been deleted."
    }, "특정 버전의 프롬프트가 성공적으로 삭제되었습니다.")


# 특정 버전 프롬프트 수정
@router.put(
    "/node/{node_name}/version/{version}",
    status_code=status.HTTP_200_OK,
    tags=["⚙️ 5. 고급 관리"],
    summary="✏️ 특정 노드의 특정 버전 프롬프트 수정",
    description="노드명과 버전으로 특정 프롬프트를 수정합니다.",
    responses={
        200: {
            "description": "프롬프트가 성공적으로 수정됨",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "node_name": "검색노드",
                        "content": {
                            "system": {
                                "order": 1,
                                "prompt": "수정된 시스템 프롬프트"
                            },
                            "user": {
                                "order": 2,
                                "prompt": "수정된 유저 프롬프트"
                            },
                            "assistant": {"order": None, "prompt": None}
                        },
                        "message": "수정된 메시지",
                        "production": False,
                        "version": 1,
                        "created_at": "2024-01-01T12:00:00Z",
                        "updated_at": "2024-01-01T13:00:00Z",
                    }
                }
            },
        },
        404: {
            "description": "해당 버전의 프롬프트를 찾을 수 없음",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Prompt with node '검색노드' and version '1' not found."
                    }
                }
            },
        },
    },
)
async def update_prompt_by_version(
    node_name: str = Path(..., description="🏷️ 노드 이름", example="검색노드"),
    version: int = Path(
        ..., description="🔢 수정할 프롬프트의 버전 번호", example=1, ge=1
    ),
    prompt_update: PromptUpdate = Body(
        ...,
        openapi_examples={
            "콘텐츠 수정": {
                "summary": "프롬프트 내용을 변경하는 경우",
                "value": {
                    "content": {
                        "system": {
                            "order": 1,
                            "prompt": "변경된 시스템 프롬프트"
                        },
                        "user": {
                            "order": 2,
                            "prompt": "변경된 유저 프롬프트"
                        },
                        "assistant": {"order": None, "prompt": None}
                    }
                },
            },
            "메시지 수정": {
                "summary": "메시지 필드를 변경하는 경우",
                "value": {"message": "변경된 메시지"},
            },
        },
    ),
):
    # 기존 프롬프트 조회
    query = select(prompts).where(
        prompts.c.node_name == node_name, prompts.c.version == version
    )
    existing_prompt = await database.fetch_one(query)

    if not existing_prompt:
        raise HTTPException(
            status_code=404,
            detail=f"Prompt with node '{node_name}' and version '{version}' not found.",
        )

    update_data = prompt_update.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc)

    # 프롬프트 수정 수행
    update_query = (
        update(prompts)
        .where(prompts.c.node_name == node_name, prompts.c.version == version)
        .values(**update_data)
        .returning(prompts)
    )

    updated_prompt = await database.fetch_one(update_query)
    return create_success_response(updated_prompt, "특정 버전의 프롬프트가 성공적으로 수정되었습니다.")
