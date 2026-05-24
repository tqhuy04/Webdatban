from sqlalchemy import Column, Integer, String, ForeignKey
from Backend.database import Base
from sqlalchemy.orm import relationship


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    Username = Column(String(50), unique=True, nullable=False)
    Email = Column(String(255), unique=True, nullable=False)
    Password = Column(String(255), nullable=False)
    Role = Column(String(20), default="STAFF")  # ADMIN | STAFF

    # Quan hệ ngược với Customer (để load thông tin khách hàng từ tài khoản)
    customer = relationship("Customer", back_populates="account", uselist=False)
