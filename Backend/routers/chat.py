from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc
from Backend.database import get_db
from Backend.models.chat_message import ChatMessage, _conversation_id_for_message
from Backend.models.chat_conversation import ChatConversation
from Backend.models.customer import Customer
from Backend.models.account import Account
from pydantic import BaseModel, ConfigDict, field_serializer
from typing import Optional, List
from datetime import datetime

from Backend.core.datetime_utils import isoformat_utc_z

router = APIRouter(prefix="/api/chat", tags=["Chat"])


def _resolve_customer(db: Session, key_id: int) -> Optional[Customer]:
    """sender_id thường là customer_id; một số dữ liệu cũ có thể dùng account_id."""
    c = db.query(Customer).filter(Customer.id == key_id).first()
    if c:
        return c
    return db.query(Customer).filter(Customer.account_id == key_id).first()


def _canonical_customer_for_account(db: Session, account_id: int) -> Optional[Customer]:
    """
    Cùng quy tắc với /customers/me (get_by_account_id): một account — lấy bản ghi Customer
    có id nhỏ nhất. Tránh lệch tên khi có nhiều dòng customers cùng account_id.
    """
    return (
        db.query(Customer)
        .filter(Customer.account_id == account_id)
        .order_by(asc(Customer.id))
        .first()
    )


def _customer_display_name(db: Session, customer: Optional[Customer], fallback_id: int) -> str:
    """
    Họ tên từ bản ghi Customer 'chính' cùng account (khớp trang Thông tin khách hàng).
    """
    if not customer:
        return f"Khách #{fallback_id}"
    canonical = _canonical_customer_for_account(db, customer.account_id)
    use = canonical or customer
    name = (use.full_name or "").strip()
    if name:
        return name
    acc = db.query(Account).filter(Account.id == customer.account_id).first()
    if acc and acc.Username:
        return acc.Username
    return f"Khách #{fallback_id}"


# SCHEMAS
class ChatMessageCreate(BaseModel):
    sender_type: str
    sender_id: int
    receiver_type: str
    receiver_id: int
    message: str


class ChatMessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sender_type: str
    sender_id: int
    receiver_type: str
    receiver_id: int
    message: str
    is_read: bool
    created_at: Optional[datetime] = None

    @field_serializer("created_at")
    def serialize_created_at(self, v: Optional[datetime]) -> Optional[str]:
        return isoformat_utc_z(v)


class ConversationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    customer_id: int
    customer_name: Optional[str] = None
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    unread_count: int = 0

    @field_serializer("last_message_time")
    def serialize_last_message_time(self, v: Optional[datetime]) -> Optional[str]:
        return isoformat_utc_z(v)


# API ENDPOINTS

@router.get("/conversations", response_model=List[ConversationResponse])
def get_conversations(db: Session = Depends(get_db)):
    """
    Lấy danh sách cuộc trò chuyện của tất cả khách hàng với admin.
    Lấy tên từ bảng Customer (chính xác hơn conversation).
    """
    # Lấy tất cả tin nhắn gửi từ khách hàng cho admin, sắp xếp mới nhất trước
    messages = db.query(ChatMessage).filter(
        ChatMessage.sender_type == "CUSTOMER",
        ChatMessage.receiver_type == "ADMIN"
    ).order_by(desc(ChatMessage.created_at)).all()

    seen_customers = set()
    conversations = []

    for msg in messages:
        # sender_id trong message chính là customer_id
        cust_id = msg.sender_id

        if cust_id is None:
            continue

        if cust_id in seen_customers:
            continue
        seen_customers.add(cust_id)

        customer = _resolve_customer(db, cust_id)
        display_name = _customer_display_name(db, customer, cust_id)

        # Tin nhắn chưa đọc từ khách này
        unread_count = db.query(ChatMessage).filter(
            ChatMessage.sender_type == "CUSTOMER",
            ChatMessage.sender_id == cust_id,
            ChatMessage.is_read == False
        ).count()

        conversations.append(ConversationResponse(
            customer_id=cust_id,
            customer_name=display_name,
            last_message=msg.message,
            last_message_time=msg.created_at,
            unread_count=unread_count
        ))

    return conversations


@router.get("/history/{customer_id}", response_model=List[ChatMessageResponse])
def get_chat_history(
    customer_id: int,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Lấy lịch sử chat với một khách hàng cụ thể
    """
    messages = db.query(ChatMessage).filter(
        or_(
            and_(ChatMessage.sender_id == customer_id, ChatMessage.sender_type == "CUSTOMER"),
            and_(ChatMessage.receiver_id == customer_id, ChatMessage.receiver_type == "CUSTOMER")
        )
    ).order_by(ChatMessage.created_at.asc()).offset(offset).limit(limit).all()
    
    return messages


@router.get("/unread/{user_type}/{user_id}")
def get_unread_count(user_type: str, user_id: int, db: Session = Depends(get_db)):
    """
    Lấy số tin nhắn chưa đọc của một người dùng
    """
    count = db.query(ChatMessage).filter(
        ChatMessage.receiver_type == user_type,
        ChatMessage.receiver_id == user_id,
        ChatMessage.is_read == False
    ).count()
    
    return {"unread_count": count}


@router.put("/mark-read/{message_id}")
def mark_message_read(message_id: int, db: Session = Depends(get_db)):
    """
    Đánh dấu một tin nhắn đã đọc
    """
    message = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Tin nhắn không tồn tại")
    
    message.is_read = True
    db.commit()
    
    return {"success": True}


@router.put("/mark-all-read/{user_type}/{user_id}")
def mark_all_read(user_type: str, user_id: int, db: Session = Depends(get_db)):
    """
    ADMIN: user_id = customer_id — đánh dấu đã đọc mọi tin khách gửi tới admin.
    CUSTOMER: user_id = customer_id — đánh dấu đã đọc mọi tin admin gửi cho khách.
    """
    if user_type.upper() == "ADMIN":
        # Tin từ khách: sender=CUSTOMER, receiver=ADMIN (receiver_id là account admin, không phải customer_id)
        q = db.query(ChatMessage).filter(
            ChatMessage.sender_type == "CUSTOMER",
            ChatMessage.sender_id == user_id,
            ChatMessage.receiver_type == "ADMIN",
            ChatMessage.is_read == False,
        )
    else:
        q = db.query(ChatMessage).filter(
            ChatMessage.receiver_type == user_type,
            ChatMessage.receiver_id == user_id,
            ChatMessage.is_read == False,
        )
    q.update({ChatMessage.is_read: True}, synchronize_session=False)
    db.commit()

    return {"success": True}


@router.delete("/messages/{message_id}")
def delete_message(message_id: int, db: Session = Depends(get_db)):
    """Xóa một tin nhắn (admin)."""
    row = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Tin nhắn không tồn tại")
    db.delete(row)
    db.commit()
    return {"success": True}


@router.delete("/conversation/{customer_id}")
def delete_conversation(customer_id: int, db: Session = Depends(get_db)):
    """Xóa toàn bộ tin nhắn với khách (theo customer_id trong luồng chat)."""
    db.query(ChatMessage).filter(
        or_(
            and_(ChatMessage.sender_type == "CUSTOMER", ChatMessage.sender_id == customer_id),
            and_(ChatMessage.receiver_type == "CUSTOMER", ChatMessage.receiver_id == customer_id),
        )
    ).delete(synchronize_session=False)
    conv = db.query(ChatConversation).filter(ChatConversation.customer_id == customer_id).first()
    if conv:
        db.delete(conv)
    db.commit()
    return {"success": True}


@router.post("/send")
def send_message(message: ChatMessageCreate, db: Session = Depends(get_db)):
    """
    Gửi tin nhắn qua API REST (thay vì Socket.IO)
    """
    sender_type = message.sender_type
    sender_id = message.sender_id
    receiver_type = message.receiver_type
    receiver_id = message.receiver_id
    
    # Tự động tạo conversation nếu chưa có
    conv_id = 0
    if sender_type == "CUSTOMER":
        conv = db.query(ChatConversation).filter(
            ChatConversation.customer_id == sender_id
        ).first()
        if not conv:
            conv = ChatConversation(customer_id=sender_id, admin_id=1, status="ACTIVE")
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
        else:
            conv = ChatConversation(customer_id=receiver_id, admin_id=1, status="ACTIVE")
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
        content=message.message,
        message=message.message,
        is_read=False,
    )
    
    db.add(chat_message)
    db.commit()
    db.refresh(chat_message)
    
    return {
        "success": True,
        "message": chat_message
    }


@router.get("/customer/{customer_id}/info")
def get_customer_chat_info(customer_id: int, db: Session = Depends(get_db)):
    """
    Lấy thông tin khách hàng cho phần chat
    """
    customer = _resolve_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Khách hàng không tồn tại")
    display = _customer_display_name(db, customer, customer_id)

    return {
        "customer_id": customer.id,
        "full_name": display,
        "phone_number": customer.phone_number
    }
