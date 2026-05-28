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

    return booking_service.create_booking(db, data, user)


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
# ADD TABLES TO BOOKING
# =========================
def add_tables(booking_id: int, data: dict, db: Session):
    """
    Thêm bàn vào booking đã tồn tại.
    data = {"table_ids": [1, 2, 3]}
    """
    table_ids = data.get("table_ids", [])
    if not table_ids:
        return {"error": "table_ids is required"}

    return booking_service.add_tables_to_booking(db, booking_id, table_ids)


# =========================
# GET FULL
# =========================
def get_full(booking_id: int, db: Session):

    return booking_service.get_booking_with_tables(db, booking_id)


# =========================
# SEARCH
# =========================
def search(db: Session, keyword: str):
    return booking_service.search_bookings(db, keyword)


# =========================
# CHECKIN (Admin)
# =========================
def checkin(db: Session, booking_id: int):
    return booking_service.checkin_booking(db, booking_id)


# =========================
# CUSTOMER SELF CHECKIN
# =========================
def customer_checkin(account_id: int, db: Session, booking_id: int):
    return booking_service.customer_self_checkin(db, booking_id, account_id)


# =========================
# PAYMENT - DEPOSIT
# =========================
def calculate_deposit(booking_id: int, db: Session):
    return booking_service.calculate_deposit(booking_id, db)


def process_deposit(booking_id: int, db: Session):
    return booking_service.process_deposit_payment(booking_id, db)


def confirm_deposit(booking_id: int, db: Session):
    return booking_service.confirm_deposit(booking_id, db)


# =========================
# PAYMENT - FINAL
# =========================
def process_final(booking_id: int, db: Session):
    return booking_service.process_final_payment(booking_id, db)


def confirm_final(booking_id: int, db: Session):
    return booking_service.confirm_final_payment(booking_id, db)