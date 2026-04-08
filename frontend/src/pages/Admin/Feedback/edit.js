import React, { useEffect, useState } from "react";
import feedbackApi from "../../../api/feedbackApi";
import { useNotify } from "../../../contexts/ToastContext";
import "./Feedback.css";

const EditForm = ({ id, data, onClose, refresh }) => {
    const notify = useNotify();
    const [Content, setContent] = useState('');
    const [name, setName] = useState('');

    // ✅ sync props -> state
    useEffect(() => {
        if (!data) return;

        setContent(data.Content);
        setName(data.full_name);
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            Content,
        };

        feedbackApi.update(id, payload)
            .then(() => {
                notify.success("Đã cập nhật phản hồi thành công");
                refresh();
                onClose();
            })
            .catch(error => {
                console.error('có lỗi trong quá trình sửa dl: ' + error);
                notify.error("Có lỗi khi cập nhật phản hồi");
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Sửa dữ liệu</h4>

                <form onSubmit={handleSubmit}>
                    <div className="form-group-modal">
                        <label>Nội dung đánh giá</label>
                        <textarea
                            type="text"
                            className="modal-textarea"
                            value={Content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group-modal">
                        <label>Tài khoản</label>
                        <input
                            type="text"
                            className="modal-input"
                            value={name || "Ẩn danh"}
                            disabled
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn-modal-save">
                            <i className="fa fa-check"></i> Lưu
                        </button>

                        <button
                            type="button"
                            className="btn-modal-cancel"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
