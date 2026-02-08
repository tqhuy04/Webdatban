from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from Backend.database import get_db
from Backend.schemas.order import OrderCreate, OrderResponse
from Backend.controllers.order_controller import (
    get_all,
    get_by_booking,
    create,
    delete
)

router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)

# =========================
# GET ALL ORDERS
# =========================
@router.get("", response_model=List[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return get_all(db)


# =========================
# GET ORDERS BY BOOKING
# =========================
@router.get("/booking/{booking_id}", response_model=List[OrderResponse])
def get_orders_by_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):
    return get_by_booking(db, booking_id)


# =========================
# CREATE ORDER
# =========================
@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED
)
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db)
):
    return create(db, data)


# =========================
# DELETE ORDER
# =========================
@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    success = delete(db, order_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    return {"message": "Delete order successfully"}
