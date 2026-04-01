from pydantic import BaseModel
from datetime import datetime
from typing import List

from Backend.schemas.table import TableOut


class BookingTableCreate(BaseModel):
    customer_id: int
    booking_time: datetime
    table_ids: List[int]


class BookingTableResponse(BaseModel):
    booking_id: int
    customer_id: int
    booking_time: datetime
    table_ids: List[int]
class BookingTableOut(BaseModel):
    BookingID: int
    TableID: int
    table: TableOut

    class Config:
        from_attributes = True
        orm_mode = True