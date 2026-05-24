from sqlalchemy import Column, Integer, ForeignKey, DateTime, Float
from Backend.database import Base
from sqlalchemy.orm import relationship


class Order(Base):
    __tablename__ = "orders"

    OrderID = Column(Integer, primary_key=True)
    BookingID = Column(Integer, ForeignKey("table_bookings.BookingID"), nullable=False)
    CustomerID = Column(Integer, ForeignKey("customers.id"), nullable=False)
    PromotionID = Column(Integer, ForeignKey("promotions.PromotionID"), nullable=True)
    OrderDate = Column(DateTime, nullable=False)
    TotalAmount = Column(Float, nullable=False)

    # Quan hệ với OrderDetail
    Items = relationship(
        "OrderDetail",
        back_populates="order",
        cascade="all, delete-orphan"
    )

    # Quan hệ với Promotion
    promotion = relationship("Promotion", back_populates="orders")

    # Quan hệ với TableBooking (booking)
    booking = relationship("TableBooking", back_populates="orders")

    # Quan hệ với Customer
    customer = relationship("Customer", back_populates="orders")
