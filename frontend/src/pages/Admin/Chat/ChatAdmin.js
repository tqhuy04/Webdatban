import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import chatApi from "../../../api/chatApi";
import { formatChatDateTime } from "../../../components/utils/formatChatTime";
import "./ChatAdmin.css";

// Localhost
// const SOCKET_URL = "http://localhost:8000";
// Deploy
const SOCKET_URL = "https://webdatbann.onrender.com";

const ChatAdmin = ({ adminInfo, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const messagesEndRef = useRef(null);
  const selectedCustomerRef = useRef(null);

  useEffect(() => {
    selectedCustomerRef.current = selectedCustomer;
  }, [selectedCustomer]);

  // Kết nối Socket.IO - Dùng Polling thay vì WebSocket (Render Free không hỗ trợ WS)
  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ["polling", "websocket"],  // polling ưu tiên
      upgrade: false,  // không thử upgrade lên websocket
    });

    socketInstance.on("connect", () => {
      console.log("Admin connected to Socket.IO");
      setIsConnected(true);

      socketInstance.emit("register", {
        user_id: adminInfo?.accountId || 1,
        user_type: "ADMIN",
        account_id: adminInfo?.accountId,
      });
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("receive_message", async (data) => {
      const sel = selectedCustomerRef.current;
      if (sel && data.sender_type === "CUSTOMER" && data.sender_id === sel.customer_id) {
        setMessages((prev) => [...prev, data]);
        scrollToBottom();
        try {
          await chatApi.markAllRead("ADMIN", data.sender_id);
        } catch (e) {
          console.error(e);
        }
      }
      loadConversations();
    });

    socketInstance.on("message_sent", (payload) => {
      if (payload?.success && payload?.message) {
        const m = payload.message;
        const sel = selectedCustomerRef.current;
        if (
          sel &&
          m.sender_type === "ADMIN" &&
          m.receiver_id === sel.customer_id
        ) {
          setMessages((prev) => [...prev, m]);
          scrollToBottom();
        }
        loadConversations();
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [adminInfo]);

  // Tải danh sách cuộc trò chuyện
  const loadConversations = async () => {
    try {
      const response = await chatApi.getConversations();
      const data = response.data || response || [];
      setConversations(data);
      const total = data.reduce((sum, conv) => sum + conv.unread_count, 0);
      setUnreadTotal(total);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Đồng bộ tên hiển thị khi danh sách hội thoại được làm mới (tên lấy từ hồ sơ mới nhất)
  useEffect(() => {
    if (!selectedCustomer) return;
    const updated = conversations.find((c) => c.customer_id === selectedCustomer.customer_id);
    if (updated && updated.customer_name !== selectedCustomer.customer_name) {
      setSelectedCustomer(updated);
    }
  }, [conversations, selectedCustomer]);

  // Tải lịch sử chat khi chọn khách hàng
  useEffect(() => {
    const loadChatHistory = async () => {
      if (selectedCustomer) {
        try {
          const response = await chatApi.getChatHistory(selectedCustomer.customer_id);
          setMessages(response.data || response || []);
          scrollToBottom();

          // Đánh dấu đã đọc
          await chatApi.markAllRead("ADMIN", selectedCustomer.customer_id);
          loadConversations();
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      }
    };

    loadChatHistory();
  }, [selectedCustomer]);

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedCustomer) return;

    const messageData = {
      sender_type: "ADMIN",
      sender_id: adminInfo?.accountId || 1,
      receiver_type: "CUSTOMER",
      receiver_id: selectedCustomer.customer_id,
      message: newMessage.trim(),
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
    loadConversations();
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) return;
    if (!window.confirm("Xóa tin nhắn này?")) return;
    try {
      await chatApi.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      loadConversations();
    } catch (err) {
      console.error(err);
      alert("Không xóa được tin nhắn.");
    }
  };

  const handleDeleteConversation = async (e) => {
    e.stopPropagation();
    if (!selectedCustomer) return;
    if (!window.confirm("Xóa toàn bộ tin nhắn với khách này? Hành động không hoàn tác.")) return;
    try {
      await chatApi.deleteConversation(selectedCustomer.customer_id);
      setMessages([]);
      setSelectedCustomer(null);
      loadConversations();
    } catch (err) {
      console.error(err);
      alert("Không xóa được cuộc trò chuyện.");
    }
  };

  return (
    <div className={`chat-admin ${isMinimized ? "minimized" : ""}`}>
      {/* Header */}
      <div className="chat-admin-header" onClick={toggleMinimize}>
        <div className="chat-admin-header-left">
          <i className="fa-solid fa-comments"></i>
          <span>Quản lý Chat</span>
          {unreadTotal > 0 && (
            <span className="chat-admin-badge">{unreadTotal}</span>
          )}
        </div>
        <button className="chat-admin-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {!isMinimized && (
        <div className="chat-admin-body">
          {/* Sidebar - Danh sách cuộc trò chuyện */}
          <div className="chat-admin-sidebar">
            <div className="chat-admin-search">
              <i className="fa-solid fa-search"></i>
              <input type="text" placeholder="Tìm khách hàng..." />
            </div>
            <div className="chat-admin-conversations">
              {conversations.map((conv) => (
                <div
                  key={conv.customer_id}
                  className={`chat-admin-conversation ${
                    selectedCustomer?.customer_id === conv.customer_id ? "active" : ""
                  }`}
                  onClick={() => setSelectedCustomer(conv)}
                >
                  <div className="conversation-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="conversation-info">
                    <span className="conversation-name">{conv.customer_name}</span>
                    <span className="conversation-preview">
                      {conv.last_message?.substring(0, 30)}
                      {conv.last_message?.length > 30 ? "..." : ""}
                    </span>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="conversation-badge">{conv.unread_count}</span>
                  )}
                </div>
              ))}
              {conversations.length === 0 && (
                <div className="chat-admin-empty">
                  <p>Chưa có cuộc trò chuyện nào</p>
                </div>
              )}
            </div>
          </div>

          {/* Main - Chat với khách hàng */}
          <div className="chat-admin-main">
            {selectedCustomer ? (
              <>
                <div className="chat-admin-main-header">
                  <span>{selectedCustomer.customer_name}</span>
                  <div className="chat-admin-main-header-right">
                    <button
                      type="button"
                      className="chat-admin-icon-btn chat-admin-delete-conv"
                      title="Xóa cuộc trò chuyện"
                      onClick={handleDeleteConversation}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <span className={`status ${isConnected ? "online" : "offline"}`}>
                      {isConnected ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="chat-admin-messages">
                  {messages.map((msg, index) => {
                    const isOwn = msg.sender_type === "ADMIN";
                    return (
                      <div
                        key={msg.id || index}
                        className={`chat-admin-message ${isOwn ? "own" : "other"}`}
                      >
                        <div className="message-bubble">
                          {msg.id ? (
                            <button
                              type="button"
                              className="message-delete-btn"
                              title="Xóa tin nhắn"
                              onClick={() => handleDeleteMessage(msg.id)}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          ) : null}
                          <p>{msg.message}</p>
                          <span className="message-time">
                            {msg.created_at ? formatChatDateTime(msg.created_at) : "Vừa xong"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form className="chat-admin-input-area" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                  />
                  <button type="submit" disabled={!newMessage.trim()}>
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </form>
              </>
            ) : (
              <div className="chat-admin-no-chat">
                <i className="fa-solid fa-comments"></i>
                <p>Chọn một cuộc trò chuyện để bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAdmin;
