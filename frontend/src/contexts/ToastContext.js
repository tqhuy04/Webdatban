import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import "../components/shared/Toast/Toast.css";

const ToastContext = createContext(null);

let toastIdSeq = 0;

const variantConfig = {
  success: {
    cls: "toast-success",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  danger: {
    cls: "toast-error",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  warning: {
    cls: "toast-warning",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L14.5 13.5H1.5L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 6.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11" r="0.75" fill="currentColor" />
      </svg>
    ),
  },
  info: {
    cls: "toast-info",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7.5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="5.5" r="0.75" fill="currentColor" />
      </svg>
    ),
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, exiting: true } : t
      )
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  }, []);

  const pushToast = useCallback(
    (message, variant) => {
      const id = ++toastIdSeq;
      setToasts((prev) => [...prev, { id, message, variant, exiting: false }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      success: (msg) => pushToast(msg, "success"),
      error: (msg) => pushToast(msg, "danger"),
      warning: (msg) => pushToast(msg, "warning"),
      info: (msg) => pushToast(msg, "info"),
    }),
    [pushToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container-custom" aria-live="polite">
        {toasts.map((t) => {
          const cfg = variantConfig[t.variant] || variantConfig.info;
          return (
            <div
              key={t.id}
              className={`toast-item ${cfg.cls} ${t.exiting ? "toast-exit" : ""}`}
              role="status"
            >
              <div className="toast-icon">{cfg.icon}</div>
              <div className="toast-message">{t.message}</div>
              <button
                type="button"
                className="toast-close"
                aria-label="Đóng"
                onClick={() => removeToast(t.id)}
              >
                ✕
              </button>
              <div className="toast-progress" />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useNotify phải dùng bên trong ToastProvider");
  }
  return ctx;
}
