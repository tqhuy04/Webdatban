from sqlalchemy import Column, Integer, String
from Backend.database import Base

class MenuCategory(Base):
    __tablename__ = "menu_categories"

    CategoryID = Column(Integer, primary_key=True, index=True)
    CategoryName = Column(String(255), nullable=False)
