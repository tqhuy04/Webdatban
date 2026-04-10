import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Dev: khi mở tab mới trong dev → xóa token cũ để thấy trang login (giống lần đầu chạy).
// Khi cần test đã đăng nhập trong dev: tạo file .env.development với dòng REACT_APP_KEEP_AUTH=true
if (
  process.env.NODE_ENV === 'development' &&
  process.env.REACT_APP_KEEP_AUTH !== 'true'
) {
  const SESSION_KEY = 'webdatban_dev_session';

  // Mỗi tab mới (chưa có sessionStorage) → xóa token cũ. Cùng tab reload → giữ nguyên.
  if (!sessionStorage.getItem(SESSION_KEY)) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.setItem(SESSION_KEY, '1');
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
