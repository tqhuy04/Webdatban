from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PromotionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    discount_percent: float
    start_date: datetime
    end_date: datetime


class PromotionUpdate(BaseModel):
    name: str
    description: Optional[str] = None
    discount_percent: float
    start_date: datetime
    end_date: datetime


class PromotionResponse(BaseModel):
    PromotionID: int
    Name: str
    Description: Optional[str] = None
    DiscountPercent: float
    StartDate: datetime
    EndDate: datetime
    CreatedAt: datetime

    class Config:
        orm_mode = True
