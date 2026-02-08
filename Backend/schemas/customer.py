from pydantic import BaseModel
from typing import Optional

class CustomerCreate(BaseModel):
    full_name: str
    phone_number: str
    address: str


class CustomerUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None


class CustomerOut(BaseModel):
    id: int
    account_id: int
    full_name: str
    phone_number: str
    address: str

    class Config:
        from_attributes = True
