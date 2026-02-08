from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from Backend.database import get_db
from Backend.schemas.feedback import (
    FeedbackCreate,
    FeedbackResponse
)
from Backend.controllers.feedback_controller import (
    get_all,
    create,
    delete
)
from Backend.core.dependencies import get_current_user, admin_required

router = APIRouter(
    prefix="/api/feedbacks",
    tags=["Feedbacks"]
)


# =========================
# USER CREATE FEEDBACK
# =========================
@router.post(
    "",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED
)
def create_feedback_api(
    data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create(db, current_user.id, data)


# =========================
# ADMIN GET ALL
# =========================
@router.get("", response_model=List[FeedbackResponse])
def get_feedbacks_api(
    db: Session = Depends(get_db),
    _: dict = Depends(admin_required)
):
    return get_all(db)


# =========================
# ADMIN DELETE
# =========================
@router.delete("/{feedback_id}")
def delete_feedback_api(
    feedback_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(admin_required)
):
    success = delete(db, feedback_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )

    return {"message": "Delete feedback successfully"}
