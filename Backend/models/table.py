from sqlalchemy import Column, Integer, String
from Backend.database import Base


class Table(Base):
    __tablename__ = "tables"

    TableID = Column(Integer, primary_key=True, index=True)
    TableNumber = Column(String(255), nullable=False)
    Capacity = Column(Integer, nullable=False)
    Status = Column(Integer, nullable=False)
