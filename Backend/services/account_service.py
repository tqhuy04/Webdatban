from sqlalchemy.orm import Session
from typing import List, Optional
from passlib.context import CryptContext

from Backend.models.account import Account
from Backend.schemas.account import (
    AccountCreate,
    AccountUpdate,
    AccountOut
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def to_account_out(account: Account) -> AccountOut:
    return AccountOut(
        account_id=account.id,
        username=account.Username,
        email=account.Email,
        role=account.Role
    )


def get_all(db: Session) -> List[AccountOut]:
    accounts = db.query(Account).all()
    return [to_account_out(a) for a in accounts]


def get_by_id(db: Session, account_id: int) -> Optional[Account]:
    return (
        db.query(Account)
        .filter(Account.id == account_id)
        .first()
    )


def create(db: Session, data: AccountCreate) -> AccountOut:
    account = Account(
        Username=data.username,
        Email=data.email,
        Password=hash_password(data.password),
        Role=data.role
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    # Tự động tạo Customer nếu role là CUSTOMER
    if data.role == "CUSTOMER":
        from Backend.models.customer import Customer
        customer = Customer(
            account_id=account.id,
            full_name=data.username,
            phone_number="",
            address=""
        )
        db.add(customer)
        db.commit()

    return to_account_out(account)   # 🔥 QUAN TRỌNG





def update(db: Session, account_id: int, data: AccountUpdate):
    account = get_by_id(db, account_id)
    if not account:
        return None

    if data.username is not None:
        account.Username = data.username
    if data.email is not None:
        account.Email = data.email
    if data.password is not None:
        account.Password = hash_password(data.password)
    if data.role is not None:
        account.Role = data.role

    db.commit()
    db.refresh(account)

    return to_account_out(account)   # 🔥 QUAN TRỌNG





def delete(db: Session, account_id: int) -> bool:
    account = get_by_id(db, account_id)
    if not account:
        return False

    # Xóa customer liên kết bằng raw SQL trước (đảm bảo FK không cản trở)
    from Backend.models.customer import Customer
    customer = db.query(Customer).filter(Customer.account_id == account_id).first()
    if customer:
        # Chuyển account_id sang NULL trước khi xóa account
        customer.account_id = None
        db.flush()

    db.delete(account)
    db.commit()
    return True
