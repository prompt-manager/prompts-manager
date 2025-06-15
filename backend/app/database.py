from databases import Database
from sqlalchemy import create_engine, MetaData

DATABASE_URL = "postgresql+asyncpg://promptuser:promptpass@localhost:5432/promptdb"

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL.replace("+asyncpg", ""))
metadata = MetaData()