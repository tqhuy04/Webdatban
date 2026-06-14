import React, { useEffect, useState } from "react";
import feedbackApi from "../../../api/feedbackApi";
import ConfirmModal from "../../../components/shared/ConfirmModal";
import { useNotify } from "../../../contexts/ToastContext";
import "./Feedback.css";

function Feedback() {
    const notify = useNotify();
    const [feedbacks, setFeedbacks] = useState([]);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [replyModal, setReplyModal] = useState({ show: false, id: null, value: "" });

    useEffect(() => {
        getFeedbacks();
    }, []);

    const getFeedbacks = async () => {
        try {
            const res = await feedbackApi.getAll();
            setFeedbacks(res.data);
        } catch (err) {
            // Silently fail
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteModal({ show: true, id });
    };

    const handleConfirmDelete = async () => {
        try {
            await feedbackApi.delete(deleteModal.id);
            notify.success("Xóa thành công");
            getFeedbacks();
        } catch (err) {
            notify.error("Xóa thất bại");
        }
        setDeleteModal({ show: false, id: null });
    };

    const handleCancelDelete = () => {
        setDeleteModal({ show: false, id: null });
    };

    const handleReplyClick = (fb) => {
        setReplyModal({ show: true, id: fb.FeedbackID, value: fb.AdminReply || "" });
    };

    const handleConfirmReply = async () => {
        try {
            await feedbackApi.reply(replyModal.id, { AdminReply: replyModal.value });
            notify.success("Đã gửi phản hồi");
            getFeedbacks();
        } catch (err) {
            notify.error("Gửi phản hồi thất bại");
        }
        setReplyModal({ show: false, id: null, value: "" });
    };

    const handleCancelReply = () => {
        setReplyModal({ show: false, id: null, value: "" });
    };

    const renderStars = (rating) => {
        return (
            <div className="admin-star-display">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`star ${star <= rating ? 'filled' : ''}`}>
                        <i className={`fa ${star <= rating ? 'fa-star' : 'fa-star-o'}`}></i>
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="admin-feedback">
            <div className="admin-feedback-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-comments"></i>
                    </span>
                    Quản lý Phản Hồi
                </h2>
                <p>
                    <span className="status-dot"></span>
                    Quản lý phản hồi và đánh giá từ khách hàng
                </p>
            </div>

            <div className="admin-data-card">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Tên tài khoản</th>
                            <th>Đánh giá</th>
                            <th>Nội dung</th>
                            <th>Phản hồi</th>
                            <th>Ngày tạo</th>
                            <th width="220">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {feedbacks.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    <div className="empty-state">
                                        <i className="fa fa-comments"></i>
                                        <p>Không có dữ liệu phản hồi</p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {feedbacks.map((fb, index) => (
                            <tr key={`${fb.FeedbackID}-${index}`}>
                                <td>{fb.full_name || "Ẩn danh"}</td>
                                <td>{renderStars(fb.Rating || 5)}</td>
                                <td>{fb.Content}</td>
                                <td>{fb.AdminReply || "Chưa có phản hồi"}</td>
                                <td>
                                    {new Date(fb.CreateAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <button
                                        className="admin-btn-edit"
                                        onClick={() => handleReplyClick(fb)}
                                    >
                                        <i className="fa fa-reply"></i> Trả lời
                                    </button>
                                    <button
                                        className="admin-btn-delete"
                                        style={{ marginLeft: 8 }}
                                        onClick={() => handleDeleteClick(fb.FeedbackID)}
                                    >
                                        <i className="fa fa-trash"></i> Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                isVisible={deleteModal.show}
                title="Xác nhận xóa"
                message="Bạn có chắc muốn xóa đánh giá này không?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            {replyModal.show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Trả lời đánh giá</h4>
                        <div className="form-group-modal">
                            <label>Nội dung phản hồi</label>
                            <textarea
                                className="modal-textarea"
                                value={replyModal.value}
                                onChange={(e) => setReplyModal((prev) => ({ ...prev, value: e.target.value }))}
                                placeholder="Nhập nội dung phản hồi..."
                            />
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-modal-save" onClick={handleConfirmReply}>
                                <i className="fa fa-check"></i> Gửi phản hồi
                            </button>
                            <button type="button" className="btn-modal-cancel" onClick={handleCancelReply}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Feedback;
