from fastapi import APIRouter, HTTPException, Body
from app.core.evaluators import run_evaluation
from app.database import database
from app.models.prompt_model import prompts
from app.models.dataset_model import datasets
from app.models.evaluation_result_model import evaluation_results
from sqlalchemy import select, insert
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import List
from app.schemas.response_schema import ResponseSchema
from app.utils.response_utils import create_success_response, create_error_response

router = APIRouter(prefix="/evaluations", tags=["Evaluations"])

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
    summary="프롬프트 평가 실행 및 결과 저장",
    description="평가 실행 후 결과를 데이터베이스에 저장합니다."
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
            prompt_content=prompt.content["system"],  
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
    summary="모든 평가 결과 조회",
    description="지금까지 저장된 모든 평가 결과를 조회합니다."
)
async def get_all_evaluation_results():
    try:
        query = select(evaluation_results).order_by(evaluation_results.c.created_at.desc())
        results = await database.fetch_all(query)
        
        return create_success_response(results, "평가 결과를 성공적으로 조회했습니다.")
    except Exception as e:
        return create_error_response(f"Error: {str(e)}")