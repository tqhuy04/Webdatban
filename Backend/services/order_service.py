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
# SEARCH
# =========================
def search_orders(db: Session, keyword: str):
    """
    Tìm kiếm đơn hàng theo mã order hoặc thông tin khách hàng.
    """
    from Backend.models.customer import Customer
    from sqlalchemy import cast, String

    return (
        db.query(Order)
        .join(Customer, Customer.id == Order.CustomerID)
        .filter(
            (
                cast(Order.OrderID, String).ilike(f"%{keyword}%") |
                Customer.full_name.ilike(f"%{keyword}%") |
                Customer.phone_number.ilike(f"%{keyword}%")
            )
        )
        .all()
    )

def create_order(db: Session, data: OrderCreate):
    print(f"[DEBUG] create_order called with data: {data}")
    print(f"[DEBUG] data.BookingID type: {type(data.BookingID)}, value: {data.BookingID}")
    print(f"[DEBUG] data.CustomerID type: {type(data.CustomerID)}, value: {data.CustomerID}")

    # Kiểm tra booking tồn tại
    from Backend.models.table_booking import TableBooking
    booking = db.query(TableBooking).filter(TableBooking.BookingID == data.BookingID).first()
    if not booking:
        print(f"[ERROR] Booking {data.BookingID} not found!")
        raise ValueError(f"Booking with ID {data.BookingID} not found")

    print(f"[DEBUG] Booking found: {booking.BookingID}, CustomerID: {booking.CustomerID}")

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

    # Xóa chi tiết trước (sử dụng synchronize_session=False để tránh lỗi)
    db.query(OrderDetail).filter(
        OrderDetail.OrderID == order_id
    ).delete(synchronize_session=False)

    db.delete(order)
    db.commit()
    return True
