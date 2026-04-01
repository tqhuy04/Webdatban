from sqlalchemy import Column, Integer, ForeignKey, DateTime, Float
from Backend.database import Base
from sqlalchemy.orm import relationship
class Order(Base):
    __tablename__ = "orders"

    OrderID = Column(Integer, primary_key=True)
    BookingID = Column(Integer, nullable=False)
    CustomerID = Column(Integer, nullable=False)
    PromotionID = Column(Integer, ForeignKey("promotions.PromotionID"), nullable=True)
    OrderDate = Column(DateTime, nullable=False)
    TotalAmount = Column(Float, nullable=False)

    Items = relationship(
        "OrderDetail",
        back_populates="order",
        cascade="all, delete-orphan"
    )
    promotion = relationship("Promotion")
