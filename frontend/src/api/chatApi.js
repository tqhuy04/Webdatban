import axiosClient from "./axiosClient";

const chatApi = {
  getConversations: () => {
    return axiosClient.get("/chat/conversations");
  },

  getChatHistory: (customerId, params = {}) => {
    if (!customerId || customerId === 'undefined' || customerId === 'null') {
      console.error("[chatApi] getChatHistory called with invalid customerId:", customerId);
      return Promise.reject(new Error("Invalid customerId"));
    }
    return axiosClient.get(`/chat/history/${customerId}`, { params });
  },

  getUnreadCount: (userType, userId) => {
    return axiosClient.get(`/chat/unread/${userType}/${userId}`);
  },

  markRead: (messageId) => {
    return axiosClient.put(`/chat/mark-read/${messageId}`);
  },

  markAllRead: (userType, userId) => {
    return axiosClient.put(`/chat/mark-all-read/${userType}/${userId}`);
  },

  sendMessage: (data) => {
    return axiosClient.post("/chat/send", data);
  },

  getCustomerInfo: (customerId) => {
    if (!customerId || customerId === 'undefined' || customerId === 'null') {
      console.error("[chatApi] getCustomerInfo called with invalid customerId:", customerId);
      return Promise.reject(new Error("Invalid customerId"));
    }
    return axiosClient.get(`/chat/customer/${customerId}/info`);
  },

  deleteMessage: (messageId) => {
    return axiosClient.delete(`/chat/messages/${messageId}`);
  },

  deleteConversation: (customerId) => {
    if (!customerId || customerId === 'undefined' || customerId === 'null') {
      console.error("[chatApi] deleteConversation called with invalid customerId:", customerId);
      return Promise.reject(new Error("Invalid customerId"));
    }
    return axiosClient.delete(`/chat/conversation/${customerId}`);
  },
};

export default chatApi;
