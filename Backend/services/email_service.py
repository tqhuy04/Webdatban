import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import random
import string


# ======================
# EMAIL CONFIG
# ======================
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USER = os.getenv("EMAIL_USER", "tranquanghuy0413@gmail.com")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "qconmbvjuwmbsloz")
FROM_NAME = os.getenv("EMAIL_FROM_NAME", "Restaurant Booking")


def generate_otp(length: int = 6) -> str:
    """Tạo mã OTP ngẫu nhiên"""
    return ''.join(random.choices(string.digits, k=length))


def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """Gửi email"""
    print(f"[EMAIL] Attempting to send email to: {to_email}")
    print(f"[EMAIL] EMAIL_USER: '{EMAIL_USER}'")
    print(f"[EMAIL] EMAIL_PASSWORD set: {bool(EMAIL_PASSWORD)}")
    
    if not EMAIL_USER or not EMAIL_PASSWORD:
        print(f"[EMAIL] Không có cấu hình email. OTP gửi đến {to_email}: demo")
        return True  # Demo mode

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{FROM_NAME} <{EMAIL_USER}>"
        msg["To"] = to_email

        # Plain text version
        text_content = html_content.replace("<br>", "\n").replace("<b>", "").replace("</b>", "")
        part1 = MIMEText(text_content, "plain")
        msg.attach(part1)

        # HTML version
        part2 = MIMEText(html_content, "html")
        msg.attach(part2)

        # Send email
        print(f"[EMAIL] Connecting to {EMAIL_HOST}:{EMAIL_PORT}")
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        print(f"[EMAIL] Logging in as {EMAIL_USER}")
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        print(f"[EMAIL] Sending email...")
        server.sendmail(EMAIL_USER, to_email, msg.as_string())
        server.quit()

        print(f"[EMAIL] Đã gửi email đến {to_email}")
        return True

    except Exception as e:
        print(f"[EMAIL] Lỗi gửi email: {type(e).__name__}: {e}")
        return False


def send_otp_email(to_email: str, otp: str) -> bool:
    """Gửi email chứa mã OTP"""
    subject = "Mã xác nhận đặt lại mật khẩu"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f5f5f5; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">Xác nhận đặt lại mật khẩu</h2>
            <p style="color: #666; font-size: 16px;">Mã xác nhận của bạn là:</p>
            <div style="background-color: #fff; padding: 20px; text-align: center; 
                        border-radius: 5px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #FF4B2B; 
                           letter-spacing: 8px;">{otp}</span>
            </div>
            <p style="color: #888; font-size: 14px; text-align: center;">
                Mã này có hiệu lực trong <b>5 phút</b>.<br>
                Vui lòng không chia sẻ mã này với bất kỳ ai.
            </p>
        </div>
    </body>
    </html>
    """
    
    return send_email(to_email, subject, html_content)