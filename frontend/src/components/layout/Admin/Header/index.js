
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


function Header() {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Ẩn dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/Login')

    };

    return (
        <div className='container' style={{ width: '100%', height: '80px', background: '#fff', position: 'fixed', boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.2)' }}>
            <div className='row align-items-center justify-content-center h-100'>
                <div className='col-md-2'>
                    <div className="search-box shadow-sm">
                        <input type="text" className="form-control" placeholder="Search..." />
                        <i className="fas fa-search"></i>
                    </div>
                </div>
                <div className='col-md-7'></div>
                <div className='col-md-3 row'>
                    <div className="notification col-md-3">
                        <i className="fa-solid fa-bell" />
                        <span className="badge">1</span>
                    </div>
                    <div className='col-md-9 d-flex align-items-center account dropdown-container ' ref={dropdownRef} onClick={toggleDropdown}>
                        <img src='https://coderthemes.com/upvex/layouts/light/assets/images/users/user-1.jpg' alt="User avatar" style={{ marginRight: '4px', width: '40px', borderRadius: '50%' }} />
                        <p className='m-0'>Lupin</p>
                        <i class="fa-solid fa-chevron-down" style={{ fontSize: '1rem', marginLeft: '4px' }}></i>

                        {isOpen && (
                            <div className="user-dropdown">
                                <Link to=''>Thông tin cá nhân</Link>
                                <Link to=''>Cài đặt</Link>
                                <span onClick={() => handleLogout()}>Đăng xuất</span>
                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Header