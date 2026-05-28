import React, { useState, useEffect, useRef } from "react";
import chatApi from "../../../api/chatApi";
import customerApi from "../../../api/customerApi";
import { formatChatTime } from "../../utils/formatChatTime";
import "./Chat.css";

const POLL_INTERVAL = 3000;

const Chat = ({ user: propUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const adminId = 1;
  const pollIntervalRef = useRef(null);

  // Load user từ API nếu propUser không có
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Thử lấy từ prop trước
        if (propUser?.id || propUser?.customerId) {
          setUserData(propUser);
          setIsLoading(false);
          return;
        }

        // Nếu không có prop, gọi API
        const response = await customerApi.getByIdUser();
        const user = response.data || response;
        
        // API trả về CustomerID (viết hoa), cần chuyển đổi
        setUserData({
          ...user,
          id: user.CustomerID || user.customerID || user.id,
          customerId: user.CustomerID || user.customerID || user.id,
          accountId: user.account_id || user.accountId,
        });
      } catch (err) {
        console.error("[Chat] Error loading user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [propUser]);

  const userId = userData?.customerId || userData?.id || propUser?.customerId || propUser?.id;

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Tải lịch sử chat
  const loadMessages = async () => {
    if (!userId) return;

    try {
      const response = await chatApi.getChatHistory(userId);
      const newMessages = response.data || response || [];
      setMessages(newMessages);
    } catch (error) {
      console.error("[Chat] Error loading messages:", error);
    }
  };

  // Khởi tạo và polling
  useEffect(() => {
    if (!userId || isLoading) return;

    loadMessages();

    pollIntervalRef.current = setInterval(() => {
      loadMessages();
    }, POLL_INTERVAL);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [userId, isLoading]);

  // Gửi tin nhắn
  const handleSendMessage = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    const messageText = newMessage.trim();
    if (!messageText) return;

    if (!userId) {
      alert("Vui lòng đăng nhập để gửi tin nhắn");
      return;
    }

    if (isSending) return;

    setIsSending(true);
    setError(null);

    try {
      await chatApi.sendMessage({
        sender_type: "CUSTOMER",
        sender_id: userId,
        receiver_type: "ADMIN",
        receiver_id: adminId,
        message: messageText,
      });

      await loadMessages();
      setNewMessage("");
      scrollToBottom();
    } catch (err) {
      console.error("[Chat] Error:", err);
      setError("Không thể gửi tin nhắn");
    } finally {
      setIsSending(false);
    }
  };

  // Toggle minimize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isLoading) {
    return (
      <div className="chat-widget">
        <div style={{ padding: "20px", textAlign: "center" }}>
          Đang tải...
        </div>
      </div>
    );
  }

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
            <span className={`chat-status ${userId ? "online" : "offline"}`}>
              {userId ? "Đang kết nối" : "Chưa đăng nhập"}
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
              <p>Hãy đặt câu hỏi để chúng tôi hỗ trợ bạn tốt nhất.</p>
            </div>

            {error && (
              <div style={{ padding: "10px", background: "#ffebee", color: "#c62828", borderRadius: "8px", margin: "10px 0" }}>
                {error}
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`chat-message ${msg.sender_type === "CUSTOMER" ? "own" : "other"}`}
              >
                <div className="message-bubble">
                  <p>{msg.message}</p>
                  <span className="message-time">
                    {msg.created_at ? formatChatTime(msg.created_at) : "Vừa xong"}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={userId ? "Nhập tin nhắn..." : "Vui lòng đăng nhập..."}
              disabled={!userId || isSending}
              onKeyPress={(e) => {
                if (e.key === "Enter" && newMessage.trim() && userId) {
                  handleSendMessage();
                }
              }}
            />
            <button
              type="button"
              className="chat-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!newMessage.trim() || !userId || isSending}
            >
              {isSending ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-solid fa-paper-plane"></i>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
