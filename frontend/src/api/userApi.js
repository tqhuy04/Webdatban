import axiosClient from "./axiosClient";

const userApi = {
  getAll() {
    return axiosClient.get("/accounts");
  },

  getById(id) {
    return axiosClient.get(`/accounts/${id}`);
  },

  // Lấy thông tin tài khoản của chính mình
  getMe() {
    return axiosClient.get("/accounts/me");
  },

  create(data) {
    return axiosClient.post("/accounts", data);
  },

  update(id, data) {
    return axiosClient.put(`/accounts/${id}`, data);
  },

  delete(id) {
    return axiosClient.delete(`/accounts/${id}`);
  },
};

export default userApi;
