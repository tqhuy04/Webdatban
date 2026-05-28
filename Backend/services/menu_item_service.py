from sqlalchemy.orm import Session
from Backend.models.menu_item import MenuItem
from Backend.models.menu_category import MenuCategory
from Backend.schemas.menu_item import MenuItemCreate, MenuItemUpdate


def get_all_menu_items(db: Session):
    return db.query(MenuItem).filter(MenuItem.IsDeleted == False).all()


def get_menu_item_by_id(db: Session, item_id: int):
    return db.query(MenuItem).filter(
        MenuItem.MenuItemID == item_id,
        MenuItem.IsDeleted == False
    ).first()


def get_menu_category_by_id(db: Session, category_id: int):
    return db.query(MenuCategory).filter(
        MenuCategory.CategoryID == category_id
    ).first()


def create_menu_item(db: Session, data: MenuItemCreate):
    item = MenuItem(**data.dict())

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def update_menu_item(db: Session, item_id: int, data: MenuItemUpdate):
    item = get_menu_item_by_id(db, item_id)

    if not item:
        return None

    for key, value in data.dict(exclude_unset=True).items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    return item


def delete_menu_item(db: Session, item_id: int):
    item = get_menu_item_by_id(db, item_id)

    if not item:
        return False

    item.IsDeleted = True
    db.commit()

    return True


# =========================
# SEARCH
# =========================
def search_menu_items(db: Session, keyword: str):
    """
    Tìm kiếm món ăn theo tên hoặc mô tả.
    """
    return db.query(MenuItem).filter(
        MenuItem.IsDeleted == False,
        (
            MenuItem.Name.ilike(f"%{keyword}%") |
            MenuItem.Description.ilike(f"%{keyword}%")
        )
    ).all()