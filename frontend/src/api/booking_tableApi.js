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
        if (!id || id === 'undefined' || id === 'null') {
            console.error("[booking_tableApi] getById called with invalid id:", id);
            return Promise.reject(new Error("Invalid booking ID"));
        }
        return axiosClient.get(`/booking-tables/${id}`);
    },


    getAllOfCustomer() {
        return axiosClient.get("/booking-tables/customer/me");
    },

    getTablesOfBooking(bookingId) {
        return axiosClient.get(`/booking-tables/${bookingId}/tables`);
    },

    // Thêm bàn vào booking đã tồn tại
    addTablesToBooking(bookingId, tableIds) {
        return axiosClient.post(`/booking-tables/${bookingId}/tables`, {
            table_ids: tableIds
        });
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
            total_amount: data.total_amount || 0,
        });
    },

    // =====================
    // DELETE BOOKING (Admin)
    // =====================
    delete(id) {
        if (!id || id === 'undefined' || id === 'null') {
            console.error("[booking_tableApi] delete called with invalid id:", id);
            return Promise.reject(new Error("Invalid booking ID"));
        }
        return axiosClient.delete(`/booking-tables/${id}`);
    },

    // =====================
    // USER CANCEL BOOKING
    // =====================
    cancelMyBooking(id) {
        return axiosClient.delete(`/booking-tables/customer/me/${id}`);
    },

    // =====================
    // SEARCH BOOKINGS
    // =====================
    search(keyword) {
        return axiosClient.get(`/booking-tables/search/?keyword=${encodeURIComponent(keyword)}`);
    },

    // =====================
    // CHECKIN BOOKING
    // =====================
    checkin(id) {
        return axiosClient.put(`/booking-tables/${id}/checkin`);
    },

    // =====================
    // CUSTOMER SELF CHECKIN
    // =====================
    checkinMe(id) {
        return axiosClient.put(`/booking-tables/customer/me/${id}/checkin`);
    },

    // =====================
    // PAYMENT - GET DEPOSIT INFO
    // =====================
    getPaymentInfo(bookingId) {
        return axiosClient.get(`/booking-tables/${bookingId}/payment`);
    },

    // =====================
    // PAYMENT - CREATE DEPOSIT (30%)
    // =====================
    createDepositPayment(data) {
        return axiosClient.post(`/booking-tables/${data.booking_id}/deposit`);
    },

    // =====================
    // PAYMENT - CONFIRM DEPOSIT
    // =====================
    confirmDeposit(bookingId) {
        return axiosClient.put(`/booking-tables/${bookingId}/deposit/confirm`);
    },

    // =====================
    // PAYMENT - CREATE FINAL PAYMENT (70%)
    // =====================
    createFinalPayment(bookingId) {
        return axiosClient.post(`/booking-tables/${bookingId}/final-payment`);
    },

    // =====================
    // PAYMENT - CONFIRM FINAL PAYMENT
    // =====================
    confirmFinalPayment(bookingId) {
        return axiosClient.put(`/booking-tables/${bookingId}/final-payment/confirm`);
    },
};

export default booking_tableApi;
