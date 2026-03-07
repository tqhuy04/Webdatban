import axiosClient from "./axiosClient";

const userApi = {
  getAll() {
    return axiosClient.get("/accounts");
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
