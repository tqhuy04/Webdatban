# Backend/controllers/customer_controller.py
from sqlalchemy.orm import Session
from fastapi import HTTPException

from Backend.schemas.customer import CustomerCreate, CustomerUpdate
from Backend.services import customer_service


def get_customer_by_user(db: Session, user_id: int):
    customer = customer_service.get_by_account_id(db, user_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


def get_all_customers(db: Session):
    return customer_service.get_all(db)


def get_customer_by_id(db: Session, customer_id: int):
    customer = customer_service.get_by_id(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


def create_customer(db: Session, user_id: int, data: CustomerCreate):
    return customer_service.create(db, user_id, data)


def update_customer(db: Session, customer_id: int, data: CustomerUpdate):
    customer = customer_service.update(db, customer_id, data)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


def delete_customer(db: Session, customer_id: int):
    success = customer_service.delete(db, customer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Deleted successfully"}
