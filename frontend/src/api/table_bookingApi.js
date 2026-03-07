import axiosClient from "./axiosClient";

const tableBookingApi = {
  getAll() {
    return axiosClient.get("/bookings");
  },

  create(data) {
    return axiosClient.post("/bookings", data);
  },

  delete(id) {
    return axiosClient.delete(`/bookings/${id}`);
  },
};

export default tableBookingApi;
