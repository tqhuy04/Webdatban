from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from Backend.database import get_db
from Backend.schemas.auth import (
    LoginRequest, RegisterRequest, AuthResponse,
    ForgotPasswordRequest, VerifyOtpRequest, ResendOtpRequest, ForgotPasswordResponse
)
from Backend.controllers.auth_controller import get_user_id_controller, login, register
from Backend.services.auth_service import get_user_id_from_token
from Backend.services.otp_service import request_otp, verify_and_reset_password, resend_otp
from Backend.core.security import oauth2_scheme
router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/login", response_model=AuthResponse)
def login_api(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    return login(db, data)


@router.post("/register")
def register_api(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    return register(db, data)
@router.get("/get_id")
def get_user_id_api(token: str = Depends(oauth2_scheme)):
    user_id = get_user_id_from_token(token)
    return {"user_id": user_id}


# =========================
# FORGOT PASSWORD ENDPOINTS
# =========================
@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password_api(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    print(f"[API] /forgot-password called with email: {data.email}")
    result = request_otp(db, data.email)
    print(f"[API] Result: {result}")
    return result


@router.post("/verify-otp")
def verify_otp_api(
    data: VerifyOtpRequest,
    db: Session = Depends(get_db)
):
    print(f"[API] /verify-otp called: email={data.email}, otp={data.otp_code}")
    result = verify_and_reset_password(
        db=db,
        email=data.email,
        otp_code=data.otp_code,
        new_password=data.new_password
    )
    print(f"[API] verify-otp result: {result}")
    return result


@router.post("/resend-otp", response_model=ForgotPasswordResponse)
def resend_otp_api(
    data: ResendOtpRequest,
    db: Session = Depends(get_db)
):
    return resend_otp(db, data.email)