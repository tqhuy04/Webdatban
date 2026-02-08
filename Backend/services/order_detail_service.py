from sqlalchemy.orm import Session
from Backend.models.order_detail import OrderDetail
from Backend.models.menu_item import MenuItem
from sqlalchemy.orm import joinedload

# =========================
# GET BY ORDER
# =========================
def get_by_order(db: Session, order_id: int):
    return (
        db.query(OrderDetail)
        .options(joinedload(OrderDetail.menu_item))
        .filter(OrderDetail.OrderID == order_id)
        .all()
    )


# =========================
# CREATE
# =========================
def create_order_detail(db: Session, data):
    menu_item = db.query(MenuItem).filter(
        MenuItem.MenuItemID == data.MenuItemID
    ).first()

    if not menu_item:
        return None

    detail = OrderDetail(
        OrderID=data.OrderID,
        MenuItemID=data.MenuItemID,
        Quantity=data.Quantity,
        Price=menu_item.Price
    )

    db.add(detail)
    db.commit()
    db.refresh(detail)
    return detail


# =========================
# DELETE
# =========================
def delete_order_detail(db: Session, detail_id: int):
    detail = db.query(OrderDetail).filter(
        OrderDetail.OrderDetailID == detail_id
    ).first()

    if not detail:
        return False

    db.delete(detail)
    db.commit()
    return True
