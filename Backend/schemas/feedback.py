from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class FeedbackBase(BaseModel):
    Content: str
    Rating: Optional[int] = 5  # Mặc định 5 sao


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackResponse(FeedbackBase):
    FeedbackID: int
    UserID: int
    CreateAt: datetime
    full_name: Optional[str] = None   # ⭐ THÊM DÒNG NÀY

    class Config:
        from_attributes = True
