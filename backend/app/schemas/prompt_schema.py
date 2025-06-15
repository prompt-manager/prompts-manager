from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PromptContent(BaseModel):
    system: str
    user: Optional[str] = None
    assistant: Optional[str] = None


class PromptCreate(BaseModel):
    node_name: str
    content: PromptContent
    message: Optional[str] = None
    version: Optional[int] = 1


class PromptRead(BaseModel):
    id: int
    production: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class PromptUpdate(BaseModel):
    node_name: Optional[str] = None
    content: Optional[PromptContent] = None
    message: Optional[str] = None
    production: Optional[bool] = None
