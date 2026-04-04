from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean
from Backend.database import Base

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