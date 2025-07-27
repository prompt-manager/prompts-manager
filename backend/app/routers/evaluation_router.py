from fastapi import APIRouter, HTTPException, Body, Query, Depends
from app.core.evaluators import run_evaluation, get_available_metrics
from app.database import database
from app.models.prompt_model import prompts
from app.models.dataset_model import datasets
from app.models.evaluation_result_model import evaluation_results, evaluation_requests, EvaluationStatus
from sqlalchemy import select, insert, func
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import List, Optional
from app.schemas.response_schema import ResponseSchema
from app.schemas.pagination_schema import PaginationParams, PaginatedResponse
from app.utils.response_utils import create_success_response, create_error_response, create_paginated_response, get_total_count
import uuid
import json

router = APIRouter(prefix="/evaluations", tags=["🧪 3. 평가 관리"])

# 새로운 노드 기반 평가 요청 스키마
class NodeEvaluationRequest(BaseModel):
    node_name: str
    version: str = "production"  # "production" or specific version number
    dataset_id: int
    metrics: List[str]
    callback_url: Optional[str] = None

# 평가 요청 응답 스키마
class EvaluationRequestResponse(BaseModel):
    request_id: str
    node_name: str
    version: str
    dataset_id: int
    metrics: List[str]
    status: str
    created_at: datetime

# 메트릭 목록 조회 API
@router.get(
    "/metrics",
    tags=["📋 4. 조회 및 검색"],
    summary="📊 사용 가능한 평가 메트릭 목록 조회",
    description="시스템에서 지원하는 모든 평가 메트릭의 목록과 상세 정보를 반환합니다.",
    responses={
        200: {
            "description": "메트릭 목록 조회 성공",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "data": [
                            {
                                "key": "accuracy",
                                "name": "정확성", 
                                "description": "예상 결과와 실제 결과의 일치율을 측정합니다",
                                "unit": "score"
                            },
                            {
                                "key": "response_time",
                                "name": "응답속도",
                                "description": "프롬프트 처리 및 응답 생성 시간을 측정합니다", 
                                "unit": "score"
                            },
                            {
                                "key": "completeness", 
                                "name": "완성도",
                                "description": "응답의 완전성과 포괄성을 평가합니다",
                                "unit": "score"
                            }
                        ],
                        "message": "사용 가능한 메트릭 목록을 성공적으로 조회했습니다."
                    }
                }
            }
        }
    }
)
async def get_metrics():
    """
    시스템에서 지원하는 모든 평가 메트릭의 목록을 반환합니다.
    각 메트릭의 키, 이름, 설명, 단위 정보를 포함합니다.
    """
    try:
        metrics = get_available_metrics()
        return ResponseSchema(
            status="success",
            data=metrics,
            message="사용 가능한 메트릭 목록을 성공적으로 조회했습니다."
        )
    except Exception as e:
        return create_error_response(f"메트릭 목록 조회 중 오류가 발생했습니다: {str(e)}")

# 새로운 노드 기반 평가 요청 API
@router.post(
    "/request",
    tags=["🧪 3. 평가 관리"],
    summary="🚀 노드 기반 평가 요청",
    description="노드와 버전을 기반으로 평가를 요청합니다. 프로덕션 버전 또는 특정 버전 지정 가능합니다.",
    responses={
        200: {
            "description": "평가 요청 성공",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "data": {
                            "request_id": "uuid-string",
                            "node_name": "검색노드",
                            "version": "production",
                            "dataset_id": 1,
                            "metrics": ["accuracy", "response_time"],
                            "status": "pending",
                            "created_at": "2024-01-01T12:00:00Z"
                        },
                        "message": "평가 요청이 성공적으로 등록되었습니다."
                    }
                }
            }
        },
        404: {
            "description": "노드 또는 데이터셋을 찾을 수 없음"
        }
    }
)
async def request_node_evaluation(request: NodeEvaluationRequest = Body(...)):
    """
    노드 기반 평가를 요청합니다.
    - 노드의 프로덕션 버전 또는 특정 버전을 평가
    - 여러 메트릭을 동시에 평가 가능
    - 비동기 처리를 위한 상태 관리
    """
    try:
        # 1. 노드와 버전 검증
        if request.version == "production":
            # 프로덕션 버전 조회
            prompt_query = select(prompts).where(
                prompts.c.node_name == request.node_name,
                prompts.c.production == True
            )
        else:
            # 특정 버전 조회
            prompt_query = select(prompts).where(
                prompts.c.node_name == request.node_name,
                prompts.c.version == int(request.version)
            )
        
        prompt = await database.fetch_one(prompt_query)
        if not prompt:
            raise HTTPException(
                status_code=404, 
                detail=f"Node '{request.node_name}' with version '{request.version}' not found"
            )

        # 2. 데이터셋 검증
        dataset_query = select(datasets).where(datasets.c.id == request.dataset_id)
        dataset = await database.fetch_one(dataset_query)
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found")

        # 3. 메트릭 검증
        available_metrics = [m["key"] for m in get_available_metrics()]
        invalid_metrics = [m for m in request.metrics if m not in available_metrics]
        if invalid_metrics:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid metrics: {invalid_metrics}. Available: {available_metrics}"
            )

        # 4. 평가 요청 생성
        request_id = str(uuid.uuid4())
        
        evaluation_request_data = {
            "id": request_id,
            "node_name": request.node_name,
            "version": request.version,
            "dataset_id": request.dataset_id,
            "metrics": json.dumps(request.metrics),
            "callback_url": request.callback_url,
            "status": EvaluationStatus.PENDING,
            "created_at": datetime.now(timezone.utc)
        }

        insert_query = insert(evaluation_requests).values(**evaluation_request_data)
        await database.execute(insert_query)

        # 5. 응답 생성
        response_data = {
            "request_id": request_id,
            "node_name": request.node_name,
            "version": request.version,
            "dataset_id": request.dataset_id,
            "metrics": request.metrics,
            "status": "pending",
            "created_at": evaluation_request_data["created_at"]
        }

        return ResponseSchema(
            status="success",
            data=response_data,
            message="평가 요청이 성공적으로 등록되었습니다."
        )

    except HTTPException:
        raise
    except Exception as e:
        return create_error_response(f"평가 요청 중 오류가 발생했습니다: {str(e)}")

# 평가 요청 스키마
class EvaluationRequest(BaseModel):
    metric_name: str
    prompt_id: int
    dataset_id: int

# 평가 결과 응답 스키마
class EvaluationResult(BaseModel):
    metric: str
    prompt_id: int
    dataset_id: int
    score: float

@router.post(
    "/run",
    tags=["🧪 3. 평가 관리"],
    summary="🚀 프롬프트 평가 실행 및 결과 저장",
    description="프롬프트와 데이터셋으로 평가를 실행하고 결과를 저장합니다.",
)
async def evaluate_prompt(request: EvaluationRequest = Body(...)):
    # 프롬프트 조회
    prompt_query = select(prompts).where(prompts.c.id == request.prompt_id)
    prompt = await database.fetch_one(prompt_query)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found.")

    # 데이터셋 조회
    dataset_query = select(datasets).where(datasets.c.id == request.dataset_id)
    dataset = await database.fetch_one(dataset_query)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    # 평가 로직 실행
    try:
        evaluation_score = run_evaluation(
            request.metric_name,
            prompt_content=prompt.content["system"]["prompt"],  
            dataset_content=dataset.content
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 평가 결과 DB에 저장
    query = insert(evaluation_results).values(
        prompt_id=request.prompt_id,
        dataset_id=request.dataset_id,
        metric_name=request.metric_name,
        score=evaluation_score,
        created_at=datetime.now(timezone.utc)
    )
    await database.execute(query)

    return create_success_response(
        EvaluationResult(
            metric=request.metric_name,
            prompt_id=request.prompt_id,
            dataset_id=request.dataset_id,
            score=evaluation_score
        ),
        "평가가 성공적으로 완료되었습니다."
    )

    

# 평가 결과 조회 스키마
class EvaluationResultRead(BaseModel):
    id: int
    prompt_id: int
    dataset_id: int
    metric_name: str
    score: float
    created_at: datetime

    class Config:
        from_attributes = True

@router.get(
    "/results",
    tags=["📋 4. 조회 및 검색"],
    summary="📋 모든 평가 결과 페이지네이션 조회",
    description="페이지네이션으로 평가 결과를 조회합니다. metric_name과 prompt_id로 필터링 가능합니다.",
    responses={
        200: {
            "description": "평가 결과 페이지네이션 조회 성공",
            "content": {
                "application/json": {
                    "example": {
                        "status": "success",
                        "data": {
                            "items": [
                                {
                                    "id": 1,
                                    "prompt_id": 1,
                                    "dataset_id": 1,
                                    "metric_name": "accuracy",
                                    "score": 0.95,
                                    "created_at": 1750064190
                                }
                            ],
                            "page": 1,
                            "size": 10,
                            "total": 25,
                            "total_pages": 3,
                            "has_next": True,
                            "has_prev": False
                        },
                        "message": "평가 결과를 성공적으로 조회했습니다."
                    }
                }
            },
        }
    },
)
async def get_evaluation_results_paginated(
    pagination: PaginationParams = Depends(),
    metric_name: str = Query(None, description="평가 지표로 필터링"),
    prompt_id: int = Query(None, description="프롬프트 ID로 필터링")
):
    """
    모든 평가 결과를 페이지네이션으로 조회합니다.
    평가 지표나 프롬프트로 필터링도 가능합니다.
    """
    try:
        # 기본 쿼리 구성
        base_query = select(evaluation_results)
        
        # 필터링 적용
        if metric_name:
            base_query = base_query.where(evaluation_results.c.metric_name == metric_name)
        if prompt_id:
            base_query = base_query.where(evaluation_results.c.prompt_id == prompt_id)
        
        # 전체 개수 조회
        count_query = select(func.count()).select_from(
            base_query.alias()
        )
        total = await database.fetch_one(count_query)
        total_count = total[0] if total else 0
        
        # 페이지네이션 적용된 데이터 조회
        paginated_query = (
            base_query
            .order_by(evaluation_results.c.created_at.desc())
            .limit(pagination.size)
            .offset((pagination.page - 1) * pagination.size)
        )
        
        items = await database.fetch_all(paginated_query)
        
        # 필터링 메시지 구성
        filters = []
        if metric_name:
            filters.append(f"지표: {metric_name}")
        if prompt_id:
            filters.append(f"프롬프트 ID: {prompt_id}")
        
        filter_message = f" ({', '.join(filters)})" if filters else ""
        message = f"평가 결과를 성공적으로 조회했습니다{filter_message}."
        
        return create_paginated_response(
            items=items,
            page=pagination.page,
            size=pagination.size,
            total=total_count,
            message=message
        )
        
    except Exception as e:
        return create_error_response(f"평가 결과 조회 중 오류가 발생했습니다: {str(e)}")