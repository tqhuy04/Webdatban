# Backend/routers/customer.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from Backend.database import get_db
from Backend.schemas.customer import CustomerCreate, CustomerUpdate, CustomerOut
from Backend.controllers.customer_controller import (
    get_all_customers,
    get_customer_by_id,
    get_customer_by_user,
    create_customer,
    update_customer,
    delete_customer
)
from Backend.core.dependencies import get_current_user, admin_required

router = APIRouter(
    prefix="/api/customers",
    tags=["Customer"]
)

# ===== USER =====
@router.get("/me", response_model=CustomerOut)
def get_my_customer(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_customer_by_user(db, user.id)

# ===== ADMIN =====
@router.post("", response_model=CustomerOut)
def create(
    data: CustomerCreate,
    account_id: int = Query(...),
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return create_customer(db, account_id, data)


@router.get("", response_model=List[CustomerOut])
def get_all(
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return get_all_customers(db)


@router.get("/{customer_id}", response_model=CustomerOut)
def get_by_id(
    customer_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return get_customer_by_id(db, customer_id)


@router.put("/{customer_id}", response_model=CustomerOut)
def update(
    customer_id: int,
    data: CustomerUpdate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return update_customer(db, customer_id, data)


@router.delete("/{customer_id}")
def delete(
    customer_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return delete_customer(db, customer_id)
