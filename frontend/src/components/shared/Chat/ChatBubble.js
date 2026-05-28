import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import { useChatContext } from "../../../contexts/ChatContext";
import "./ChatBubble.css";

const ChatBubble = () => {
  const { user } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);
  const [forceRenderKey, setForceRenderKey] = useState(0);

  // Lắng nghe sự kiện đăng nhập thành công
  useEffect(() => {
    const handleLoginSuccess = () => {
      setForceRenderKey((prev) => prev + 1);
    };

    window.addEventListener("loginSuccess", handleLoginSuccess);
    return () => window.removeEventListener("loginSuccess", handleLoginSuccess);
  }, []);

  // Force re-render khi user thay đổi
  useEffect(() => {
    if (user && isOpen) {
      setForceRenderKey((prev) => prev + 1);
    }
  }, [user, isOpen]);

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <Chat
          key={forceRenderKey}
          user={user}
          onClose={handleCloseChat}
        />
      )}

      {!isOpen && user && (
        <button className="chat-bubble-btn" onClick={() => setIsOpen(true)}>
          <i className="fa-solid fa-comments"></i>
          <span className="chat-bubble-tooltip">Chat với chúng tôi</span>
        </button>
      )}
    </>
  );
};

export default ChatBubble;
