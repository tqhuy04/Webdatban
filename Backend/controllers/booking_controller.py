from fastapi import HTTPException
from sqlalchemy.orm import Session
from Backend.schemas.booking import BookingTableCreate
from Backend.services.booking_service import (
    get_all_bookings,
    get_booking_by_id,
    create_booking,
    delete_booking,
    get_bookings_of_account
)


# =========================
# GET ALL (ADMIN)
# =========================
def get_all(db: Session):
    return get_all_bookings(db)


# =========================
# GET BY ID (USER / ADMIN)
# =========================
def get_by_id(
    booking_id: int,
    db: Session,
    user
):
    booking = get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # user là Account object → dùng thuộc tính
    if user.Role.lower() == "user" and booking.CustomerID != user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this booking"
        )

    return booking


# =========================
# GET BY CUSTOMER (USER)
# =========================
def get_by_customer(
    db: Session,
    user
):
    return get_bookings_of_account(user.id, db)


# =========================
# CREATE
# =========================
def create(
    data: BookingTableCreate,
    db: Session,
    user
):
    # ép customer_id theo user đăng nhập
    data.customer_id = user.id
    return create_booking(db, data)


# =========================
# DELETE (ADMIN)
# =========================
def delete(
    booking_id: int,
    db: Session
):
    booking = delete_booking(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    return {"message": "Deleted successfully"}
