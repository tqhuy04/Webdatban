from sqlalchemy.orm import Session
from typing import List

from Backend.models.promotion import Promotion
from Backend.schemas.promotion import PromotionCreate, PromotionUpdate


def get_all_promotions(db: Session) -> List[Promotion]:
    return db.query(Promotion).order_by(Promotion.CreatedAt.desc()).all()


def create_promotion(db: Session, data: PromotionCreate) -> Promotion:
    promotion = Promotion(
        Name=data.name,
        Description=data.description,
        DiscountPercent=data.discount_percent,
        StartDate=data.start_date,
        EndDate=data.end_date,
    )

    db.add(promotion)
    db.commit()
    db.refresh(promotion)
    return promotion


def update_promotion(
    db: Session,
    promotion_id: int,
    data: PromotionUpdate
) -> Promotion | None:
    promotion = (
        db.query(Promotion)
        .filter(Promotion.PromotionID == promotion_id)
        .first()
    )

    if not promotion:
        return None

    promotion.Name = data.name
    promotion.Description = data.description
    promotion.DiscountPercent = data.discount_percent
    promotion.StartDate = data.start_date
    promotion.EndDate = data.end_date

    db.commit()
    db.refresh(promotion)
    return promotion


def delete_promotion(db: Session, promotion_id: int) -> bool:
    promotion = (
        db.query(Promotion)
        .filter(Promotion.PromotionID == promotion_id)
        .first()
    )

    if not promotion:
        return False

    db.delete(promotion)
    db.commit()
    return True
