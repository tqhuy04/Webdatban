from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from Backend.controllers.booking_controller import (
    get_all,
    get_by_id,
    get_by_customer,
    create,
    delete
)
from Backend.database import get_db
from Backend.core.dependencies import get_current_user, admin_required
from Backend.models.account import Account
from Backend.schemas.booking import BookingTableCreate, BookingTableOut
from Backend.services.booking_service import get_booking_with_tables, get_tables_of_booking

router = APIRouter(
    prefix="/api/booking-tables",
    tags=["Booking Tables"]
)

# 🔒 ADMIN – xem toàn bộ booking
@router.get("")
def admin_get_all(
    db=Depends(get_db),
    admin=Depends(admin_required)
):
    return get_all(db)


# 🔒 USER / ADMIN – xem booking theo ID
@router.get("/{booking_id}")
def user_get_booking(
    booking_id: int,
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    return get_by_id(booking_id, db, user)


# 🔒 USER – xem booking của chính mình
@router.get("/customer/me")
def user_get_my_bookings(
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    return get_by_customer(user.id, db)

# 🔒 USER – tạo booking
@router.post("")
def user_create_booking(
    data: BookingTableCreate = Body(...),
    db=Depends(get_db),
    user=Depends(get_current_user)
):
    return create(data, db, user)


# 🔒 ADMIN – xoá booking
@router.delete("/{booking_id}")
def admin_delete_booking(
    booking_id: int,
    db=Depends(get_db),
    admin=Depends(admin_required)
):
    return delete(booking_id, db)
@router.get("/booking/{booking_id}/tables", response_model=list[BookingTableOut])
def get_booking_tables(
    booking_id: int,
    db: Session = Depends(get_db)
):
    return get_tables_of_booking(db, booking_id)
@router.get("/{booking_id}/full")
def get_booking_full(
    booking_id: int,
    db: Session = Depends(get_db)
):
    data = get_booking_with_tables(db, booking_id)
    if not data:
        raise HTTPException(status_code=404, detail="Booking not found")
    return data
