from fastapi import (
    APIRouter, Depends, status,
    UploadFile, File, Form, HTTPException
)
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil

from Backend.database import get_db
from Backend.schemas.menu_item import (
    MenuItemCreate,
    MenuItemUpdate,
    MenuItemResponse
)

from Backend.controllers.menu_item_controller import (
    get_all,
    get_by_id,
    create,
    update,
    delete,
    search
)

from Backend.core.dependencies import admin_required
from Backend.models.menu_category import MenuCategory

router = APIRouter(
    prefix="/api/menu-items",
    tags=["Menu Items"]
)

BASE_UPLOAD_DIR = "uploads/Categories"


# =========================
# GET ALL
# =========================
@router.get("/", response_model=List[MenuItemResponse])
def get_menu_items(db: Session = Depends(get_db)):
    return get_all(db)


# =========================
# GET BY ID
# =========================
@router.get("/{item_id}", response_model=MenuItemResponse)
def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    return get_by_id(db, item_id)


# =========================
# CREATE
# =========================
@router.post(
    "/",
    response_model=MenuItemResponse,
    status_code=status.HTTP_201_CREATED
)
def create_menu_item(
    CategoryID: int = Form(...),
    Name: str = Form(...),
    Description: str = Form(...),
    Price: float = Form(...),
    Status: str = Form(...),
    img: Optional[UploadFile] = File(None),

    db: Session = Depends(get_db),
    _: dict = Depends(admin_required)
):

    category = db.query(MenuCategory).filter(
        MenuCategory.CategoryID == CategoryID
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category không tồn tại")

    category_folder = category.CategoryName
    upload_dir = os.path.join(BASE_UPLOAD_DIR, category_folder)
    os.makedirs(upload_dir, exist_ok=True)

    if img:
        filename = img.filename
        file_path = os.path.join(upload_dir, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)
    else:
        filename = "default.png"

    data = MenuItemCreate(
        CategoryID=CategoryID,
        Name=Name,
        Description=Description,
        Price=Price,
        ImageURL=f"{category_folder}/{filename}",
        Status=Status
    )

    return create(db, data)


# =========================
# UPDATE
# =========================
@router.put("/{item_id}", response_model=MenuItemResponse)
def update_menu_item(
    item_id: int,

    CategoryID: Optional[int] = Form(None),
    Name: Optional[str] = Form(None),
    Description: Optional[str] = Form(None),
    Price: Optional[float] = Form(None),
    Status: Optional[str] = Form(None),
    img: Optional[UploadFile] = File(None),

    db: Session = Depends(get_db),
    _: dict = Depends(admin_required)
):

    update_data = {}

    if CategoryID is not None:
        update_data["CategoryID"] = CategoryID
    if Name is not None:
        update_data["Name"] = Name
    if Description is not None:
        update_data["Description"] = Description
    if Price is not None:
        update_data["Price"] = Price
    if Status is not None:
        update_data["Status"] = Status

    if img:
        category = db.query(MenuCategory).filter(
            MenuCategory.CategoryID == CategoryID
        ).first()

        if not category:
            raise HTTPException(status_code=404, detail="Category không tồn tại")

        category_folder = category.CategoryName
        upload_dir = os.path.join(BASE_UPLOAD_DIR, category_folder)
        os.makedirs(upload_dir, exist_ok=True)

        filename = img.filename
        file_path = os.path.join(upload_dir, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)

        update_data["ImageURL"] = f"{category_folder}/{filename}"

    data = MenuItemUpdate(**update_data)

    return update(db, item_id, data)


# =========================
# DELETE
# =========================
@router.delete("/{item_id}")
def delete_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(admin_required)
):
    return delete(db, item_id)


# =========================
# SEARCH
# =========================
@router.get("/search/", response_model=List[MenuItemResponse])
def search_menu_items(
    keyword: str,
    db: Session = Depends(get_db)
):
    return search(db, keyword)