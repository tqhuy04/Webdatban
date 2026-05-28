// src/api/customerApi.js
import axiosClient from "./axiosClient";

const customerApi = {
  getAll() {
    return axiosClient.get("/customers");
  },

  getById(id) {
    if (!id || id === 'undefined' || id === 'null') {
      console.error("[customerApi] getById called with invalid id:", id);
      return Promise.reject(new Error("Invalid customer ID"));
    }
    return axiosClient.get(`/customers/${id}`);
  },

  // ✅ LẤY CUSTOMER THEO TOKEN
  getByIdUser() {
    return axiosClient.get("/customers/me");
  },

  update(id, data) {
    if (!id || id === 'undefined' || id === 'null') {
      console.error("[customerApi] update called with invalid id:", id);
      return Promise.reject(new Error("Invalid customer ID"));
    }
    return axiosClient.put(`/customers/${id}`, data);
  },

  delete(id) {
    if (!id || id === 'undefined' || id === 'null') {
      console.error("[customerApi] delete called with invalid id:", id);
      return Promise.reject(new Error("Invalid customer ID"));
    }
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
