from sqlalchemy.orm import Session
from Backend.models.feedback import Feedback
from Backend.models.account import Account
from Backend.models.customer import Customer


# =========================
# ADMIN GET ALL (NO RELATIONSHIP)
# =========================
def get_all_feedbacks(db: Session):
    results = (
        db.query(
            Feedback.FeedbackID,
            Feedback.UserID,          # ⭐ THÊM DÒNG NÀY
            Feedback.Content,
            Feedback.CreateAt,
            Customer.full_name
        )
        .join(Account, Feedback.UserID == Account.id)
        .outerjoin(Customer, Customer.account_id == Account.id)
        .order_by(Feedback.CreateAt.desc())
        .all()
    )

    return [
        {
            "FeedbackID": r.FeedbackID,
            "UserID": r.UserID,       # ⭐ THÊM DÒNG NÀY
            "Content": r.Content,
            "CreateAt": r.CreateAt,
            "full_name": r.full_name
        }
        for r in results
    ]



# =========================
# CREATE
# =========================
def create_feedback(db: Session, user_id: int, content: str):
    feedback = Feedback(
        UserID=user_id,
        Content=content
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


# =========================
# DELETE
# =========================
def delete_feedback(db: Session, feedback_id: int):
    feedback = (
        db.query(Feedback)
        .filter(Feedback.FeedbackID == feedback_id)
        .first()
    )

    if not feedback:
        return False

    db.delete(feedback)
    db.commit()
    return True
