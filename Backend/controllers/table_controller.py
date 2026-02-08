from sqlalchemy.orm import Session
from Backend.schemas.table import (
    TableCreate,
    TableUpdate,
    TableAvailableRequest
)
from Backend.services.table_service import (
    get_all_tables,
    create_table,
    update_table,
    delete_table,
    get_available_tables
)

def get_tables_controller(db: Session):
    return get_all_tables(db)

def create_table_controller(db: Session, data: TableCreate):
    return create_table(db, data)

def update_table_controller(db: Session, table_id: int, data: TableUpdate):
    return update_table(db, table_id, data)

def delete_table_controller(db: Session, table_id: int):
    return delete_table(db, table_id)

def check_available_tables_controller(db: Session, data: TableAvailableRequest):
    return get_available_tables(db, data.people)
