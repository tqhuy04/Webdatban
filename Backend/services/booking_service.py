from http.client import HTTPException
from sqlalchemy.orm import Session
from Backend.models.customer import Customer
from Backend.models.table_booking import TableBooking
from Backend.models.booking_table import BookingTable
from Backend.schemas.booking import BookingTableCreate
from sqlalchemy.orm import Session, joinedload
from Backend.models.table import Table

# =========================
# GET ALL
# =========================
def get_all_bookings(db: Session):
    return db.query(TableBooking).all()


# =========================
# GET BY ID
# =========================
def get_booking_by_id(db: Session, booking_id: int):
    return (
        db.query(TableBooking)
        .filter(TableBooking.BookingID == booking_id)
        .first()
    )


# =========================
# GET BOOKINGS OF ACCOUNT
# =========================
def get_bookings_of_account(account_id: int, db: Session):
    customer = (
        db.query(Customer)
        .filter(Customer.account_id == account_id)
        .first()
    )

    if not customer:
        return []

    return (
        db.query(TableBooking)
        .filter(TableBooking.CustomerID == customer.id)
        .all()
    )


# =========================
# CREATE BOOKING + TABLES
# =========================

def create_booking(db: Session, data: BookingTableCreate):

    # kiểm tra booking đã tồn tại chưa
    existed = (
        db.query(TableBooking)
        .filter(
            TableBooking.CustomerID == data.customer_id,
            TableBooking.BookingTime == data.booking_time
        )
        .first()
    )

    if existed:
        return existed
    # 1️ tạo booking
    booking = TableBooking(
        CustomerID=data.customer_id,
        BookingTime=data.booking_time,
        Status=0
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    # 2️ kiểm tra có table_ids không
    if data.table_ids and len(data.table_ids) > 0:

        booking_tables = []

        for table_id in data.table_ids:
            bt = BookingTable(
                BookingID=booking.BookingID,
                TableID=table_id,
                TableNumber=None
            )
            booking_tables.append(bt)

        # add tất cả cùng lúc
        db.add_all(booking_tables)

        # commit insert booking_tables
        db.commit()

    return booking
# =========================
# DELETE
# =========================
def delete_booking(db: Session, booking_id: int):
    booking = (
        db.query(TableBooking)
        .filter(TableBooking.BookingID == booking_id)
        .first()
    )
    if not booking:
        return None

    db.delete(booking)
    db.commit()
    return booking
def get_tables_of_booking(db: Session, booking_id: int):
    return (
        db.query(BookingTable)
        .options(joinedload(BookingTable.table))
        .filter(BookingTable.BookingID == booking_id)
        .all()
    )

def get_booking_with_tables(db: Session, booking_id: int):
    booking = (
        db.query(TableBooking)
        .filter(TableBooking.BookingID == booking_id)
        .first()
    )

    if not booking:
        return None

    tables = (
        db.query(Table)
        .join(BookingTable, BookingTable.TableID == Table.TableID)
        .filter(BookingTable.BookingID == booking_id)
        .all()
    )

    return {
        "BookingID": booking.BookingID,
        "CustomerID": booking.CustomerID,
        "BookingTime": booking.BookingTime,
        "tables": [
            {
                "TableNumber": t.TableNumber
            } for t in tables
        ]
    }

