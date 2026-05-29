from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List

from Backend.database import get_db
from Backend.schemas.order import OrderCreate, OrderUpdate, OrderResponse
from Backend.controllers.order_controller import (
    get_all,
    get_by_booking,
    create,
    update,
    delete,
    search
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
@router.get("/booking/{booking_id}")
def get_orders_by_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):
    orders = get_by_booking(db, booking_id)
    print(f"[DEBUG] Found {len(orders)} orders for booking_id={booking_id}")
    for o in orders:
        print(f"[DEBUG] Order: {o}")
    return orders


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
    print(f"[DEBUG ROUTER] create_order received data: {data}")
    try:
        result = create(db, data)
        print(f"[DEBUG ROUTER] create_order success, result: {result}")
        return result
    except Exception as e:
        print(f"[DEBUG ROUTER] create_order error: {e}")
        import traceback
        traceback.print_exc()
        raise


# =========================
# DEBUG: Test create order (raw JSON)
# =========================
@router.post("/debug-create")
async def debug_create_order(request: Request):
    """
    Test endpoint to debug order creation.
    """
    print("[DEBUG] /debug-create endpoint called")

    try:
        body = await request.body()
        print(f"[DEBUG] Raw body: {body}")

        data = await request.json()
        print(f"[DEBUG] Parsed JSON: {data}")

        # Validate fields
        booking_id = data.get("BookingID")
        customer_id = data.get("CustomerID")
        order_date = data.get("OrderDate")

        print(f"[DEBUG] BookingID: {booking_id} (type: {type(booking_id)})")
        print(f"[DEBUG] CustomerID: {customer_id} (type: {type(customer_id)})")
        print(f"[DEBUG] OrderDate: {order_date} (type: {type(order_date)})")

        if not booking_id:
            return {"error": "Missing BookingID", "received": data}
        if not customer_id:
            return {"error": "Missing CustomerID", "received": data}

        # Try to create order
        from Backend.database import SessionLocal
        from Backend.schemas.order import OrderCreate

        db = SessionLocal()
        try:
            order_data = OrderCreate(**data)
            print(f"[DEBUG] OrderCreate validated successfully: {order_data}")

            from Backend.controllers.order_controller import create
            result = create(db, order_data)
            print(f"[DEBUG] Order created: {result}")

            return {"success": True, "order_id": result.OrderID, "booking_id": booking_id}
        except Exception as e:
            import traceback
            error_detail = traceback.format_exc()
            print(f"[DEBUG] Error creating order: {e}")
            print(error_detail)
            return {"error": str(e), "traceback": error_detail}
        finally:
            db.close()

    except Exception as e:
        import traceback
        print(f"[DEBUG] Error: {e}")
        traceback.print_exc()
        return {"error": str(e)}


# =========================
# UPDATE ORDER
# =========================
@router.put("/{order_id}")
def update_order_api(
    order_id: int,
    data: OrderUpdate,
    db: Session = Depends(get_db)
):
    result = update(db, order_id, data)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return result


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


# =========================
# SEARCH ORDERS
# =========================
@router.get("/search/")
def search_orders(
    keyword: str,
    db: Session = Depends(get_db)
):
    return search(db, keyword)
