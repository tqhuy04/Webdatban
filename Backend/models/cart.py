from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from Backend.database import Base
from sqlalchemy.orm import relationship
from datetime import datetime

class Cart(Base):
    __tablename__ = "carts"

    CartID = Column(Integer, primary_key=True, index=True)
    CustomerID = Column(Integer, ForeignKey("customers.id"), nullable=False)
    MenuItemID = Column(Integer, ForeignKey("menu_items.MenuItemID"), nullable=False)
    Quantity = Column(Integer, nullable=False, default=1)
    CreatedAt = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer")
    menu_item = relationship("MenuItem")
