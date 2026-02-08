from pydantic import BaseModel
from typing import Optional


class BankingCheckParams(BaseModel):
    amount: Optional[float] = None
    bank_code: Optional[str] = None
    content: Optional[str] = None


class BankingCheckResponse(BaseModel):
    success: bool
    message: str
