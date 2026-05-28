import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import menu_itemApi from "../../../../api/menu_itemApi";
import booking_tableApi from "../../../../api/booking_tableApi";
import orderApi from "../../../../api/orderApi";
import customerApi from "../../../../api/customerApi";
import notificationApi from "../../../../api/notificationApi";
import profileApi from "../../../../api/profileApi";


function Header() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [adminName, setAdminName] = useState("");

    // Notification state
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef(null);

    // Load admin name
    useEffect(() => {
        const loadAdminName = () => {
            const savedName = localStorage.getItem("admin_name");
            if (savedName) {
                setAdminName(savedName);
            }
        };

        loadAdminName();

        const handleLoginSuccess = () => {
            profileApi.getMe()
                .then((res) => {
                    setAdminName(res.username || "Admin");
                    localStorage.setItem("admin_name", res.username || "Admin");
                })
                .catch(() => {});
        };

        window.addEventListener("loginSuccess", handleLoginSuccess);
        return () => window.removeEventListener("loginSuccess", handleLoginSuccess);
    }, []);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const data = await notificationApi.getAll(0, "ADMIN", 20);
            setNotifications(data);
            const count = await notificationApi.getUnreadCount(0, "ADMIN");
            setUnreadCount(count.count);
        } catch (error) {
            console.error("Lỗi khi lấy thông báo:", error);
        }
    };

    // Load notifications on mount
    useEffect(() => {
        fetchNotifications();

        // Lắng nghe thông báo mới qua Socket.IO
        if (window.socket) {
            window.socket.on("new_notification", (data) => {
                setNotifications(prev => [data, ...prev]);
                setUnreadCount(prev => prev + 1);
            });
        }
    }, []);

    // Handle notification click
    const handleNotificationClick = async (notif) => {
        if (!notif.is_read) {
            try {
                await notificationApi.markAsRead(notif.id);
                setNotifications(prev =>
                    prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (error) {
                console.error("Lỗi khi đánh dấu đã đọc:", error);
            }
        }

        // Navigate to related page
        if (notif.reference_type === "booking") {
            navigate("/Admin/Table_booking");
        } else if (notif.reference_type === "order") {
            navigate("/Admin/Order");
        }
        setShowNotifications(false);
    };

    // Format time
    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return `${diff} giây trước`;
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        return date.toLocaleDateString("vi-VN");
    };

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState({ menu: [], bookings: [], orders: [], customers: [] });
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    // Click outside to close search
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (searchQuery.trim().length >= 2) {
            setIsSearching(true);
            debounceRef.current = setTimeout(async () => {
                try {
                    const [menuRes, bookingRes, orderRes, customerRes] = await Promise.all([
                        menu_itemApi.search(searchQuery).catch(() => ({ data: [] })),
                        booking_tableApi.search(searchQuery).catch(() => ({ data: [] })),
                        orderApi.search(searchQuery).catch(() => ({ data: [] })),
                        customerApi.search(searchQuery).catch(() => ({ data: [] })),
                    ]);

                    setSearchResults({
                        menu: (menuRes.data || []).slice(0, 4),
                        bookings: (bookingRes.data || []).slice(0, 3),
                        orders: (orderRes.data || []).slice(0, 3),
                        customers: (customerRes.data || []).slice(0, 3),
                    });
                    setShowSearchDropdown(true);
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setIsSearching(false);
                }
            }, 300);
        } else {
            setSearchResults({ menu: [], bookings: [], orders: [], customers: [] });
            setShowSearchDropdown(false);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchQuery]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("admin_name");
        navigate('/Login');
    };

    // Navigate to search result
    const handleSearchClick = (type, id) => {
        setShowSearchDropdown(false);
        setSearchQuery("");
        switch (type) {
            case "menu":
                navigate(`/Admin/Menu_item`);
                break;
            case "booking":
                navigate(`/Admin/Table_booking`);
                break;
            case "order":
                navigate(`/Admin/Order`);
                break;
            case "customer":
                navigate(`/Admin/Customer`);
                break;
            default:
                break;
        }
    };

    const totalResults = searchResults.menu.length + searchResults.bookings.length + searchResults.orders.length + searchResults.customers.length;

    return (
        <header className="admin-top-header">
            <div className="admin-top-header__inner">
                {/* Search Box */}
                <div className="admin-top-header__search" ref={searchRef}>
                    <i className="fas fa-search" aria-hidden />
                    <input
                        type="search"
                        placeholder="Tìm kiếm..."
                        autoComplete="off"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.trim().length >= 2 && setShowSearchDropdown(true)}
                    />
                    {isSearching && <i className="fas fa-spinner fa-spin search-loading" />}

                    {/* Search Dropdown */}
                    {showSearchDropdown && (
                        <div className="admin-search-dropdown">
                            {totalResults === 0 ? (
                                <div className="admin-search-no-results">
                                    <i className="fas fa-search-minus"></i>
                                    <span>Không tìm thấy kết quả</span>
                                </div>
                            ) : (
                                <>
                                    {/* Menu Items */}
                                    {searchResults.menu.length > 0 && (
                                        <div className="admin-search-section">
                                            <div className="admin-search-section-title">
                                                <i className="fas fa-utensils"></i> Món ăn
                                            </div>
                                            {searchResults.menu.map((item) => (
                                                <div
                                                    key={`menu-${item.MenuItemID}`}
                                                    className="admin-search-item"
                                                    onClick={() => handleSearchClick("menu", item.MenuItemID)}
                                                >
                                                    <div className="admin-search-item-content">
                                                        <span className="admin-search-item-name">{item.Name}</span>
                                                        <span className="admin-search-item-meta">
                                                            {new Intl.NumberFormat("vi-VN").format(item.Price)} đ
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Bookings */}
                                    {searchResults.bookings.length > 0 && (
                                        <div className="admin-search-section">
                                            <div className="admin-search-section-title">
                                                <i className="fas fa-calendar-check"></i> Đặt bàn
                                            </div>
                                            {searchResults.bookings.map((item) => (
                                                <div
                                                    key={`booking-${item.BookingID}`}
                                                    className="admin-search-item"
                                                    onClick={() => handleSearchClick("booking", item.BookingID)}
                                                >
                                                    <div className="admin-search-item-content">
                                                        <span className="admin-search-item-name">
                                                            #{item.BookingID} - {item.customer?.full_name || "Khách hàng"}
                                                        </span>
                                                        <span className="admin-search-item-meta">
                                                            {item.BookingTime ? new Date(item.BookingTime).toLocaleDateString("vi-VN") : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Orders */}
                                    {searchResults.orders.length > 0 && (
                                        <div className="admin-search-section">
                                            <div className="admin-search-section-title">
                                                <i className="fas fa-shopping-bag"></i> Đơn hàng
                                            </div>
                                            {searchResults.orders.map((item) => (
                                                <div
                                                    key={`order-${item.OrderID}`}
                                                    className="admin-search-item"
                                                    onClick={() => handleSearchClick("order", item.OrderID)}
                                                >
                                                    <div className="admin-search-item-content">
                                                        <span className="admin-search-item-name">#{item.OrderID}</span>
                                                        <span className="admin-search-item-meta">
                                                            {new Intl.NumberFormat("vi-VN").format(item.TotalAmount)} đ
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Customers */}
                                    {searchResults.customers.length > 0 && (
                                        <div className="admin-search-section">
                                            <div className="admin-search-section-title">
                                                <i className="fas fa-users"></i> Khách hàng
                                            </div>
                                            {searchResults.customers.map((item) => (
                                                <div
                                                    key={`customer-${item.CustomerID}`}
                                                    className="admin-search-item"
                                                    onClick={() => handleSearchClick("customer", item.CustomerID)}
                                                >
                                                    <div className="admin-search-item-content">
                                                        <span className="admin-search-item-name">{item.full_name}</span>
                                                        <span className="admin-search-item-meta">{item.phone_number}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="admin-top-header__actions">
                    {/* Notification Bell */}
                    <div className="admin-top-header__notify-wrapper" ref={notificationRef}>
                        <button
                            type="button"
                            className="admin-top-header__notify"
                            aria-label="Thông báo"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <i className="fa-solid fa-bell" />
                            {unreadCount > 0 && (
                                <span className="admin-top-header__badge">{unreadCount}</span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="admin-notification-dropdown">
                                <div className="admin-notification-header">
                                    <span>Thông báo</span>
                                    <button
                                        type="button"
                                        className="admin-notification-clear"
                                        onClick={() => setShowNotifications(false)}
                                    >
                                        Đóng
                                    </button>
                                </div>
                                <div className="admin-notification-list">
                                    {notifications.length === 0 ? (
                                        <div className="admin-notification-empty">
                                            Không có thông báo nào
                                        </div>
                                    ) : (
                                        notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`admin-notification-item ${!notif.is_read ? 'unread' : ''}`}
                                                onClick={() => handleNotificationClick(notif)}
                                            >
                                                <div className="admin-notification-icon">
                                                    <i className={`fa-solid ${
                                                        notif.type === 'booking' ? 'fa-calendar-check' :
                                                        notif.type === 'order' ? 'fa-shopping-bag' :
                                                        notif.type === 'warning' ? 'fa-exclamation-triangle' :
                                                        'fa-bell'
                                                    }`} />
                                                </div>
                                                <div className="admin-notification-content">
                                                    <span className="admin-notification-message">{notif.message}</span>
                                                    <span className="admin-notification-time">{formatTime(notif.created_at)}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
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
                        <span className="admin-top-header__name">{adminName || "Admin"}</span>
                        <i className={`fa-solid fa-chevron-down admin-top-header__chev ${isOpen ? 'is-open' : ''}`} />

                        {isOpen && (
                            <div className="admin-top-header__menu" onClick={(e) => e.stopPropagation()}>
                                <Link to="/Admin/Profile">Thông tin cá nhân</Link>
                                <Link to="/Admin/Settings">Cài đặt</Link>
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
