from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from Backend.database import get_db
from Backend.models.account import Account
from Backend.core.security import SECRET_KEY, ALGORITHM

# ✅ PHẢI ĐÚNG với router login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        # Decode token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # ✅ sub là USERNAME (string), không phải ID
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )

        # ✅ Query đúng theo username
        account = (
            db.query(Account)
            .filter(Account.Username == username)
            .first()
        )

        if not account:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account not found"
            )

        return account

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


def admin_required(user: Account = Depends(get_current_user)):
    if user.Role != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin only")
    return user
