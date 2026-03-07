import React, { useState, useEffect } from 'react';
import userApi from '../../../api/userApi';

const EditUser = ({ setName, setEmail, user_id, data, onClose }) => {

    const [Name_edit, setName_edit] = useState('');
    const [Email_edit, setEmail_edit] = useState('');
    const [Password, setPassword] = useState(null);
    const [Password_old, setPassword_old] = useState(null);
    const [ischangePassword, setischangePassword] = useState(false);

    useEffect(() => {
        if (!data) return;
        setEmail_edit(data.email);
        setName_edit(data.name);
    }, [data]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: Name_edit,
            email: Email_edit,
        }

        if (Password !== null) {
            data.password = Password;
            data.password_old = Password_old;
        }

        userApi.update(user_id, data)
            .then(response => {
                alert('đã sửa thông tin tài khoản thành công')
                setName(response.data.name);
                setEmail(response.data.email);
                onClose();
            })
            .catch(error => {
                console.error('Có lỗi ' + error)
                alert('Mật khẩu cũ của bạn không đúng vui lòng nhập lại')
            })

    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Thêm dữ liệu</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: 'black' }}>Tên</label>
                        <input
                            type="text"
                            className="form-control"
                            value={Name_edit}
                            onChange={e => setName_edit(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: 'black' }}>Email</label>
                        <input
                            type="text"
                            className="form-control"
                            value={Email_edit}
                            onChange={e => setEmail_edit(e.target.value)}
                            required
                        />
                        <div className="mb-3">
                            <label className="form-label" style={{ color: 'black' }}>Đổi mật khẩu</label>
                            <input
                                type="checkbox"
                                onChange={() => setischangePassword(prev => !prev)}
                                required
                            />
                        </div>
                        {ischangePassword ?
                            <>
                                <div className="mb-3">
                                    <label className="form-label" style={{ color: 'black' }}>Mật khẩu cũ</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={Password_old ? Password_old : ''}
                                        onChange={e => setPassword_old(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" style={{ color: 'black' }}>Mật khẩu mới</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={Password ? Password : ''}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                            :
                            ''}


                    </div>
                    <button type="submit" className="btn btn-success me-2">Lưu</button>
                    <button type="button" className="btn btn-secondary" onClick={() => onClose()}>Hủy</button>
                </form>
            </div>
        </div>

    );
}
export default EditUser;