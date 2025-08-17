import os
from databases import Database
from sqlalchemy import create_engine, MetaData

# 환경변수에서 DATABASE_URL을 가져오고, 없으면 기본값 사용
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://promptuser:promptpass@db:5432/promptdb"
)

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL.replace("+asyncpg", ""))
metadata = MetaData()