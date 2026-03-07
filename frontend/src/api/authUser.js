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
};

export default authUserApi;
