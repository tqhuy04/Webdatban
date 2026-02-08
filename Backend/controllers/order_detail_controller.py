from sqlalchemy.orm import Session
from Backend.schemas.order_detail import OrderDetailCreate
from Backend.services.order_detail_service import (
    get_by_order,
    create_order_detail,
    delete_order_detail
)


def get_order_details(db: Session, order_id: int):
    return get_by_order(db, order_id)


def create(db: Session, data: OrderDetailCreate):
    return create_order_detail(db, data)


def delete(db: Session, detail_id: int):
    return delete_order_detail(db, detail_id)
