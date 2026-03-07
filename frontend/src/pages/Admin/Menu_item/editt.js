
import React, { useEffect, useState } from "react";
import userApi from "../../../api/userApi";
import customerApi from "../../../api/customerApi";

const EditForm = ({ setisShowFormEdit, GetCustomers, data, id }) => {
    const [FullName, setFullName] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Address, setAddress] = useState('');
    const [User_id, setUser_id] = useState('');
    const [Users, setUsers] = useState(null);

    useEffect(() => {
        setFullName(data.FullName);
        setPhoneNumber(data.PhoneNumber);
        setAddress(data.Address);
        setUser_id(data.UserID);
        setFullName(data.FullName);
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            FullName,
            PhoneNumber,
            Address,
            UserID: User_id,
        }
        customerApi.update(id, data)
            .then(response => {
                alert('bạn đã sua thong tin khách hàng thành công');
                GetCustomers();
                setisShowFormEdit(false);
            })
            .catch(error => {
                console.error('có lỗi trong quá trình lấy dl: ' + error);
            })
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>{"Sua du lieu"}</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Họ và Tên</label>
                        <input
                            type="text"
                            className="form-control"
                            value={FullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Số điện thoại</label>
                        <input
                            type="text"
                            className="form-control"
                            value={PhoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Địa chỉ</label>
                        <input
                            type="text"
                            className="form-control"
                            value={Address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success me-2">Lưu</button>
                    <button type="button" className="btn btn-secondary"
                        onClick={() => { setisShowFormEdit(false) }}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditForm