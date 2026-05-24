from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from Backend.database import Base

class TableBooking(Base):
    __tablename__ = "table_bookings"

    BookingID = Column(Integer, primary_key=True, index=True)
    CustomerID = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )
    BookingTime = Column(DateTime, nullable=False)
    Status = Column(Integer, nullable=False)

    # Quan hệ với Customer
    customer = relationship("Customer", back_populates="bookings")

    # Quan hệ ngược với BookingTable (để load danh sách bàn của booking)
    booking_tables = relationship("BookingTable", back_populates="booking")

    # Quan hệ ngược với Order (để load danh sách đơn hàng của booking)
    orders = relationship("Order", back_populates="booking")
