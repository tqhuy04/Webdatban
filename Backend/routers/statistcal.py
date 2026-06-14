from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from Backend.database import get_db
from Backend.controllers.statiscal_controller import (
    get_order_and_table,
    get_chart,
    get_pie
)
from Backend.core.dependencies import admin_required

router = APIRouter(
    prefix="/api/statistical",
    tags=["Statistical"]
)


# 🔒 ADMIN – tổng số order & table
@router.get("/getOrderandTable")
def get_order_and_table_api(
    db: Session = Depends(get_db),
    start_date: str = None,
    end_date: str = None,
    time_frame: str = None,
    _=Depends(admin_required)
):
    return get_order_and_table(db, start_date, end_date, time_frame)


# 🔒 ADMIN – chart order
@router.get("/getChartOfOrder")
def get_chart_of_order_api(
    db: Session = Depends(get_db),
    start_date: str = None,
    end_date: str = None,
    time_frame: str = None,
    _=Depends(admin_required)
):
    return get_chart(db, start_date, end_date, time_frame)


# 🔒 ADMIN – phân bổ theo mốc thời gian
@router.get("/getPieTimeframe")
def get_pie_timeframe_api(
    db: Session = Depends(get_db),
    start_date: str = None,
    end_date: str = None,
    _=Depends(admin_required)
):
    return get_pie(db, start_date, end_date)
