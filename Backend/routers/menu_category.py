from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from Backend.database import get_db
from Backend.schemas.menu_category import (
    MenuCategoryCreate,
    MenuCategoryUpdate,
    MenuCategoryResponse
)
from Backend.controllers import menu_category_controller
from Backend.core.dependencies import admin_required

router = APIRouter(
    prefix="/api/menu-categories",
    tags=["Menu Categories"]
)

@router.get("/", response_model=list[MenuCategoryResponse])
def get_all(db: Session = Depends(get_db)):
    return menu_category_controller.get_categories(db)

@router.post(
    "/",
    response_model=MenuCategoryResponse,
    dependencies=[Depends(admin_required)]
)
def create(
    data: MenuCategoryCreate,
    db: Session = Depends(get_db)
):
    return menu_category_controller.create_category(db, data)

@router.put(
    "/{category_id}",
    response_model=MenuCategoryResponse,
    dependencies=[Depends(admin_required)]
)
def update(
    category_id: int,
    data: MenuCategoryUpdate,
    db: Session = Depends(get_db)
):
    return menu_category_controller.update_category(db, category_id, data)

@router.delete(
    "/{category_id}",
    dependencies=[Depends(admin_required)]
)
def delete(
    category_id: int,
    db: Session = Depends(get_db)
):
    return menu_category_controller.delete_category(db, category_id)
