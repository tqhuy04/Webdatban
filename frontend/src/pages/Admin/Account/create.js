import React, { useState } from "react";
import userApi from "../../../api/userApi";
import { useNotify } from "../../../contexts/ToastContext";

const CreateForm = ({ setisShowFormCreate, GetUsers }) => {
    const notify = useNotify();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STAFF");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            username: name,
            email,
            password,
            role: role.toUpperCase(),
        };

        try {
            await userApi.create(data);
            notify.success("Thêm tài khoản thành công");
            GetUsers();
            setisShowFormCreate(false);
        } catch (err) {
            notify.error("Thêm tài khoản thất bại");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>
                    <i className="fa fa-user-plus"></i>
                    Thêm tài khoản
                </h4>

                <form onSubmit={handleSubmit}>
                    <div className="form-group-modal">
                        <label><i className="fa fa-user"></i> Tên người dùng</label>
                        <input
                            className="modal-input"
                            placeholder="Nhập tên người dùng"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group-modal">
                        <label><i className="fa fa-envelope"></i> Email</label>
                        <input
                            className="modal-input"
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group-modal">
                        <label><i className="fa fa-lock"></i> Mật khẩu</label>
                        <input
                            className="modal-input"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group-modal">
                        <label><i className="fa fa-shield-halved"></i> Vai trò</label>
                        <div className="role-selector">
                            {["STAFF", "ADMIN", "CUSTOMER"].map((r) => (
                                <div key={r} className="role-option">
                                    <input
                                        type="radio"
                                        id={`role-${r}`}
                                        value={r}
                                        checked={role === r}
                                        onChange={() => setRole(r)}
                                    />
                                    <label htmlFor={`role-${r}`}>
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
                            onClick={() => setisShowFormCreate(false)}
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

export default CreateForm;
