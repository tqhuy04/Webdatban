from sqlalchemy.orm import Session
from Backend.schemas.cart import CartCreate, CartUpdate
from Backend.services import cart_service
from Backend.services import customer_service
from Backend.models.account import Account


def get_cart(db: Session, user: Account):
    # Get customer by account_id
    customer = customer_service.get_by_account_id(db, user.id)
    if not customer:
        return []

    return cart_service.get_cart_by_customer(db, customer.id)


def add_to_cart(db: Session, data: CartCreate, user: Account):
    # Get customer by account_id
    customer = customer_service.get_by_account_id(db, user.id)
    if not customer:
        raise ValueError("Customer not found")

    return cart_service.add_to_cart(db, customer.id, data.MenuItemID, data.Quantity)


def update_cart_item(db: Session, cart_id: int, data: CartUpdate, user: Account):
    return cart_service.update_cart_item(db, cart_id, data.Quantity)


def remove_from_cart(db: Session, cart_id: int, user: Account):
    # Get customer by account_id
    customer = customer_service.get_by_account_id(db, user.id)
    if not customer:
        raise ValueError("Customer not found")

    # Check if cart item belongs to customer
    cart_item = cart_service.get_cart_item_by_id(db, cart_id)
    if not cart_item or cart_item.CustomerID != customer.id:
        raise ValueError("Cart item not found")

    return cart_service.remove_from_cart(db, cart_id)


def clear_cart(db: Session, user: Account):
    # Get customer by account_id
    customer = customer_service.get_by_account_id(db, user.id)
    if not customer:
        raise ValueError("Customer not found")

    return cart_service.clear_cart(db, customer.id)
