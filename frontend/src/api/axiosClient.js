// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để xử lý request và response
axiosClient.interceptors.request.use(config => {
  // Thêm token nếu cần
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.headers['Custom-Upload']) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

axiosClient.interceptors.response.use(
  response => response,        // ✅ trả full response
  error => Promise.reject(error)
);


export default axiosClient;
