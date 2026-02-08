from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class FeedbackBase(BaseModel):
    Content: str


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackResponse(FeedbackBase):
    FeedbackID: int
    UserID: int
    CreateAt: datetime
    full_name: Optional[str] = None   # ⭐ THÊM DÒNG NÀY

    class Config:
        from_attributes = True
