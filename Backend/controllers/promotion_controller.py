from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from Backend.schemas.promotion import PromotionCreate, PromotionUpdate
from Backend.services.promotion_service import (
    get_all_promotions,
    create_promotion,
    update_promotion,
    delete_promotion,
)


def get_all(db: Session):
    return get_all_promotions(db)


def create(db: Session, data: PromotionCreate):
    return create_promotion(db, data)


def update(db: Session, promotion_id: int, data: PromotionUpdate):
    promotion = update_promotion(db, promotion_id, data)
    if not promotion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Promotion not found",
        )
    return promotion


def delete(db: Session, promotion_id: int):
    if not delete_promotion(db, promotion_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Promotion not found",
        )
