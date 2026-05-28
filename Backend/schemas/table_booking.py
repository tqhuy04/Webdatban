from typing import Optional
from pydantic import BaseModel, field_validator
from datetime import datetime, time


class CustomerResponse(BaseModel):
    full_name: str

    class Config:
        from_attributes = True

class TableBookingCreate(BaseModel):
    CustomerID: Optional[int] = None
    BookingTime: Optional[datetime] = None
    Status: Optional[int] = None
    
    @field_validator('BookingTime', mode='before')
    @classmethod
    def parse_booking_time(cls, v):
        if v is None:
            return None
        if isinstance(v, datetime):
            return v
        if isinstance(v, str):
            # Handle time-only format "14:30" or "14:30:00"
            if ':' in v and len(v.split('T')) == 1:
                try:
                    time_obj = time.fromisoformat(v)
                    return datetime.combine(datetime.now().date(), time_obj)
                except:
                    pass
            # Handle full datetime format
            try:
                return datetime.fromisoformat(v.replace('Z', '+00:00'))
            except:
                pass
        return v

    @field_validator('CustomerID', 'Status', mode='before')
    @classmethod
    def parse_int_fields(cls, v):
        if v is None:
            return None
        try:
            return int(v)
        except:
            return v

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
