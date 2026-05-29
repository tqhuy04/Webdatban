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
    delete_customer,
    search_customers
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
    print(f"[DEBUG] /customers/me called by user: {user.Username} (ID: {user.id})")
    return get_customer_by_user(db, user.id)


@router.post("/me", response_model=CustomerOut)
def create_my_customer(
    data: CustomerCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    from Backend.services import customer_service
    # Kiểm tra đã có customer chưa
    existing = customer_service.get_by_account_id(db, user.id)
    if existing:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Thông tin khách hàng đã tồn tại")
    return create_customer(db, user.id, data)

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
    user=Depends(get_current_user)
):
    # Lấy customer của user hiện tại
    customer = get_customer_by_user(db, user.id)
    if not customer or customer.id != customer_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Không có quyền cập nhật thông tin này")
    return update_customer(db, customer_id, data)


@router.delete("/{customer_id}")
def delete(
    customer_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return delete_customer(db, customer_id)


# =========================
# SEARCH
# =========================
@router.get("/search/", response_model=List[CustomerOut])
def search(
    keyword: str,
    db: Session = Depends(get_db)
):
    return search_customers(db, keyword)
