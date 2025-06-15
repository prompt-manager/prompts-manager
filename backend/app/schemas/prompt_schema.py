from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PromptContent(BaseModel):
    system: str
    user: Optional[str] = None
    assistant: Optional[str] = None


class PromptCreate(BaseModel):
    node_name: str
    model_name: str
    title: str
    content: PromptContent


class PromptRead(BaseModel):
    id: int
    node_name: str
    model_name: str
    title: str
    content: PromptContent
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class PromptUpdate(BaseModel):
    node_name: Optional[str] = None
    model_name: Optional[str] = None
    content: Optional[PromptContent] = None
    is_active: Optional[bool] = None
