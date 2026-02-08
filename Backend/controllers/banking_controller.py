from Backend.schemas.banking import BankingCheckParams, BankingCheckResponse
from Backend.services.banking_service import check_banking_service

def check_banking_controller(
    params: BankingCheckParams
) -> BankingCheckResponse:
    return check_banking_service(params)
