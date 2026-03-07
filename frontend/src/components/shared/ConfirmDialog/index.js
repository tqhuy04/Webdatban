import React from 'react'

const ConfirmDialog = ({ show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Bạn chắc chắn muốn xóa?</h4>
                <div className='d-flex'>
                    <button className="btn btn-danger me-2" onClick={onConfirm}>Xóa</button>
                    <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmDialog