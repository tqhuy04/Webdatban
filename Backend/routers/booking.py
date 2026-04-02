from fastapi import APIRouter, Depends, Body, HTTPException
from sqlalchemy.orm import Session

from Backend.database import get_db
from Backend.core.dependencies import get_current_user, admin_required

from Backend.controllers.booking_controller import (
    get_all,
    get_by_id,
    get_by_customer,
    create,
    delete,
    get_tables,
    add_tables,
    get_full
)

from Backend.models.booking_table import BookingTable
from Backend.schemas.booking import BookingTableCreate, BookingTableOut

router = APIRouter(
    prefix="/api/booking-tables",
    tags=["Booking Tables"]
)


# =========================
# ADMIN GET ALL
# =========================
@router.get("")
def admin_get_all(
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return get_all(db)


# =========================
# GET MY BOOKINGS (MUST be before /{booking_id} to avoid conflict)
# =========================
@router.get("/customer/me")
def user_get_my_bookings(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_by_customer(user.id, db)


# =========================
# GET BY ID
# =========================
@router.get("/{booking_id}")
def user_get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_by_id(booking_id, db, user)


# =========================
# CREATE
# =========================
@router.post("")
def user_create_booking(
    data: BookingTableCreate = Body(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return create(data, db, user)


# =========================
# DELETE
# =========================
@router.delete("/{booking_id}")
def admin_delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return delete(booking_id, db)


# =========================
# GET TABLES OF BOOKING
# =========================
@router.get("/{booking_id}/tables", response_model=list[BookingTableOut])
def get_booking_tables(
    booking_id: int,
    db: Session = Depends(get_db)
):
    return get_tables(booking_id, db)

@router.post("/{booking_id}/tables")
def add_table(
    booking_id: int,
    data: dict,
    db: Session = Depends(get_db)
):
    table_ids = data.get("table_ids", [])
    if not table_ids:
        return {"error": "table_ids is required"}

    return booking_service.add_tables_to_booking(db, booking_id, table_ids)
# =========================
# GET FULL BOOKING
# =========================
@router.get("/{booking_id}/full")
def get_booking_full(
    booking_id: int,
    db: Session = Depends(get_db)
):
    data = get_full(booking_id, db)

    if not data:
        raise HTTPException(404, "Booking not found")

    return data