from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from Backend.models.otp import OTP
from Backend.models.account import Account
from Backend.services.email_service import generate_otp, send_otp_email, EMAIL_USER, EMAIL_PASSWORD
from Backend.services.auth_service import hash_password, normalize_email
from Backend.core.security import create_access_token


# =========================
# REQUEST OTP (FORGOT PASSWORD)
# =========================
def request_otp(db: Session, email: str) -> dict:
    """Gửi yêu cầu OTP cho email"""
    # Chuẩn hóa email
    email = normalize_email(email)
    print(f"[OTP] Request for email (normalized): '{email}'")
    
    # Debug: Kiểm tra email config
    print(f"[OTP] EMAIL_USER from env: '{EMAIL_USER}'")
    print(f"[OTP] EMAIL_PASSWORD set: {bool(EMAIL_PASSWORD)}")
    
    # Kiểm tra email có tồn tại không (không phân biệt hoa thường)
    user = db.query(Account).filter(
        func.lower(Account.Email) == email.lower()
    ).first()
    
    # Debug: liệt kê tất cả email trong hệ thống
    all_accounts = db.query(Account).all()
    print(f"[OTP] All accounts in DB: {[(a.Username, a.Email) for a in all_accounts]}")
    
    if not user:
        print(f"[OTP] Email not found: '{email}'")
        return {
            "success": False,
            "message": "Email không tồn tại trong hệ thống"
        }

    print(f"[OTP] User found: {user.Username}, email: {user.Email}")

    # Xóa OTP cũ của email này
    db.query(OTP).filter(
        OTP.email == email,
        OTP.type == "FORGOT_PASSWORD",
        OTP.is_used == 0
    ).delete()

    # Tạo OTP mới
    otp_code = generate_otp()
    print(f"[OTP] Generated code: {otp_code}")
    print(f"[OTP] Saving OTP with email: '{email}'")
    
    otp = OTP.create_otp(email=email, code=otp_code, expires_minutes=5)
    db.add(otp)
    db.commit()

    # Gửi email
    email_sent = send_otp_email(email, otp_code)
    print(f"[OTP] Email sent: {email_sent}")
    
    if email_sent:
        return {
            "success": True,
            "message": "Đã gửi mã OTP đến email của bạn",
            "email": email
        }
    else:
        return {
            "success": True,
            "message": "Đã tạo mã OTP (chế độ demo)",
            "email": email,
            "otp_demo": otp_code  # Hiển thị khi không gửi được email
        }


# =========================
# VERIFY OTP & RESET PASSWORD
# =========================
def verify_and_reset_password(db: Session, email: str, otp_code: str, new_password: str) -> dict:
    """Xác minh OTP và đặt lại mật khẩu"""
    # Chuẩn hóa email
    email = normalize_email(email)
    print(f"[OTP Verify] Email received: '{email}'")
    print(f"[OTP Verify] OTP code received: '{otp_code}'")
    
    # Debug: Kiểm tra tất cả OTP trong DB
    all_otps = db.query(OTP).filter(OTP.type == "FORGOT_PASSWORD").all()
    print(f"[OTP Verify] All FORGOT_PASSWORD OTPs in DB:")
    for o in all_otps:
        print(f"  - email='{o.email}', code='{o.code}', is_used={o.is_used}, valid={o.is_valid()}")
    
    # Tìm OTP hợp lệ
    otp = db.query(OTP).filter(
        OTP.email == email,
        OTP.code == otp_code,
        OTP.type == "FORGOT_PASSWORD",
        OTP.is_used == 0
    ).first()

    if not otp:
        print(f"[OTP Verify] OTP not found with exact match")
        return {
            "success": False,
            "message": "Mã OTP không hợp lệ"
        }

    # Kiểm tra OTP còn hạn không
    if not otp.is_valid():
        return {
            "success": False,
            "message": "Mã OTP đã het hạn"
        }

    # Tìm tài khoản và đổi mật khẩu
    user = db.query(Account).filter(Account.Email == email).first()
    if not user:
        return {
            "success": False,
            "message": "Tài khoản không tồn tại"
        }

    # Đặt mật khẩu mới
    user.Password = hash_password(new_password[:72])
    
    # Đánh dấu OTP đã sử dụng
    otp.is_used = 1
    
    db.commit()

    return {
        "success": True,
        "message": "Đặt lại mật khẩu thành công"
    }


# =========================
# RESEND OTP
# =========================
def resend_otp(db: Session, email: str) -> dict:
    """Gửi lại OTP"""
    return request_otp(db, email)