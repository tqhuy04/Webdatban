from fastapi import APIRouter, Body, Depends, Query
from Backend.controllers.banking_controller import check_banking_controller
from Backend.schemas.banking import BankingCheckParams, BankingCheckResponse
from Backend.core.dependencies import get_current_user

router = APIRouter(
    tags=["Banking"],
    prefix="/api/banking"
)


@router.get("/check_banking", response_model=BankingCheckResponse)
def check_banking_api(
    amount: float = Query(...),
    bank_code: str | None = None,
    content: str | None = None,
    _=Depends(get_current_user)   # 👤 user login là dùng được
):
    params = BankingCheckParams(
        amount=amount,
        bank_code=bank_code,
        content=content
    )
    return check_banking_controller(params)
@router.post("/check_banking")
def check_banking(params: BankingCheckParams = Body(...)):
    print(params)
    return {"success": True, "message": "OK"}