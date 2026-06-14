from sqlalchemy import Column, Integer, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from Backend.database import Base
from datetime import datetime

class TableBooking(Base):
    __tablename__ = "table_bookings"

    BookingID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    CustomerID = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )
    BookingTime = Column(DateTime, nullable=False)
    Status = Column(Integer, nullable=False)
    People = Column(Integer, default=1)  # Số người đặt bàn
    CreatedAt = Column(DateTime, default=datetime.now, nullable=False)  # Thời điểm tạo đơn đặt bàn

    # Thông tin thanh toán
    DepositAmount = Column(Float, default=0)  # Số tiền đã cọc (30%)
    DepositStatus = Column(Integer, default=0)  # 0: Chưa cọc, 1: Đã cọc
    TotalAmount = Column(Float, default=0)  # Tổng số tiền đơn hàng
    RemainingAmount = Column(Float, default=0)  # Số tiền còn lại cần thanh toán
    PaymentStatus = Column(Integer, default=0)  # 0: Chưa thanh toán, 1: Đã thanh toán đủ

    # Quan hệ với Customer
    customer = relationship("Customer", back_populates="bookings")

    # Quan hệ ngược với BookingTable (để load danh sách bàn của booking)
    booking_tables = relationship("BookingTable", back_populates="booking")

    # Quan hệ ngược với Order (để load danh sách đơn hàng của booking)
    orders = relationship("Order", back_populates="booking")
