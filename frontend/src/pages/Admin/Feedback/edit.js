import React, { useEffect, useState } from "react";
import feedbackApi from "../../../api/feedbackApi";
import userApi from "../../../api/userApi";

const EditForm = ({ setisShowFormEdit, GetFeedbacks, data, id }) => {
    const [UserID, setUserID] = useState('');
    const [Content, setContent] = useState('');
    const [CreateAt, setCreateAt] = useState('');
    const [name, setName] = useState('');
    const [Users, setUsers] = useState([]);

    // ✅ sync props -> state
    useEffect(() => {
        if (!data) return;

        setUserID(data.UserID);
        setContent(data.Content);
        setCreateAt(data.CreateAt);
        setName(data.name);
    }, [data]);

    useEffect(() => {
        userApi.getAll()
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('có lỗi trong quá trình lấy dl: ' + error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            UserID,
            Content,
            CreateAt,
        };

        feedbackApi.update(id, payload)
            .then(() => {
                alert('bạn đã sửa thông tin phản hồi thành công');
                GetFeedbacks();
                setisShowFormEdit(false);
            })
            .catch(error => {
                console.error('có lỗi trong quá trình sửa dl: ' + error);
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Sửa dữ liệu</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nội dung đánh giá</label>
                        <input
                            type="text"
                            className="form-control"
                            value={Content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Thuộc tài khoản:</label>
                        <select
                            value={UserID}
                            onChange={(e) => setUserID(e.target.value)}
                            style={{ width: '100%', height: '30px', border: '1px solid black' }}
                        >
                            <option value={UserID} hidden>
                                {name}
                            </option>

                            {Users.map((user) =>
                                user?.customer || user.name === 'admin'
                                    ? null
                                    : (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    )
                            )}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success me-2">
                        Lưu
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setisShowFormEdit(false)}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
