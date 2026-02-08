from datetime import datetime

from sqlalchemy.orm import Session
from Backend.models.customer import Customer
from Backend.models.order import Order
from Backend.models.table import Table
from Backend.models.table_booking import TableBooking
from Backend.schemas.table_booking import TableBookingCreate


def get_all_bookings(db: Session):
    bookings = db.query(TableBooking).all()

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

    booking.CustomerID = data.CustomerID
    booking.BookingTime = data.BookingTime
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

    db.delete(booking)
    db.commit()
    return True
