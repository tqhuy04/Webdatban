from sqlalchemy.orm import Session
from Backend.schemas.booking import BookingTableCreate
from Backend.services import booking_service


# =========================
# GET ALL
# =========================
def get_all(db: Session):

    return booking_service.get_all_bookings(db)


# =========================
# GET BY ID
# =========================
def get_by_id(booking_id: int, db: Session, user):

    return booking_service.get_booking_by_id(db, booking_id)


# =========================
# GET BY CUSTOMER
# =========================
def get_by_customer(account_id: int, db: Session):

    return booking_service.get_bookings_of_account(account_id, db)


# =========================
# CREATE
# =========================
def create(data: BookingTableCreate, db: Session, user):

    return booking_service.create_booking(db, data)


# =========================
# DELETE
# =========================
def delete(booking_id: int, db: Session):

    return booking_service.delete_booking(db, booking_id)


# =========================
# GET TABLES
# =========================
def get_tables(booking_id: int, db: Session):

    return booking_service.get_tables_of_booking(db, booking_id)


# =========================
# GET FULL
# =========================
def get_full(booking_id: int, db: Session):

    return booking_service.get_booking_with_tables(db, booking_id)