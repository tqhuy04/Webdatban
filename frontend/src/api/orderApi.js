// src/api/order.js
import axiosClient from "./axiosClient";

const orderApi = {

  getAll() {
    return axiosClient.get("/orders");
  },
  delete(orderId) {
    return axiosClient.delete(`/orders/${orderId}`);
  },
  getByBooking(bookingId) {
    return axiosClient.get(`/orders/booking/${bookingId}`);
  },

  create(data) {
    return axiosClient.post("/orders", data);
  },

  // =====================
  // SEARCH ORDERS
  // =====================
  search(keyword) {
    return axiosClient.get(`/orders/search/?keyword=${encodeURIComponent(keyword)}`);
  },
};

export default orderApi;
