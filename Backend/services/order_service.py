from sqlalchemy.orm import Session
from Backend.models.order import Order
from Backend.models.order_detail import OrderDetail
from Backend.schemas.order import OrderCreate
from sqlalchemy.orm import joinedload

# =========================
# GET ALL
# =========================
def get_all_orders(db: Session):
    return db.query(Order).all()


# =========================
# GET BY BOOKING
# =========================
def get_orders_by_booking(db: Session, booking_id: int):
    return (
        db.query(Order)
        .options(joinedload(Order.Items))
        .filter(Order.BookingID == booking_id)
        .all()
    )


# =========================
# CREATE
# =========================
def create_order(db: Session, data: OrderCreate):

    total = 0
    if data.Items:
        total = sum(item.Price * item.Quantity for item in data.Items)

    order = Order(
        BookingID=data.BookingID,
        CustomerID=data.CustomerID,
        PromotionID=data.PromotionID,
        OrderDate=data.OrderDate,
        TotalAmount=total
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    if data.Items:
        for item in data.Items:
            detail = OrderDetail(
                OrderID=order.OrderID,
                MenuItemID=item.MenuItemID,
                Quantity=item.Quantity,
                Price=item.Price
            )
            db.add(detail)

        db.commit()

    return order



# =========================
# DELETE
# =========================
def delete_order(db: Session, order_id: int):
    order = db.query(Order).filter(Order.OrderID == order_id).first()
    if not order:
        return False

    # xóa chi tiết trước
    db.query(OrderDetail).filter(
        OrderDetail.OrderID == order_id
    ).delete()

    db.delete(order)
    db.commit()
    return True
