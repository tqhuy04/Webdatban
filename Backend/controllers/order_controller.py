from sqlalchemy.orm import Session
from Backend.schemas.order import OrderCreate
from Backend.services.order_service import (
    get_all_orders,
    get_orders_by_booking,
    create_order,
    delete_order
)


def get_all(db: Session):
    return get_all_orders(db)


def get_by_booking(db: Session, booking_id: int):
    return get_orders_by_booking(db, booking_id)


def create(db: Session, data: OrderCreate):
    return create_order(db, data)


def delete(db: Session, order_id: int):
    return delete_order(db, order_id)
