from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from Backend.database import Base

class TableBooking(Base):
    __tablename__ = "table_bookings"

    BookingID = Column(Integer, primary_key=True, index=True)
    CustomerID = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )
    BookingTime = Column(DateTime, nullable=False)
    Status = Column(Integer, nullable=False)

    # relationship
    customer = relationship("Customer", back_populates="bookings")
