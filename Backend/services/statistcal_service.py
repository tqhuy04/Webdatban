from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import Dict, List, Optional
from datetime import datetime, time

from Backend.models.order import Order
from Backend.models.table import Table


# Mapping mốc thời gian -> khoảng giờ trong ngày
TIMEFRAME_HOURS = {
    "morning": (time(5, 0), time(11, 59, 59)),
    "afternoon": (time(12, 0), time(17, 59, 59)),
    "evening": (time(18, 0), time(23, 59, 59)),
}


def _build_filter(start_date: Optional[str], end_date: Optional[str], time_frame: Optional[str]):
    """
    Tạo danh sách điều kiện lọc cho Order theo ngày và mốc giờ.
    - start_date / end_date: chuỗi YYYY-MM-DD
    - time_frame: morning | afternoon | evening | all | None
    """
    filters = []

    if start_date:
        try:
            sd = datetime.strptime(start_date, "%Y-%m-%d")
            filters.append(Order.OrderDate >= sd)
        except ValueError:
            pass

    if end_date:
        try:
            ed = datetime.strptime(end_date, "%Y-%m-%d")
            # tính tới hết ngày
            ed = ed.replace(hour=23, minute=59, second=59)
            filters.append(Order.OrderDate <= ed)
        except ValueError:
            pass

    if time_frame and time_frame in TIMEFRAME_HOURS and TIMEFRAME_HOURS[time_frame]:
        start_t, end_t = TIMEFRAME_HOURS[time_frame]
        filters.append(func.time(Order.OrderDate) >= start_t)
        filters.append(func.time(Order.OrderDate) <= end_t)

    return filters


def get_order_and_table_statistical(
    db: Session,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    time_frame: Optional[str] = None,
) -> Dict[str, int]:
    order_query = db.query(Order)
    for f in _build_filter(start_date, end_date, time_frame):
        order_query = order_query.filter(f)

    total_orders = order_query.with_entities(func.count(Order.OrderID)).scalar() or 0
    total_revenue = order_query.with_entities(
        func.coalesce(func.sum(Order.TotalAmount), 0)
    ).scalar() or 0

    total_tables = db.query(func.count(Table.TableID)).scalar() or 0

    return {
        "totalOrders": int(total_orders),
        "totalTables": int(total_tables),
        "totalRevenue": float(total_revenue),
    }


def get_chart_of_order(
    db: Session,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    time_frame: Optional[str] = None,
) -> List[Dict]:
    """
    Trả dữ liệu chart theo ngày:
    [
      { "date": "2026-01-01", "total": 5 },
      { "date": "2026-01-02", "total": 10 }
    ]
    """

    query = db.query(
        func.date(Order.OrderDate).label("date"),
        func.count(Order.OrderID).label("total")
    )

    for f in _build_filter(start_date, end_date, time_frame):
        query = query.filter(f)

    result = (
        query
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


def get_pie_timeframe_distribution(
    db: Session,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
) -> List[Dict]:
    """
    Trả về phân bổ đơn hàng theo mốc thời gian (Sáng/Chiều/Tối) trong khoảng ngày.
    [
      { "label": "Sáng", "value": 10 },
      { "label": "Chiều", "value": 15 },
      { "label": "Tối", "value": 8 }
    ]
    """
    base_filters = _build_filter(start_date, end_date, None)

    distribution = []
    for key, (start_t, end_t) in TIMEFRAME_HOURS.items():
        if start_t is None:
            continue
        q = db.query(func.count(Order.OrderID))
        for f in base_filters:
            q = q.filter(f)
        q = q.filter(and_(
            func.time(Order.OrderDate) >= start_t,
            func.time(Order.OrderDate) <= end_t,
        ))
        total = q.scalar() or 0
        distribution.append({"label": key, "value": int(total)})

    return distribution
