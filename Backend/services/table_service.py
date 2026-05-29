from fastapi import HTTPException
from sqlalchemy.orm import Session
from Backend.models.table import Table
from Backend.schemas.table import TableCreate, TableUpdate

def get_all_tables(db: Session):
    return db.query(Table).all()

def create_table(db: Session, data: TableCreate):
    table = Table(**data.dict())
    db.add(table)
    db.commit()
    db.refresh(table)
    return table

def update_table(db: Session, table_id: int, data: TableUpdate):
    table = db.query(Table).filter(Table.TableID == table_id).first()

    if not table:
        raise HTTPException(status_code=404, detail="Table not found")

    print(f"[DEBUG update_table] Before update - TableID: {table_id}, Status: {table.Status}")
    print(f"[DEBUG update_table] Data to update: {data.dict()}")

    # Update fields manually
    update_data = {}
    if data.TableNumber is not None:
        update_data['TableNumber'] = data.TableNumber
    if data.Capacity is not None:
        update_data['Capacity'] = data.Capacity
    if data.Status is not None:
        update_data['Status'] = data.Status

    print(f"[DEBUG update_table] Update data: {update_data}")

    # Use update statement for more reliable update
    if update_data:
        db.query(Table).filter(Table.TableID == table_id).update(update_data)
        db.commit()

    # Re-query to get the updated data
    table = db.query(Table).filter(Table.TableID == table_id).first()

    print(f"[DEBUG update_table] After update - TableID: {table_id}, Status: {table.Status}")

    return table


def delete_table(db: Session, table_id: int):
    table = db.query(Table).filter(Table.TableID == table_id).first()
    if not table:
        return False

    db.delete(table)
    db.commit()
    return True

def get_available_tables(db: Session, people: int):
    # TẠM THỜI: lọc theo sức chứa
    # SAU NÀY: join booking_table + booking_time
    return db.query(Table).filter(Table.Capacity >= people).all()
