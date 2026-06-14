from sqlalchemy.orm import Session
from fastapi import Query

from Backend.services.statistcal_service import (
    get_order_and_table_statistical,
    get_chart_of_order,
    get_pie_timeframe_distribution,
)


def get_order_and_table(
    db: Session,
    start_date: str = Query(None),
    end_date: str = Query(None),
    time_frame: str = Query(None),
):
    return get_order_and_table_statistical(db, start_date, end_date, time_frame)


def get_chart(
    db: Session,
    start_date: str = Query(None),
    end_date: str = Query(None),
    time_frame: str = Query(None),
):
    return get_chart_of_order(db, start_date, end_date, time_frame)


def get_pie(
    db: Session,
    start_date: str = Query(None),
    end_date: str = Query(None),
):
    return get_pie_timeframe_distribution(db, start_date, end_date)
