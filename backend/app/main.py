import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import database, engine, metadata
from app.routers import prompt_router, dataset_router, evaluation_router  # 라우터 추가
from app.schemas.response_schema import ResponseSchema
from app.logging_config import setup_logging

# 로깅 설정 초기화
logger = setup_logging()
logger.info("🚀 FastAPI 애플리케이션 시작")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🔧 데이터베이스 테이블 생성 중...")
    metadata.create_all(engine)
    logger.info("🔌 데이터베이스 연결 중...")
    await database.connect()
    logger.info("✅ 애플리케이션 시작 완료")
    yield
    logger.info("🔌 데이터베이스 연결 해제 중...")
    await database.disconnect()
    logger.info("✅ 애플리케이션 종료 완료")


tags_metadata = [
    {
        "name": "📝 1. 프롬프트 관리",
        "description": "프롬프트의 생성, 조회, 수정, 삭제 등 기본 CRUD 작업",
    },
    {
        "name": "📊 2. 데이터셋 관리",
        "description": "데이터셋의 업로드, 수정, 삭제, 다운로드 등 관리 작업",
    },
    {
        "name": "🧪 3. 평가 관리",
        "description": "프롬프트 평가 실행 및 결과 관리",
    },
    {
        "name": "📋 4. 조회 및 검색",
        "description": "페이지네이션 조회, 검색, 필터링, 통계 정보 등",
    },
    {
        "name": "⚙️ 5. 고급 관리",
        "description": "버전 관리, 프로덕션 배포, 노드 관리 등 고급 기능",
    },
]

app = FastAPI(
    title="🤖 AI Prompt Manager API",
    description="""
    ## AI 프롬프트 관리 시스템 API
    
    이 API는 AI 프롬프트의 생성, 관리, 평가를 위한 완전한 솔루션을 제공합니다.
    
    ### 🌟 주요 기능
    - **프롬프트 관리**: 다양한 AI 프롬프트의 버전 관리 및 배포
    - **데이터셋 관리**: CSV 기반 데이터셋 업로드 및 관리  
    - **평가 시스템**: 프롬프트 성능 평가 및 결과 추적
    - **페이지네이션**: 대용량 데이터의 효율적 조회
    - **검색 및 필터링**: 강력한 검색 및 필터링 기능
    
    ### 📚 사용 가이드
    1. **시작하기**: 프롬프트 생성부터 시작하세요
    2. **데이터셋 준비**: CSV 파일을 업로드하여 평가용 데이터를 준비하세요
    3. **평가 실행**: 프롬프트와 데이터셋으로 성능 평가를 진행하세요
    4. **결과 분석**: 페이지네이션과 필터링으로 결과를 분석하세요
    """,
    version="1.0.0",
    lifespan=lifespan,
    openapi_tags=tags_metadata,
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(prompt_router.router)
app.include_router(dataset_router.router)
app.include_router(evaluation_router.router)


@app.get("/")
async def root():
    logger.info("🏠 루트 엔드포인트 접근")
    return {"message": "프롬프트 및 데이터셋 관리 서버 준비 완료!"}


@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ResponseSchema(
            status="error", data=None, message=exc.detail
        ).model_dump(),
    )
