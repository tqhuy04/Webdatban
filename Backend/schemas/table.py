from pydantic import BaseModel
from typing import Optional


# =========================
# BASE
# =========================
class TableBase(BaseModel):
    TableNumber: str
    Capacity: int
    Status: int


# =========================
# CREATE
# =========================
class TableCreate(TableBase):
    pass


# =========================
# UPDATE
# =========================
class TableUpdate(BaseModel):
    TableNumber: Optional[str] = None
    Capacity: Optional[int] = None
    Status: Optional[int]


# =========================
# RESPONSE
# =========================
class TableOut(TableBase):
    TableID: int

    class Config:
        from_attributes = True


# =========================
# AVAILABLE TABLE REQUEST
# =========================
class TableAvailableRequest(BaseModel):
    date: str      # yyyy-mm-dd
    time: str      # HH:mm
    people: int
