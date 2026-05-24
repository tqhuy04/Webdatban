import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isVisible, title, message, onConfirm, onCancel }) => {
    if (!isVisible) return null;

    return (
        <div className="confirm-modal-overlay" onClick={onCancel}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-modal-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#ff6b6b" strokeWidth="2" />
                        <path d="M12 7v6" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="16" r="1" fill="#ff6b6b" />
                    </svg>
                </div>
                <h3 className="confirm-modal-title">{title}</h3>
                <p className="confirm-modal-message">{message}</p>
                <div className="confirm-modal-actions">
                    <button className="confirm-btn cancel" onClick={onCancel}>
                        Hủy
                    </button>
                    <button className="confirm-btn confirm" onClick={onConfirm}>
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
