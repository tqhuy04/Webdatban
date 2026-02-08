from pydantic import BaseModel

from Backend.schemas.menu_item import MenuItemResponse


# =========================
# ORDER DETAIL
# =========================
class OrderDetailBase(BaseModel):
    OrderID: int
    MenuItemID: int
    Quantity: int

class OrderDetailCreate(BaseModel):
    OrderID: int
    MenuItemID: int
    Quantity: int
    Price: float


class OrderDetailResponse(OrderDetailCreate):
    OrderDetailID: int
    Price: float
    menu_item: MenuItemResponse

    class Config:
        from_attributes = True
