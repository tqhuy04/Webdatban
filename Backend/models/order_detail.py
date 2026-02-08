from sqlalchemy import Column, Integer, ForeignKey, Float
from Backend.database import Base
from sqlalchemy.orm import relationship
class OrderDetail(Base):
    __tablename__ = "order_details"

    OrderDetailID = Column(Integer, primary_key=True)
    OrderID = Column(Integer, ForeignKey("orders.OrderID"), nullable=False)
    MenuItemID = Column(Integer, ForeignKey("menu_items.MenuItemID"), nullable=False)
    Quantity = Column(Integer, nullable=False)
    Price = Column(Float, nullable=False)
    order = relationship(
        "Order",
        back_populates="Items"
    )
    menu_item = relationship("MenuItem")