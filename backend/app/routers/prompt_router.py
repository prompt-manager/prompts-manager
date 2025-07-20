from fastapi import APIRouter, HTTPException, Body, Path, status
from typing import List
from app.database import database
from app.models.prompt_model import prompts
from app.schemas.prompt_schema import PromptCreate, PromptRead, PromptUpdate
from app.schemas.response_schema import ResponseSchema
from app.utils.response_utils import create_success_response, create_error_response
from sqlalchemy import select, insert, update, delete
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/prompts", tags=["프롬프트 관리"])


# 프롬프트 추가 (System 필수, User/Assistant 선택)
@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    tags=["기본 CRUD"],
    summary="🆕 새 프롬프트 생성",
    description="""
    ## 새로운 프롬프트를 생성합니다
    
    ### 📋 필수 사항
    - **System 메시지**: 반드시 포함되어야 합니다
    - **Node Name**: 프롬프트가 속할 노드 이름
    
    ### 🔧 선택 사항
    - **User 메시지**: 사용자 입력 예시
    - **Assistant 메시지**: 어시스턴트 응답 예시  
    - **Message**: 프롬프트에 대한 설명이나 메모
    
    ### ⚙️ 자동 처리
    - **Version**: 자동으로 증가 (같은 노드 내에서)
    - **Production**: 기본값 `false`
    - **생성/수정 시간**: UTC 기준 자동 설정
    """,
    responses={
        201: {
            "description": "프롬프트가 성공적으로 생성됨",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "node_name": "검색노드",
                        "content": {
                            "system": "당신은 검색을 도와주는 어시스턴트입니다."
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
                        "system": "당신은 질문에 답변하고 작업을 도와줄 수 있는 도움이 되는 어시스턴트입니다."
                    },
                },
            },
            "완전한_대화형": {
                "summary": "💬 완전한 대화형 프롬프트",
                "description": "System, User, Assistant 메시지가 모두 포함된 완전한 예시",
                "value": {
                    "node_name": "요약노드",
                    "content": {
                        "system": "당신은 제공된 텍스트를 간결하게 요약하는 전문 어시스턴트입니다.",
                        "user": "이 보고서는 최신 시장 동향을 분석하고 있으며, 주요 경쟁사의 전략과 소비자 행동 변화에 초점을 맞추고 있습니다.",
                        "assistant": "보고서는 시장 동향, 경쟁사 전략, 소비자 행동 변화를 분석합니다.",
                    },
                    "message": "📊 요약 노드의 신규 버전 프롬프트 - 더 간결한 요약을 위해 개선",
                },
            },
        },
    ),
):
    if not prompt.content.system.strip():
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


# 특정 프롬프트 조회 (Read) - ID로 조회
@router.get(
    "/id/{prompt_id}",
    tags=["기본 CRUD"],
    summary="🔍 ID로 프롬프트 조회",
    description="""
    ## 고유 ID로 특정 프롬프트를 조회합니다
    
    ### 📌 사용 시나리오
    - 특정 프롬프트의 상세 정보가 필요할 때
    - 프롬프트 수정 전 현재 상태 확인
    - 프로덕션 상태나 버전 정보 확인
    
    ### 💡 팁
    - ID는 데이터베이스에서 자동 생성되는 고유 값입니다
    - 다른 API에서 반환된 프롬프트의 ID를 사용하세요
    """,
    responses={
        200: {
            "description": "프롬프트 조회 성공",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "node_name": "검색노드",
                        "content": {
                            "system": "검색을 도와주는 어시스턴트입니다.",
                            "user": "파리의 날씨는 어때요?",
                            "assistant": "파리의 현재 날씨를 확인해드리겠습니다.",
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


# 특정 노드를 기준으로 프롬프트 조회 (모든 버전 조회)
@router.get(
    "/node/{node_name}",
    tags=["노드 관리"],
    summary="📦 노드별 모든 프롬프트 조회",
    description="""
    ## 특정 노드의 모든 프롬프트 버전을 조회합니다
    
    ### 📊 반환 정보
    - 해당 노드의 **모든 버전** 프롬프트
    - **최신순으로 정렬**되어 반환
    - 각 프롬프트의 프로덕션 상태 포함
    
    ### 🎯 활용 방법
    - 노드의 프롬프트 히스토리 확인
    - 버전별 변경사항 추적
    - 프로덕션 버전과 개발 버전 비교
    
    ### 📝 참고사항
    - 빈 배열이 반환되면 해당 노드에 프롬프트가 없음을 의미합니다
    - 대소문자를 구분하므로 정확한 노드명을 입력해주세요
    """,
    responses={
        200: {
            "description": "노드의 모든 프롬프트 목록",
            "content": {
                "application/json": {
                    "example": [
                        {
                            "id": 3,
                            "node_name": "검색노드",
                            "content": {"system": "최신 검색 어시스턴트"},
                            "message": "성능 최적화 버전",
                            "production": True,
                            "version": 3,
                            "created_at": "2024-01-03T10:00:00Z",
                            "updated_at": "2024-01-03T10:00:00Z",
                        },
                        {
                            "id": 2,
                            "node_name": "검색노드",
                            "content": {"system": "검색 도우미"},
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


# 프롬프트 수정 (Update)
@router.put(
    "/id/{prompt_id}",
    tags=["기본 CRUD"],
    summary="✏️ 프롬프트 수정",
    description="""
    ## 기존 프롬프트를 수정합니다
    
    ### 🔄 수정 가능한 필드
    - **Content**: System/User/Assistant 메시지
    - **Message**: 프롬프트 설명이나 메모
    - **Production**: 프로덕션 상태
    - **Node Name**: 소속 노드 (신중히 변경)
    
    ### ⚠️ 주의사항
    - **부분 업데이트**: 변경하고 싶은 필드만 포함하세요
    - **Version**: 수정 시에도 버전은 변경되지 않습니다
    - **Updated At**: 자동으로 현재 시간(UTC)으로 갱신됩니다
    
    ### 💡 베스트 프랙티스
    - 프로덕션 중인 프롬프트 수정 시 주의하세요
    - 중요한 변경사항은 새 버전 생성을 고려하세요
    """,
    responses={
        200: {
            "description": "프롬프트 수정 성공",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "node_name": "검색노드",
                        "content": {"system": "향상된 검색 어시스턴트입니다."},
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
                        "system": "당신은 개선된 검색 전문 어시스턴트입니다. 정확하고 관련성 높은 결과를 제공해주세요.",
                        "user": "최신 기술 트렌드에 대해 알려주세요.",
                        "assistant": "최신 기술 트렌드를 정확한 데이터와 함께 설명드리겠습니다.",
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
                        "system": "당신은 최첨단 AI 검색 어시스턴트입니다. 사용자의 질문을 정확히 이해하고 최적의 답변을 제공합니다."
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


# 프롬프트 삭제 (Delete)
@router.delete(
    "/id/{prompt_id}",
    status_code=status.HTTP_200_OK,
    tags=["기본 CRUD"],
    summary="🗑️ 프롬프트 삭제",
    description="""
    ## 특정 프롬프트를 영구적으로 삭제합니다
    
    ### ⚠️ 경고
    - **되돌릴 수 없는 작업**입니다
    - 삭제된 프롬프트는 복구할 수 없습니다
    - 프로덕션 중인 프롬프트 삭제 시 서비스에 영향을 줄 수 있습니다
    
    ### 🛡️ 권장사항
    - 프로덕션 프롬프트 삭제 전 백업 확인
    - 팀원들과 삭제 여부 사전 협의
    - 대안 프롬프트 준비 후 삭제 수행
    
    ### 💡 대안
    - 삭제 대신 `production: false`로 비활성화 고려
    - 새 버전 생성으로 점진적 전환 권장
    """,
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


# 특정 프롬프트를 프로덕션으로 설정 (다른 버전은 비프로덕션으로 처리)
@router.post(
    "/{prompt_id}/production",
    tags=["프로덕션 관리"],
    summary="🚀 프로덕션 배포",
    description="""
    ## 특정 프롬프트를 프로덕션으로 배포합니다
    
    ### 🔄 자동 처리 사항
    - **대상 프롬프트**: `production: true`로 설정
    - **동일 노드의 다른 프롬프트**: `production: false`로 자동 변경
    - **배포 시점**: 즉시 적용
    
    ### 📋 배포 전 체크리스트
    - [ ] 프롬프트 내용 최종 검토 완료
    - [ ] 테스트 환경에서 정상 동작 확인
    - [ ] 팀 리뷰 및 승인 완료
    - [ ] 백업 프롬프트 준비 완료
    
    ### 🎯 사용 시나리오
    - 새 버전의 프롬프트를 라이브 서비스에 적용
    - A/B 테스트를 위한 프롬프트 전환
    - 긴급 핫픽스 프롬프트 배포
    """,
    responses={
        200: {
            "description": "프로덕션 배포 성공",
            "content": {
                "application/json": {
                    "example": {
                        "id": 5,
                        "node_name": "검색노드",
                        "content": {"system": "최신 프로덕션 검색 어시스턴트"},
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


# 프롬프트 개수 조회
@router.get(
    "/count/{node_name}",
    tags=["노드 관리"],
    summary="📊 노드별 프롬프트 개수",
    description="""
    ## 특정 노드의 프롬프트 총 개수를 조회합니다
    
    ### 📈 활용 방법
    - 노드별 프롬프트 관리 현황 파악
    - 버전 히스토리 규모 확인
    - 리소스 사용량 모니터링
    
    ### 💡 참고
    - 모든 버전(프로덕션/비프로덕션)을 포함한 총 개수
    - 실시간 정확한 카운트 제공
    """,
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
    tags=["노드 관리"],
    summary="💣 노드 전체 삭제",
    description="""
    ## ⚠️ 위험: 노드의 모든 프롬프트를 삭제합니다
    
    ### 🚨 경고사항
    - **모든 버전**의 프롬프트가 삭제됩니다
    - **되돌릴 수 없는** 작업입니다
    - **프로덕션 서비스**에 영향을 줄 수 있습니다
    
    ### 🛡️ 안전 절차
    1. **백업 확인**: 중요한 프롬프트 백업
    2. **팀 승인**: 관련 팀원들과 협의
    3. **서비스 점검**: 해당 노드 사용 서비스 확인
    4. **대체 방안**: 필요 시 대체 프롬프트 준비
    
    ### 🎯 사용 시나리오
    - 테스트 노드 정리
    - 프로젝트 종료 후 리소스 정리
    - 실수로 생성된 노드 제거
    """,
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


# 특정 버전의 프롬프트 조회
@router.get(
    "/node/{node_name}/version/{version}",
    tags=["버전 관리"],
    summary="🔢 특정 버전 프롬프트 조회",
    description="""
    ## 노드의 특정 버전 프롬프트를 조회합니다
    
    ### 🎯 사용 목적
    - **버전별 비교**: 이전 버전과 현재 버전 비교
    - **롤백 준비**: 이전 버전으로 되돌리기 전 내용 확인
    - **히스토리 추적**: 특정 시점의 프롬프트 상태 확인
    
    ### 📋 버전 정보
    - 버전은 1부터 시작하여 순차적으로 증가
    - 같은 노드 내에서만 버전 번호가 의미를 가짐
    - 삭제된 버전은 조회할 수 없음
    
    ### 💡 활용 팁
    - 프로덕션 이슈 발생 시 이전 버전 확인
    - 프롬프트 변경 이력 추적
    - 특정 버전의 성능 분석
    """,
    responses={
        200: {
            "description": "특정 버전 프롬프트 조회 성공",
            "content": {
                "application/json": {
                    "example": {
                        "id": 2,
                        "node_name": "검색노드",
                        "content": {"system": "이전 버전의 검색 어시스턴트"},
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


# 특정 버전의 프롬프트 삭제
@router.delete(
    "/node/{node_name}/version/{version}",
    status_code=status.HTTP_200_OK,
    tags=["버전 관리"],
    summary="🗑️ 특정 버전 삭제",
    description="""
    ## 노드의 특정 버전 프롬프트를 삭제합니다
    
    ### ⚠️ 삭제 전 확인사항
    - **프로덕션 상태**: 프로덕션 중인 버전 삭제 주의
    - **의존성**: 해당 버전을 참조하는 서비스 확인
    - **백업**: 중요한 버전은 삭제 전 백업
    
    ### 🎯 일반적인 사용 사례
    - 테스트용 버전 정리
    - 잘못 생성된 버전 제거  
    - 불필요한 구버전 정리
    - 보안 이슈가 있는 버전 즉시 제거
    
    ### 💡 대체 방안
    - 삭제 대신 `production: false` 설정 고려
    - 중요한 버전은 메시지에 '사용 중단' 표시
    """,
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


# 특정 노드의 특정 버전 프롬프트 수정
@router.put(
    "/node/{node_name}/version/{version}",
    status_code=status.HTTP_200_OK,
    tags=["기본 CRUD"],
    summary="✏️ 특정 노드의 특정 버전 프롬프트 수정",
    description="""
    ## 특정 노드의 특정 버전 프롬프트를 수정합니다
    
    ### 📋 필수 사항
    - **Node Name**: 수정할 프롬프트의 노드 이름
    - **Version**: 수정할 프롬프트의 버전 번호
    
    ### 🔧 수정 가능 항목
    - **Content**: 프롬프트 내용 (system, user, assistant)
    - **Message**: 프롬프트 설명이나 메모
    
    ### ⚙️ 자동 처리
    - **Updated At**: UTC 기준 자동 업데이트
    """,
    responses={
        200: {
            "description": "프롬프트가 성공적으로 수정됨",
            "content": {
                "application/json": {
                    "example": {
                        "id": 1,
                        "node_name": "검색노드",
                        "content": {
                            "system": "수정된 시스템 프롬프트",
                            "user": "수정된 유저 프롬프트",
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
                        "system": "변경된 시스템 프롬프트",
                        "user": "변경된 유저 프롬프트",
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
