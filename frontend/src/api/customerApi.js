// src/api/customerApi.js
import axiosClient from "./axiosClient";

const customerApi = {
  getAll() {
    return axiosClient.get("/customers");
  },

  getById(id) {
    return axiosClient.get(`/customers/${id}`);
  },

  // ✅ LẤY CUSTOMER THEO TOKEN
  getByIdUser() {
    return axiosClient.get("/customers/me");
  },

  update(id, data) {
    return axiosClient.put(`/customers/${id}`, data);
  },

  delete(id) {
    return axiosClient.delete(`/customers/${id}`);
  },

  create(account_id, data) {
    return axiosClient.post(`/customers?account_id=${account_id}`, data);
  },
};

export default customerApi;
