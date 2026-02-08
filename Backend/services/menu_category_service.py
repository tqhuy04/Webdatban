from sqlalchemy.orm import Session
from Backend.models.menu_category import MenuCategory
from Backend.schemas.menu_category import (
    MenuCategoryCreate,
    MenuCategoryUpdate
)

def get_all(db: Session):
    return db.query(MenuCategory).all()


def create(db: Session, data: MenuCategoryCreate):
    category = MenuCategory(
        CategoryName=data.CategoryName
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update(db: Session, category_id: int, data: MenuCategoryUpdate):
    category = db.query(MenuCategory).get(category_id)
    if not category:
        return None

    if data.CategoryName is not None:
        category.CategoryName = data.CategoryName

    db.commit()
    db.refresh(category)
    return category


def delete(db: Session, category_id: int):
    category = db.query(MenuCategory).get(category_id)
    if not category:
        return False

    db.delete(category)
    db.commit()
    return True
