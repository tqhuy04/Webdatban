from sqlalchemy.orm import Session
from Backend.schemas.table_booking import TableBookingCreate
from Backend.services.table_booking_service import (
    get_all_bookings,
    create_booking,
    delete_booking
)


def get_all(db: Session):
    return get_all_bookings(db)


def create(db: Session, customer_id: int, data: TableBookingCreate):
    return create_booking(db, customer_id, data)

def delete(db: Session, booking_id: int):
    return delete_booking(db, booking_id)
