# VNPay Configuration
# Lấy từ VNPay Merchant Portal: https://merchant.vnpayment.vn/

VNPAY_CONFIG = {
    # URL thanh toán VNPay (sandbox hoặc production)
    "vnp_Url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    
    #  # URL nhận kết quả thanh toán (return URL)
    # "vnp_ReturnUrl": "http://localhost:8000/api/banking/vnpay/vnpay_return"
    # # URL nhận kết quả thanh toán (return URL) - Deploy
    "vnp_ReturnUrl": "https://webdatbann.onrender.com/api/banking/vnpay/vnpay_return",
    
    # Mã website của bạn trên VNPay
    "vnp_TmnCode": "3ROZIVO6",
    
    # Secret key để tạo checksum
    "vnp_HashSecret": "R9KV4IBFSOOCWGNNZSNHRILV3V2KIGMR",
    
    # Phiên bản API (2.1.0)
    "vnp_Version": "2.1.0",
    
    # Mã lệnh thanh toán (pay)
    "vnp_Command": "pay",
    
    # Mã tiền tệ (VND)
    "vnp_CurrCode": "VND",
    
    # Ngôn ngữ (vn/en)
    "vnp_Locale": "vn",
}


# Danh sách mã ngân hàng hỗ trợ
BANK_CODES = {
    "NCB": "Ngân hàng NCB",
    "VISA": "Thanh toán qua VISA",
    "MASTERCARD": "Thanh toán qua MasterCard",
    "VNBANK": "Thanh toán qua VNBANK",
    "IBFT": "Thanh toán qua IBFT",
    "VNMART": "Thanh toán qua VnMart",
    "PAYOO": "Thanh toán qua Payoo",
    "VCB": "Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)",
    "VCB_OLD": "Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank) - Old",
    "TCB": "Ngân hàng TMCP Kỹ thương (Techcombank)",
    "BIDV": "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)",
    "BIDV_OLD": "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV) - Old",
    "DAB": "Ngân hàng TMCP Đại Á (DongA Bank)",
    "ACB": "Ngân hàng TMCP Ngoại Thương Việt Nam (ACB)",
    "ACB_OLD": "Ngân hàng TMCP Ngoại Thương Việt Nam (ACB) - Old",
    "TPB": "Ngân hàng TMCP Tiên Phong (TPBank)",
    "TPB_OLD": "Ngân hàng TMCP Tiên Phong (TPBank) - Old",
    "EIB": "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam (Eximbank)",
    "EIB_OLD": "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam (Eximbank) - Old",
    "MB": "Ngân hàng TMCP Quân đội (MB Bank)",
    "MB_OLD": "Ngân hàng TMCP Quân đội (MB Bank) - Old",
    "OCB": "Ngân hàng TMCP Phương Đông (OCB)",
    "OCB_OLD": "Ngân hàng TMCP Phương Đông (OCB) - Old",
    "SCB": "Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)",
    "SCB_OLD": "Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank) - Old",
    "SHB": "Ngân hàng TMCP Sài Gòn - Hà Nội (SHB)",
    "HDB": "Ngân hàng TMCP Phát triển Nhà TPHCM (HDBank)",
    "HDB_OLD": "Ngân hàng TMCP Phát triển Nhà TPHCM (HDBank) - Old",
    "MSB": "Ngân hàng TMCP Hàng Hải (Maritime Bank)",
    "VAB": "Ngân hàng TMCP Việt Nam Thương Tín (VietBank)",
    "VPB": "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
    "VPB_OLD": "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank) - Old",
    "AGRIBANK": "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)",
    "AGB": "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)",
    "VTB": "Ngân hàng TMCP Viết Tuấn (Vietbank)",
    "PGB": "Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh (PGBank)",
    "SGB": "Ngân hàng TMCP Sài Gòn (Saigonbank)",
    "ABB": "Ngân hàng TMCP An Bình (ABB)",
    "BAC": "Ngân hàng TMCP Bắc Á (BacABank)",
    "SEAB": "Ngân hàng TMCP Đông Nam Á (SeABank)",
    "SEAB_OLD": "Ngân hàng TMCP Đông Nam Á (SeABank) - Old",
    "NAB": "Ngân hàng TMCP Nam Á (NamABank)",
    "SHINHAN": "Ngân hàng TNHH MTV Shinhan Việt Nam (Shinhan Bank)",
    "CITIBANK": "Ngân hàng TNHH MTV Citibank Việt Nam (Citibank)",
    "CITIES": "CITIES Bank",
    "UPI": "UPI",
    "VNPAYQR": "VNPAY-QR",
}


