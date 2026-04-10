import React, { createContext, useContext, useState, useEffect } from "react";

// Tạo Context
const AuthContext = createContext(null);

// Provider bao ngoài App
export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);

  // Khởi tạo từ localStorage (chạy 1 lần khi app mount)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogin(!!token);
  }, []);

  // Hàm cập nhật trạng thái đăng nhập
  const updateLoginStatus = (status) => {
    setIsLogin(status);
  };

  return (
    <AuthContext.Provider value={{ isLogin, updateLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để dùng ở bất kỳ đâu
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};