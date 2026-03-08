import React, { useEffect, useState } from "react";
import userApi from "../../../api/userApi";

const EditForm = ({ setisShowFormEdit, GetUsers, data, id }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STAFF");

    useEffect(() => {
        if (data) {
            setName(data.name || "");
            setEmail(data.email || "");
            setRole(data.role || "STAFF");
        }
    }, [data]);

    const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
        Username: name,
        Email: email,
        Role: role.toUpperCase(),
    };

    if (password.trim()) {
        payload.Password = password;
    }

    userApi.update(id, payload)
        .then(() => {
            alert("Sửa tài khoản thành công");
            GetUsers();
            setisShowFormEdit(false);
        })
        .catch(err => {
            console.error(err.response?.data || err);
            alert("Lỗi sửa tài khoản");
        });
};

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Sửa người dùng</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tên</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Mật khẩu mới</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Để trống nếu không đổi mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Vai trò</label>
                        <select
                            className="form-select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="STAFF">STAFF</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="CUSTOMER">CUSTOMER</option>
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
