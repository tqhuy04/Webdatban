from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from Backend.database import get_db
from Backend.schemas.order_detail import (
    OrderDetailCreate,
    OrderDetailResponse
)
from Backend.controllers.order_detail_controller import (
    get_order_details,
    create,
    delete
)

router = APIRouter(
    prefix="/api/order-details",
    tags=["Order Details"]
)


# =========================
# GET BY ORDER
# =========================
@router.get("/{order_id}", response_model=List[OrderDetailResponse])
def get_by_order_api(
    order_id: int,
    db: Session = Depends(get_db)
):
    return get_order_details(db, order_id)


# =========================
# CREATE
# =========================
@router.post(
    "",
    response_model=OrderDetailResponse,
    status_code=status.HTTP_201_CREATED
)
def create_order_detail_api(
    data: OrderDetailCreate,
    db: Session = Depends(get_db)
):
    detail = create(db, data)
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )
    return detail


# =========================
# DEBUG: Check Order 78
# =========================
@router.get("/debug/order-78")
def debug_order_78(db: Session = Depends(get_db)):
    from Backend.models.order import Order
    from Backend.models.order_detail import OrderDetail

    order = db.query(Order).filter(Order.OrderID == 78).first()
    if not order:
        return {"error": "Order 78 not found"}

    details = db.query(OrderDetail).filter(OrderDetail.OrderID == 78).all()

    return {
        "order": {
            "OrderID": order.OrderID,
            "BookingID": order.BookingID,
            "CustomerID": order.CustomerID,
            "TotalAmount": order.TotalAmount
        },
        "details_count": len(details),
        "details": [{"id": d.OrderDetailID, "MenuItemID": d.MenuItemID, "Quantity": d.Quantity, "Price": d.Price} for d in details]
    }


# =========================
# DELETE
# =========================
@router.delete("/{detail_id}")
def delete_order_detail_api(
    detail_id: int,
    db: Session = Depends(get_db)
):
    success = delete(db, detail_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order detail not found"
        )

    return {"message": "Delete order detail successfully"}
