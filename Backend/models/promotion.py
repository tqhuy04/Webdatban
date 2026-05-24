from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from Backend.database import Base
from sqlalchemy.orm import relationship


class Promotion(Base):
    __tablename__ = "promotions"

    PromotionID = Column(Integer, primary_key=True, index=True)
    Name = Column(String(255), nullable=False)
    Description = Column(Text, nullable=True)
    DiscountPercent = Column(Float, nullable=False)
    StartDate = Column(DateTime, nullable=False)
    EndDate = Column(DateTime, nullable=False)
    CreatedAt = Column(DateTime(timezone=True), server_default=func.now())

    # Quan hệ ngược với Order
    orders = relationship("Order", back_populates="promotion")

