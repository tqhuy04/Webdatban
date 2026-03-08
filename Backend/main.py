from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from Backend.database import Base, engine

# IMPORT MODELS
from Backend.models.account import Account
from Backend.models.customer import Customer
from Backend.models.feedback import Feedback
from Backend.models.menu_category import MenuCategory
from Backend.models.menu_item import MenuItem
from Backend.models.table import Table
from Backend.models.table_booking import TableBooking
from Backend.models.booking_table import BookingTable
from Backend.models.order import Order
from Backend.models.order_detail import OrderDetail
from Backend.models.promotion import Promotion
from Backend.models.cart import Cart

# CREATE TABLES
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Restaurant Booking API",
    description="Backend API for restaurant booking management system",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả các origin trong development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ROUTERS
from Backend.routers import (
    auth,
    account,
    customer,
    feedback,
    menu_category,
    menu_item,
    table,
    booking,
    table_booking,
    order,
    promotion,
    statistcal,
    banking,
    order_detail,
    cart
)

app.include_router(auth.router)
app.include_router(account.router)
app.include_router(customer.router)
app.include_router(feedback.router)
app.include_router(menu_category.router)
app.include_router(menu_item.router)
app.include_router(table.router)
app.include_router(booking.router)
app.include_router(table_booking.router)
app.include_router(order.router)
app.include_router(promotion.router)
app.include_router(statistcal.router)
app.include_router(banking.router)
app.include_router(order_detail.router)
app.include_router(cart.router)

@app.get("/")
def root():
    return {
        "message": "Restaurant Booking API is running",
        "swagger": "/docs",
        "redoc": "/redoc"
    }
