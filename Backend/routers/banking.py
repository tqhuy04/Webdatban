from fastapi import APIRouter, Body, Depends, Request, Query
from sqlalchemy.orm import Session
import urllib.parse

from Backend.database import get_db
from Backend.controllers.banking_controller import (
    create_payment_controller,
    vnpay_return_controller,
    vnpay_ipn_controller,
)
from Backend.schemas.banking import (
    VNPayCreatePaymentParams,
    VNPayCreatePaymentResponse,
    VNPayReturnResponse,
    VNPayIpnResponse,
)
from Backend.core.dependencies import get_current_user
from Backend.models.account import Account

router = APIRouter(
    tags=["Banking - VNPay"],
    prefix="/api/banking"
)


@router.post("/vnpay/create", response_model=VNPayCreatePaymentResponse)
def create_payment(
    params: VNPayCreatePaymentParams = Body(...),
    request: Request = None,
    current_user: Account = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Tạo URL thanh toán VNPay
    
    - **order_id**: Mã đơn hàng (duy nhất)
    - **amount**: Số tiền thanh toán (VND)
    - **order_desc**: Mô tả đơn hàng
    - **order_type**: Loại đơn hàng (mặc định: other)
    - **bank_code**: Mã ngân hàng (tùy chọn)
    - **locale**: Ngôn ngữ vn/en (mặc định: vn)
    """
    return create_payment_controller(params, request, current_user, db)


@router.get("/vnpay/vnpay_return")
async def vnpay_return(request: Request):
    """
    Xử lý return URL từ VNPay
    
    Endpoint này được gọi sau khi khách hàng thanh toán xong
    VNPay sẽ redirect về URL này với các tham số kết quả
    Sau khi xử lý sẽ redirect về trang Bill của frontend
    """
    from fastapi.responses import RedirectResponse
    
    # Lấy tất cả query params từ URL
    params = dict(request.query_params)
    print(f"\n[DEBUG] VNPay Return params received: {params}")
    
    # Xử lý kết quả thanh toán
    result = vnpay_return_controller(params)
    
    # Lấy response_code từ result
    response_code = result.get("code", "99")
    payment_message = urllib.parse.quote(result.get("message", ""))
    
    # Localhost
    frontend_url = "http://localhost:3000/Bill"
    # Deploy
    # frontend_url = "https://webdatbandola-phi.vercel.app/Bill"
    redirect_url = f"{frontend_url}?payment_status={response_code}&payment_message={payment_message}"

    print(f"[DEBUG] Redirecting to: {redirect_url[:200]}...")
    
    # Redirect về frontend
    return RedirectResponse(url=redirect_url, status_code=302)


@router.post("/vnpay/vnpay_ipn", response_model=VNPayIpnResponse)
def vnpay_ipn(request: Request):
    """
    Xử lý IPN (Instant Payment Notification) từ VNPay
    
    Endpoint này được VNPay gọi để thông báo kết quả thanh toán
    Dùng để cập nhật trạng thái đơn hàng trong database
    """
    # Lấy tất cả params từ request body
    params = dict(request.query_params)
    return vnpay_ipn_controller(params)


@router.get("/vnpay/bank_codes")
def get_bank_codes():
    """
    Lấy danh sách mã ngân hàng hỗ trợ
    """
    from Backend.core.vnpay_utils import VNPay
    return VNPay.get_bank_codes()


@router.get("/vnpay/response_codes")
def get_response_codes():
    """
    Lấy danh sách mã phản hồi VNPay
    """
    codes = {
        "00": "Giao dịch thành công",
        "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan đến rửa tiền), giao dịch bị khóa",
        "09": "Giao dịch không thành công do: Thẻ/Tài khoản chưa đăng ký dịch vụ",
        "10": "Giao dịch không thành công do: Thẻ/Tài khoản bị khóa",
        "11": "Giao dịch không thành công do: Đã hết hạn chờ thanh toán",
        "12": "Giao dịch không thành công do: Thẻ/Tài khoản không hợp lệ",
        "13": "Giao dịch không thành công do: Quý khách nhập sai mật khẩu thanh toán",
        "24": "Giao dịch không thành công do: Khách hàng hủy giao dịch",
        "51": "Giao dịch không thành công do: Tài khoản không đủ số dư",
        "65": "Giao dịch không thành công do: Tài khoản đã vượt quá hạn mức thanh toán",
        "75": "Ngân hàng thanh toán đang bảo trì",
        "99": "Lỗi không xác định",
    }
    return codes


@router.post("/vnpay/test_signature")
def test_signature(request: Request):
    """
    Test endpoint để debug signature - nhận params giống như VNPay return
    """
    from Backend.core.vnpay_utils import VNPay
    
    params = dict(request.query_params)
    print(f"\n[TEST] Params received: {params}")
    
    vnpay = VNPay()
    
    # Test tạo hash
    sorted_keys = sorted([k for k in params.keys() if k.startswith('vnp_') and k not in ['vnp_SecureHash', 'vnp_SecureHashType']])
    hashdata = ''
    for i, key in enumerate(sorted_keys):
        value = params.get(key, '')
        encoded_val = urllib.parse.quote(str(value))
        if i == 0:
            hashdata = key + '=' + encoded_val
        else:
            hashdata += '&' + key + '=' + encoded_val
    
    computed_hash = vnpay._hmacsha512(vnpay.vnp_HashSecret, hashdata)
    received_hash = params.get('vnp_SecureHash', '')
    
    return {
        "sorted_keys": sorted_keys,
        "hashdata": hashdata,
        "computed_hash": computed_hash,
        "received_hash": received_hash,
        "match": computed_hash == received_hash
    }
