from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from Backend.database import Base
from sqlalchemy.orm import relationship
from datetime import datetime


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)  # ID của user nhận thông báo (0 = tất cả admin)
    user_type = Column(String(20), default="ADMIN")  # ADMIN, CUSTOMER
    title = Column(String(255), nullable=False)
    message = Column(String(500), nullable=False)
    type = Column(String(50), default="info")  # info, order, booking, warning, success
    reference_id = Column(Integer, nullable=True)  # ID của đối tượng liên quan (OrderID, BookingID)
    reference_type = Column(String(50), nullable=True)  # order, booking, feedback
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_type": self.user_type,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "reference_id": self.reference_id,
            "reference_type": self.reference_type,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
