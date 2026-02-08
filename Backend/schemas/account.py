from pydantic import BaseModel, EmailStr
from typing import Optional

# ======================
# BASE
# ======================
class AccountBase(BaseModel):
    username: str
    email: EmailStr
    role: str


# ======================
# CREATE
# ======================
class AccountCreate(AccountBase):
    password: str


# ======================
# UPDATE
# ======================
class AccountUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None


# ======================
# OUTPUT
# ======================
class AccountOut(BaseModel):
    account_id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True
