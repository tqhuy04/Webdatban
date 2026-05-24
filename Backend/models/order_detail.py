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

    # Quan hệ với Order
    order = relationship("Order", back_populates="Items")

    # Quan hệ với MenuItem (để load thông tin món ăn khi query)
    menu_item = relationship("MenuItem", back_populates="order_details")