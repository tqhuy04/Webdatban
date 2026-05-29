from sqlalchemy import Column, Integer, String, ForeignKey
from Backend.database import Base
from sqlalchemy.orm import relationship


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True)  # Nullable cho khách đặt bàn trực tiếp

    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(255), nullable=True)  # Nullable vì khách có thể không cung cấp
    address = Column(String(255), nullable=True)  # Nullable vì khách có thể không cung cấp

    # Quan hệ với Account
    account = relationship("Account", back_populates="customer")

    # Quan hệ với TableBooking
    bookings = relationship("TableBooking", back_populates="customer")

    # Quan hệ ngược với Order
    orders = relationship("Order", back_populates="customer")