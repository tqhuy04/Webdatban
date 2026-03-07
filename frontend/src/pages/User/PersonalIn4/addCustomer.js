import React, { useState, useEffect } from 'react';
import customerApi from '../../../api/customerApi';

const AddCustomer = ({ onUpdate, onClose, user_id }) => {

    const [FullName, setFullName] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Address, setAddress] = useState('');

    // ✅ DÙNG useEffect
    useEffect(() => {
        setFullName('');
        setPhoneNumber('');
        setAddress('');
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            UserID: user_id,
            FullName,
            PhoneNumber,
            Address,
        };

        customerApi.create(data)
            .then(() => {
                alert('đã thêm người đặt thành công');
                onUpdate();
                onClose();
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Thêm dữ liệu</h4>
                <form onSubmit={handleSubmit}>
                    <input value={FullName} onChange={e => setFullName(e.target.value)} />
                    <input value={PhoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                    <input value={Address} onChange={e => setAddress(e.target.value)} />
                    <button type="submit">Lưu</button>
                </form>
            </div>
        </div>
    );
};

export default AddCustomer;
