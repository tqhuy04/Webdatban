import React from 'react'

const ConfirmDialog = ({ show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="confirm-card">
                <div className="confirm-icon">
                    <i className="fa fa-trash-alt"></i>
                </div>
                <h4>Bạn chắc chắn muốn xóa?</h4>
                <p>Hành động này không thể hoàn tác. Tài khoản sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
                <div className="confirm-actions">
                    <button className="btn-modal-danger" onClick={onConfirm}>
                        <i className="fa fa-trash-alt"></i>
                        Xóa
                    </button>
                    <button className="btn-modal-cancel" onClick={onClose}>
                        <i className="fa fa-xmark"></i>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog
