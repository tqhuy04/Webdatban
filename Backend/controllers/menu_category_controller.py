from fastapi import HTTPException
from sqlalchemy.orm import Session
from Backend.services import menu_category_service
from Backend.schemas.menu_category import (
    MenuCategoryCreate,
    MenuCategoryUpdate
)

def get_categories(db: Session):
    return menu_category_service.get_all(db)


def create_category(db: Session, data: MenuCategoryCreate):
    return menu_category_service.create(db, data)


def update_category(db: Session, category_id: int, data: MenuCategoryUpdate):
    category = menu_category_service.update(db, category_id, data)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


def delete_category(db: Session, category_id: int):
    success = menu_category_service.delete(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}
