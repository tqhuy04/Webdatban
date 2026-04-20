import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import chatApi from "../../../api/chatApi";
import { formatChatTime } from "../../utils/formatChatTime";
import "./Chat.css";

// Localhost
// const SOCKET_URL = "http://localhost:8000";
// Deploy
const SOCKET_URL = "https://webdatbann.onrender.com";

const Chat = ({ user, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const adminId = 1; // Admin ID mặc định

  // Kết nối Socket.IO
  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setIsConnected(true);

      // Đăng ký thông tin user
      socketInstance.emit("register", {
        user_id: user?.customerId || user?.id,
        user_type: "CUSTOMER",
        account_id: user?.accountId,
      });
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    // Lắng nghe tin nhắn đến
    socketInstance.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    });

    // Xác nhận tin nhắn đã gửi
    socketInstance.on("message_sent", (data) => {
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        scrollToBottom();
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  // Tải lịch sử chat khi component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (user?.customerId) {
        try {
          const response = await chatApi.getChatHistory(user.customerId);
          setMessages(response.data || []);
          scrollToBottom();
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      }
    };

    loadChatHistory();
  }, [user]);

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Gửi tin nhắn
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      sender_type: "CUSTOMER",
      sender_id: user?.customerId || user?.id,
      receiver_type: "ADMIN",
      receiver_id: adminId,
      message: newMessage.trim(),
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  // Toggle minimize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`chat-widget ${isMinimized ? "minimized" : ""}`}>
      {/* Header */}
      <div className="chat-header" onClick={toggleMinimize}>
        <div className="chat-header-left">
          <div className="chat-avatar">
            <i className="fa-solid fa-headset"></i>
          </div>
          <div className="chat-header-info">
            <span className="chat-title">Hỗ trợ khách hàng</span>
            <span className={`chat-status ${isConnected ? "online" : "offline"}`}>
              {isConnected ? "Đang kết nối" : "Kết nối lại..."}
            </span>
          </div>
        </div>
        <button className="chat-close-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="chat-messages">
            <div className="chat-welcome">
              <div className="chat-welcome-icon">🍽️</div>
              <h4>Chào bạn!</h4>
              <p>
                Cảm ơn bạn đã ghé thăm! Hãy đặt câu hỏi để chúng tôi hỗ trợ bạn tốt nhất.
              </p>
            </div>

            {messages.map((msg, index) => {
              const isOwn = msg.sender_type === "CUSTOMER";
              return (
                <div
                  key={msg.id || index}
                  className={`chat-message ${isOwn ? "own" : "other"}`}
                >
                  <div className="message-bubble">
                    <p>{msg.message}</p>
                    <span className="message-time">
                      {msg.created_at ? formatChatTime(msg.created_at) : "Vừa xong"}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Chat;
