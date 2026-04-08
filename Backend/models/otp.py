from sqlalchemy import Column, Integer, String, DateTime
from Backend.database import Base
from datetime import datetime, timedelta


class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, index=True)
    code = Column(String(10), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Integer, default=0)  # 0 = chưa dùng, 1 = đã dùng
    type = Column(String(20), default="FORGOT_PASSWORD")  # FORGOT_PASSWORD | VERIFY_EMAIL

    @classmethod
    def create_otp(cls, email: str, code: str, expires_minutes: int = 5):
        """Tạo OTP mới với thời hạn"""
        return cls(
            email=email,
            code=code,
            expires_at=datetime.utcnow() + timedelta(minutes=expires_minutes)
        )

    def is_valid(self) -> bool:
        """Kiểm tra OTP còn hiệu lực không"""
        return (
            self.is_used == 0 and 
            datetime.utcnow() < self.expires_at
        )