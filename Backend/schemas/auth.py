from pydantic import BaseModel, EmailStr, Field
from typing_extensions import Annotated

Username = Annotated[str, Field(min_length=3, max_length=50)]
Password = Annotated[str, Field(min_length=6, max_length=72)]


class RegisterRequest(BaseModel):
    username: Username
    email: EmailStr
    password: Password
    full_name: str = ""
    phone_number: str = ""
    address: str = ""


class LoginRequest(BaseModel):
    username: str
    password: Annotated[str, Field(max_length=72)]


class AuthResponse(BaseModel):
    access_token: str
    user_id: int
    role: str
