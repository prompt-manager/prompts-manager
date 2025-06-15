from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database import database, engine, metadata
from app.routers import prompt_router  # 라우터 추가

@asynccontextmanager
async def lifespan(app: FastAPI):
    metadata.create_all(engine)
    await database.connect()
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)

# 라우터 등록
app.include_router(prompt_router.router)

@app.get("/")
async def root():
    return {"message": "프롬프트 관리 서버 준비 완료!"}