from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from Backend.database import get_db
from Backend.schemas.promotion import (
    PromotionCreate,
    PromotionUpdate,
    PromotionResponse
)
from Backend.controllers.promotion_controller import (
    get_all,
    create,
    update,
    delete
)
from Backend.core.dependencies import admin_required

router = APIRouter(prefix="/api/promotions", tags=["Promotion"])


# 🌐 PUBLIC – user xem khuyến mãi
@router.get("", response_model=List[PromotionResponse])
def get_all_promotions_api(
    db: Session = Depends(get_db)
):
    return get_all(db)


# 🔒 ADMIN – tạo khuyến mãi
@router.post("", response_model=PromotionResponse)
def create_promotion_api(
    data: PromotionCreate,
    db: Session = Depends(get_db),
    _=Depends(admin_required)
):
    return create(db, data)


# 🔒 ADMIN – cập nhật
@router.put("/{promotion_id}", response_model=PromotionResponse)
def update_promotion_api(
    promotion_id: int,
    data: PromotionUpdate,
    db: Session = Depends(get_db),
    _=Depends(admin_required)
):
    return update(db, promotion_id, data)


# 🔒 ADMIN – xóa
@router.delete("/{promotion_id}")
def delete_promotion_api(
    promotion_id: int,
    db: Session = Depends(get_db),
    _=Depends(admin_required)
):
    delete(db, promotion_id)
    return {"message": "Deleted successfully"}
