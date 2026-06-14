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
            Feedback.UserID,
            Feedback.Content,
            Feedback.Rating,
            Feedback.CreateAt,
            Feedback.AdminReply,
            Customer.full_name,
        )
        .join(Account, Feedback.UserID == Account.id)
        .outerjoin(Customer, Customer.account_id == Account.id)
        .order_by(Feedback.CreateAt.desc())
        .all()
    )

    return [
        {
            "FeedbackID": r.FeedbackID,
            "UserID": r.UserID,
            "Content": r.Content,
            "Rating": r.Rating,
            "CreateAt": r.CreateAt,
            "full_name": r.full_name,
            "AdminReply": r.AdminReply,
        }
        for r in results
    ]


# =========================
# USER GET PUBLIC FEEDBACKS
# =========================
def get_public_feedbacks(db: Session, skip: int = 0, limit: int = 6):
    total = (
        db.query(Feedback.FeedbackID)
        .join(Account, Feedback.UserID == Account.id)
        .count()
    )

    results = (
        db.query(
            Feedback.FeedbackID,
            Feedback.UserID,
            Feedback.Content,
            Feedback.Rating,
            Feedback.CreateAt,
            Feedback.AdminReply,
            Customer.full_name,
        )
        .join(Account, Feedback.UserID == Account.id)
        .outerjoin(Customer, Customer.account_id == Account.id)
        .order_by(Feedback.CreateAt.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    items = [
        {
            "FeedbackID": r.FeedbackID,
            "UserID": r.UserID,
            "Content": r.Content,
            "Rating": r.Rating,
            "CreateAt": r.CreateAt,
            "full_name": r.full_name or "Khách hàng",
            "AdminReply": r.AdminReply,
        }
        for r in results
    ]

    return {"items": items, "total": total}



# =========================
# CREATE
# =========================
def create_feedback(db: Session, user_id: int, content: str, rating: int = 5):
    feedback = Feedback(
        UserID=user_id,
        Content=content,
        Rating=rating
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


# =========================
# UPDATE
# =========================
def update_feedback(db: Session, feedback_id: int, content: str, rating: int = None):
    feedback = (
        db.query(Feedback)
        .filter(Feedback.FeedbackID == feedback_id)
        .first()
    )

    if not feedback:
        return False

    feedback.Content = content
    if rating is not None:
        feedback.Rating = rating
    db.commit()
    db.refresh(feedback)
    return True


def reply_feedback(db: Session, feedback_id: int, admin_reply: str = None):
    feedback = (
        db.query(Feedback)
        .filter(Feedback.FeedbackID == feedback_id)
        .first()
    )

    if not feedback:
        return False

    feedback.AdminReply = admin_reply
    db.commit()
    db.refresh(feedback)
    return True
