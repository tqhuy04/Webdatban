import React, { useState } from 'react';
import customerApi from '../../../api/customerApi';

const AddCustomer = ({ onUpdate }) => {

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            full_name: fullName,
            phone_number: phoneNumber,
            address: address,
        };

        customerApi.create(data)
            .then(() => {
                alert('Đã thêm thông tin khách hàng thành công');
                onUpdate();
            })
            .catch(error => console.error(error));
    };

    return (
        <form onSubmit={handleSubmit} className="edit-section">
            <h4 className="edit-title">Thêm thông tin khách hàng</h4>
            
            <div className="form-group">
                <label className="form-label">Họ tên</label>
                <input
                    type="text"
                    className="form-input"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Nhập họ tên"
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input
                    type="tel"
                    className="form-input"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label">Địa chỉ</label>
                <input
                    type="text"
                    className="form-input"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ"
                    required
                />
            </div>

            <div className="d-flex gap-2">
                <button type="submit" className="btn-save">Lưu thông tin</button>
            </div>
        </form>
    );
};

export default AddCustomer;
