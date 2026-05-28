import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const notificationApi = {
    // Lấy danh sách thông báo
    getAll: async (userId = 0, userType = "ADMIN", limit = 20) => {
        const response = await axios.get(`${API_URL}/api/notifications`, {
            params: { user_id: userId, user_type: userType, limit }
        });
        return response.data;
    },

    // Lấy số thông báo chưa đọc
    getUnreadCount: async (userId = 0, userType = "ADMIN") => {
        const response = await axios.get(`${API_URL}/api/notifications/unread-count`, {
            params: { user_id: userId, user_type: userType }
        });
        return response.data;
    },

    // Đánh dấu một thông báo đã đọc
    markAsRead: async (notificationId) => {
        const response = await axios.put(`${API_URL}/api/notifications/${notificationId}/read`);
        return response.data;
    },

    // Đánh dấu tất cả đã đọc
    markAllAsRead: async (userId = 0, userType = "ADMIN") => {
        const response = await axios.put(`${API_URL}/api/notifications/read-all`, {}, {
            params: { user_id: userId, user_type: userType }
        });
        return response.data;
    },

    // Xóa thông báo
    delete: async (notificationId) => {
        const response = await axios.delete(`${API_URL}/api/notifications/${notificationId}`);
        return response.data;
    }
};

export default notificationApi;
