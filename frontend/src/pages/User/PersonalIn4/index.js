import React, { useState, useEffect } from 'react';
import userApi from "../../../api/userApi";
import customerApi from "../../../api/customerApi";
import authUser from '../../../api/authUser';
import AddCustomer from './addCustomer';
import EditCustomer from './editCustomer';
import EditUser from './editUser';

function PersonalIn4() {
    const [selectedTab, setSelectedTab] = useState("info1");

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const [user_id, setUser_id] = useState(null);
    const [CustomerID, setCustomerID] = useState(null);

    const [isFormVisibleAdd, setIsFormVisibleAdd] = useState(false);
    const [isFormVisibleEdit, setIsFormVisibleEdit] = useState(false);
    const [isFormVisibleUser, setIsFormVisibleUser] = useState(false);

    // ===== MODAL HANDLER =====
    const handleAddClick = () => setIsFormVisibleAdd(true);
    const handleEditClick = () => setIsFormVisibleEdit(true);
    const handleUserClick = () => setIsFormVisibleUser(true);

    // ===== GET USER ID =====
    useEffect(() => {
        authUser.get_user_id()
            .then(res => setUser_id(res.data.user_id))
            .catch(() => console.error("Lỗi lấy user_id"));
    }, []);

    useEffect(() => {
        if (!user_id) return;

        userApi.getById(user_id).then(res => {
            setName(res.data.name);
            setEmail(res.data.email);
        });

        customerApi.getByIdUser()
            .then(res => {
                setFullName(res.data.full_name);
                setPhoneNumber(res.data.phone_number);
                setAddress(res.data.address);
                setCustomerID(res.data.id);
            })
            .catch(() => {
                setFullName("");
            });
    }, [user_id]);


    return (
        <div className="container mt-5 text-white">
            <div className="row">
                {/* TAB */}
                <div className="col-md-3">
                    <p
                        className={selectedTab === "info1" ? "text-danger" : ""}
                        onClick={() => setSelectedTab("info1")}
                    >
                        Thông tin tài khoản
                    </p>
                    <p
                        className={selectedTab === "info2" ? "text-danger" : ""}
                        onClick={() => setSelectedTab("info2")}
                    >
                        Thông tin đặt bàn
                    </p>
                </div>

                {/* CONTENT */}
                <div className="col-md-6">
                    {selectedTab === "info1" && (
                        <>
                            <p>Tên đăng nhập: {name}</p>
                            <p>Email: {email}</p>
                            <button onClick={handleUserClick}>Chỉnh sửa</button>

                            {isFormVisibleUser && (
                                <EditUser
                                    data={{ name, email }}
                                    user_id={user_id}
                                    setName={setName}
                                    setEmail={setEmail}
                                    onClose={() => setIsFormVisibleUser(false)}
                                />
                            )}
                        </>
                    )}

                    {selectedTab === "info2" && (
                        <>
                            {fullName ? (
                                <>
                                    <p>Tên KH: {fullName}</p>
                                    <p>SĐT: {phoneNumber}</p>
                                    <p>Địa chỉ: {address}</p>
                                    <button onClick={handleEditClick}>Chỉnh sửa</button>

                                    {isFormVisibleEdit && (
                                        <EditCustomer
                                            data={{ fullName, phoneNumber, address, CustomerID }}
                                            user_id={user_id}
                                            onUpdate={() => { }}
                                            onClose={() => setIsFormVisibleEdit(false)}
                                        />
                                    )}
                                </>
                            ) : (
                                <>
                                    <p>Chưa có thông tin khách hàng</p>
                                    <button onClick={handleAddClick}>Thêm</button>

                                    {isFormVisibleAdd && (
                                        <AddCustomer
                                            user_id={user_id}
                                            onUpdate={() => { }}
                                            onClose={() => setIsFormVisibleAdd(false)}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PersonalIn4;
