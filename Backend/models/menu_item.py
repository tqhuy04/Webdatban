from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean
from Backend.database import Base
from sqlalchemy.orm import relationship


class MenuItem(Base):
    __tablename__ = "menu_items"

    MenuItemID = Column(Integer, primary_key=True, index=True)
    CategoryID = Column(
        Integer,
        ForeignKey("menu_categories.CategoryID"),
        nullable=False
    )

    Name = Column(String(255), nullable=False)
    Description = Column(Text, nullable=False)
    Price = Column(Float, nullable=False)
    ImageURL = Column(String(255), nullable=False)
    Status = Column(String(255), nullable=False)
    IsDeleted = Column(Boolean, default=False, nullable=False)

    # Quan hệ ngược với OrderDetail (để load thông tin menu_item khi query order_details)
    order_details = relationship("OrderDetail", back_populates="menu_item")

    # Quan hệ với MenuCategory
    category = relationship("MenuCategory", back_populates="menu_items")