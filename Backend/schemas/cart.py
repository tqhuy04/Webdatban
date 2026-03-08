from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from Backend.schemas.menu_item import MenuItemResponse


class CartBase(BaseModel):
    CustomerID: int
    MenuItemID: int
    Quantity: int


class CartCreate(CartBase):
    pass


class CartUpdate(BaseModel):
    Quantity: int


class CartResponse(CartBase):
    CartID: int
    CreatedAt: datetime
    menu_item: Optional[MenuItemResponse] = None

    class Config:
        from_attributes = True
