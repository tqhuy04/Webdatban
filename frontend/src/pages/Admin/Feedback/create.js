import React, { useEffect, useState } from "react";
import feedbackApi from "../../../api/feedbackApi";
import userApi from "../../../api/userApi";

const CreateForm = ({ onClose, refresh }) => {
    const [content, setContent] = useState("");
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert("Vui lòng chọn tài khoản");
            return;
        }

        try {
            await feedbackApi.create({
                UserID: userId,
                Content: content,
            });

            alert("Thêm đánh giá thành công");
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
                    {/* CONTENT */}
                    <div className="mb-3">
                        <label className="form-label">Nội dung đánh giá</label>
                        <input
                            type="text"
                            className="form-control"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    {/* USER */}
                    <div className="mb-3">
                        <label className="form-label">Thuộc tài khoản</label>
                        <select
                            className="form-select"
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

                    <div className="text-end">
                        <button type="submit" className="btn btn-success me-2">
                            Lưu
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
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

export default CreateForm;
