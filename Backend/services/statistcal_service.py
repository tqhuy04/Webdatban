from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, List

from Backend.models.order import Order
from Backend.models.table import Table


def get_order_and_table_statistical(db: Session) -> Dict[str, int]:
    total_orders = db.query(func.count(Order.OrderID)).scalar()
    total_tables = db.query(func.count(Table.TableID)).scalar()
    total_revenue = (
        db.query(func.coalesce(func.sum(Order.TotalAmount), 0))
        .scalar()
    )

    return {
        "totalOrders": total_orders,
        "totalTables": total_tables,
        "totalRevenue": float(total_revenue or 0),
    }


def get_chart_of_order(db: Session) -> List[Dict]:
    """
    Trả dữ liệu chart theo ngày:
    [
      { "date": "2026-01-01", "total": 5 },
      { "date": "2026-01-02", "total": 10 }
    ]
    """

    result = (
        db.query(
            func.date(Order.OrderDate).label("date"),
            func.count(Order.OrderID).label("total")
        )
        .group_by(func.date(Order.OrderDate))
        .order_by(func.date(Order.OrderDate))
        .all()
    )

    return [
        {
            "date": str(row.date),
            "total": row.total
        }
        for row in result
    ]
