
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
        navigate('/Login');
    };

    return (
        <header className="admin-top-header">
            <div className="admin-top-header__inner">
                <div className="admin-top-header__search">
                    <i className="fas fa-search" aria-hidden />
                    <input type="search" placeholder="Tìm kiếm..." autoComplete="off" />
                </div>
                <div className="admin-top-header__actions">
                    <button type="button" className="admin-top-header__notify" aria-label="Thông báo">
                        <i className="fa-solid fa-bell" />
                        <span className="admin-top-header__badge">1</span>
                    </button>
                    <div
                        className="admin-top-header__user"
                        ref={dropdownRef}
                        onClick={toggleDropdown}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}
                    >
                        <img
                            src="https://coderthemes.com/upvex/layouts/light/assets/images/users/user-1.jpg"
                            alt=""
                            className="admin-top-header__avatar"
                        />
                        <span className="admin-top-header__name">Lupin</span>
                        <i className={`fa-solid fa-chevron-down admin-top-header__chev ${isOpen ? 'is-open' : ''}`} />

                        {isOpen && (
                            <div className="admin-top-header__menu" onClick={(e) => e.stopPropagation()}>
                                <Link to="">Thông tin cá nhân</Link>
                                <Link to="">Cài đặt</Link>
                                <button type="button" onClick={handleLogout}>Đăng xuất</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
