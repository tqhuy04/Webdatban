from sqlalchemy.orm import Session
from Backend.models.order_detail import OrderDetail
from Backend.models.menu_item import MenuItem


# =========================
# GET BY ORDER
# =========================
def get_by_order(db: Session, order_id: int):
    results = db.query(OrderDetail).filter(OrderDetail.OrderID == order_id).all()

    print(f"[DEBUG] Found {len(results)} order details for OrderID={order_id}")

    # Load menu_item cho mỗi result
    for result in results:
        if result.menu_item is None:
            menu_item = db.query(MenuItem).filter(
                MenuItem.MenuItemID == result.MenuItemID
            ).first()
            result.menu_item = menu_item
            print(f"[DEBUG] Loaded menu_item: {menu_item.Name if menu_item else 'None'}")
        else:
            print(f"[DEBUG] menu_item already loaded: {result.menu_item.Name}")

    return results


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
