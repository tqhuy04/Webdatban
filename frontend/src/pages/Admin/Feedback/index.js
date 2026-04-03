import React, { useEffect, useState } from "react";
import feedbackApi from "../../../api/feedbackApi";
import CreateForm from "./create";
import EditForm from "./edit";

function Feedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);

    useEffect(() => {
        getFeedbacks();
    }, []);

    const getFeedbacks = async () => {
        try {
            const res = await feedbackApi.getAll();
            setFeedbacks(res.data);
        } catch (err) {
            console.error("Lỗi lấy feedback:", err);
        }
    };

    const deleteFeedback = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;

        try {
            await feedbackApi.delete(id);
            alert("Xóa thành công");
            getFeedbacks();
        } catch (err) {
            console.error("Lỗi xóa:", err);
        }
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
                <div className="d-flex justify-content-end mb-3">
                    <button
                        className="admin-btn-add"
                        onClick={() => setShowCreate(true)}
                    >
                        <i className="fa fa-plus"></i> Thêm
                    </button>
                </div>

                {/* CREATE */}
                {showCreate && (
                    <CreateForm
                        onClose={() => setShowCreate(false)}
                        refresh={getFeedbacks}
                    />
                )}

                {/* EDIT - chỉ render 1 form */}
                {editingFeedback && (
                    <EditForm
                        id={editingFeedback.FeedbackID}
                        data={editingFeedback}
                        onClose={() => setEditingFeedback(null)}
                        refresh={getFeedbacks}
                    />
                )}

                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Tên tài khoản</th>
                            <th>Nội dung</th>
                            <th>Ngày tạo</th>
                            <th width="180">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {feedbacks.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center">
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
                                <td>{fb.Content}</td>
                                <td>
                                    {new Date(fb.CreateAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <button
                                        className="admin-btn-edit"
                                        onClick={() => setEditingFeedback(fb)}
                                    >
                                        <i className="fa fa-edit"></i> Sửa
                                    </button>
                                    <button
                                        className="admin-btn-delete"
                                        onClick={() => deleteFeedback(fb.FeedbackID)}
                                    >
                                        <i className="fa fa-trash"></i> Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Feedback;
