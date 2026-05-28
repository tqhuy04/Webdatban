from datetime import datetime

from sqlalchemy.orm import Session, joinedload
from Backend.models.customer import Customer
from Backend.models.order import Order
from Backend.models.table import Table
from Backend.models.table_booking import TableBooking
from Backend.models.booking_table import BookingTable
from Backend.schemas.table_booking import TableBookingCreate


def get_all_bookings(db: Session):
    bookings = db.query(TableBooking).options(
        joinedload(TableBooking.customer)
    ).all()

    result = []
    for b in bookings:
        result.append({
            "BookingID": b.BookingID,
            "CustomerID": b.CustomerID,
            "CustomerName": b.customer.full_name if b.customer else None,
            "BookingTime": b.BookingTime,
            "Status": b.Status,
            "OrderID": None,
            "TableNumber": None,
            "customer": {
                "full_name": b.customer.full_name
            } if b.customer else None
        })

    return result

def create_booking(db: Session, data: TableBookingCreate):
    booking = TableBooking(
        CustomerID=data.CustomerID,
        BookingTime=data.BookingTime or datetime.now(),
        Status=data.Status if data.Status is not None else 1
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    # lấy thông tin customer
    customer = db.query(Customer).filter(
        Customer.id == booking.CustomerID
    ).first()

    return {
        "BookingID": booking.BookingID,
        "CustomerID": booking.CustomerID,
        "CustomerName": customer.full_name if customer else None,
        "BookingTime": booking.BookingTime,
        "Status": booking.Status,
        "OrderID": None,        # chưa có đơn
        "TableNumber": None,    # chưa gán bàn
        "customer": {
            "full_name": customer.full_name
        } if customer else None
    }


def update_booking(
    db: Session,
    booking_id: int,
    data: TableBookingCreate
):
    booking = db.query(TableBooking).filter(
        TableBooking.BookingID == booking_id
    ).first()

    if not booking:
        return None

    if data.CustomerID is not None:
        booking.CustomerID = data.CustomerID
    if data.BookingTime is not None:
        booking.BookingTime = data.BookingTime
    if data.Status is not None:
        booking.Status = data.Status

    db.commit()
    db.refresh(booking)

    # lấy customer
    customer = db.query(Customer).filter(
        Customer.id == booking.CustomerID
    ).first()

    return {
        "BookingID": booking.BookingID,
        "CustomerID": booking.CustomerID,
        "CustomerName": customer.full_name if customer else None,
        "BookingTime": booking.BookingTime,
        "Status": booking.Status,
        "OrderID": None,
        "TableNumber": None,
        "customer": {
            "full_name": customer.full_name
        } if customer else None
    }



def delete_booking(db: Session, booking_id: int):
    booking = db.query(TableBooking).filter(
        TableBooking.BookingID == booking_id
    ).first()

    if not booking:
        return False

    # Import here to avoid circular import
    from Backend.models.order_detail import OrderDetail

    # 1. Xóa order_details của các orders liên quan trước
    # Lấy danh sách order_ids
    orders = db.query(Order).filter(Order.BookingID == booking_id).all()
    order_ids = [o.OrderID for o in orders]
    
    if order_ids:
        db.query(OrderDetail).filter(
            OrderDetail.OrderID.in_(order_ids)
        ).delete(synchronize_session=False)

    # 2. Xóa các orders
    db.query(Order).filter(
        Order.BookingID == booking_id
    ).delete(synchronize_session=False)

    # 3. Xóa booking_tables
    db.query(BookingTable).filter(
        BookingTable.BookingID == booking_id
    ).delete(synchronize_session=False)

    # 4. Cuối cùng xóa booking
    db.delete(booking)
    db.commit()
    return True


def checkin_booking(db: Session, booking_id: int):
    """
    Checkin booking - Đánh dấu khách đã đến.
    Cập nhật status = 2 và trạng thái các bàn thành "đang sử dụng".
    """
    booking = db.query(TableBooking).filter(
        TableBooking.BookingID == booking_id
    ).first()

    if not booking:
        return None

    if booking.Status == 2:
        raise Exception("Đặt bàn đã được checkin trước đó")
    if booking.Status == 3:
        raise Exception("Đặt bàn đã bị hủy")

    # Cập nhật status = 2 (Hoàn thành/Đang sử dụng)
    booking.Status = 2

    # Cập nhật trạng thái các bàn thành "đang sử dụng"
    booking_tables = db.query(BookingTable).filter(
        BookingTable.BookingID == booking_id
    ).all()

    for bt in booking_tables:
        table = db.query(Table).filter(Table.TableID == bt.TableID).first()
        if table:
            table.Status = 2  # Đang sử dụng

    db.commit()
    db.refresh(booking)

    # Lấy thông tin customer
    customer = db.query(Customer).filter(
        Customer.id == booking.CustomerID
    ).first()

    return {
        "BookingID": booking.BookingID,
        "CustomerID": booking.CustomerID,
        "CustomerName": customer.full_name if customer else None,
        "BookingTime": booking.BookingTime,
        "Status": booking.Status,
        "OrderID": None,
        "TableNumber": None,
        "customer": {
            "full_name": customer.full_name
        } if customer else None
    }
