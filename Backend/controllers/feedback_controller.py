from sqlalchemy.orm import Session
from Backend.schemas.feedback import FeedbackCreate
from Backend.services.feedback_service import (
    get_all_feedbacks,
    create_feedback,
    delete_feedback
)


def get_all(db: Session):
    return get_all_feedbacks(db)


def create(db: Session, user_id: int, data: FeedbackCreate):
    return create_feedback(db, user_id, data.Content)


def delete(db: Session, feedback_id: int):
    return delete_feedback(db, feedback_id)
