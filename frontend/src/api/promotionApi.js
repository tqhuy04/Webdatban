// src/api/promotionApi.js
import axiosClient from "./axiosClient";

const promotionApi = {
    // GET ALL PROMOTIONS
    getAll() {
        return axiosClient.get("/promotions");
    },

    // ADMIN alias
    getAllOfAdmin() {
        return axiosClient.get("/promotions");
    },

    // CREATE PROMOTION
    create(data) {
        return axiosClient.post("/promotions", {
            name: data.name,
            description: data.description,
            discount_percent: Number(data.discount_percent),
            start_date: data.start_date,
            end_date: data.end_date,
        });
    },

    // UPDATE PROMOTION
    update(id, data) {
        return axiosClient.put(`/promotions/${id}`, {
            name: data.name,
            description: data.description,
            discount_percent: Number(data.discount_percent),
            start_date: data.start_date,
            end_date: data.end_date,
        });
    },

    // DELETE PROMOTION
    delete(id) {
        return axiosClient.delete(`/promotions/${id}`);
    },
};

export default promotionApi;
