from datetime import datetime, timedelta
from http.client import HTTPException
from typing import List
from sqlalchemy.orm import Session
from Backend.models.customer import Customer
from Backend.models.table_booking import TableBooking
from Backend.models.booking_table import BookingTable
from Backend.schemas.booking import BookingTableCreate
from sqlalchemy.orm import Session, joinedload
from Backend.models.table import Table

# Thời gian chờ tối đa (phút) sau giờ đặt
BOOKING_TIMEOUT_MINUTES = 15

# =========================
# AUTO CANCEL EXPIRED BOOKINGS
# =========================
def auto_cancel_expired_bookings(db: Session):
    """
    Tự động hủy các booking đã quá hạn (quá 15 phút so với giờ đặt mà chưa hoàn thành).
    """
    now = datetime.now()
    threshold_time = now - timedelta(minutes=BOOKING_TIMEOUT_MINUTES)

    # Tìm các booking quá hạn:
    # - Status = 0 (Chờ xác nhận) hoặc Status = 1 (Đã xác nhận)
    # - BookingTime đã qua threshold_time (quá 15 phút)
    expired_bookings = (
        db.query(TableBooking)
        .filter(
            TableBooking.Status.in_([0, 1]),  # Chờ xác nhận hoặc Đã xác nhận
            TableBooking.BookingTime < threshold_time  # Đã quá 15 phút
        )
        .all()
    )

    cancelled_count = 0
    for booking in expired_bookings:
        # Cập nhật status thành 3 (Đã hủy)
        booking.Status = 3
        cancelled_count += 1

    db.commit()
    return cancelled_count

# =========================
# GET ALL
# =========================
def get_all_bookings(db: Session):
    bookings = db.query(TableBooking).options(
        joinedload(TableBooking.customer)
    ).all()

    result = []
    for booking in bookings:
        customer_data = None
        if booking.customer:
            customer_data = {
                "full_name": booking.customer.full_name,
                "phone": booking.customer.phone_number
            }
        result.append({
            "BookingID": booking.BookingID,
            "CustomerID": booking.CustomerID,
            "CustomerName": booking.customer.full_name if booking.customer else None,
            "BookingTime": booking.BookingTime,
            "Status": booking.Status,
            "People": booking.People,
            "TotalAmount": booking.TotalAmount,
            "RemainingAmount": booking.RemainingAmount,
            "PaymentStatus": booking.PaymentStatus,
            "DepositStatus": booking.DepositStatus,
            "customer": customer_data
        })

    return result


# =========================
# GET BY ID
# =========================
def get_booking_by_id(db: Session, booking_id: int):
    return (
        db.query(TableBooking)
        .filter(TableBooking.BookingID == booking_id)
        .first()
    )


# =========================
# SEARCH
# =========================
def search_bookings(db: Session, keyword: str):
    """
    Tìm kiếm booking theo tên khách hàng, số điện thoại, hoặc mã booking.
    """
    from Backend.models.customer import Customer
    from sqlalchemy import cast, String

    return (
        db.query(TableBooking)
        .join(Customer, Customer.id == TableBooking.CustomerID)
        .filter(
            (
                Customer.full_name.ilike(f"%{keyword}%") |
                Customer.phone_number.ilike(f"%{keyword}%") |
                cast(TableBooking.BookingID, String).ilike(f"%{keyword}%")
            )
        )
        .all()
    )
def get_bookings_of_account(account_id: int, db: Session):
    print(f"[DEBUG] get_bookings_of_account called with account_id: {account_id}")

    customer = (
        db.query(Customer)
        .filter(Customer.account_id == account_id)
        .first()
    )

    if not customer:
        print(f"[DEBUG] No customer found for account_id: {account_id}")
        return []

    print(f"[DEBUG] Found customer: id={customer.id}, account_id={customer.account_id}")

    # Query bookings for this customer
    bookings = (
        db.query(TableBooking)
        .filter(TableBooking.CustomerID == customer.id)
        .all()
    )

    print(f"[DEBUG] Found {len(bookings)} bookings for customer id: {customer.id}")

    # Thêm TableCount cho mỗi booking
    from Backend.models.booking_table import BookingTable
    for booking in bookings:
        table_count = db.query(BookingTable).filter(BookingTable.BookingID == booking.BookingID).count()
        booking.TableCount = table_count

    # Print all bookings in DB for debugging
    all_bookings = db.query(TableBooking).all()
    print(f"[DEBUG] Total bookings in DB: {len(all_bookings)}")
    for b in all_bookings[:5]:
        print(f"[DEBUG]   Booking: id={b.BookingID}, CustomerID={b.CustomerID}, Time={b.BookingTime}, Status={b.Status}")

    # Trả về danh sách dict với thông tin customer
    result = []
    for booking in bookings:
        result.append({
            "BookingID": booking.BookingID,
            "CustomerID": booking.CustomerID,
            "CustomerName": customer.full_name,
            "BookingTime": booking.BookingTime,
            "Status": booking.Status,
            "People": booking.People,
            "TotalAmount": booking.TotalAmount,
            "RemainingAmount": booking.RemainingAmount,
            "PaymentStatus": booking.PaymentStatus,
            "DepositStatus": booking.DepositStatus,
            "TableCount": booking.TableCount,
            "customer": {
                "full_name": customer.full_name,
                "phone": customer.phone_number
            }
        })

    return result


# Tỷ lệ đặt cọc (30%)
DEPOSIT_RATE = 0.30


# =========================
# CREATE BOOKING + TABLES
# =========================

def _add_tables_to_booking_internal(db: Session, booking_id: int, table_ids: List[int]):
    """
    Internal helper: thêm bàn vào booking (chỉ thêm bàn chưa có).
    """
    existing_tables = (
        db.query(BookingTable.TableID)
        .filter(BookingTable.BookingID == booking_id)
        .all()
    )
    existing_table_ids = {t[0] for t in existing_tables}

    new_table_ids = [tid for tid in table_ids if tid not in existing_table_ids]

    if not new_table_ids:
        return

    booking_tables = []
    for table_id in new_table_ids:
        # Cập nhật trạng thái bàn thành "Đã đặt" (Status = 1)
        table = db.query(Table).filter(Table.TableID == table_id).first()
        if table:
            table.Status = 1

        bt = BookingTable(
            BookingID=booking_id,
            TableID=table_id
        )
        booking_tables.append(bt)

    db.add_all(booking_tables)
    db.commit()


def create_booking(db: Session, data: BookingTableCreate, user=None):

    print(f"[DEBUG] create_booking called with data: {data}")
    print(f"[DEBUG] create_booking user.id: {user.id if user else None}")

    # Tìm customer dựa trên account_id của user đang đăng nhập
    # KHÔNG tin customer_id từ frontend vì có thể không khớp
    if user:
        customer = db.query(Customer).filter(Customer.account_id == user.id).first()
        if customer:
            actual_customer_id = customer.id
            print(f"[DEBUG] Found customer by account_id: {user.id} -> customer_id: {actual_customer_id}")
        else:
            print(f"[DEBUG] No customer found for account_id: {user.id}")
            actual_customer_id = data.customer_id  # fallback
    else:
        actual_customer_id = data.customer_id
        print(f"[DEBUG] No user context, using customer_id from data: {actual_customer_id}")

    # kiểm tra booking đã tồn tại chưa
    existed = (
        db.query(TableBooking)
        .filter(
            TableBooking.CustomerID == actual_customer_id,
            TableBooking.BookingTime == data.booking_time
        )
        .first()
    )

    if existed:
        print(f"[DEBUG] Booking already exists, returning existing booking: {existed.BookingID}")
        # Booking đã tồn tại → vẫn thêm tables nếu chưa có
        if data.table_ids and len(data.table_ids) > 0:
            _add_tables_to_booking_internal(db, existed.BookingID, data.table_ids)
        return existed

    # Tính số tiền cọc (30%)
    total_amount = data.total_amount or 0
    deposit_amount = total_amount * DEPOSIT_RATE

    # 1️ tạo booking (tự động xác nhận khi đặt thành công)
    booking = TableBooking(
        CustomerID=actual_customer_id,
        BookingTime=data.booking_time,
        Status=1,  # Đã xác nhận ngay khi đặt thành công
        People=data.people or 1,
        TotalAmount=total_amount,
        DepositAmount=deposit_amount,
        RemainingAmount=total_amount - deposit_amount,
        DepositStatus=0,
        PaymentStatus=0
    )

    print(f"[DEBUG] Creating booking with CustomerID: {actual_customer_id}")

    db.add(booking)
    db.commit()
    db.refresh(booking)

    print(f"[DEBUG] Booking created with ID: {booking.BookingID}")

    # 2️ kiểm tra có table_ids không
    if data.table_ids and len(data.table_ids) > 0:

        booking_tables = []

        for table_id in data.table_ids:
            # Cập nhật trạng thái bàn thành "Đã đặt" (Status = 1)
            table = db.query(Table).filter(Table.TableID == table_id).first()
            if table:
                table.Status = 1

            bt = BookingTable(
                BookingID=booking.BookingID,
                TableID=table_id
            )
            booking_tables.append(bt)

        # add tất cả cùng lúc
        db.add_all(booking_tables)

        # commit insert booking_tables
        db.commit()

    return booking
# =========================
# DELETE
# =========================
def delete_booking(db: Session, booking_id: int):
    booking = (
        db.query(TableBooking)
        .filter(TableBooking.BookingID == booking_id)
        .first()
    )
    if not booking:
        return None

    # Import here to avoid circular import
    from Backend.models.order import Order
    from Backend.models.order_detail import OrderDetail

    # 1. Xóa order_details của các orders liên quan trước
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

    # 4. Xóa booking
    db.delete(booking)
    db.commit()
    return booking
def get_tables_of_booking(db: Session, booking_id: int):
    return (
        db.query(BookingTable)
        .options(joinedload(BookingTable.table))
        .filter(BookingTable.BookingID == booking_id)
        .all()
    )

# =========================
# ADD TABLES TO BOOKING
# =========================
def add_tables_to_booking(db: Session, booking_id: int, table_ids: List[int]):
    """
    Thêm bàn vào booking đã tồn tại.
    Chỉ thêm những bàn CHƯA có trong booking_tables.
    """
    existing_tables = (
        db.query(BookingTable.TableID)
        .filter(BookingTable.BookingID == booking_id)
        .all()
    )
    existing_table_ids = {t[0] for t in existing_tables}

    new_table_ids = [tid for tid in table_ids if tid not in existing_table_ids]

    if not new_table_ids:
        return {"message": "Tất cả các bàn đã tồn tại trong booking", "added": 0}

    _add_tables_to_booking_internal(db, booking_id, new_table_ids)

    return {"message": f"Đã thêm {len(new_table_ids)} bàn vào booking", "added": len(new_table_ids)}

def get_booking_with_tables(db: Session, booking_id: int):
    booking = (
        db.query(TableBooking)
        .filter(TableBooking.BookingID == booking_id)
        .first()
    )

    if not booking:
        return None

    tables = (
        db.query(Table)
        .join(BookingTable, BookingTable.TableID == Table.TableID)
        .filter(BookingTable.BookingID == booking_id)
        .all()
    )

    return {
        "BookingID": booking.BookingID,
        "CustomerID": booking.CustomerID,
        "BookingTime": booking.BookingTime,
        "tables": [
            {
                "TableNumber": t.TableNumber
            } for t in tables
        ]
    }

# =========================
# CHECKIN BOOKING
# =========================
def checkin_booking(db: Session, booking_id: int, account_id: int = None):
    """
    Admin checkin booking - Đánh dấu khách đã đến.
    """
    booking = (
        db.query(TableBooking)
        .filter(TableBooking.BookingID == booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy đặt bàn")

    if booking.Status == 2:
        raise HTTPException(status_code=400, detail="Đặt bàn đã được checkin trước đó")
    if booking.Status == 3:
        raise HTTPException(status_code=400, detail="Đặt bàn đã bị hủy")

    # Cập nhật status = 2 (Hoàn thành/Đang sử dụng)
    booking.Status = 2

    # Cập nhật trạng thái các bàn thành "đang sử dụng"
    booking_tables = (
        db.query(BookingTable)
        .filter(BookingTable.BookingID == booking_id)
        .all()
    )

    for bt in booking_tables:
        table = db.query(Table).filter(Table.TableID == bt.TableID).first()
        if table:
            table.Status = 2  # Đang sử dụng

    db.commit()
    db.refresh(booking)

    return booking


# =========================
# CUSTOMER SELF CHECKIN
# =========================
def customer_self_checkin(db: Session, booking_id: int, account_id: int):
    """
    Khách tự checkin khi đến nhà hàng.
    Chỉ cho phép nếu booking thuộc về customer của account_id.
    """
    # Tìm customer theo account_id
    customer = (
        db.query(Customer)
        .filter(Customer.account_id == account_id)
        .first()
    )

    if not customer:
        raise HTTPException(status_code=403, detail="Không tìm thấy thông tin khách hàng")

    # Kiểm tra booking thuộc về customer này
    booking = (
        db.query(TableBooking)
        .filter(
            TableBooking.BookingID == booking_id,
            TableBooking.CustomerID == customer.id
        )
        .first()
    )

    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy đặt bàn hoặc bạn không có quyền thực hiện")

    if booking.Status == 2:
        raise HTTPException(status_code=400, detail="Đặt bàn đã được checkin trước đó")
    if booking.Status == 3:
        raise HTTPException(status_code=400, detail="Đặt bàn đã bị hủy")

    # Cập nhật status = 2 (Hoàn thành/Đang sử dụng)
    booking.Status = 2

    # Cập nhật trạng thái các bàn thành "đang sử dụng"
    booking_tables = (
        db.query(BookingTable)
        .filter(BookingTable.BookingID == booking_id)
        .all()
    )

    for bt in booking_tables:
        table = db.query(Table).filter(Table.TableID == bt.TableID).first()
        if table:
            table.Status = 2  # Đang sử dụng

    db.commit()
    db.refresh(booking)

    return booking


# =========================
# PAYMENT - DEPOSIT (30%)
# =========================
def calculate_deposit(booking_id: int, db: Session):
    """
    Tính số tiền cọc 30% cho booking.
    """
    booking = db.query(TableBooking).filter(TableBooking.BookingID == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy đặt bàn")

    deposit_amount = booking.TotalAmount * DEPOSIT_RATE

    return {
        "booking_id": booking_id,
        "total_amount": booking.TotalAmount,
        "deposit_amount": deposit_amount,
        "remaining_amount": booking.TotalAmount - deposit_amount,
        "deposit_rate": DEPOSIT_RATE * 100,
        "deposit_status": booking.DepositStatus,
        "payment_status": booking.PaymentStatus
    }


def process_deposit_payment(booking_id: int, db: Session):
    """
    Tạo URL thanh toán cọc qua VNPay.
    """
    booking = db.query(TableBooking).filter(TableBooking.BookingID == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy đặt bàn")

    if booking.DepositStatus == 1:
        raise HTTPException(status_code=400, detail="Đã thanh toán cọc rồi")

    deposit_amount = int(booking.TotalAmount * DEPOSIT_RATE)

    try:
        from Backend.core.vnpay_config import vnp_CreatePaymentUrl

        order_info = f"Dat coc 30% cho booking #{booking_id}"
        amount = deposit_amount

        payment_url = vnp_CreatePaymentUrl(
            amount=amount,
            order_description=order_info,
            order_id=f"DEPOSIT_{booking_id}_{int(datetime.now().timestamp())}"
        )

        return {
            "booking_id": booking_id,
            "deposit_amount": deposit_amount,
            "payment_url": payment_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi tạo thanh toán: {str(e)}")


def confirm_deposit(booking_id: int, db: Session):
    """
    Xác nhận đã thanh toán cọc thành công.
    """
    booking = db.query(TableBooking).filter(TableBooking.BookingID == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy đặt bàn")

    booking.DepositStatus = 1
    booking.DepositAmount = booking.TotalAmount * DEPOSIT_RATE
    booking.RemainingAmount = booking.TotalAmount - booking.DepositAmount
    
    # Cập nhật trạng thái thành "Đã xác nhận" (Status = 1) nếu chưa được xác nhận
    if booking.Status == 0:
        booking.Status = 1

    db.commit()
    db.refresh(booking)

    return {
        "booking_id": booking_id,
        "deposit_amount": booking.DepositAmount,
        "remaining_amount": booking.RemainingAmount,
        "deposit_status": 1,
        "status": booking.Status
    }


# =========================
# PAYMENT - FINAL (70% remaining)
# =========================
def process_final_payment(booking_id: int, db: Session):
    """
    Tạo URL thanh toán phần còn lại (70%) qua VNPay.
    """
    booking = db.query(TableBooking).filter(TableBooking.BookingID == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy đặt bàn")

    if booking.DepositStatus != 1:
        raise HTTPException(status_code=400, detail="Chưa thanh toán tiền cọc")

    if booking.PaymentStatus == 1:
        raise HTTPException(status_code=400, detail="Đã thanh toán đủ")

    remaining_amount = int(booking.RemainingAmount)

    try:
        from Backend.core.vnpay_config import vnp_CreatePaymentUrl

        order_info = f"Thanh toan con lai cho booking #{booking_id}"
        amount = remaining_amount

        payment_url = vnp_CreatePaymentUrl(
            amount=amount,
            order_description=order_info,
            order_id=f"FINAL_{booking_id}_{int(datetime.now().timestamp())}"
        )

        return {
            "booking_id": booking_id,
            "remaining_amount": remaining_amount,
            "payment_url": payment_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi tạo thanh toán: {str(e)}")


def confirm_final_payment(booking_id: int, db: Session):
    """
    Xác nhận đã thanh toán phần còn lại thành công.
    """
    booking = db.query(TableBooking).filter(TableBooking.BookingID == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy đặt bàn")

    booking.PaymentStatus = 1
    booking.RemainingAmount = 0
    
    # Cập nhật trạng thái thành "Đã xác nhận" (Status = 1) nếu chưa được xác nhận
    if booking.Status == 0:
        booking.Status = 1

    db.commit()
    db.refresh(booking)

    return {
        "booking_id": booking_id,
        "total_amount": booking.TotalAmount,
        "deposit_amount": booking.DepositAmount,
        "remaining_amount": 0,
        "payment_status": 1,
        "status": booking.Status
    }

