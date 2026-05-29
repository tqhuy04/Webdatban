from pydantic import BaseModel, Field
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
    id: int = Field(..., alias="CustomerID")
    account_id: Optional[int] = None
    full_name: str
    phone_number: str
    address: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True
