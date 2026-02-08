from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from Backend.database import get_db
from Backend.schemas.account import AccountOut, AccountCreate, AccountUpdate
from Backend.controllers.account_controller import (
    get_all_accounts,
    create_account,
    update_account,
    delete_account,
)
from Backend.core.dependencies import admin_required

router = APIRouter(
    prefix="/api/accounts",
    tags=["Accounts"],
    dependencies=[Depends(admin_required)]
)


@router.get("", response_model=list[AccountOut])
def get_all(db: Session = Depends(get_db)):
    return get_all_accounts(db)


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
    db: Session = Depends(get_db)
):
    return update_account(db, account_id, data)


@router.delete("/{account_id}")
def remove(
    account_id: int,
    db: Session = Depends(get_db)
):
    return delete_account(db, account_id)
