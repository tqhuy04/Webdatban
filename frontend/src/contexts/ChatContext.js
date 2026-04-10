import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import customerApi from "../api/customerApi";

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm load user — gọi lại sau khi đăng nhập thành công
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await customerApi.getByIdUser();
      const userData = response.data || response;
      setUser({
        ...userData,
        customerId: userData.id,
        accountId: userData.account_id,
      });
    } catch (error) {
      console.error("Error loading user for chat:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user ban đầu
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Lắng nghe thay đổi token → load lại user (sau khi đăng nhập / đăng xuất)
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && !user) {
        loadUser();
      } else if (!token && user) {
        setUser(null);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [user, loadUser]);

  return (
    <ChatContext.Provider value={{ user, loading, refreshUser: loadUser }}>
      {children}
    </ChatContext.Provider>
  );
};
