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

  // ✅ TẠO CUSTOMER CHO USER HIỆN TẠI
  create(data) {
    return axiosClient.post("/customers/me", data);
  },

  // SEARCH
  search(keyword) {
    return axiosClient.get(`/customers/search/?keyword=${encodeURIComponent(keyword)}`);
  },
};

export default customerApi;
