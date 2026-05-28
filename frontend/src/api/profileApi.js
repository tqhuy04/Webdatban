import axiosClient from "./axiosClient";

const profileApi = {
  getMe() {
    return axiosClient.get("/accounts/me");
  },

  updateMe(data) {
    return axiosClient.put("/accounts/me", data);
  },
};

export default profileApi;
