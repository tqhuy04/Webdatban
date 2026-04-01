from pydantic import BaseModel, Field
from typing import Optional


class VNPayCreatePaymentParams(BaseModel):
    """Params tạo thanh toán VNPay"""
    order_id: str = Field(..., description="Mã đơn hàng")
    amount: float = Field(..., gt=0, description="Số tiền thanh toán (VND)")
    order_desc: str = Field(..., description="Mô tả đơn hàng")
    order_type: Optional[str] = Field(default="other", description="Loại đơn hàng")
    bank_code: Optional[str] = Field(default=None, description="Mã ngân hàng")
    locale: Optional[str] = Field(default="vn", description="Ngôn ngữ (vn/en)")
    
    # Billing info
    bill_mobile: Optional[str] = Field(default=None, description="Số điện thoại")
    bill_email: Optional[str] = Field(default=None, description="Email")
    bill_firstname: Optional[str] = Field(default=None, description="Tên")
    bill_lastname: Optional[str] = Field(default=None, description="Họ")
    bill_address: Optional[str] = Field(default=None, description="Địa chỉ")
    bill_city: Optional[str] = Field(default=None, description="Thành phố")
    bill_country: Optional[str] = Field(default=None, description="Quốc gia")
    bill_state: Optional[str] = Field(default=None, description="Bang/Tỉnh")
    
    # Invoice info
    inv_mobile: Optional[str] = Field(default=None, description="SĐT xuất hóa đơn")
    inv_email: Optional[str] = Field(default=None, description="Email xuất hóa đơn")
    inv_customer: Optional[str] = Field(default=None, description="Khách hàng xuất hóa đơn")
    inv_address: Optional[str] = Field(default=None, description="Địa chỉ xuất hóa đơn")
    inv_company: Optional[str] = Field(default=None, description="Công ty xuất hóa đơn")
    inv_taxcode: Optional[str] = Field(default=None, description="Mã số thuế")
    inv_type: Optional[str] = Field(default=None, description="Loại hóa đơn")


class VNPayCreatePaymentResponse(BaseModel):
    """Response tạo thanh toán VNPay"""
    code: str = Field(..., description="Mã phản hồi (00 = thành công)")
    message: str = Field(..., description="Thông điệp")
    data: Optional[str] = Field(default=None, description="URL thanh toán VNPay")


class VNPayReturnParams(BaseModel):
    """Params từ VNPay return (IPN)"""
    vnp_Amount: Optional[str] = None
    vnp_BankCode: Optional[str] = None
    vnp_BankTranNo: Optional[str] = None
    vnp_CardType: Optional[str] = None
    vnp_OrderInfo: Optional[str] = None
    vnp_PayDate: Optional[str] = None
    vnp_ResponseCode: Optional[str] = None
    vnp_TmnCode: Optional[str] = None
    vnp_TransactionNo: Optional[str] = None
    vnp_TransactionStatus: Optional[str] = None
    vnp_TxnRef: Optional[str] = None
    vnp_VnpSecHash: Optional[str] = None
    vnp_Vnp_TxnRef: Optional[str] = None
    vnp_Vnp_Amount: Optional[str] = None
    vnp_Vnp_CardType: Optional[str] = None
    vnp_SecureHash: Optional[str] = None
    vnp_SecureHashType: Optional[str] = None


class VNPayReturnResponse(BaseModel):
    """Response từ VNPay return (IPN)"""
    code: str = Field(..., description="Mã phản hồi (00 = thành công)")
    message: str = Field(..., description="Thông điệp")
    data: Optional[dict] = Field(default=None, description="Thông tin giao dịch")


class VNPayIpnResponse(BaseModel):
    """Response cho VNPay IPN (Instant Payment Notification)"""
    RspCode: str = Field(..., description="Mã phản hồi")
    Message: str = Field(..., description="Thông điệp")


# Giữ backward compatibility
BankingCheckParams = VNPayCreatePaymentParams
BankingCheckResponse = VNPayCreatePaymentResponse
