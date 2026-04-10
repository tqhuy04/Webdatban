from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import socketio
import os
from dotenv import load_dotenv

# Load environment variables từ .env file
load_dotenv()

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
from Backend.models.otp import OTP
from Backend.models.chat_message import ChatMessage, _conversation_id_for_message
from Backend.models.chat_conversation import ChatConversation
from Backend.core.datetime_utils import isoformat_utc_z

# CREATE TABLES
Base.metadata.create_all(bind=engine)

# SOCKET.IO SERVER
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*'
)

# FASTAPI APP
app = FastAPI(
    title="Restaurant Booking API",
    description="Backend API for restaurant booking management system",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ROUTERS
from Backend.routers.auth import router as auth
from Backend.routers.account import router as account
from Backend.routers.customer import router as customer
from Backend.routers.feedback import router as feedback
from Backend.routers.menu_category import router as menu_category
from Backend.routers.menu_item import router as menu_item
from Backend.routers.table import router as table
from Backend.routers.booking import router as booking
from Backend.routers.table_booking import router as table_booking
from Backend.routers.order import router as order
from Backend.routers.promotion import router as promotion
from Backend.routers.statistcal import router as statistcal
from Backend.routers.banking import router as banking
from Backend.routers.order_detail import router as order_detail
from Backend.routers.cart import router as cart
from Backend.routers.chat import router as chat

app.include_router(auth)
app.include_router(account)
app.include_router(customer)
app.include_router(feedback)
app.include_router(menu_category)
app.include_router(menu_item)
app.include_router(table)
app.include_router(booking)
app.include_router(table_booking)
app.include_router(order)
app.include_router(promotion)
app.include_router(statistcal)
app.include_router(banking)
app.include_router(order_detail)
app.include_router(cart)
app.include_router(chat)

# COMBINE FASTAPI + SOCKET.IO
socket_app = socketio.ASGIApp(sio, app)

# Lưu trữ thông tin người dùng online
online_users = {}


@sio.on("connect")
async def handle_connect(sid, environ):
    """Xử lý khi client kết nối"""
    print(f"Client connected: {sid}")
    await sio.emit("connected", {"sid": sid})


@sio.on("disconnect")
async def handle_disconnect(sid):
    """Xử lý khi client ngắt kết nối"""
    if sid in online_users:
        user_info = online_users.pop(sid)
        print(f"User disconnected: {user_info}")
        if user_info.get("user_type") == "CUSTOMER":
            await sio.emit("customer_offline", {
                "customer_id": user_info.get("user_id"),
                "account_id": user_info.get("account_id")
            })


@sio.on("register")
async def handle_register(sid, data):
    """Client đăng ký thông tin người dùng"""
    user_id = data.get("user_id")
    user_type = data.get("user_type")
    account_id = data.get("account_id")
    
    online_users[sid] = {
        "user_id": user_id,
        "user_type": user_type,
        "account_id": account_id
    }
    
    print(f"User registered: {online_users[sid]}")
    
    if user_type == "CUSTOMER":
        await sio.emit("customer_online", {
            "customer_id": user_id,
            "account_id": account_id
        })
    
    await sio.emit("registered", {"success": True, "sid": sid}, room=sid)


@sio.on("send_message")
async def handle_send_message(sid, data):
    """Xử lý gửi tin nhắn"""
    from Backend.database import SessionLocal

    sender_type = data.get("sender_type")
    sender_id = data.get("sender_id")
    receiver_type = data.get("receiver_type")
    receiver_id = data.get("receiver_id")
    message_text = data.get("message")
    
    db = SessionLocal()
    try:
        # Tự động tạo conversation nếu chưa có
        conv_id = _conversation_id_for_message(
            sender_type, sender_id, receiver_type, receiver_id
        )
        if sender_type == "CUSTOMER":
            conv = db.query(ChatConversation).filter(
                ChatConversation.customer_id == sender_id
            ).first()
            if not conv:
                conv = ChatConversation(
                    customer_id=sender_id,
                    admin_id=1,
                    status="ACTIVE",
                    unread_admin=1,
                )
                db.add(conv)
                db.commit()
                db.refresh(conv)
            conv_id = conv.id
        else:
            conv = db.query(ChatConversation).filter(
                ChatConversation.customer_id == receiver_id
            ).first()
            if conv:
                conv_id = conv.id
                conv.unread_admin = (conv.unread_admin or 0) + 1
                conv.updated_at = datetime.utcnow()
            else:
                conv = ChatConversation(
                    customer_id=receiver_id,
                    admin_id=1,
                    status="ACTIVE",
                    unread_customer=1,
                )
                db.add(conv)
                db.commit()
                db.refresh(conv)
                conv_id = conv.id

        chat_message = ChatMessage(
            conversation_id=conv_id,
            sender_type=sender_type,
            sender_id=sender_id,
            receiver_type=receiver_type,
            receiver_id=receiver_id,
            content=message_text,
            message=message_text,
            is_read=False,
        )
        db.add(chat_message)
        db.commit()
        db.refresh(chat_message)
        
        message_data = {
            "id": chat_message.id,
            "sender_type": sender_type,
            "sender_id": sender_id,
            "receiver_type": receiver_type,
            "receiver_id": receiver_id,
            "message": message_text,
            "created_at": isoformat_utc_z(chat_message.created_at),
            "is_read": False
        }
        
        # Tìm socket của receiver và gửi tin nhắn
        receiver_sid = None
        for s_id, user_info in online_users.items():
            if (user_info.get("user_id") == receiver_id and 
                user_info.get("user_type") == receiver_type):
                receiver_sid = s_id
                break
        
        if receiver_sid:
            await sio.emit("receive_message", message_data, room=receiver_sid)
        
        # Xác nhận cho người gửi
        await sio.emit("message_sent", {"success": True, "message": message_data}, room=sid)
        
        return {"success": True, "message_id": chat_message.id}
        
    except Exception as e:
        db.rollback()
        print(f"Error sending message: {e}")
        await sio.emit("message_error", {"error": str(e)}, room=sid)
        return {"success": False, "error": str(e)}
    finally:
        db.close()


@sio.on("mark_read")
async def handle_mark_read(sid, data):
    """Đánh dấu tin nhắn đã đọc"""
    from Backend.database import SessionLocal
    from Backend.models.chat_message import ChatMessage
    
    db = SessionLocal()
    try:
        message_ids = data.get("message_ids", [])
        sender_id = data.get("sender_id")
        sender_type = data.get("sender_type")
        
        if message_ids:
            db.query(ChatMessage).filter(
                ChatMessage.id.in_(message_ids)
            ).update({ChatMessage.is_read: True}, synchronize_session=False)
        elif sender_id and sender_type:
            db.query(ChatMessage).filter(
                ChatMessage.sender_id == sender_id,
                ChatMessage.sender_type == sender_type
            ).update({ChatMessage.is_read: True}, synchronize_session=False)
        
        db.commit()
        await sio.emit("messages_read", {"success": True}, room=sid)
        return {"success": True}
        
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}
    finally:
        db.close()


@sio.on("get_online_customers")
async def handle_get_online_customers(sid, data):
    """Lấy danh sách customer đang online"""
    customers = []
    for sio_id, user_info in online_users.items():
        if user_info.get("user_type") == "CUSTOMER":
            customers.append({
                "customer_id": user_info.get("user_id"),
                "account_id": user_info.get("account_id"),
                "sio_id": sio_id
            })
    await sio.emit("online_customers_list", {"customers": customers}, room=sid)
    return {"customers": customers}


# Xuất socket_app làm ứng dụng chính
application = socket_app
