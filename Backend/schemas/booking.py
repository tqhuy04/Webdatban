from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import List, Optional

from Backend.schemas.table import TableOut


class BookingTableCreate(BaseModel):
    customer_id: int
    booking_time: datetime
    table_ids: List[int]
    total_amount: Optional[float] = 0  # Tổng tiền đơn hàng (tạm tính)
    people: Optional[int] = 1  # Số người đặt bàn


class BookingTableResponse(BaseModel):
    booking_id: int
    customer_id: int
    booking_time: datetime
    table_ids: List[int]
    deposit_amount: float = 0
    deposit_status: int = 0
    total_amount: float = 0
    remaining_amount: float = 0
    payment_status: int = 0


class BookingTableOut(BaseModel):
    BookingID: int
    TableID: int
    table: TableOut

    class Config:
        from_attributes = True


# Response schema matching SQLAlchemy model (PascalCase)
class BookingTableDBResponse(BaseModel):
    BookingID: int
    CustomerID: int
    BookingTime: datetime
    Status: int
    People: int = 1
    DepositAmount: float = 0
    DepositStatus: int = 0
    TotalAmount: float = 0
    RemainingAmount: float = 0
    PaymentStatus: int = 0
    TableCount: int = 0  # Số lượng bàn đã đặt

    class Config:
        from_attributes = True

    @field_validator('Status', 'DepositStatus', 'PaymentStatus', 'People', 'TableCount', mode='before')
    @classmethod
    def ensure_int(cls, v):
        return int(v) if v is not None else 0


# Schema cho thanh toán cọc
class DepositRequest(BaseModel):
    booking_id: int
    amount: float


class DepositResponse(BaseModel):
    booking_id: int
    deposit_amount: float
    deposit_status: int
    payment_url: Optional[str] = None  # URL thanh toán VNPay


# Schema for search results with customer info
class BookingWithCustomer(BaseModel):
    BookingID: int
    BookingTime: datetime
    Status: int
    People: int = 1
    TotalAmount: float = 0
    RemainingAmount: float = 0
    PaymentStatus: int = 0
    customer: Optional[dict] = None

    class Config:
        from_attributes = True