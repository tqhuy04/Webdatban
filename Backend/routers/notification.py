from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from Backend.database import get_db
from Backend.services.notification_service import (
    get_notifications,
    get_unread_count,
    mark_as_read,
    mark_all_as_read,
    delete_notification
)
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


def convert_to_vietnam_time(dt):
    """Chuyển datetime sang giờ Việt Nam (UTC+7)"""
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone(timedelta(hours=7)))


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    user_type: str
    title: str
    message: str
    type: str
    reference_id: Optional[int]
    reference_type: Optional[str]
    is_read: bool
    created_at: Optional[str]

    class Config:
        from_attributes = True


@router.get("", response_model=List[NotificationResponse])
def get_all_notifications(
    user_id: int = 0,
    user_type: str = "ADMIN",
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Lấy danh sách thông báo của admin hoặc user"""
    notifications = get_notifications(db, user_id, user_type, limit)
    result = []
    for n in notifications:
        # Chuyển created_at sang giờ Việt Nam
        created_at_vn = convert_to_vietnam_time(n.created_at)
        result.append(NotificationResponse(
            id=n.id,
            user_id=n.user_id,
            user_type=n.user_type,
            title=n.title,
            message=n.message,
            type=n.type,
            reference_id=n.reference_id,
            reference_type=n.reference_type,
            is_read=n.is_read,
            created_at=created_at_vn.isoformat() if created_at_vn else None
        ))
    return result


@router.get("/unread-count")
def get_notification_count(
    user_id: int = 0,
    user_type: str = "ADMIN",
    db: Session = Depends(get_db)
):
    """Lấy số thông báo chưa đọc"""
    count = get_unread_count(db, user_id, user_type)
    return {"count": count}


@router.put("/{notification_id}/read")
def read_notification(
    notification_id: int,
    db: Session = Depends(get_db)
):
    """Đánh dấu thông báo đã đọc"""
    notification = mark_as_read(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"success": True}


@router.put("/read-all")
def read_all_notifications(
    user_id: int = 0,
    user_type: str = "ADMIN",
    db: Session = Depends(get_db)
):
    """Đánh dấu tất cả thông báo đã đọc"""
    mark_all_as_read(db, user_id, user_type)
    return {"success": True}


@router.delete("/{notification_id}")
def delete_notif(
    notification_id: int,
    db: Session = Depends(get_db)
):
    """Xóa thông báo"""
    success = delete_notification(db, notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"success": True}
