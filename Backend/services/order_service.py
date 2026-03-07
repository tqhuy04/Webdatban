from sqlalchemy.orm import Session
from Backend.models.menu_item import MenuItem
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

    order = db.query(Order).options(

        joinedload(Order.Items).joinedload(OrderDetail.menu_item)

    ).filter(
        Order.BookingID == booking_id
    ).all()

    return order or []

# =========================
# CREATE
# =========================

def create_order(db: Session, data: OrderCreate):

    # tạo order trước
    order = Order(
        BookingID=data.BookingID,
        CustomerID=data.CustomerID,
        PromotionID=data.PromotionID,
        OrderDate=data.OrderDate,
        TotalAmount=0
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    total = 0

    # tạo order detail + tính total
    if data.Items:
        for item in data.Items:

            # lấy menu item từ DB
            menu = db.query(MenuItem).filter(
                MenuItem.MenuItemID == item.MenuItemID
            ).first()

            if not menu:
                continue

            price = menu.Price

            detail = OrderDetail(
                OrderID=order.OrderID,
                MenuItemID=item.MenuItemID,
                Quantity=item.Quantity,
                Price=price
            )

            total += price * item.Quantity

            db.add(detail)

        # cập nhật total
        order.TotalAmount = total
        db.commit()
        db.refresh(order)

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
