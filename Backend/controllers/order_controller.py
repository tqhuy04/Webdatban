from sqlalchemy.orm import Session
from Backend.schemas.order import OrderCreate, OrderUpdate
from Backend.services.order_service import (
    get_all_orders,
    get_orders_by_booking,
    create_order,
    update_order,
    delete_order,
    search_orders
)


def get_all(db: Session):
    return get_all_orders(db)


def get_by_booking(db, booking_id: int):

    orders = get_orders_by_booking(db, booking_id)


    return orders or []


def create(db: Session, data: OrderCreate):
    return create_order(db, data)


def update(db: Session, order_id: int, data: OrderUpdate):
    return update_order(db, order_id, data)


def delete(db: Session, order_id: int):
    return delete_order(db, order_id)


# =========================
# SEARCH
# =========================
def search(db: Session, keyword: str):
    return search_orders(db, keyword)
