// src/api/order_detailApi.js
import axiosClient from "./axiosClient";

const orderDetailApi = {
  // GET /api/order-details/{order_id}
  getByOrder(orderId) {
    return axiosClient.get(`/order-details/${orderId}`);
  },

  create(data) {
    return axiosClient.post("/order-details", data);
  },

  delete(id) {
    return axiosClient.delete(`/order-details/${id}`);
  },
};

export default orderDetailApi;
