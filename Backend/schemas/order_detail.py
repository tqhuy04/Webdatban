from pydantic import BaseModel, field_validator
from typing import Optional, Any

from Backend.schemas.menu_item import MenuItemResponse


# =========================
# ORDER DETAIL
# =========================
class OrderDetailBase(BaseModel):
    OrderID: int
    MenuItemID: int
    Quantity: int

class OrderDetailCreate(BaseModel):
    OrderID: Optional[int] = None  # Optional - will be set when creating order
    MenuItemID: int
    Quantity: int
    Price: float = 0


class OrderDetailUpdate(BaseModel):
    OrderID: int
    MenuItemID: int
    Quantity: int
    Price: float = 0


class OrderDetailResponse(OrderDetailCreate):
    OrderDetailID: int
    Price: float
    menu_item: Optional[dict] = None

    class Config:
        from_attributes = True

    @field_validator('menu_item', mode='before')
    @classmethod
    def convert_menu_item_to_dict(cls, v):
        if v is None:
            return None
        if hasattr(v, 'MenuItemID'):
            return {
                'MenuItemID': v.MenuItemID,
                'Name': getattr(v, 'Name', None),
                'Price': getattr(v, 'Price', None),
                'Description': getattr(v, 'Description', None),
                'ImageURL': getattr(v, 'ImageURL', None),
                'CategoryID': getattr(v, 'CategoryID', None),
                'IsAvailable': getattr(v, 'IsAvailable', None),
            }
        return v
