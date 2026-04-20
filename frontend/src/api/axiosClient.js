// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  // Localhost
  // baseURL: "http://localhost:8000/api",
  // Deploy
  baseURL: "https://webdatbann.onrender.com/api",
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
  response => {
    return response;
  },
  error => {
    const status = error.response?.status;
    const message = error.response?.data?.detail || error.message;
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
    const path = error.config?.url || 'unknown';

    console.error(`[API] ${method} ${path} - ${status}: ${message}`);
    return Promise.reject(error);
  }
);


export default axiosClient;
