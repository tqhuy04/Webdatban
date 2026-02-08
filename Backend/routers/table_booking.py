from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from Backend.database import get_db
from Backend.schemas.table_booking import (
    TableBookingCreate,
    TableBookingResponse
)
from Backend.services import table_booking_service

router = APIRouter(prefix="/api/bookings", tags=["Table Booking"])


@router.get("/", response_model=list[TableBookingResponse])
def get_bookings_api(db: Session = Depends(get_db)):
    return table_booking_service.get_all_bookings(db)


@router.post("/", response_model=TableBookingResponse)
def create_booking_api(
    data: TableBookingCreate,
    db: Session = Depends(get_db)
):
    return table_booking_service.create_booking(db, data)


@router.put("/{booking_id}", response_model=TableBookingResponse)
def update_booking_api(
    booking_id: int,
    data: TableBookingCreate,
    db: Session = Depends(get_db)
):
    booking = table_booking_service.update_booking(db, booking_id, data)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.delete("/{booking_id}")
def delete_booking_api(
    booking_id: int,
    db: Session = Depends(get_db)
):
    success = table_booking_service.delete_booking(db, booking_id)
    if not success:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Deleted successfully"}
