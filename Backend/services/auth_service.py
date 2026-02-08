from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from typing import Optional

from Backend.models.account import Account
from Backend.core.security import create_access_token, decode_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =========================
# Password utils
# =========================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# =========================
# Authenticate (LOGIN)
# =========================
def authenticate_user(
    db: Session,
    username: str,
    password: str
) -> Optional[Account]:
    user = (
        db.query(Account)
        .filter(Account.Username == username)
        .first()
    )

    if not user:
        return None

    if not verify_password(password, user.Password):
        return None

    return user


# =========================
# Register (CREATE ACCOUNT)
# =========================
def register_user(
    db: Session,
    username: str,
    email: str,
    password: str,
    role: str = "STAFF"
) -> Account:
    if db.query(Account).filter(Account.Username == username).first():
        raise ValueError("Username đã tồn tại")

    if db.query(Account).filter(Account.Email == email).first():
        raise ValueError("Email đã tồn tại")

    user = Account(
        Username=username,
        Email=email,
        Password=hash_password(password[:72]),  # tránh lỗi bcrypt
        Role=role
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user



# =========================
# Create token
# =========================
def create_token(user: Account) -> str:
    token = create_access_token(
        data={
            "sub": user.Username,
            "role": user.Role,
            "user_id": user.id
        }
    )
    return token
def get_user_id_from_token(token: str):
    payload = decode_token(token)

    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không chứa user_id"
        )

    return user_id