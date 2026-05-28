import axiosClient from "./axiosClient";

const notificationApi = {
    // Lấy danh sách thông báo
    getAll: async (userId = 0, userType = "ADMIN", limit = 20) => {
        const response = await axiosClient.get("/notifications", {
            params: { user_id: userId, user_type: userType, limit }
        });
        return response.data;
    },

    // Lấy số thông báo chưa đọc
    getUnreadCount: async (userId = 0, userType = "ADMIN") => {
        const response = await axiosClient.get("/notifications/unread-count", {
            params: { user_id: userId, user_type: userType }
        });
        return response.data;
    },

    // Đánh dấu một thông báo đã đọc
    markAsRead: async (notificationId) => {
        const response = await axiosClient.put(`/notifications/${notificationId}/read`);
        return response.data;
    },

    // Đánh dấu tất cả đã đọc
    markAllAsRead: async (userId = 0, userType = "ADMIN") => {
        const response = await axiosClient.put("/notifications/read-all", {}, {
            params: { user_id: userId, user_type: userType }
        });
        return response.data;
    },

    // Xóa thông báo
    delete: async (notificationId) => {
        const response = await axiosClient.delete(`/notifications/${notificationId}`);
        return response.data;
    }
};

export default notificationApi;
