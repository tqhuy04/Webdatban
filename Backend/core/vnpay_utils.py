import hashlib
import hmac
import urllib.parse
from datetime import datetime, timezone, timedelta
from typing import Optional

from Backend.core.vnpay_config import VNPAY_CONFIG, BANK_CODES

# Timezone Asia/Ho_Chi_Minh (UTC+7)
VIETNAM_TZ = timezone(timedelta(hours=7))

# Dùng lowercase hex như NodeJS
def quote_vnpay(value: str) -> str:
    """Encode giống NodeJS encodeURIComponent + thay %20 -> +"""
    return urllib.parse.quote(str(value), safe='').replace('%20', '+')


class VNPay:
    def __init__(self):
        self.vnp_Url = VNPAY_CONFIG["vnp_Url"]
        self.vnp_ReturnUrl = VNPAY_CONFIG["vnp_ReturnUrl"]
        self.vnp_TmnCode = VNPAY_CONFIG["vnp_TmnCode"]
        self.vnp_HashSecret = VNPAY_CONFIG["vnp_HashSecret"]
        self.vnp_Version = VNPAY_CONFIG["vnp_Version"]
        self.vnp_Command = VNPAY_CONFIG["vnp_Command"]
        self.vnp_CurrCode = VNPAY_CONFIG["vnp_CurrCode"]
        self.vnp_Locale = VNPAY_CONFIG["vnp_Locale"]
        
        self.requestData = {}
        self.responseData = {}

    def get_payment_url(self, order_id: str, amount: float, order_desc: str,
                        order_type: str = "other",
                        bank_code: Optional[str] = None,
                        ip_addr: str = "127.0.0.1",
                        locale: Optional[str] = None,
                        # Billing info
                        bill_mobile: Optional[str] = None,
                        bill_email: Optional[str] = None,
                        bill_firstname: Optional[str] = None,
                        bill_lastname: Optional[str] = None,
                        bill_address: Optional[str] = None,
                        bill_city: Optional[str] = None,
                        bill_country: Optional[str] = None,
                        bill_state: Optional[str] = None,
                        # Invoice info
                        inv_mobile: Optional[str] = None,
                        inv_email: Optional[str] = None,
                        inv_customer: Optional[str] = None,
                        inv_address: Optional[str] = None,
                        inv_company: Optional[str] = None,
                        inv_taxcode: Optional[str] = None,
                        inv_type: Optional[str] = None,
                        ) -> dict:
        """
        Tạo URL thanh toán VNPay - theo format PHP/VNPay chuẩn
        """
        try:
            if amount <= 0:
                return {"code": "01", "message": "Số tiền không hợp lệ", "data": None}

            # Thời gian ( timezone Asia/Ho_Chi_Minh UTC+7 )
            now = datetime.now(VIETNAM_TZ)
            create_date = now.strftime('%Y%m%d%H%M%S')
            expire_date = (now + timedelta(minutes=15)).strftime('%Y%m%d%H%M%S')

            # Build request data
            self.requestData = {
                'vnp_Amount': str(int(amount * 100)),
                'vnp_Command': self.vnp_Command,
                'vnp_CreateDate': create_date,
                'vnp_CurrCode': self.vnp_CurrCode,
                'vnp_ExpireDate': expire_date,
                'vnp_IpAddr': ip_addr,
                'vnp_Locale': locale or self.vnp_Locale,
                'vnp_OrderInfo': order_desc,
                'vnp_OrderType': order_type,
                'vnp_ReturnUrl': self.vnp_ReturnUrl,
                'vnp_TmnCode': self.vnp_TmnCode,
                'vnp_TxnRef': order_id,
                'vnp_Version': self.vnp_Version,
            }

            # Optional bank code
            if bank_code:
                self.requestData['vnp_BankCode'] = bank_code

            # Billing info
            if bill_mobile:
                self.requestData['vnp_Bill_Mobile'] = bill_mobile
            if bill_email:
                self.requestData['vnp_Bill_Email'] = bill_email
            if bill_firstname:
                self.requestData['vnp_Bill_FirstName'] = bill_firstname
            if bill_lastname:
                self.requestData['vnp_Bill_LastName'] = bill_lastname
            if bill_address:
                self.requestData['vnp_Bill_Address'] = bill_address
            if bill_city:
                self.requestData['vnp_Bill_City'] = bill_city
            if bill_country:
                self.requestData['vnp_Bill_Country'] = bill_country
            if bill_state:
                self.requestData['vnp_Bill_State'] = bill_state

            # Invoice info
            if inv_mobile:
                self.requestData['vnp_Inv_Phone'] = inv_mobile
            if inv_email:
                self.requestData['vnp_Inv_Email'] = inv_email
            if inv_customer:
                self.requestData['vnp_Inv_Customer'] = inv_customer
            if inv_address:
                self.requestData['vnp_Inv_Address'] = inv_address
            if inv_company:
                self.requestData['vnp_Inv_Company'] = inv_company
            if inv_taxcode:
                self.requestData['vnp_Inv_Taxcode'] = inv_taxcode
            if inv_type:
                self.requestData['vnp_Inv_Type'] = inv_type

            # Build query string - ksort style (sort by key)
            sorted_keys = sorted(self.requestData.keys())
            hashdata = ''
            query = ''
            for i, key in enumerate(sorted_keys):
                value = self.requestData[key]
                # Encode: giống NodeJS encodeURIComponent (lowercase hex, space = +)
                encoded_key = quote_vnpay(str(key))
                encoded_val = quote_vnpay(str(value))
                if i == 0:
                    hashdata = encoded_key + '=' + encoded_val
                    query = encoded_key + '=' + encoded_val
                else:
                    hashdata += '&' + encoded_key + '=' + encoded_val
                    query += '&' + encoded_key + '=' + encoded_val

            # Tạo secure hash SHA512
            vnpSecureHash = self._hmacsha512(self.vnp_HashSecret, hashdata)

            # Thêm secure hash vào URL
            payment_url = f"{self.vnp_Url}?{query}&vnp_SecureHash={vnpSecureHash}"

            # Debug log - chi tiết từng param
            print(f"\n{'='*60}")
            print(f"[VNPay] All params for hash:")
            for k, v in self.requestData.items():
                print(f"  {k} = {v}")
            print(f"\n[VNPay] Sorted keys: {sorted_keys}")
            print(f"[VNPay] Hash Data (raw):\n{hashdata}")
            print(f"[VNPay] Query (raw):\n{query}")
            print(f"[VNPay] Hash Secret: {self.vnp_HashSecret}")
            print(f"[VNPay] Secure Hash: {vnpSecureHash}")
            print(f"[VNPay] Final URL: {payment_url[:300]}...")
            print(f"{'='*60}\n")

            return {
                "code": "00",
                "message": "success",
                "data": payment_url
            }

        except Exception as e:
            import traceback
            traceback.print_exc()
            return {"code": "99", "message": f"Lỗi tạo URL thanh toán: {str(e)}", "data": None}

    def validate_response(self, vnp_params: dict = None) -> dict:
        """
        Xác thực response từ VNPay - theo format Django/VNPay chuẩn
        """
        try:
            if vnp_params:
                self.responseData = vnp_params
            
            vnp_SecureHash = self.responseData.get('vnp_SecureHash', '')
            
            # Remove hash params
            if 'vnp_SecureHash' in self.responseData.keys():
                self.responseData.pop('vnp_SecureHash')
            if 'vnp_SecureHashType' in self.responseData.keys():
                self.responseData.pop('vnp_SecureHashType')
            
            # Build hash data - CHỈ bao gồm các params bắt đầu bằng 'vnp_'
            inputData = sorted(self.responseData.items())
            hasData = ''
            seq = 0
            for key, val in inputData:
                if str(key).startswith('vnp_'):
                    # Dùng quote_vnpay giống NodeJS
                    encoded_val = quote_vnpay(str(val))
                    if seq == 1:
                        hasData = hasData + "&" + str(key) + '=' + encoded_val
                    else:
                        seq = 1
                        hasData = str(key) + '=' + encoded_val
            
            # Tạo secure hash
            hashValue = self._hmacsha512(self.vnp_HashSecret, hasData)
            
            print(f"\n{'='*60}")
            print(f"[VNPay Validate] Hash Secret: {self.vnp_HashSecret}")
            print(f"[VNPay Validate] Hash Data:\n{hasData}")
            print(f"[VNPay Validate] Computed Hash: {hashValue}")
            print(f"[VNPay Validate] Received Hash: {vnp_SecureHash}")
            print(f"[VNPay Validate] Match: {vnp_SecureHash == hashValue}")
            print(f"{'='*60}\n")
            
            # Nếu không có SecureHash (sandbox), vẫn kiểm tra response code
            if not vnp_SecureHash:
                print(f"[VNPay Validate] Warning: No SecureHash received (sandbox mode?)")
                return {
                    "code": "00",
                    "message": "Xác thực thành công (không có chữ ký)",
                    "data": {
                        "response_code": self.responseData.get('vnp_ResponseCode'),
                        "transaction_id": self.responseData.get('vnp_TransactionNo'),
                        "order_id": self.responseData.get('vnp_TxnRef'),
                        "amount": int(self.responseData.get('vnp_Amount', 0)) / 100,
                        "bank_code": self.responseData.get('vnp_BankCode'),
                        "pay_date": self.responseData.get('vnp_PayDate'),
                        "transaction_status": self.responseData.get('vnp_TransactionStatus'),
                    }
                }
            
            if vnp_SecureHash == hashValue:
                return {
                    "code": "00",
                    "message": "Xác thực chữ ký thành công",
                    "data": {
                        "response_code": self.responseData.get('vnp_ResponseCode'),
                        "transaction_id": self.responseData.get('vnp_TransactionNo'),
                        "order_id": self.responseData.get('vnp_TxnRef'),
                        "amount": int(self.responseData.get('vnp_Amount', 0)) / 100,
                        "bank_code": self.responseData.get('vnp_BankCode'),
                        "pay_date": self.responseData.get('vnp_PayDate'),
                        "transaction_status": self.responseData.get('vnp_TransactionStatus'),
                    }
                }
            else:
                return {
                    "code": "01",
                    "message": "Chữ ký không hợp lệ",
                    "data": None
                }
                
        except Exception as e:
            import traceback
            traceback.print_exc()
            return {"code": "99", "message": f"Lỗi xác thực: {str(e)}", "data": None}

    @staticmethod
    def verify_return(vnp_Params: dict, vnp_SecureHash: str = None) -> dict:
        """Legacy method - sử dụng validate_response thay thế"""
        vnpay = VNPay()
        vnpay.responseData = vnp_Params
        return vnpay.validate_response()

    @staticmethod
    def _hmacsha512(key: str, data: str) -> str:
        """Tạo HMAC SHA512 hash"""
        byteKey = key.encode('utf-8')
        byteData = data.encode('utf-8')
        return hmac.new(byteKey, byteData, hashlib.sha512).hexdigest()

    @staticmethod
    def get_response_message(response_code: str) -> str:
        """Map response code sang message tiếng Việt"""
        messages = {
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
        return messages.get(response_code, "Lỗi không xác định")

    @staticmethod
    def get_bank_codes() -> dict:
        """Lấy danh sách mã ngân hàng"""
        return BANK_CODES
