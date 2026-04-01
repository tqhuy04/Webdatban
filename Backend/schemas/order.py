from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .order_detail import OrderDetailCreate, OrderDetailResponse

class OrderCreate(BaseModel):
    BookingID: int
    CustomerID: int
    PromotionID: Optional[int] = None
    OrderDate: datetime
    Items: Optional[List[OrderDetailCreate]] = []



class OrderResponse(BaseModel):
    OrderID: int
    BookingID: int
    CustomerID: int
    PromotionID: Optional[int]
    OrderDate: datetime
    TotalAmount: float
    Items: List[OrderDetailResponse]
    promotion: Optional[dict] = None

    class Config:
        from_attributes = True
