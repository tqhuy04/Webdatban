import axiosClient from "./axiosClient";

const menuItemApi = {

  // =========================
  // GET ALL
  // =========================
  getAll() {
    return axiosClient.get("/menu-items/");
  },

  // =========================
  // GET BY ID
  // =========================
  getById(id) {
    return axiosClient.get(`/menu-items/${id}`);
  },

  // =========================
  // CREATE
  // =========================
  create(data) {
    const formData = new FormData();

    formData.append("CategoryID", data.CategoryID);
    formData.append("Name", data.Name);
    formData.append("Description", data.Description);
    formData.append("Price", data.Price);
    formData.append("Status", data.Status);

    if (data.img) {
      formData.append("img", data.img);
    }

    return axiosClient.post("/menu-items/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // =========================
  // UPDATE
  // =========================
  update(id, data) {
    const formData = new FormData();

    if (data.CategoryID) formData.append("CategoryID", data.CategoryID);
    if (data.Name) formData.append("Name", data.Name);
    if (data.Description) formData.append("Description", data.Description);
    if (data.Price) formData.append("Price", data.Price);
    if (data.Status) formData.append("Status", data.Status);

    if (data.img) {
      formData.append("img", data.img);
    }

    return axiosClient.put(`/menu-items/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // =========================
  // DELETE
  // =========================
  delete(id) {
    return axiosClient.delete(`/menu-items/${id}`);
  },
};

export default menuItemApi;