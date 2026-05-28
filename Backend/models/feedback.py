from sqlalchemy import Column, Integer, BigInteger, String, DateTime
from datetime import datetime
from Backend.database import Base


class Feedback(Base):
    __tablename__ = "feedbacks"

    FeedbackID = Column(Integer, primary_key=True, index=True)
    UserID = Column(BigInteger, nullable=False)
    Content = Column(String(255), nullable=False)
    Rating = Column(Integer, default=5)  # Đánh giá 1-5 sao, mặc định 5 sao
    CreateAt = Column(DateTime, default=datetime.utcnow)
