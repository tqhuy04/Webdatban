from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from Backend.database import get_db
from Backend.schemas.account import AccountOut, AccountCreate, AccountUpdate
from Backend.controllers.account_controller import (
    get_all_accounts,
    get_account_by_id,
    get_my_account,
    create_account,
    update_account,
    delete_account,
)
from Backend.core.dependencies import admin_required, get_current_user
from Backend.models.account import Account

router = APIRouter(
    prefix="/api/accounts",
    tags=["Accounts"]
)


# ===== USER: Lấy thông tin tài khoản của chính mình =====
@router.get("/me", response_model=AccountOut)
def get_my_account_info(
    db: Session = Depends(get_db),
    user: Account = Depends(get_current_user)
):
    return get_my_account(db, user.id)


# ===== ADMIN =====
@router.get("", response_model=list[AccountOut])
def get_all(db: Session = Depends(get_db), admin=Depends(admin_required)):
    return get_all_accounts(db)


@router.get("/{account_id}", response_model=AccountOut)
def get_by_id(
    account_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return get_account_by_id(db, account_id)


@router.post("", response_model=AccountOut)
def create(
    data: AccountCreate,
    db: Session = Depends(get_db)
):
    return create_account(db, data)


@router.put("/{account_id}", response_model=AccountOut)
def update(
    account_id: int,
    data: AccountUpdate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return update_account(db, account_id, data)


@router.delete("/{account_id}")
def remove(
    account_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    return delete_account(db, account_id)
