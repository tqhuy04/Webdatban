import axiosClient from "./axiosClient";

const authUserApi = {
  // 🔐 Login
  async login(data) {
    const res = await axiosClient.post("/auth/login", data);
    return res.data; // { token, user, role... }
  },

  // 📝 Register
  async register(data) {
    const res = await axiosClient.post("/auth/register", data);
    return res.data;
  },

  // 👤 Lấy user_id từ token (JWT)
  async get_user_id() {
    const res = await axiosClient.get("/auth/get_id");
    return res.data; // { user_id }
  },

  // 🚪 Logout
  async logout() {
    const res = await axiosClient.post("/auth/logout");
    return res.data;
  },

  // 🔑 Forgot Password - Gửi yêu cầu OTP
  async forgotPassword(email) {
    console.log("[API] forgotPassword called with:", email);
    try {
      const res = await axiosClient.post("/auth/forgot-password", { email });
      console.log("[API] Response:", res.data);
      return res.data;
    } catch (err) {
      console.log("[API] Error:", err);
      // Nếu backend trả về lỗi với data, vẫn trả về để component xử lý
      if (err.response?.data) {
        return err.response.data;
      }
      throw err;
    }
  },

  // ✅ Verify OTP và đặt lại mật khẩu
  async verifyOtp(email, otpCode, newPassword) {
    const res = await axiosClient.post("/auth/verify-otp", {
      email,
      otp_code: otpCode,
      new_password: newPassword
    });
    return res.data; // { success, message }
  },

  // 📧 Gửi lại OTP
  async resendOtp(email) {
    const res = await axiosClient.post("/auth/resend-otp", { email });
    return res.data;
  },
};

export default authUserApi;
