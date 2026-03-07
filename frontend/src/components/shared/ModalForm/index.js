import React from 'react'

const ModalForm = ({ show, onClose, onSave, formData, setFormData, isEdit }) => {
    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>{isEdit ? "Sửa dữ liệu" : "Thêm dữ liệu"}</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tên</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Số điện thoại</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success me-2">Lưu</button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
                </form>
            </div>
        </div>
    );
};

export default ModalForm