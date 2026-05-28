import React, { useEffect, useState } from "react";
import feedbackApi from "../../../api/feedbackApi";
import { useNotify } from "../../../contexts/ToastContext";
import "./Feedback.css";

const EditForm = ({ id, data, onClose, refresh }) => {
    const notify = useNotify();
    const [Content, setContent] = useState('');
    const [Rating, setRating] = useState(5);
    const [name, setName] = useState('');

    // ✅ sync props -> state
    useEffect(() => {
        if (!data) return;

        setContent(data.Content);
        setRating(data.Rating || 5);
        setName(data.full_name);
    }, [data]);

    const renderStars = (rating, interactive = false, onSelect = null, onHover = null, onLeave = null) => {
        return (
            <div className={`admin-star-rating ${interactive ? 'interactive' : ''}`}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'clickable' : ''}`}
                        onClick={() => interactive && onSelect && onSelect(star)}
                        onMouseEnter={() => interactive && onHover && onHover(star)}
                        onMouseLeave={() => interactive && onLeave && onLeave()}
                    >
                        <i className={`fa ${star <= rating ? 'fa-star' : 'fa-star-o'}`}></i>
                    </span>
                ))}
            </div>
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            Content,
            Rating,
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
                        <label>Tài khoản</label>
                        <input
                            type="text"
                            className="modal-input"
                            value={name || "Ẩn danh"}
                            disabled
                        />
                    </div>

                    <div className="form-group-modal">
                        <label>Đánh giá (sao)</label>
                        <div className="admin-rating-selector">
                            {renderStars(Rating, true, setRating, null, null)}
                            <span className="admin-rating-text">{Rating}/5 sao</span>
                        </div>
                    </div>

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
