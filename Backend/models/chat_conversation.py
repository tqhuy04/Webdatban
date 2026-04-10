from sqlalchemy import Column, Integer, String, DateTime, Text
from Backend.database import Base
from datetime import datetime


class ChatConversation(Base):
    """
    Bảng cuộc hội thoại chat giữa khách hàng và admin.
    Mỗi khách hàng có một conversation duy nhất với admin.
    """
    __tablename__ = "chat_conversations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # ID khách hàng
    customer_id = Column(Integer, nullable=True)
    
    # ID admin (mặc định = 1)
    admin_id = Column(Integer, nullable=True, default=1)
    
    # Tên khách hàng
    customer_name = Column(String(255), nullable=True)
    
    # Email khách hàng
    customer_email = Column(String(255), nullable=True)
    
    # Trạng thái: ACTIVE / CLOSED
    status = Column(String(20), default="ACTIVE")
    
    # Số tin nhắn chưa đọc
    unread_customer = Column(Integer, default=0)
    unread_admin = Column(Integer, default=0)
    
    # Thời gian
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
