import React, { useState, useEffect } from 'react';
import customerApi from '../../../api/customerApi';
import Notification from '../../../components/shared/Notification';

const EditCustomer = ({ onUpdate, user_id, data }) => {
    const [notification, setNotification] = useState({ message: '', type: 'success' });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [customerID, setCustomerID] = useState();

    useEffect(() => {
        if (!data) return;
        setFullName(data.fullName);
        setPhoneNumber(data.phoneNumber);
        setAddress(data.address);
        setCustomerID(data.CustomerID);
    }, [data]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const updateData = {
            full_name: fullName,
            phone_number: phoneNumber,
            address: address,
        }
        customerApi.update(customerID, updateData)
            .then(response => {
                showNotification('Đã cập nhật thông tin thành công', 'success');
                onUpdate();
            })
            .catch(error => {
                console.error('Có lỗi khi cập nhật:', error);
                showNotification('Có lỗi khi cập nhật', 'danger');
            })
    };

    return (
        <>
            <Notification message={notification.message} type={notification.type} />
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn-save">Lưu thay đổi</button>
            </div>
        </form>
        </>
    );
}
export default EditCustomer;
