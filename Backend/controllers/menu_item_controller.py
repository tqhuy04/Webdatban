from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from Backend.schemas.menu_item import MenuItemCreate
from Backend.services.menu_item_service import (
    get_all_menu_items,
    create_menu_item,
    update_menu_item,
    delete_menu_item,
)


def get_all(db: Session):
    return get_all_menu_items(db)


def create(db: Session, data: MenuItemCreate):
    return create_menu_item(db, data)


def update(db: Session, item_id: int, data: MenuItemCreate):
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
