// src/api/tableApi.js
import axiosClient from "./axiosClient";

const tableApi = {
    /**
     * GET ALL TABLES
     */
    getAll() {
        return axiosClient.get("/tables/");
    },

    /**
     * CREATE TABLE (ADMIN)
     */
    create(data) {
        return axiosClient.post("/tables/", {
            TableNumber: String(data.TableNumber),
            Capacity: Number(data.Capacity),
            Status: Number(data.Status), // 0 | 1
        });
    },

    /**
     * UPDATE TABLE (ADMIN)
     */
    update(id, data) {
        return axiosClient.put(`/tables/${id}`, {
            TableNumber: String(data.TableNumber),
            Capacity: Number(data.Capacity),
            Status: Number(data.Status),
        });
    },

    /**
     * DELETE TABLE (ADMIN)
     */
    delete(id) {
        return axiosClient.delete(`/tables/${id}`);
    },

    /**
     * CHECK AVAILABLE TABLES
     */
    checkAvailable(data) {
        return axiosClient.post("/tables/available", {
            date: String(data.date),
            time: String(data.time),
            people: Number(data.people),
        });
    },
};

export default tableApi;
