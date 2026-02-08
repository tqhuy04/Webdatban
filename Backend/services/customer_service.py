# Backend/services/customer_service.py
from sqlalchemy.orm import Session
from typing import List, Optional

from Backend.models.customer import Customer
from Backend.schemas.customer import CustomerCreate, CustomerUpdate


def get_by_account_id(db: Session, account_id: int) -> Optional[Customer]:
    return db.query(Customer).filter(Customer.account_id == account_id).first()


def get_all(db: Session) -> List[Customer]:
    return db.query(Customer).all()


def get_by_id(db: Session, customer_id: int) -> Optional[Customer]:
    return db.query(Customer).filter(Customer.id == customer_id).first()


def create(db: Session, account_id: int, data: CustomerCreate) -> Customer:
    customer = Customer(
        account_id=account_id,
        full_name=data.full_name,
        phone_number=data.phone_number,
        address=data.address
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def update(db: Session, customer_id: int, data: CustomerUpdate) -> Optional[Customer]:
    customer = get_by_id(db, customer_id)
    if not customer:
        return None

    if data.full_name is not None:
        customer.full_name = data.full_name
    if data.phone_number is not None:
        customer.phone_number = data.phone_number
    if data.address is not None:
        customer.address = data.address

    db.commit()
    db.refresh(customer)
    return customer


def delete(db: Session, customer_id: int) -> bool:
    customer = get_by_id(db, customer_id)
    if not customer:
        return False

    db.delete(customer)
    db.commit()
    return True
