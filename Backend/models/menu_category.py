from sqlalchemy import Column, Integer, String, ForeignKey
from Backend.database import Base
from sqlalchemy.orm import relationship


class MenuCategory(Base):
    __tablename__ = "menu_categories"

    CategoryID = Column(Integer, primary_key=True, index=True)
    CategoryName = Column(String(255), nullable=False)

    # Quan hệ ngược với MenuItem (để load danh sách món của category)
    menu_items = relationship("MenuItem", back_populates="category")
