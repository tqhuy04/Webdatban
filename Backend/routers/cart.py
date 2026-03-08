from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from Backend.database import get_db
from Backend.core.dependencies import get_current_user
from Backend.models.account import Account
from Backend.schemas.cart import CartCreate, CartUpdate, CartResponse
from Backend.controllers import cart_controller

router = APIRouter(
    prefix="/api/cart",
    tags=["Cart"]
)


# =========================
# GET CART
# =========================
@router.get("", response_model=List[CartResponse])
def get_cart(
    db: Session = Depends(get_db),
    user: Account = Depends(get_current_user)
):
    return cart_controller.get_cart(db, user)


# =========================
# ADD TO CART
# =========================
@router.post("", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    data: CartCreate,
    db: Session = Depends(get_db),
    user: Account = Depends(get_current_user)
):
    try:
        return cart_controller.add_to_cart(db, data, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================
# UPDATE CART ITEM
# =========================
@router.put("/{cart_id}", response_model=CartResponse)
def update_cart_item(
    cart_id: int,
    data: CartUpdate,
    db: Session = Depends(get_db),
    user: Account = Depends(get_current_user)
):
    try:
        result = cart_controller.update_cart_item(db, cart_id, data, user)
        if result is None:
            raise HTTPException(status_code=404, detail="Cart item not found")
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================
# REMOVE FROM CART
# =========================
@router.delete("/{cart_id}")
def remove_from_cart(
    cart_id: int,
    db: Session = Depends(get_db),
    user: Account = Depends(get_current_user)
):
    try:
        success = cart_controller.remove_from_cart(db, cart_id, user)
        if not success:
            raise HTTPException(status_code=404, detail="Cart item not found")
        return {"message": "Item removed from cart"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================
# CLEAR CART
# =========================
@router.delete("")
def clear_cart(
    db: Session = Depends(get_db),
    user: Account = Depends(get_current_user)
):
    try:
        cart_controller.clear_cart(db, user)
        return {"message": "Cart cleared"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
