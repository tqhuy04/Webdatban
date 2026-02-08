from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class CustomerResponse(BaseModel):
    full_name: str

    class Config:
        from_attributes = True
class TableBookingCreate(BaseModel):
    CustomerID: int
    BookingTime: Optional[datetime] = None
    Status: Optional[int] = None

class TableBookingResponse(BaseModel):
    BookingID: int
    CustomerID: int
    CustomerName: str
    BookingTime: datetime
    Status: Optional[int] = None
    OrderID: Optional[int]
    TableNumber: Optional[str]

    # 🔥 FIX QUYẾT ĐỊNH
    customer: Optional[CustomerResponse] = None

    class Config:
        from_attributes = True
