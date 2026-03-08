import React, { useState, useEffect } from 'react';
import userApi from '../../../api/userApi';
import Notification from '../../../components/shared/Notification';

const EditUser = ({ setName, setEmail, user_id, data }) => {
    const [notification, setNotification] = useState({ message: '', type: 'success' });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const [nameEdit, setNameEdit] = useState('');
    const [emailEdit, setEmailEdit] = useState('');
    const [password, setPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [isChangePassword, setIsChangePassword] = useState(false);

    useEffect(() => {
        if (!data) return;
        setEmailEdit(data.email);
        setNameEdit(data.name);
    }, [data]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const updateData = {
            username: nameEdit,
            email: emailEdit,
        }

        if (isChangePassword && password) {
            updateData.password = password;
            updateData.password_old = oldPassword;
        }

        userApi.update(user_id, updateData)
            .then(response => {
                showNotification('Đã cập nhật thông tin tài khoản thành công', 'success');
                setName(response.data.username);
                setEmail(response.data.email);
            })
            .catch(error => {
                console.error('Có lỗi:', error);
                showNotification('Mật khẩu cũ của bạn không đúng, vui lòng nhập lại', 'danger');
            })
    };

    return (
        <>
            <Notification message={notification.message} type={notification.type} />
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Tên đăng nhập</label>
                <input
                    type="text"
                    className="form-input"
                    value={nameEdit}
                    onChange={e => setNameEdit(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className="form-input"
                    value={emailEdit}
                    onChange={e => setEmailEdit(e.target.value)}
                    placeholder="Nhập email"
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label d-flex align-items-center">
                    <input
                        type="checkbox"
                        className="me-2"
                        checked={isChangePassword}
                        onChange={() => setIsChangePassword(prev => !prev)}
                    />
                    Đổi mật khẩu
                </label>
            </div>
            
            {isChangePassword && (
                <>
                    <div className="form-group">
                        <label className="form-label">Mật khẩu cũ</label>
                        <input
                            type="password"
                            className="form-input"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                            placeholder="Nhập mật khẩu cũ"
                            required={isChangePassword}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Mật khẩu mới</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            required={isChangePassword}
                        />
                    </div>
                </>
            )}

            <div className="d-flex gap-2">
                <button type="submit" className="btn-save">Lưu thay đổi</button>
            </div>
        </form>
        </>
    );
}
export default EditUser;
