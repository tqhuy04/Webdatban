from Backend.schemas.banking import BankingCheckParams, BankingCheckResponse


def check_banking_service(params: BankingCheckParams) -> BankingCheckResponse:
    if not params.amount or params.amount <= 0:
        return BankingCheckResponse(
            success=False,
            message="Số tiền không hợp lệ"
        )

    return BankingCheckResponse(
        success=True,
        message="Giao dịch hợp lệ"
    )

