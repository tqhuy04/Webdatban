from sqlalchemy.orm import Session

from Backend.services.statistcal_service import (
    get_order_and_table_statistical,
    get_chart_of_order
)


def get_order_and_table(db: Session):
    return get_order_and_table_statistical(db)


def get_chart(db: Session):
    return get_chart_of_order(db)
