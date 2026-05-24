from sqlalchemy import Column, Integer, String
from Backend.database import Base
from sqlalchemy.orm import relationship


class Table(Base):
    __tablename__ = "tables"

    TableID = Column(Integer, primary_key=True, index=True)
    TableNumber = Column(String(255), nullable=False)
    Capacity = Column(Integer, nullable=False)
    Status = Column(Integer, nullable=False)

    # Quan hệ ngược với BookingTable (để load bàn khi query booking_tables)
    booking_tables = relationship("BookingTable", back_populates="table")
