import axiosClient from "./axiosClient";

const feedbackApi = {
  // user gửi feedback
  create(data) {
    return axiosClient.post("/feedbacks", data);
  },

  // user xem feedback công khai (phân trang)
  getPublic(page = 0, limit = 6) {
    return axiosClient.get("/feedbacks/public", { params: { skip: page * limit, limit } });
  },

  // admin xem feedback (🔒)
  getAll() {
    return axiosClient.get("/feedbacks");
  },

  // admin update feedback
  update(id, data) {
    return axiosClient.put(`/feedbacks/${id}`, data);
  },

  delete(id) {
    return axiosClient.delete(`/feedbacks/${id}`);
  },
};

export default feedbackApi;
