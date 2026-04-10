import React, { useState } from "react";
import ChatAdmin from "./ChatAdmin";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(true);
  const adminInfo = {
    accountId: 1,
  };

  if (!isOpen) {
    return (
      <button
        className="chat-admin-toggle"
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
          zIndex: 9998,
        }}
      >
        <i
          className="fa-solid fa-comments"
          style={{ fontSize: "24px", color: "white" }}
        ></i>
      </button>
    );
  }

  return <ChatAdmin adminInfo={adminInfo} onClose={() => setIsOpen(false)} />;
};

export default Chat;
