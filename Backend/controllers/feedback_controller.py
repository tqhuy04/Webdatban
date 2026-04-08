from sqlalchemy.orm import Session
from Backend.schemas.feedback import FeedbackCreate
from Backend.services.feedback_service import (
    get_all_feedbacks,
    get_public_feedbacks,
    create_feedback,
    delete_feedback,
    update_feedback
)


def get_all(db: Session):
    return get_all_feedbacks(db)


def get_public(db: Session, skip: int = 0, limit: int = 6):
    return get_public_feedbacks(db, skip, limit)


def create(db: Session, user_id: int, data: FeedbackCreate):
    return create_feedback(db, user_id, data.Content)


def delete(db: Session, feedback_id: int):
    return delete_feedback(db, feedback_id)


def update(db: Session, feedback_id: int, content: str):
    return update_feedback(db, feedback_id, content)
