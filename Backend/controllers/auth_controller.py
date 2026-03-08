from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer

from Backend.schemas.auth import LoginRequest, RegisterRequest, AuthResponse
from Backend.services.auth_service import authenticate_user, register_user, get_user_id_from_token
from Backend.core.security import create_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# =========================
# LOGIN
# =========================
def login(db: Session, data: LoginRequest) -> AuthResponse:
    user = authenticate_user(
        db=db,
        username=data.username,
        password=data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sai username hoặc mật khẩu"
        )

    access_token = create_access_token(
        data={
            "sub": user.Username,
            "user_id": user.id,
            "role": user.Role
        }
    )

    return AuthResponse(
        access_token=access_token,
        user_id=user.id,
        role=user.Role
    )


# =========================
# REGISTER
# =========================
def register(db: Session, data: RegisterRequest):
    try:
        user = register_user(
            db=db,
            username=data.username,
            email=data.email,
            password=data.password,
            role="CUSTOMER"
        )

        # Tự động tạo customer record
        from Backend.models.customer import Customer
        customer = Customer(
            account_id=user.id,
            full_name=data.full_name or data.username,
            phone_number=data.phone_number or "",
            address=data.address or ""
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    return {
        "message": "Đăng ký thành công",
        "user_id": user.id,
        "username": user.Username,
        "email": user.Email,
        "customer_id": customer.id
    }


# =========================
# GET USER ID FROM TOKEN
# =========================
def get_user_id_controller(token: str = Depends(oauth2_scheme)):
    user_id = get_user_id_from_token(token)
    return {"user_id": user_id}
