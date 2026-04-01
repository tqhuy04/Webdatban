from fastapi import Request, Depends
from sqlalchemy.orm import Session

from Backend.database import get_db
from Backend.schemas.banking import (
    VNPayCreatePaymentParams,
    VNPayCreatePaymentResponse,
    VNPayReturnParams,
    VNPayReturnResponse,
    VNPayIpnResponse,
)
from Backend.services.banking_service import (
    create_vnpay_payment_service,
    verify_vnpay_return_service,
    process_vnpay_ipn_service,
)
from Backend.core.dependencies import get_current_user
from Backend.models.account import Account


def create_payment_controller(
    params: VNPayCreatePaymentParams,
    request: Request,
    current_user: Account = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> VNPayCreatePaymentResponse:
    """
    Controller tạo URL thanh toán VNPay
    """
    # Lấy IP của client
    client_ip = request.client.host if request.client else "127.0.0.1"

    return create_vnpay_payment_service(params, client_ip)


def vnpay_return_controller(
    params: dict
) -> dict:
    """
    Controller xử lý return URL từ VNPay
    Trả về dict thay vì model để router có thể xử lý redirect
    """
    result = verify_vnpay_return_service(params)
    return {
        "code": result.code,
        "message": result.message,
        "data": result.data
    }


def vnpay_ipn_controller(
    params: dict
) -> VNPayIpnResponse:
    """
    Controller xử lý IPN từ VNPay
    """
    return process_vnpay_ipn_service(params)
