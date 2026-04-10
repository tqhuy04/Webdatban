from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from Backend.database import Base
from sqlalchemy.orm import relationship
from datetime import datetime


def _conversation_id_for_message(sender_type: str, sender_id: int, receiver_type: str, receiver_id: int) -> int:
    """Luồng khách–admin: conversation_id = id khách hàng."""
    if sender_type == "CUSTOMER":
        return sender_id
    if receiver_type == "CUSTOMER":
        return receiver_id
    return 0


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)

    # Khóa cuộc hội thoại (theo customer_id trong luồng khách–admin)
    conversation_id = Column(Integer, nullable=False, default=0)
    
    # Người gửi (có thể là customer_id hoặc admin_account_id)
    sender_type = Column(String(20), nullable=False)  # "CUSTOMER" | "ADMIN"
    sender_id = Column(Integer, nullable=False)  # customer_id hoặc account_id của admin
    
    # Người nhận
    receiver_type = Column(String(20), nullable=False)  # "CUSTOMER" | "ADMIN"
    receiver_id = Column(Integer, nullable=False)  # customer_id hoặc account_id của admin
    
    # Nội dung tin nhắn (cả 2 cột vì DB có cả content và message)
    content = Column(Text, nullable=False, default="")
    message = Column(Text, nullable=False, default="")
    
    # Trạng thái đã đọc
    is_read = Column(Boolean, default=False)
    
    # Thời gian
    created_at = Column(DateTime, default=datetime.utcnow)

    # Các mối quan hệ
    sender_customer = relationship("Customer", foreign_keys=[sender_id], primaryjoin="and_(ChatMessage.sender_type=='CUSTOMER', ChatMessage.sender_id==Customer.id)", viewonly=True)
    sender_account = relationship("Account", foreign_keys=[sender_id], primaryjoin="and_(ChatMessage.sender_type=='ADMIN', ChatMessage.sender_id==Account.id)", viewonly=True)
