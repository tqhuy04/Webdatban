from sqlalchemy.orm import Session
from Backend.models.menu_item import MenuItem
from Backend.schemas.menu_item import MenuItemCreate


def get_all_menu_items(db: Session):
    return db.query(MenuItem).all()


def get_menu_item_by_id(db: Session, item_id: int):
    return (
        db.query(MenuItem)
        .filter(MenuItem.MenuItemID == item_id)
        .first()
    )


def create_menu_item(db: Session, data: MenuItemCreate):
    item = MenuItem(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_menu_item(db: Session, item_id: int, data: MenuItemCreate):
    item = get_menu_item_by_id(db, item_id)
    if not item:
        return None

    for key, value in data.dict().items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)
    return item


def delete_menu_item(db: Session, item_id: int):
    item = get_menu_item_by_id(db, item_id)
    if not item:
        return False

    db.delete(item)
    db.commit()
    return True
