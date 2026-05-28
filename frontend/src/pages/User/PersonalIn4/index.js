import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from "../../../api/userApi";
import customerApi from "../../../api/customerApi";
import authUser from '../../../api/authUser';
import AddCustomer from './addCustomer';
import EditCustomer from './editCustomer';
import EditUser from './editUser';
import Header from "../../../components/layout/User/Header";
import './index.css';

function PersonalIn4() {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState("info1");

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const [user_id, setUser_id] = useState(null);
    const [CustomerID, setCustomerID] = useState(null);

    // Chỉ cho phép CUSTOMER truy cập
    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "CUSTOMER") {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    // Hàm refresh thông tin customer
    const refreshCustomerData = () => {
        customerApi.getByIdUser()
            .then(res => {
                setFullName(res.data.full_name);
                setPhoneNumber(res.data.phone_number);
                setAddress(res.data.address);
                setCustomerID(res.data.id);
            })
            .catch(err => console.error('Lỗi refresh customer:', err));
    };

    // ===== GET USER ID =====
    useEffect(() => {
        authUser.get_user_id()
            .then(res => {
                console.log("get_user_id response:", res);
                setUser_id(res?.user_id);
            })
            .catch(err => console.error("Lỗi lấy user_id:", err));
    }, []);

    useEffect(() => {
        if (!user_id) return;

        console.log("user_id:", user_id);

        userApi.getMe()
            .then(res => {
                console.log("Account response:", res);
                setName(res.data.username);
                setEmail(res.data.email);
            })
            .catch(err => console.error("Error getting account:", err));

        customerApi.getByIdUser()
            .then(res => {
                console.log("Customer response:", res);
                setFullName(res.data.full_name);
                setPhoneNumber(res.data.phone_number);
                setAddress(res.data.address);
                setCustomerID(res.data.id);
            })
            .catch(() => {
                setFullName("");
                setPhoneNumber("");
                setAddress("");
            });
    }, [user_id]);


    return (
        <>
            <div className="back-button-container" style={{ padding: '80px 20px 0 20px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#d69c52',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        padding: '10px 0'
                    }}
                >
                    ← Quay lại
                </button>
            </div>
            <Header />
            <div className="personal-info-container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="personal-info-card">
                            <div className="row">
                                {/* TAB */}
                                <div className="col-md-3">
                                    <div className="info-tabs">
                                        <button
                                            className={`tab-item ${selectedTab === "info1" ? "active" : ""}`}
                                            onClick={() => setSelectedTab("info1")}
                                        >
                                            <i className="fas fa-user-circle me-2"></i>
                                            Thông tin tài khoản
                                        </button>
                                        <button
                                            className={`tab-item ${selectedTab === "info2" ? "active" : ""}`}
                                            onClick={() => setSelectedTab("info2")}
                                        >
                                            <i className="fas fa-id-card me-2"></i>
                                            Thông tin khách hàng
                                        </button>
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="col-md-9">
                                    <div className="info-content">
                                        {selectedTab === "info1" && (
                                            <div className="info-section">
                                                <h3 className="info-title">Thông tin tài khoản</h3>

                                                <div className="info-item">
                                                    <span className="info-label">Tên đăng nhập</span>
                                                    <span className="info-value">{name || "Chưa cập nhật"}</span>
                                                </div>

                                                <div className="info-item">
                                                    <span className="info-label">Email</span>
                                                    <span className="info-value">{email || "Chưa cập nhật"}</span>
                                                </div>

                                                <div className="edit-section">
                                                    <h4 className="edit-title">Chỉnh sửa thông tin tài khoản</h4>
                                                    <EditUser
                                                        data={{ name, email }}
                                                        user_id={user_id}
                                                        setName={setName}
                                                        setEmail={setEmail}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {selectedTab === "info2" && (
                                            <div className="info-section">
                                                <h3 className="info-title">Thông tin khách hàng</h3>

                                                {fullName ? (
                                                    <>
                                                        <div className="info-item">
                                                            <span className="info-label">Họ tên</span>
                                                            <span className="info-value">{fullName}</span>
                                                        </div>

                                                        <div className="info-item">
                                                            <span className="info-label">SĐT</span>
                                                            <span className="info-value">{phoneNumber}</span>
                                                        </div>

                                                        <div className="info-item">
                                                            <span className="info-label">Email</span>
                                                            <span className="info-value">{email}</span>
                                                        </div>

                                                        <div className="info-item">
                                                            <span className="info-label">Địa chỉ</span>
                                                            <span className="info-value">{address}</span>
                                                        </div>

                                                        <div className="edit-section">
                                                            <h4 className="edit-title">Chỉnh sửa thông tin</h4>
                                                            <EditCustomer
                                                                data={{ fullName, phoneNumber, address, CustomerID }}
                                                                user_id={user_id}
                                                                onUpdate={refreshCustomerData}
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="no-info">
                                                        <p>Chưa có thông tin khách hàng</p>
                                                        <AddCustomer
                                                            onUpdate={refreshCustomerData}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PersonalIn4;
