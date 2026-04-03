import React, { useEffect, useState } from "react";
import userApi from "../../../api/userApi";
import { useNotify } from "../../../contexts/ToastContext";

const EditForm = ({ setisShowFormEdit, GetUsers, data, id }) => {
    const notify = useNotify();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STAFF");

    useEffect(() => {
        if (data) {
            setName(data.username || "");
            setEmail(data.email || "");
            setRole(data.role || "STAFF");
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            username: name,
            email: email,
            role: role.toUpperCase(),
        };

        if (password.trim()) {
            payload.password = password;
        }

        userApi.update(id, payload)
            .then(() => {
                notify.success("Sửa tài khoản thành công");
                GetUsers();
                setisShowFormEdit(false);
            })
            .catch(() => {
                notify.error("Lỗi sửa tài khoản");
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>
                    <i className="fa fa-user-pen"></i>
                    Sửa người dùng
                </h4>

                <form onSubmit={handleSubmit}>
                    <div className="form-group-modal">
                        <label><i className="fa fa-user"></i> Tên</label>
                        <input
                            type="text"
                            className="modal-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group-modal">
                        <label><i className="fa fa-envelope"></i> Email</label>
                        <input
                            type="email"
                            className="modal-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group-modal">
                        <label><i className="fa fa-lock"></i> Mật khẩu mới</label>
                        <input
                            type="password"
                            className="modal-input"
                            placeholder="Để trống nếu không đổi mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                        />
                        <p className="modal-hint">Để trống nếu không muốn thay đổi mật khẩu</p>
                    </div>

                    <div className="form-group-modal">
                        <label><i className="fa fa-shield-halved"></i> Vai trò</label>
                        <div className="role-selector">
                            {["STAFF", "ADMIN", "CUSTOMER"].map((r) => (
                                <div key={r} className="role-option">
                                    <input
                                        type="radio"
                                        id={`edit-role-${r}`}
                                        value={r}
                                        checked={role === r}
                                        onChange={() => setRole(r)}
                                    />
                                    <label htmlFor={`edit-role-${r}`}>
                                        {r === "STAFF" && <i className="fa fa-user-gear"></i>}
                                        {r === "ADMIN" && <i className="fa fa-shield-halved"></i>}
                                        {r === "CUSTOMER" && <i className="fa fa-user"></i>}
                                        {r}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn-modal-save">
                            <i className="fa fa-check"></i>
                            Lưu
                        </button>
                        <button
                            type="button"
                            className="btn-modal-cancel"
                            onClick={() => setisShowFormEdit(false)}
                        >
                            <i className="fa fa-xmark"></i>
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
