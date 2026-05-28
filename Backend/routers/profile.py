from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from Backend.database import get_db
from Backend.models.account import Account
from Backend.core.dependencies import get_current_user

router = APIRouter(prefix="/api/accounts", tags=["Accounts"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None


class ProfileOut(BaseModel):
    account_id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(plain, hashed)
    except Exception:
        return False


@router.get("/me", response_model=ProfileOut)
def get_my_profile(user: Account = Depends(get_current_user)):
    return ProfileOut(
        account_id=user.id,
        username=user.Username,
        email=user.Email,
        role=user.Role
    )


@router.put("/me", response_model=ProfileOut)
def update_my_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    user: Account = Depends(get_current_user)
):
    if data.username is not None:
        existing = db.query(Account).filter(
            Account.Username == data.username,
            Account.id != user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại")

    if data.email is not None:
        existing = db.query(Account).filter(
            Account.Email == data.email,
            Account.id != user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email đã tồn tại")

    if data.new_password:
        if not data.current_password:
            raise HTTPException(status_code=400, detail="Vui lòng nhập mật khẩu hiện tại")
        if not verify_password(data.current_password, user.Password):
            raise HTTPException(status_code=400, detail="Mật khẩu hiện tại không đúng")

    if data.username is not None:
        user.Username = data.username
    if data.email is not None:
        user.Email = data.email
    if data.new_password:
        user.Password = pwd_context.hash(data.new_password)

    db.commit()
    db.refresh(user)

    return ProfileOut(
        account_id=user.id,
        username=user.Username,
        email=user.Email,
        role=user.Role
    )
