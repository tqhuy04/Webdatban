import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import table_bookingApi from "../../../api/booking_tableApi";
import Pagination from "../../../components/shared/Pagination";

const PAGE_SIZE = 4;

function Show_booking() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const handleToOrder = (BookingID) => {
        navigate(`/Order/${BookingID}`);
    };

    const handleToTable = (BookingID) => {
        navigate(`/Show_bookingTable/${BookingID}`);
    };

    useEffect(() => {
        setLoading(true);
        table_bookingApi
            .getAllOfCustomer()
            .then((res) => {
                setBookings(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi lấy booking của khách hàng:", err);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const totalPages = Math.ceil(bookings.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const currentBookings = bookings.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <div className='show-booking-container'>
            <div className='show-booking-hero'>
                <div className='container'>
                    <nav className='breadcrumb-nav'>
                        <span className='breadcrumb-home'>Trang chủ</span>
                        <span className='breadcrumb-separator'>/</span>
                        <span className='breadcrumb-current'>Các lượt đặt bàn của tôi</span>
                    </nav>
                </div>
            </div>

            <div className='container show-booking-content'>
                <div className='page-header'>
                    <h1 className='page-title'>
                        <span className="title-icon">📅</span>
                        Lịch sử đặt bàn
                    </h1>
                    <p className='page-subtitle'>Xem lại các lượt đặt bàn của bạn</p>
                </div>

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Đang tải thông tin...</p>
                    </div>
                ) : bookings.length > 0 ? (
                    <>
                        <div className='bookings-list'>
                            {currentBookings.map((booking, index) => (
                                <div
                                    key={booking.BookingID}
                                    className={`booking-card ${booking.Status ? 'completed' : 'pending'}`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className='booking-card-header'>
                                        <div className='booking-time'>
                                            <span className="time-icon">🕐</span>
                                            <span className="time-text">{formatDate(booking.BookingTime)}</span>
                                        </div>
                                        <span className={`status-badge ${booking.Status ? 'completed' : 'pending'}`}>
                                            {booking.Status ? '✓ Hoàn thành' : '⏳ Chưa hoàn thành'}
                                        </span>
                                    </div>

                                    <div className='booking-card-body'>
                                        <div className='booking-info'>
                                            <div className='info-row'>
                                                <span className="info-icon">🆔</span>
                                                <span className="info-label">Mã đặt bàn:</span>
                                                <span className="info-value">#{booking.BookingID}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='booking-card-footer'>
                                        <button
                                            className='btn-action btn-tables'
                                            onClick={() => handleToTable(booking.BookingID)}
                                        >
                                            <span className="btn-icon">🪑</span>
                                            <span className="btn-text">Xem các bàn đã đặt</span>
                                        </button>
                                        <button
                                            className='btn-action btn-orders'
                                            onClick={() => handleToOrder(booking.BookingID)}
                                        >
                                            <span className="btn-icon">📦</span>
                                            <span className="btn-text">Chi tiết đơn hàng</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {bookings.length > PAGE_SIZE && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                ) : (
                    <div className='empty-state'>
                        <span className="empty-icon">📋</span>
                        <h3>Chưa có lượt đặt bàn nào</h3>
                        <p>Bạn chưa thực hiện đặt bàn nào. Hãy đặt bàn ngay!</p>
                    </div>
                )}
            </div>

            <style>{`
                .show-booking-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #10302c 0%, #0a1f1c 100%);
                }

                .show-booking-hero {
                    background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%);
                    padding: 60px 0 40px;
                    border-bottom: 1px solid rgba(214, 156, 82, 0.2);
                }

                .breadcrumb-nav {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                }

                .breadcrumb-home {
                    color: rgba(255, 255, 255, 0.6);
                }

                .breadcrumb-separator {
                    color: rgba(255, 255, 255, 0.3);
                }

                .breadcrumb-current {
                    color: #d69c52;
                    font-weight: 500;
                }

                .show-booking-content {
                    padding: 40px 0 80px;
                }

                .page-header {
                    margin-bottom: 40px;
                }

                .page-title {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    color: #fff;
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }

                .title-icon {
                    font-size: 36px;
                }

                .page-subtitle {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 16px;
                    margin: 0;
                }

                .bookings-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .booking-card {
                    background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
                    border-radius: 20px;
                    padding: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    transition: all 0.3s ease;
                    animation: fadeInUp 0.5s ease forwards;
                    opacity: 0;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .booking-card:hover {
                    transform: translateY(-2px);
                    border-color: rgba(214, 156, 82, 0.3);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
                }

                .booking-card.completed {
                    border-left: 4px solid #4ecdc4;
                }

                .booking-card.pending {
                    border-left: 4px solid #f39c12;
                }

                .booking-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }

                .booking-time {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .time-icon {
                    font-size: 22px;
                }

                .time-text {
                    color: #fff;
                    font-size: 18px;
                    font-weight: 600;
                }

                .status-badge {
                    padding: 8px 18px;
                    border-radius: 25px;
                    font-size: 13px;
                    font-weight: 600;
                }

                .status-badge.completed {
                    background: rgba(78, 205, 196, 0.2);
                    color: #4ecdc4;
                }

                .status-badge.pending {
                    background: rgba(243, 156, 18, 0.2);
                    color: #f39c12;
                }

                .booking-card-body {
                    margin-bottom: 20px;
                }

                .booking-info {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .info-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .info-icon {
                    font-size: 18px;
                }

                .info-label {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 14px;
                }

                .info-value {
                    color: #d69c52;
                    font-weight: 700;
                    font-size: 16px;
                }

                .booking-card-footer {
                    display: flex;
                    gap: 15px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }

                .btn-action {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 14px 20px;
                    border: none;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-tables {
                    background: linear-gradient(135deg, #d69c52 0%, #c48840 100%);
                    color: #fff;
                }

                .btn-tables:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(214, 156, 82, 0.4);
                }

                .btn-orders {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #fff;
                }

                .btn-orders:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }

                .btn-icon {
                    font-size: 18px;
                }

                .loading-spinner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 0;
                    color: rgba(255, 255, 255, 0.6);
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(214, 156, 82, 0.2);
                    border-top-color: #d69c52;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 0;
                    text-align: center;
                }

                .empty-icon {
                    font-size: 80px;
                    margin-bottom: 20px;
                    opacity: 0.5;
                }

                .empty-state h3 {
                    color: #fff;
                    font-size: 24px;
                    margin-bottom: 10px;
                }

                .empty-state p {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 16px;
                }

                @media (max-width: 768px) {
                    .page-title {
                        font-size: 24px;
                    }

                    .booking-card-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                    }

                    .booking-card-footer {
                        flex-direction: column;
                    }

                    .btn-action {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}

export default Show_booking;
