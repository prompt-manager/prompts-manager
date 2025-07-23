from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MessageContent(BaseModel):
    order: Optional[int] = None
    prompt: Optional[str] = None


class PromptContent(BaseModel):
    system: MessageContent
    user: MessageContent
    assistant: MessageContent

    class Config:
        json_schema_extra = {
            "example": {
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
            }
        }


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
