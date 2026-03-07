import axiosClient from "./axiosClient";

const feedbackApi = {
  // user gửi feedback
  create(data) {
    return axiosClient.post("/feedbacks", data);
  },

  // admin xem feedback (🔒)
  getAll() {
    return axiosClient.get("/feedbacks");
  },

  delete(id) {
    return axiosClient.delete(`/feedbacks/${id}`);
  },
};

export default feedbackApi;
