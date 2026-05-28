import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import menuItemApi from "../../../api/menu_itemApi";
import booking_tableApi from "../../../api/booking_tableApi";
import orderApi from "../../../api/orderApi";

function Search() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("q") || "";

    const [menuItems, setMenuItems] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    const fetchSearchResults = async () => {
        setLoading(true);
        try {
            const [menuRes, bookingRes, orderRes] = await Promise.all([
                menuItemApi.search(keyword).catch(() => ({ data: [] })),
                booking_tableApi.search(keyword).catch(() => ({ data: [] })),
                orderApi.search(keyword).catch(() => ({ data: [] })),
            ]);

            setMenuItems(menuRes.data || []);
            setBookings(bookingRes.data || []);
            setOrders(orderRes.data || []);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (keyword.trim()) {
            fetchSearchResults();
        } else {
            setLoading(false);
        }
    }, [keyword]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price) + " đ";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getBookingStatus = (status) => {
        const statusMap = {
            0: { label: "Chờ xác nhận", className: "search-status-badge pending" },
            1: { label: "Đã xác nhận", className: "search-status-badge confirmed" },
            2: { label: "Đã hoàn thành", className: "search-status-badge completed" },
            3: { label: "Đã hủy", className: "search-status-badge cancelled" },
        };
        return statusMap[status] || { label: "Không xác định", className: "search-status-badge" };
    };

    const getOrderStatus = (status) => {
        const statusMap = {
            0: { label: "Chờ xử lý", className: "search-status-badge pending" },
            1: { label: "Đang chuẩn bị", className: "search-status-badge confirmed" },
            2: { label: "Hoàn thành", className: "search-status-badge completed" },
            3: { label: "Đã hủy", className: "search-status-badge cancelled" },
        };
        return statusMap[status] || { label: "Không xác định", className: "search-status-badge" };
    };

    const totalResults = menuItems.length + bookings.length + orders.length;

    if (loading) {
        return (
            <div className="user-search-page">
                <div className="container pt-4">
                    <div className="search-loading">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p>Đang tìm kiếm...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!keyword.trim()) {
        return (
            <div className="user-search-page">
                <div className="container pt-4">
                    <div className="search-no-keyword">
                        <i className="fas fa-search"></i>
                        <h4>Nhập từ khóa tìm kiếm</h4>
                        <p>Vui lòng nhập thông tin cần tìm kiếm</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="user-search-page">
            <div className="container pt-5">
                {/* Header */}
                <div className="search-page-header">
                    <div className="search-header-content">
                        <h2>
                            <i className="fas fa-search"></i>
                            Kết quả tìm kiếm
                        </h2>
                        <p>
                            Từ khóa: <strong>"{keyword}"</strong> - Tìm thấy{" "}
                            <strong>{totalResults}</strong> kết quả
                        </p>
                    </div>
                </div>

                <div className="search-container">
                    {/* Tabs */}
                    <div className="search-tabs">
                        <button
                            className={`search-tab ${activeTab === "all" ? "active" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >
                            <i className="fas fa-th-large"></i>
                            Tất cả
                            <span className="count">{totalResults}</span>
                        </button>
                        <button
                            className={`search-tab ${activeTab === "menu" ? "active" : ""}`}
                            onClick={() => setActiveTab("menu")}
                        >
                            <i className="fas fa-utensils"></i>
                            Món ăn
                            <span className="count">{menuItems.length}</span>
                        </button>
                        <button
                            className={`search-tab ${activeTab === "booking" ? "active" : ""}`}
                            onClick={() => setActiveTab("booking")}
                        >
                            <i className="fas fa-calendar-alt"></i>
                            Đặt bàn
                            <span className="count">{bookings.length}</span>
                        </button>
                        <button
                            className={`search-tab ${activeTab === "order" ? "active" : ""}`}
                            onClick={() => setActiveTab("order")}
                        >
                            <i className="fas fa-shopping-bag"></i>
                            Đơn hàng
                            <span className="count">{orders.length}</span>
                        </button>
                    </div>

                    {/* No Results */}
                    {totalResults === 0 && (
                        <div className="search-empty">
                            <i className="fas fa-search-minus"></i>
                            <h4>Không tìm thấy kết quả nào</h4>
                            <p>Vui lòng thử lại với từ khóa khác</p>
                        </div>
                    )}

                    {/* Menu Items */}
                    {(activeTab === "all" || activeTab === "menu") && menuItems.length > 0 && (
                        <div className="search-section">
                            <div className="search-section-header menu">
                                <h4>
                                    <i className="fas fa-utensils"></i>
                                    Món ăn
                                </h4>
                            </div>
                            <div className="search-menu-grid">
                                {menuItems.map((item) => (
                                    <div key={item.MenuItemID} className="search-menu-card">
                                        <div className="card-body">
                                            <h5 className="card-title">{item.Name}</h5>
                                            <p className="card-text">
                                                {item.Description?.substring(0, 100)}
                                                {(item.Description?.length || 0) > 100 ? "..." : ""}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="price">
                                                    {formatPrice(item.Price)}
                                                </span>
                                                <Link
                                                    to={`/ProductDetails/${item.MenuItemID}`}
                                                    className="btn-detail"
                                                >
                                                    Xem chi tiết
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bookings */}
                    {(activeTab === "all" || activeTab === "booking") && bookings.length > 0 && (
                        <div className="search-section">
                            <div className="search-section-header booking">
                                <h4>
                                    <i className="fas fa-calendar-alt"></i>
                                    Đặt bàn
                                </h4>
                            </div>
                            <div className="table-responsive">
                                <table className="search-table">
                                    <thead>
                                        <tr>
                                            <th>Mã đặt bàn</th>
                                            <th>Thời gian</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((booking) => {
                                            const status = getBookingStatus(booking.Status);
                                            return (
                                                <tr key={booking.BookingID}>
                                                    <td className="order-id">#{booking.BookingID}</td>
                                                    <td>{formatDate(booking.BookingTime)}</td>
                                                    <td>
                                                        <span className={status.className}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Link
                                                            to={`/Show_bookingTable/${booking.BookingID}`}
                                                            className="btn-detail"
                                                            style={{ padding: "8px 16px", fontSize: "13px" }}
                                                        >
                                                            Xem chi tiết
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Orders */}
                    {(activeTab === "all" || activeTab === "order") && orders.length > 0 && (
                        <div className="search-section">
                            <div className="search-section-header order">
                                <h4>
                                    <i className="fas fa-shopping-bag"></i>
                                    Đơn hàng
                                </h4>
                            </div>
                            <div className="table-responsive">
                                <table className="search-table">
                                    <thead>
                                        <tr>
                                            <th>Mã đơn hàng</th>
                                            <th>Ngày đặt</th>
                                            <th>Tổng tiền</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.OrderID}>
                                                <td className="order-id">#{order.OrderID}</td>
                                                <td>{formatDate(order.OrderDate)}</td>
                                                <td className="order-total">
                                                    {formatPrice(order.TotalAmount)}
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/OrderDetail/${order.OrderID}`}
                                                        className="btn-detail"
                                                        style={{ padding: "8px 16px", fontSize: "13px" }}
                                                    >
                                                        Xem chi tiết
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Search;
