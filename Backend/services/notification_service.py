from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from Backend.models.notification import Notification

# Timezone cho Việt Nam (UTC+7)
VIETNAM_TZ = timezone(timedelta(hours=7))


def get_vietnam_time():
    """Lấy thời gian hiện tại theo múi giờ Việt Nam"""
    return datetime.now(VIETNAM_TZ)


def emit_notification_to_admins(notification_data: dict):
    """Emit notification to all admin users via Socket.IO"""
    try:
        from Backend.main import sio
        import asyncio

        async def _emit():
            # Lấy danh sách admin SIDs
            admin_sids = [
                sid for sid, user_info in sio.manager.users.items()
                if user_info.get("user_type") == "ADMIN"
            ]
            # Emit MỘT LẦN cho tất cả admin rooms
            if admin_sids:
                for sid in admin_sids:
                    await sio.emit("new_notification", notification_data, room=sid)

        try:
            loop = asyncio.get_running_loop()
            loop.create_task(_emit())
        except RuntimeError:
            pass  # No running event loop

    except ImportError:
        pass  # Socket.IO not available yet


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notif_type: str = "info",
    reference_id: int = None,
    reference_type: str = None,
    user_type: str = "ADMIN"
):
    """Tạo một thông báo mới"""
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notif_type,
        reference_id=reference_id,
        reference_type=reference_type,
        user_type=user_type,
        is_read=False,
        created_at=get_vietnam_time()  # Dùng giờ Việt Nam
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)

    # Emit notification to admins via Socket.IO
    if user_type == "ADMIN" or user_id == 0:
        emit_notification_to_admins(notification.to_dict())

    return notification


def get_notifications(db: Session, user_id: int = 0, user_type: str = "ADMIN", limit: int = 20):
    """Lấy danh sách thông báo cho user"""
    query = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.user_type == user_type
    ).order_by(Notification.created_at.desc()).limit(limit)

    return query.all()


def get_unread_count(db: Session, user_id: int = 0, user_type: str = "ADMIN"):
    """Đếm số thông báo chưa đọc"""
    return db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.user_type == user_type,
        Notification.is_read == False
    ).count()


def mark_as_read(db: Session, notification_id: int):
    """Đánh dấu thông báo đã đọc"""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if notification:
        notification.is_read = True
        db.commit()
    return notification


def mark_all_as_read(db: Session, user_id: int = 0, user_type: str = "ADMIN"):
    """Đánh dấu tất cả thông báo là đã đọc"""
    db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.user_type == user_type,
        Notification.is_read == False
    ).update({Notification.is_read: True})
    db.commit()


def delete_notification(db: Session, notification_id: int):
    """Xóa thông báo"""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if notification:
        db.delete(notification)
        db.commit()
        return True
    return False
