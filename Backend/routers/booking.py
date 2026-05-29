from fastapi import APIRouter, Depends, Body, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from Backend.database import get_db
from Backend.core.dependencies import get_current_user, admin_required

from Backend.controllers.booking_controller import (
    get_all,
    get_by_id,
    get_by_customer,
    create,
    delete,
    get_tables,
    add_tables,
    get_full,
    search,
    checkin,
    customer_checkin
)

from Backend.models.booking_table import BookingTable
from Backend.models.customer import Customer
from Backend.schemas.booking import BookingTableCreate, BookingTableDBResponse, BookingTableOut, BookingWithCustomer

router = APIRouter(
    prefix="/api/booking-tables",
    tags=["Booking Tables"]
)


# =========================
# ADMIN GET ALL
# =========================
@router.get("")
def admin_get_all(
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return get_all(db)


# =========================
# GET MY BOOKINGS (MUST be before /{booking_id} to avoid conflict)
# =========================
@router.get("/customer/me")
def user_get_my_bookings(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_by_customer(user.id, db)


# =========================
# GET BY ID
# =========================
@router.get("/{booking_id}")
def user_get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_by_id(booking_id, db, user)


# =========================
# CREATE
# =========================
@router.post("", response_model=BookingTableDBResponse)
def user_create_booking(
    data: BookingTableCreate = Body(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    try:
        result = create(data, db, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Tạo thông báo cho admin khi có đặt bàn mới
    if result and hasattr(result, 'BookingID'):
        from Backend.services.notification_service import create_notification

        # Lấy thông tin customer
        customer_name = ""
        if user:
            customer = db.query(Customer).filter(Customer.account_id == user.id).first()
            if customer:
                customer_name = customer.full_name

        # Format thời gian đặt bàn (BookingTime là datetime object hoặc string)
        booking_time_display = ""
        if result.BookingTime:
            if hasattr(result.BookingTime, 'strftime'):
                # result.BookingTime là datetime object
                booking_time_display = result.BookingTime.strftime("%d/%m/%Y %H:%M")
            else:
                # result.BookingTime là string hoặc đã format sẵn
                booking_time_display = str(result.BookingTime)

        # Tạo message với thời gian đặt bàn
        message = f"Khách hàng {customer_name} vừa đặt bàn mới (ID: #{result.BookingID})"
        if booking_time_display:
            message += f" - Thời gian: {booking_time_display}"

        notif = create_notification(
            db=db,
            user_id=0,
            title="Yêu cầu đặt bàn mới",
            message=message,
            notif_type="booking",
            reference_id=result.BookingID,
            reference_type="booking"
        )

        # Gửi qua Socket.IO cho admin (trong main.py xử lý)

    return result


# =========================
# DELETE (Admin)
# =========================
@router.delete("/{booking_id}")
def admin_delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return delete(booking_id, db)


# =========================
# USER CANCEL BOOKING
# =========================
@router.delete("/customer/me/{booking_id}")
def user_cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    """
    User cancel their own booking.
    Only allows cancellation if booking belongs to the current user.
    """
    from Backend.models.table_booking import TableBooking
    from Backend.models.customer import Customer

    # Check if booking belongs to current user
    customer = db.query(Customer).filter(
        Customer.account_id == user.id
    ).first()

    if not customer:
        raise HTTPException(status_code=403, detail="Bạn không có quyền hủy đặt bàn này")

    booking = db.query(TableBooking).filter(
        TableBooking.BookingID == booking_id,
        TableBooking.CustomerID == customer.id
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy đặt bàn hoặc bạn không có quyền hủy")

    # Check if booking can be cancelled (not completed or cancelled)
    if booking.Status == 2:
        raise HTTPException(status_code=400, detail="Không thể hủy đặt bàn đã hoàn thành")
    if booking.Status == 3:
        raise HTTPException(status_code=400, detail="Đặt bàn đã được hủy trước đó")

    return delete(booking_id, db)


# =========================
# GET TABLES OF BOOKING
# =========================
@router.get("/{booking_id}/tables", response_model=list[BookingTableOut])
def get_booking_tables(
    booking_id: int,
    db: Session = Depends(get_db)
):
    return get_tables(booking_id, db)

@router.post("/{booking_id}/tables")
def add_table(
    booking_id: int,
    data: dict,
    db: Session = Depends(get_db)
):
    table_ids = data.get("table_ids", [])
    if not table_ids:
        return {"error": "table_ids is required"}

    return add_tables(booking_id, {"table_ids": table_ids}, db)
# =========================
# GET FULL BOOKING
# =========================
@router.get("/{booking_id}/full")
def get_booking_full(
    booking_id: int,
    db: Session = Depends(get_db)
):
    data = get_full(booking_id, db)

    if not data:
        raise HTTPException(404, "Booking not found")

    return data


# =========================
# SEARCH BOOKINGS
# =========================
@router.get("/search/", response_model=List[BookingWithCustomer])
def search_bookings(
    keyword: str,
    db: Session = Depends(get_db)
):
    results = search(db, keyword)
    # Transform results to include customer info
    booking_list = []
    for booking in results:
        customer_data = None
        if booking.customer:
            customer_data = {
                "full_name": booking.customer.full_name,
                "phone": booking.customer.phone_number
            }
        booking_data = {
            "BookingID": booking.BookingID,
            "BookingTime": booking.BookingTime,
            "Status": booking.Status,
            "People": booking.People,
            "TotalAmount": booking.TotalAmount,
            "RemainingAmount": booking.RemainingAmount,
            "PaymentStatus": booking.PaymentStatus,
            "customer": customer_data
        }
        booking_list.append(BookingWithCustomer(**booking_data))
    return booking_list


# =========================
# CHECKIN (Admin)
# =========================
@router.put("/{booking_id}/checkin")
def admin_checkin(
    booking_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return checkin(db, booking_id)


# =========================
# UPDATE BOOKING
# =========================
@router.put("/{booking_id}")
async def update_booking(
    booking_id: int,
    request: Request,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    """
    Update booking information.
    """
    from Backend.models.table_booking import TableBooking
    import json

    # Lấy data từ request body dưới dạng dict
    body = await request.body()
    data_dict = json.loads(body)

    booking = db.query(TableBooking).filter(
        TableBooking.BookingID == booking_id
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Cập nhật các trường được phép (hỗ trợ cả PascalCase và snake_case)
    booking_time = data_dict.get('booking_time') or data_dict.get('BookingTime')
    people = data_dict.get('people') or data_dict.get('People')
    status = data_dict.get('status') or data_dict.get('Status')

    if booking_time:
        # Xử lý format thời gian: có thể là "18:00" hoặc datetime string
        if isinstance(booking_time, str) and ':' in booking_time and 'T' not in booking_time:
            # Chỉ có time, giữ nguyên ngày
            try:
                time_obj = datetime.strptime(booking_time, "%H:%M").time()
                old_datetime = booking.BookingTime
                booking.BookingTime = datetime.combine(old_datetime.date(), time_obj)
            except:
                pass
        else:
            booking.BookingTime = booking_time

    if people:
        booking.People = int(people)
    if status is not None:
        booking.Status = int(status)

    db.commit()
    db.refresh(booking)

    # Trả về response với customer info
    customer = db.query(Customer).filter(Customer.id == booking.CustomerID).first()
    customer_data = None
    if customer:
        customer_data = {
            "full_name": customer.full_name,
            "phone": customer.phone_number
        }

    return {
        "BookingID": booking.BookingID,
        "CustomerID": booking.CustomerID,
        "CustomerName": customer.full_name if customer else None,
        "BookingTime": booking.BookingTime,
        "Status": booking.Status,
        "People": booking.People,
        "TotalAmount": booking.TotalAmount,
        "RemainingAmount": booking.RemainingAmount,
        "PaymentStatus": booking.PaymentStatus,
        "DepositStatus": booking.DepositStatus,
        "customer": customer_data
    }


# =========================
# CUSTOMER SELF CHECKIN
# =========================
@router.put("/customer/me/{booking_id}/checkin")
def customer_self_checkin(
    booking_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    """
    Customer checkin their own booking.
    """
    return customer_checkin(user.id, db, booking_id)