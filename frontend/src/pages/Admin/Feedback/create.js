import React, { useEffect, useState } from "react";
import feedbackApi from "../../../api/feedbackApi";
import userApi from "../../../api/userApi";
import { useNotify } from "../../../contexts/ToastContext";
import "./Feedback.css";

const CreateForm = ({ onClose, refresh }) => {
    const notify = useNotify();
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState([]);

    // lấy danh sách user
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await userApi.getAll();
                setUsers(res.data);
            } catch (err) {
                console.error("Lỗi lấy user:", err);
            }
        };
        fetchUsers();
    }, []);

    const renderStars = (r, interactive = false, onSelect = null) => {
        return (
            <div className={`admin-star-rating ${interactive ? 'interactive' : ''}`}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= r ? 'filled' : ''} ${interactive ? 'clickable' : ''}`}
                        onClick={() => interactive && onSelect && onSelect(star)}
                    >
                        <i className={`fa ${star <= r ? 'fa-star' : 'fa-star-o'}`}></i>
                    </span>
                ))}
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            notify.warning("Vui lòng chọn tài khoản");
            return;
        }

        try {
            await feedbackApi.create({
                UserID: userId,
                Content: content,
                Rating: rating,
            });

            notify.success("Thêm đánh giá thành công");
            refresh();
            onClose();
        } catch (err) {
            console.error("Lỗi thêm feedback:", err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4 className="mb-3">Thêm đánh giá</h4>

                <form onSubmit={handleSubmit}>
                    {/* USER */}
                    <div className="form-group-modal">
                        <label><i className="fa fa-user"></i> Thuộc tài khoản</label>
                        <select
                            className="modal-select"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        >
                            <option value="">-- Chọn tài khoản --</option>

                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.full_name || u.Username}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* RATING */}
                    <div className="form-group-modal">
                        <label><i className="fa fa-star"></i> Đánh giá (sao)</label>
                        <div className="admin-rating-selector">
                            {renderStars(rating, true, setRating)}
                            <span className="admin-rating-text">{rating}/5 sao</span>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="form-group-modal">
                        <label><i className="fa fa-comment"></i> Nội dung đánh giá</label>
                        <textarea
                            type="text"
                            className="modal-textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Nhập nội dung đánh giá..."
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn-modal-save">
                            <i className="fa fa-plus"></i> Thêm đánh giá
                        </button>

                        <button
                            type="button"
                            className="btn-modal-cancel"
                            onClick={onClose}
                        >
                            <i className="fa fa-times"></i> Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateForm;
