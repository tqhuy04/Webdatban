import React, { useState } from "react";
import Chat from "./Chat";
import "./ChatBubble.css";

const ChatBubble = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleOpenChat = () => {
    if (!user) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }
    setIsOpen(true);
  };

  if (!user) return null;

  return (
    <>
      {isOpen && <Chat user={user} onClose={() => setIsOpen(false)} />}

      {!isOpen && (
        <>
          {showLoginPrompt && (
            <div className="chat-login-prompt">
              Vui lòng đăng nhập để sử dụng chat
            </div>
          )}
          <button className="chat-bubble-btn" onClick={handleOpenChat}>
            <i className="fa-solid fa-comments"></i>
            <span className="chat-bubble-tooltip">Chat với chúng tôi</span>
          </button>
        </>
      )}
    </>
  );
};

export default ChatBubble;
