import React, { useEffect, useState } from "react";
import customerApi from "../../../api/customerApi";
import { useNotify } from "../../../contexts/ToastContext";

const EditForm = ({ data, onClose, reload }) => {
    const notify = useNotify();
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        if (!data) return;

        setFullName(data.full_name);
        setPhoneNumber(data.phone_number);
        setAddress(data.address);
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data?.id) {
            notify.warning("Không tìm thấy ID khách hàng");
            return;
        }

        const payload = {
            full_name: fullName,
            phone_number: phoneNumber,
            address: address
        };

        try {
            await customerApi.update(data.id, payload); // ✅ ID ĐÚNG
            notify.success("Cập nhật thành công");
            reload();   // reload bảng
            onClose();  // đóng form
        } catch (err) {
            console.error("Update error:", err.response?.data || err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Sửa khách hàng</h4>

                <form onSubmit={handleSubmit}>
                    <input
                        className="form-control mb-2"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required
                    />

                    <input
                        className="form-control mb-2"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        required
                    />

                    <input
                        className="form-control mb-3"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                    />

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

export default EditForm;
