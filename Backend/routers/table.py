from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from Backend.database import get_db
from Backend.schemas.table import (
    TableCreate,
    TableUpdate,
    TableOut,
    TableAvailableRequest
)
from Backend.services.table_service import (
    get_all_tables,
    create_table,
    update_table,
    delete_table,
    get_available_tables
)
from Backend.core.dependencies import get_current_user, admin_required

router = APIRouter(
    prefix="/api/tables",
    tags=["Tables"]
)

# =========================
# GET ALL TABLES (PUBLIC)
# =========================
@router.get("/", response_model=List[TableOut])
def get_tables(
    db: Session = Depends(get_db)
):
    return get_all_tables(db)


# =========================
# CREATE TABLE (ADMIN)
# =========================
@router.post(
    "/",
    response_model=TableOut,
    status_code=status.HTTP_201_CREATED
)
def create_new_table(
    data: TableCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(admin_required)
):
    return create_table(db, data)


# =========================
# UPDATE TABLE (ADMIN)
# =========================
@router.put("/{table_id}", response_model=TableOut)
def update_table_api(
    table_id: int,
    data: TableUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_user)
):
    table = update_table(db, table_id, data)
    if not table:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Table not found"
        )
    return table


# =========================
# DELETE TABLE (ADMIN)
# =========================
@router.delete("/{table_id}")
def delete_table_api(
    table_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(admin_required)
):
    success = delete_table(db, table_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete table (not found or booked)"
        )

    return {"message": "Delete table successfully"}


# =========================
# GET AVAILABLE TABLES
# =========================
@router.post("/available", response_model=List[TableOut])
def get_available_table_api(
    data: TableAvailableRequest,
    db: Session = Depends(get_db)
):
    return get_available_tables(
        db=db,
        people=data.people
    )
