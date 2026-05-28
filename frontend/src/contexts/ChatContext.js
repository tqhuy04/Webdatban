import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import customerApi from "../api/customerApi";

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadCountRef = useRef(0);

  // Hàm load user — gọi lại sau khi đăng nhập thành công
  const loadUser = useCallback(async () => {
    loadCountRef.current++;
    const currentLoad = loadCountRef.current;
    
    const token = localStorage.getItem("token");
    console.log(`[ChatContext] loadUser called (#${currentLoad}), token exists:`, !!token);
    
    if (!token) {
      console.log("[ChatContext] No token, clearing user");
      setUser(null);
      setLoading(false);
      return;
    }
    
    // Chỉ set loading true nếu chưa có user (tránh flicker)
    if (!user) {
      setLoading(true);
    }
    
    try {
      console.log("[ChatContext] Fetching customer info...");
      const response = await customerApi.getByIdUser();
      const userData = response.data || response;
      
      // Chỉ update nếu đây là request gần nhất
      if (loadCountRef.current === currentLoad) {
        console.log("[ChatContext] User loaded successfully:", userData);
        console.log("[ChatContext] customerId:", userData?.id);
        
        if (!userData?.id) {
          console.warn("[ChatContext] WARNING: API response missing 'id' field!");
        }
        
        setUser({
          ...userData,
          customerId: userData.id,
          accountId: userData.account_id,
        });
      } else {
        console.log("[ChatContext] Stale request, ignoring response");
      }
    } catch (error) {
      console.error("[ChatContext] Error loading user:", error);
      // Nếu lỗi 401/403, có thể token hết hạn
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("[ChatContext] Auth error, clearing token");
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      if (loadCountRef.current === currentLoad) {
        setLoading(false);
      }
    }
  }, [user]);

  // Load user ban đầu (chỉ chạy 1 lần khi mount)
  useEffect(() => {
    console.log("[ChatContext] Initial load");
    loadUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Lắng nghe thay đổi token → load lại user (sau khi đăng nhập / đăng xuất)
  useEffect(() => {
    // Poll thường xuyên hơn (500ms)
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      
      if (token && !user && !loading) {
        // Có token nhưng chưa có user → thử load lại
        console.log("[ChatContext] Token exists but no user, loading...");
        loadUser();
      } else if (!token && user) {
        // Không có token nhưng có user → đăng xuất
        console.log("[ChatContext] Token removed, clearing user");
        setUser(null);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [user, loading, loadUser]);

  // Dispatch event khi đăng nhập thành công (để các component khác biết)
  useEffect(() => {
    const handleLogin = () => {
      console.log("[ChatContext] Login event received, reloading user...");
      setTimeout(() => loadUser(), 100); // Delay nhỏ để đảm bảo token đã được lưu
    };

    window.addEventListener("loginSuccess", handleLogin);
    return () => window.removeEventListener("loginSuccess", handleLogin);
  }, [loadUser]);

  return (
    <ChatContext.Provider value={{ user, loading, refreshUser: loadUser }}>
      {children}
    </ChatContext.Provider>
  );
};
