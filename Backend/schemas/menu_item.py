from pydantic import BaseModel
from typing import Optional


# =========================
# BASE
# =========================
class MenuItemBase(BaseModel):
    CategoryID: int
    Name: str
    Description: str
    Price: float
    ImageURL: str
    Status: str


# =========================
# CREATE
# =========================
class MenuItemCreate(MenuItemBase):
    pass


# =========================
# UPDATE (CHỈNH TỪNG FIELD)
# =========================
class MenuItemUpdate(BaseModel):
    CategoryID: Optional[int] = None
    Name: Optional[str] = None
    Description: Optional[str] = None
    Price: Optional[float] = None
    ImageURL: Optional[str] = None
    Status: Optional[str] = None


# =========================
# RESPONSE
# =========================
class MenuItemResponse(MenuItemBase):
    MenuItemID: int

    class Config:
        from_attributes = True
