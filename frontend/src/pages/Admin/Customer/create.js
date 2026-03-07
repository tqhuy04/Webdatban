import React, { useEffect, useState } from "react";
import customerApi from "../../../api/customerApi";
import userApi from "../../../api/userApi";

const CreateForm = ({ onClose, reload }) => {
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [accountId, setAccountId] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        userApi.getAll()
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!accountId) {
            alert("Vui lòng chọn tài khoản");
            return;
        }

        const payload = {
            full_name: fullName,
            phone_number: phoneNumber,
            address: address
        };

        try {
            await customerApi.create(accountId, payload);
            alert("Thêm khách hàng thành công");
            reload();   // ✅ OK
            onClose();  // ✅ OK
        } catch (err) {
            console.error("Create customer error:", err.response?.data || err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Thêm khách hàng</h4>

                <form onSubmit={handleSubmit}>
                    <input className="form-control mb-2"
                        placeholder="Họ tên"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required
                    />

                    <input className="form-control mb-2"
                        placeholder="Số điện thoại"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        required
                    />

                    <input className="form-control mb-2"
                        placeholder="Địa chỉ"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                    />

                    <select
                        className="form-control mb-3"
                        value={accountId ?? ""}
                        onChange={e => setAccountId(Number(e.target.value))}
                        required
                    >
                        <option value="">-- Chọn tài khoản --</option>
                        {users.map(u => (
                            <option key={u.account_id} value={u.account_id}>
                                {u.username}
                            </option>
                        ))}
                    </select>

                    <button className="btn btn-success me-2">Lưu</button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateForm;
