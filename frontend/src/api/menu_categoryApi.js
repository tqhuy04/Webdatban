// src/api/menu_categoryApi.js
import axiosClient from "./axiosClient";

const menuCategoryApi = {
  getAll() {
    return axiosClient.get("/menu-categories");
  },
  create(data) {
    return axiosClient.post("/menu-categories", data);
  },
  update(id, data) {
    return axiosClient.put(`/menu-categories/${id}`, data);
  },
  delete(id) {
    return axiosClient.delete(`/menu-categories/${id}`);
  },
};

export default menuCategoryApi;
