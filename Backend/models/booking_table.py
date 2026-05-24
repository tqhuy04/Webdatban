from sqlalchemy import ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column
from Backend.database import Base
from sqlalchemy.orm import relationship

class BookingTable(Base):
    __tablename__ = "booking_tables"

    BookingID: Mapped[int] = mapped_column(
        ForeignKey("table_bookings.BookingID"),
        primary_key=True
    )

    TableID: Mapped[int] = mapped_column(
        ForeignKey("tables.TableID"),
        primary_key=True
    )
    # Quan hệ với Table để load thông tin bàn khi query
    table: Mapped["Table"] = relationship("Table", back_populates="booking_tables")

    # Quan hệ với TableBooking (để load thông tin booking)
    booking: Mapped["TableBooking"] = relationship("TableBooking", back_populates="booking_tables")