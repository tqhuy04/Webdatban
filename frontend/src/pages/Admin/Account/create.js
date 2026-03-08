import React, { useState } from "react";
import userApi from "../../../api/userApi";

const CreateForm = ({ setisShowFormCreate, GetUsers }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STAFF");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            username: name,   // 🔥 ĐỔI name → username
            email,
            password,
            role: role.toUpperCase(),
        };


        try {
            await userApi.create(data);
            alert("Thêm tài khoản thành công");
            GetUsers();
            setisShowFormCreate(false);
        } catch (err) {
            console.error(err.response?.data || err);
            alert("Thêm tài khoản thất bại");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Thêm tài khoản</h4>
                <form onSubmit={handleSubmit}>
                    <input className="form-control mb-2"
                        placeholder="Tên"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <input className="form-control mb-2"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input className="form-control mb-2"
                        placeholder="Mật khẩu"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <select
                        className="form-control mb-3"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                    >
                        <option value="STAFF">STAFF</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="CUSTOMER">CUSTOMER</option>
                    </select>

                    <button className="btn btn-success me-2">Lưu</button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setisShowFormCreate(false)}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateForm;
