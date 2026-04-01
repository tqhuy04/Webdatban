import axiosClient from "./axiosClient";

const booking_tableApi = {
    // =====================
    // GET ALL BOOKINGS
    // =====================
    getAll() {
        return axiosClient.get("/booking-tables");
    },

    // =====================
    // GET BOOKING BY ID
    // =====================
    getById(id) {
        return axiosClient.get(`/booking-tables/${id}`);
    },


    getAllOfCustomer() {
        return axiosClient.get("/booking-tables/customer/me");
    },

    getTablesOfBooking(bookingId) {
        return axiosClient.get(`/booking-tables/${bookingId}/tables`);
    },
    getFull(bookingId) {
        return axiosClient.get(`/booking-tables/${bookingId}/full`);
    },

    create(data) {
        if (!Array.isArray(data.table_ids) || data.table_ids.length === 0) {
            throw new Error("table_ids phải là mảng và không được rỗng");
        }

        return axiosClient.post("/booking-tables", {
            customer_id: Number(data.customer_id),
            booking_time: data.booking_time,
            table_ids: data.table_ids.map(id => Number(id)),
        });
    },

    // =====================
    // DELETE BOOKING
    // =====================
    delete(id) {
        return axiosClient.delete(`/booking-tables/${id}`);
    },
};

export default booking_tableApi;
