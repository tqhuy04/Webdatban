from sqlalchemy.orm import Session
from Backend.models.cart import Cart
from Backend.models.menu_item import MenuItem
from typing import List


# =========================
# GET CART BY CUSTOMER
# =========================
def get_cart_by_customer(db: Session, customer_id: int) -> List[Cart]:
    return db.query(Cart).options(
        Cart.menu_item
    ).filter(
        Cart.CustomerID == customer_id
    ).all()


# =========================
# ADD ITEM TO CART
# =========================
def add_to_cart(db: Session, customer_id: int, menu_item_id: int, quantity: int):
    # Check if item already exists in cart
    existing_item = db.query(Cart).filter(
        Cart.CustomerID == customer_id,
        Cart.MenuItemID == menu_item_id
    ).first()

    if existing_item:
        # Update quantity
        existing_item.Quantity += quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item

    # Create new cart item
    cart_item = Cart(
        CustomerID=customer_id,
        MenuItemID=menu_item_id,
        Quantity=quantity
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item


# =========================
# UPDATE CART ITEM QUANTITY
# =========================
def update_cart_item(db: Session, cart_id: int, quantity: int):
    cart_item = db.query(Cart).filter(Cart.CartID == cart_id).first()

    if not cart_item:
        return None

    if quantity <= 0:
        db.delete(cart_item)
        db.commit()
        return None

    cart_item.Quantity = quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item


# =========================
# REMOVE ITEM FROM CART
# =========================
def remove_from_cart(db: Session, cart_id: int):
    cart_item = db.query(Cart).filter(Cart.CartID == cart_id).first()

    if not cart_item:
        return False

    db.delete(cart_item)
    db.commit()
    return True


# =========================
# CLEAR CART
# =========================
def clear_cart(db: Session, customer_id: int):
    db.query(Cart).filter(Cart.CustomerID == customer_id).delete()
    db.commit()
    return True


# =========================
# GET CART ITEM BY ID
# =========================
def get_cart_item_by_id(db: Session, cart_id: int):
    return db.query(Cart).filter(Cart.CartID == cart_id).first()
