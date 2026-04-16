from http.client import HTTPException
from typing import List
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

def _add_tables_to_booking_internal(db: Session, booking_id: int, table_ids: List[int]):
    """
    Internal helper: thêm bàn vào booking (chỉ thêm bàn chưa có).
    """
    existing_tables = (
        db.query(BookingTable.TableID)
        .filter(BookingTable.BookingID == booking_id)
        .all()
    )
    existing_table_ids = {t[0] for t in existing_tables}

    new_table_ids = [tid for tid in table_ids if tid not in existing_table_ids]

    if not new_table_ids:
        return

    booking_tables = []
    for table_id in new_table_ids:
        bt = BookingTable(
            BookingID=booking_id,
            TableID=table_id
        )
        booking_tables.append(bt)

    db.add_all(booking_tables)
    db.commit()


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
        # Booking đã tồn tại → vẫn thêm tables nếu chưa có
        if data.table_ids and len(data.table_ids) > 0:
            _add_tables_to_booking_internal(db, existed.BookingID, data.table_ids)
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

# =========================
# ADD TABLES TO BOOKING
# =========================
def add_tables_to_booking(db: Session, booking_id: int, table_ids: List[int]):
    """
    Thêm bàn vào booking đã tồn tại.
    Chỉ thêm những bàn CHƯA có trong booking_tables.
    """
    existing_tables = (
        db.query(BookingTable.TableID)
        .filter(BookingTable.BookingID == booking_id)
        .all()
    )
    existing_table_ids = {t[0] for t in existing_tables}

    new_table_ids = [tid for tid in table_ids if tid not in existing_table_ids]

    if not new_table_ids:
        return {"message": "Tất cả các bàn đã tồn tại trong booking", "added": 0}

    _add_tables_to_booking_internal(db, booking_id, new_table_ids)

    return {"message": f"Đã thêm {len(new_table_ids)} bàn vào booking", "added": len(new_table_ids)}

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

