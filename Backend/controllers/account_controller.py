from sqlalchemy.orm import Session
from fastapi import HTTPException

from Backend.schemas.account import AccountCreate, AccountUpdate
from Backend.services import account_service


def get_all_accounts(db: Session):
    return account_service.get_all(db)


def create_account(db: Session, data: AccountCreate):
    return account_service.create(db, data)


def update_account(
    db: Session,
    account_id: int,
    data: AccountUpdate
):
    account = account_service.update(db, account_id, data)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


def delete_account(db: Session, account_id: int):
    success = account_service.delete(db, account_id)
    if not success:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"message": "Deleted successfully"}
