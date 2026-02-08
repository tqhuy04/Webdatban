from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from Backend.database import get_db
from Backend.schemas.auth import LoginRequest, RegisterRequest, AuthResponse
from Backend.controllers.auth_controller import get_user_id_controller, login, register
from Backend.services.auth_service import get_user_id_from_token
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