from Backend.schemas.banking import (
    VNPayCreatePaymentParams,
    VNPayCreatePaymentResponse,
    VNPayReturnParams,
    VNPayReturnResponse,
    VNPayIpnResponse,
)
from Backend.core.vnpay_utils import VNPay


def create_vnpay_payment_service(params: VNPayCreatePaymentParams, client_ip: str = "127.0.0.1") -> VNPayCreatePaymentResponse:
    """
    Tạo URL thanh toán VNPay
    """
    try:
        vnpay = VNPay()
        result = vnpay.get_payment_url(
            order_id=params.order_id,
            amount=params.amount,
            order_desc=params.order_desc,
            order_type=params.order_type or "other",
            bank_code=params.bank_code,
            ip_addr=client_ip,
            locale=params.locale,
            bill_mobile=params.bill_mobile,
            bill_email=params.bill_email,
            bill_firstname=params.bill_firstname,
            bill_lastname=params.bill_lastname,
            bill_address=params.bill_address,
            bill_city=params.bill_city,
            bill_country=params.bill_country,
            bill_state=params.bill_state,
            inv_mobile=params.inv_mobile,
            inv_email=params.inv_email,
            inv_customer=params.inv_customer,
            inv_address=params.inv_address,
            inv_company=params.inv_company,
            inv_taxcode=params.inv_taxcode,
            inv_type=params.inv_type,
        )
        return VNPayCreatePaymentResponse(
            code=result.get("code", "99"),
            message=result.get("message", "Lỗi không xác định"),
            data=result.get("data")
        )
    except Exception as e:
        return VNPayCreatePaymentResponse(
            code="99",
            message=f"Lỗi tạo thanh toán: {str(e)}",
            data=None
        )


def verify_vnpay_return_service(params: dict) -> VNPayReturnResponse:
    """
    Xác thực và xử lý response từ VNPay (Return URL)
    """
    try:
        print(f"\n[DEBUG] VNPay Return params received: {params}")

        vnpay = VNPay()
        result = vnpay.validate_response(params)

        if result.get("code") == "00" or result.get("success"):
            data = result.get("data", {})
            response_code = data.get("response_code")

            return VNPayReturnResponse(
                code="00" if response_code == "00" else "01",
                message=VNPay.get_response_message(response_code) if response_code else result.get("message", ""),
                data=data
            )
        else:
            return VNPayReturnResponse(
                code="01",
                message=result.get("message", "Xác thực thất bại"),
                data=None
            )
    except Exception as e:
        return VNPayReturnResponse(
            code="99",
            message=f"Lỗi xác thực: {str(e)}",
            data=None
        )


def process_vnpay_ipn_service(params: dict) -> VNPayIpnResponse:
    """
    Xử lý IPN (Instant Payment Notification) từ VNPay
    """
    try:
        vnpay = VNPay()
        result = vnpay.validate_response(params)

        if result.get("code") == "00" or result.get("success"):
            data = result.get("data", {})
            response_code = data.get("response_code")

            # Kiểm tra transaction status
            if response_code == "00":
                # ✅ Thanh toán thành công - cập nhật đơn hàng ở đây
                order_id = data.get("order_id")
                # TODO: Update order status in database
                # update_order_payment_status(order_id, "PAID", data)

                return VNPayIpnResponse(
                    RspCode="00",
                    Message="Confirm Success"
                )
            else:
                return VNPayIpnResponse(
                    RspCode=response_code or "99",
                    Message=VNPay.get_response_message(response_code)
                )
        else:
            return VNPayIpnResponse(
                RspCode="97",
                Message="Chữ ký không hợp lệ"
            )
    except Exception as e:
        return VNPayIpnResponse(
            RspCode="99",
            Message=f"Lỗi xử lý: {str(e)}"
        )
