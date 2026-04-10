import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../../contexts/CartContext";
import { useAuth } from "../../../../contexts/AuthContext";
import { useChatContext } from "../../../../contexts/ChatContext";

function Header() {
    const navigate = useNavigate();
    const { getCartItemCount } = useCart();
    const { isLogin, updateLoginStatus } = useAuth();
    const { refreshUser } = useChatContext();

    const [isOpen, setIsOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        setCartCount(getCartItemCount());
    }, [getCartItemCount]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogin = () => {
        setIsOpen(false);
        navigate("/Login");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        updateLoginStatus(false);
        refreshUser();
        setIsOpen(false);
        navigate("/");
    };

    const handleScroll = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <div className="p-0" id="header">
                <div className="container-fluid header p-0">
                    <div className="container h-100">
                        <div className="row d-flex align-items-center h-100">

                            {/* LOGO */}
                            <div className="col-md-2">
                                <img
                                    className="w-75"
                                    src="https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/logo.png?1705898809027"
                                    alt="Dola Restaurant"
                                />
                            </div>

                            {/* MENU */}
                            <div className="col-md-6">
                                <nav className="header-nav">
                                    <ul className="item_big m-0 d-flex align-items-center justify-content-between">
                                        <li>
                                            <Link to="/">Trang chủ</Link>
                                        </li>

                                        <li onClick={() => handleScroll("thucdon")}>
                                            <Link to="/">Thực đơn</Link>
                                        </li>

                                        <li onClick={() => handleScroll("gioithieu")}>
                                            <Link to="/">Giới thiệu</Link>
                                        </li>

                                        <li onClick={() => handleScroll("tintuc")}>
                                            <Link to="/">Tin tức</Link>
                                        </li>

                                        <li>
                                            <Link to="/Feedback">Phản hồi</Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>

                            <div className="col-md-2"></div>

                            {/* RIGHT SIDE */}
                            <div className="col-md-2 text-white">
                                <div className="row align-items-center justify-content-center">

                                    {/* SEARCH */}
                                    <div className="col-md-2 user-container">
                                        <i className="fas fa-search"></i>

                                        <div className="search-dropdown">
                                            <div
                                                className="d-flex"
                                                style={{ color: "#bd8133" }}
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Nhập từ khóa"
                                                />
                                                <button>Tìm kiếm</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* USER */}
                                    <div className="col-md-2 user-container">
                                        <i
                                            className="fas fa-user"
                                            onClick={toggleMenu}
                                        ></i>

                                        {isOpen && (
                                            <div className="user-dropdown">

                                                {!isLogin ? (
                                                    <button onClick={handleLogin}>
                                                        Đăng nhập | Đăng ký
                                                    </button>
                                                ) : (
                                                    <>
                                                        <div
                                                            className="d-flex flex-column"
                                                            style={{
                                                                color: "#bd8133",
                                                            }}
                                                        >
                                                            <p className="m-0">
                                                                Xin chào!
                                                            </p>

                                                            <Link
                                                                to="/Show_booking"
                                                                onClick={() =>
                                                                    setIsOpen(false)
                                                                }
                                                            >
                                                                Xem lượt đặt
                                                            </Link>

                                                            <Link
                                                                to="/PersonalIn4"
                                                                onClick={() =>
                                                                    setIsOpen(false)
                                                                }
                                                            >
                                                                Thông tin cá nhân
                                                            </Link>
                                                        </div>

                                                        <button onClick={handleLogout}>
                                                            Đăng xuất
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* CART */}
                                    <div className="col-md-2 user-container" style={{ position: 'relative' }}>
                                        <Link to="/Cart">
                                            <i className="fas fa-shopping-cart"></i>
                                            {cartCount > 0 && (
                                                <span
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-8px',
                                                        right: '-8px',
                                                        background: '#d69c52',
                                                        color: '#fff',
                                                        borderRadius: '50%',
                                                        width: '18px',
                                                        height: '18px',
                                                        fontSize: '11px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </div>

                                    {/* BOOKING */}
                                    <div className="col-md-6">
                                        <Link to="/Bookings">
                                            <button className="bt-booking w-100">
                                                Đặt bàn
                                            </button>
                                        </Link>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Header;