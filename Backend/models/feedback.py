from sqlalchemy import Column, Integer, BigInteger, String, DateTime
from datetime import datetime
from Backend.database import Base


class Feedback(Base):
    __tablename__ = "feedbacks"

    FeedbackID = Column(Integer, primary_key=True, index=True)
    UserID = Column(BigInteger, nullable=False)
    Content = Column(String(255), nullable=False)
    CreateAt = Column(DateTime, default=datetime.utcnow)
