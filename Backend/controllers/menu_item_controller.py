from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from Backend.schemas.menu_item import MenuItemCreate, MenuItemUpdate
from Backend.services.menu_item_service import (
    get_all_menu_items,
    get_active_menu_items,
    get_menu_item_by_id,
    create_menu_item,
    update_menu_item,
    delete_menu_item,
    get_menu_category_by_id
)


def get_category(category_id: int, db: Session):
    category = get_menu_category_by_id(db, category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu category không tồn tại"
        )

    return category


def get_all(db: Session):
    return get_all_menu_items(db)


def get_active(db: Session):
    return get_active_menu_items(db)


def get_by_id(db: Session, item_id: int):
    item = get_menu_item_by_id(db, item_id)

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item không tồn tại"
        )

    return item


def create(db: Session, data: MenuItemCreate):
    return create_menu_item(db, data)


def update(db: Session, item_id: int, data: MenuItemUpdate):
    item = update_menu_item(db, item_id, data)

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item không tồn tại"
        )

    return item


def delete(db: Session, item_id: int):
    ok = delete_menu_item(db, item_id)

    if not ok:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item không tồn tại"
        )

    return {"message": "Xóa thành công"}


# =========================
# SEARCH
# =========================
def search(db: Session, keyword: str):
    from Backend.services.menu_item_service import search_menu_items
    return search_menu_items(db, keyword)