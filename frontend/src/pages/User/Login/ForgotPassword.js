import React, { useState } from "react";
import authUser from "../../../api/authUser";
import { useNotify } from "../../../contexts/ToastContext";

const ForgotPassword = ({ onBackToLogin }) => {
    const notify = useNotify();
    
    // Step: 1 = nhập email, 2 = nhập OTP + password, 3 = thành công
    const [step, setStep] = useState(1);
    
    // Form data
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Loading
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // =========================
    // Step 1: Gửi yêu cầu OTP
    // =========================
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("[Frontend] Sending forgot password request for:", email);
            const res = await authUser.forgotPassword(email);
            console.log("[Frontend] Response:", res);
            
            // Nếu backend trả về lỗi (không phải exception)
            if (res.success === false) {
                notify.error(res.message || "Gửi yêu cầu thất bại");
                setLoading(false);
                return;
            }
            
            if (res.success) {
                setStep(2);
                startCountdown(300); // 5 phút
            }
        } catch (err) {
            console.log("[Frontend] Error:", err);
            const errorMsg = err.response?.data?.detail || err.message || "Gửi yêu cầu thất bại";
            notify.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // Step 2: Xác minh OTP và đặt lại mật khẩu
    // =========================
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            notify.error("Mật khẩu xác nhận không khớp");
            return;
        }
        
        if (newPassword.length < 6) {
            notify.error("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        setLoading(true);

        try {
            const res = await authUser.verifyOtp(email, otpCode, newPassword);
            
            if (res.success) {
                notify.success("Đặt lại mật khẩu thành công!");
                setStep(3);
            }
        } catch (err) {
            notify.error(err.response?.data?.detail || "Xác minh thất bại");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // Gửi lại OTP
    // =========================
    const handleResendOtp = async () => {
        if (countdown > 0) return;
        
        setLoading(true);
        try {
            const res = await authUser.resendOtp(email);
            if (res.success) {
                startCountdown(300);
                notify.success("Đã gửi lại mã OTP");
            }
        } catch (err) {
            notify.error("Gửi lại OTP thất bại");
        } finally {
            setLoading(false);
        }
    };

    // Countdown timer
    const startCountdown = (seconds) => {
        setCountdown(seconds);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <>
            {/* Overlay */}
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)",
                zIndex: 999,
            }} />

            <div className="forgot-password-container">
                {/* Back button */}
                <button 
                    onClick={onBackToLogin}
                    className="back-btn"
                >
                    ← Quay lại đăng nhập
                </button>

                {/* Step 1: Nhập email */}
                {step === 1 && (
                    <div className="fp-step-1">
                        <h2>Quên mật khẩu</h2>
                        <p>Nhập email của bạn để nhận mã xác nhận</p>

                        <form onSubmit={handleSendOtp}>
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            
                            <button type="submit" disabled={loading}>
                                {loading ? "Đang gửi..." : "Gửi mã xác nhận"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Nhập OTP và mật khẩu mới */}
                {step === 2 && (
                    <div className="fp-step-2">
                        <h2>Nhập mã xác nhận</h2>
                        <p>Mã OTP đã được gửi đến <b>{email}</b></p>

                        <form onSubmit={handleVerifyOtp}>
                            <input
                                type="text"
                                placeholder="Nhập mã OTP (6 số)"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                maxLength={6}
                                required
                            />

                            <input
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />

                            <input
                                type="password"
                                placeholder="Xác nhận mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            {/* Countdown */}
                            <div className="countdown-timer">
                                Mã có hiệu lực trong: <b>{formatTime(countdown)}</b>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading || otpCode.length !== 6}
                            >
                                {loading ? "Đang xác minh..." : "Đặt lại mật khẩu"}
                            </button>

                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={loading || countdown > 0}
                                className="resend-btn"
                            >
                                {countdown > 0 ? `Gửi lại sau ${formatTime(countdown)}` : "Gửi lại mã OTP"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 3: Thành công */}
                {step === 3 && (
                    <div className="fp-step-3">
                        <div className="success-icon">
                            <span>✓</span>
                        </div>
                        
                        <h2>Thành công!</h2>
                        <p>Mật khẩu của bạn đã được đặt lại thành công.</p>

                        <button onClick={onBackToLogin}>
                            Đăng nhập ngay
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ForgotPassword;