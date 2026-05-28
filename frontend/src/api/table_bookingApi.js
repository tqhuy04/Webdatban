import axiosClient from "./axiosClient";

const table_bookingApi = {
  getAll() {
    return axiosClient.get("/booking-tables");
  },

  getById(id) {
    return axiosClient.get(`/booking-tables/${id}`);
  },

  create(data) {
    return axiosClient.post("/booking-tables", data);
  },

  update(id, data) {
    return axiosClient.put(`/booking-tables/${id}`, data);
  },

  delete(id) {
    return axiosClient.delete(`/booking-tables/${id}`);
  },

  checkin(bookingId) {
    return axiosClient.put(`/booking-tables/${bookingId}/checkin`);
  },

  search(keyword) {
    return axiosClient.get(`/booking-tables/search/?keyword=${encodeURIComponent(keyword)}`);
  },
};

export default table_bookingApi;
