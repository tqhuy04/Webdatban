from sqlalchemy.orm import Session
from Backend.models.order_detail import OrderDetail
from Backend.models.menu_item import MenuItem
from Backend.models.order import Order


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

    # Tính giá = đơn giá * số lượng
    price = menu_item.Price * data.Quantity

    detail = OrderDetail(
        OrderID=data.OrderID,
        MenuItemID=data.MenuItemID,
        Quantity=data.Quantity,
        Price=price
    )

    db.add(detail)

    # Cập nhật tổng tiền order (tính lại với discount nếu có)
    order = db.query(Order).filter(Order.OrderID == data.OrderID).first()
    if order:
        # Tính tổng phụ từ tất cả details + món mới
        order_details = db.query(OrderDetail).filter(
            OrderDetail.OrderID == data.OrderID
        ).all()
        subtotal = sum(d.Price for d in order_details) + price

        # Lấy DiscountPercent từ promotion
        discount = 0
        if order.PromotionID:
            from Backend.models.promotion import Promotion
            promotion = db.query(Promotion).filter(
                Promotion.PromotionID == order.PromotionID
            ).first()
            if promotion and promotion.DiscountPercent:
                discount = promotion.DiscountPercent

        # TotalAmount = Tổng phụ - DiscountPercent
        order.TotalAmount = subtotal - discount

    db.commit()
    db.refresh(detail)
    return detail


# =========================
# DELETE
# =========================
def update_order_detail(db: Session, detail_id: int, data):
    detail = db.query(OrderDetail).filter(
        OrderDetail.OrderDetailID == detail_id
    ).first()

    if not detail:
        return None

    old_price = detail.Price

    # Lấy menu item mới
    menu_item = db.query(MenuItem).filter(
        MenuItem.MenuItemID == data.MenuItemID
    ).first()

    if not menu_item:
        return None

    new_price = menu_item.Price * data.Quantity

    # Cập nhật
    detail.MenuItemID = data.MenuItemID
    detail.Quantity = data.Quantity
    detail.Price = new_price

    # Cập nhật tổng tiền order (tính lại từ đầu vì có thể promotion %)
    order = db.query(Order).filter(Order.OrderID == detail.OrderID).first()
    if order:
        # Tính tổng phụ từ tất cả details
        order_details = db.query(OrderDetail).filter(
            OrderDetail.OrderID == detail.OrderID
        ).all()
        subtotal = sum(d.Price for d in order_details)

        # Lấy DiscountPercent từ promotion
        discount = 0
        if order.PromotionID:
            from Backend.models.promotion import Promotion
            promotion = db.query(Promotion).filter(
                Promotion.PromotionID == order.PromotionID
            ).first()
            if promotion and promotion.DiscountPercent:
                discount = promotion.DiscountPercent

        # TotalAmount = Tổng phụ - DiscountPercent
        order.TotalAmount = subtotal - discount

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

    # Cập nhật tổng tiền order trước khi xóa (tính lại với discount)
    order = db.query(Order).filter(Order.OrderID == detail.OrderID).first()
    if order:
        # Tính tổng phụ (không tính detail bị xóa)
        order_details = db.query(OrderDetail).filter(
            OrderDetail.OrderID == detail.OrderID,
            OrderDetail.OrderDetailID != detail_id
        ).all()
        subtotal = sum(d.Price for d in order_details)

        # Lấy DiscountPercent từ promotion
        discount = 0
        if order.PromotionID:
            from Backend.models.promotion import Promotion
            promotion = db.query(Promotion).filter(
                Promotion.PromotionID == order.PromotionID
            ).first()
            if promotion and promotion.DiscountPercent:
                discount = promotion.DiscountPercent

        # TotalAmount = Tổng phụ - DiscountPercent
        order.TotalAmount = subtotal - discount

    db.delete(detail)
    db.commit()
    return True
