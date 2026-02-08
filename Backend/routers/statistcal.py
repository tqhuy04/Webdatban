from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from Backend.database import get_db
from Backend.controllers.statiscal_controller import (
    get_order_and_table,
    get_chart
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
    _=Depends(admin_required)
):
    return get_order_and_table(db)


# 🔒 ADMIN – chart order
@router.get("/getChartOfOrder")
def get_chart_of_order_api(
    db: Session = Depends(get_db),
    _=Depends(admin_required)
):
    return get_chart(db)
