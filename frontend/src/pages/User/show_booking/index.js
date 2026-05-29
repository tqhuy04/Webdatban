import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import table_bookingApi from "../../../api/booking_tableApi";
import Pagination from "../../../components/shared/Pagination";
import { useNotify } from '../../../contexts/ToastContext';

const PAGE_SIZE = 4;

function Show_booking() {
    const notify = useNotify();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    // Checkin Modal State
    const [showCheckinModal, setShowCheckinModal] = useState(false);
    const [bookingToCheckin, setBookingToCheckin] = useState(null);
    const [checkinLoading, setCheckinLoading] = useState(false);

    const handleToOrder = (BookingID) => {
        navigate(`/Order/${BookingID}`);
    };

    const handleToTable = (BookingID) => {
        navigate(`/Show_bookingTable/${BookingID}`);
    };

    const handleCancelClick = (booking) => {
        setBookingToCancel(booking);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        if (!bookingToCancel) return;

        setCancelLoading(true);
        try {
            await table_bookingApi.cancelMyBooking(bookingToCancel.BookingID);

            // Remove from local state
            setBookings(prev => prev.filter(b => b.BookingID !== bookingToCancel.BookingID));
            setShowCancelModal(false);
            setBookingToCancel(null);
            notify.success("Hủy đặt bàn thành công!");
        } catch (error) {
            console.error("Lỗi hủy đặt bàn:", error);
            notify.error("Không thể hủy đặt bàn. Vui lòng thử lại.");
        } finally {
            setCancelLoading(false);
        }
    };

    const handleCloseCancelModal = () => {
        setShowCancelModal(false);
        setBookingToCancel(null);
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
        
        // Xử lý format từ backend: "2026-05-27 22:52:00" hoặc "2026-05-27T22:52:00"
        let date;
        if (typeof dateString === 'string') {
            // Thay dấu cách hoặc T thành dấu -
            const normalized = dateString.replace(' ', 'T').split('.')[0];
            date = new Date(normalized);
        } else {
            date = new Date(dateString);
        }
        
        if (isNaN(date.getTime())) return dateString; // Fallback
        
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 0:
                return { label: 'Chờ xác nhận', className: 'pending', icon: '⏳' };
            case 1:
                return { label: 'Đã xác nhận', className: 'confirmed', icon: '✓' };
            case 2:
                return { label: 'Đã checkin', className: 'completed', icon: '🎉' };
            case 3:
                return { label: 'Đã hủy', className: 'cancelled', icon: '✕' };
            default:
                return { label: 'Không xác định', className: 'pending', icon: '?' };
        }
    };

    const canCancel = (status) => {
        return status !== 2 && status !== 3;
    };

    const canCheckin = (status) => {
        return status === 0 || status === 1;
    };

    // Mở modal checkin
    const handleCheckinClick = (booking) => {
        setBookingToCheckin(booking);
        setShowCheckinModal(true);
    };

    // Xác nhận checkin đơn giản
    const handleConfirmCheckin = async () => {
        if (!bookingToCheckin) return;

        setCheckinLoading(true);
        try {
            await table_bookingApi.checkinMe(bookingToCheckin.BookingID);

            setShowCheckinModal(false);
            setBookingToCheckin(null);
            notify.success("Check-in thành công!");

            const res = await table_bookingApi.getAllOfCustomer();
            setBookings(res.data || []);

        } catch (error) {
            console.error("Lỗi checkin:", error);
            notify.error("Check-in thất bại. Vui lòng thử lại.");
        } finally {
            setCheckinLoading(false);
        }
    };

    const handleCloseCheckinModal = () => {
        setShowCheckinModal(false);
        setBookingToCheckin(null);
    };

    const totalPages = Math.ceil(bookings.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const currentBookings = bookings.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <div className='show-booking-container'>
            <div className='show-booking-hero'>
                <div className='container'>
                    <nav className='breadcrumb-nav'>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255, 255, 255, 0.6)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                padding: '0',
                                marginRight: '8px'
                            }}
                        >
                            ← Quay lại
                        </button>
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
                            {currentBookings.map((booking, index) => {
                                const statusInfo = getStatusInfo(booking.Status);
                                return (
                                    <div
                                        key={booking.BookingID}
                                        className={`booking-card ${statusInfo.className}`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className='booking-card-header'>
                                            <div className='booking-time'>
                                                <span className="time-icon">🕐</span>
                                                <span className="time-text">{formatDate(booking.BookingTime)}</span>
                                            </div>
                                            <span className={`status-badge ${statusInfo.className}`}>
                                                {statusInfo.icon} {statusInfo.label}
                                            </span>
                                        </div>

                                        <div className='booking-card-body'>
                                            <div className='booking-info'>
                                                <div className='info-row'>
                                                    <span className="info-icon">👤</span>
                                                    <span className="info-label">Khách hàng:</span>
                                                    <span className="info-value">{booking.customer?.full_name || booking.CustomerName || 'Không rõ'}</span>
                                                </div>
                                                <div className='info-row'>
                                                    <span className="info-icon">🆔</span>
                                                    <span className="info-label">Mã đặt bàn:</span>
                                                    <span className="info-value">#{booking.BookingID}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='booking-card-footer'>
                                            {canCheckin(booking.Status) && (
                                                <button
                                                    className='btn-action btn-checkin'
                                                    onClick={() => handleCheckinClick(booking)}
                                                >
                                                    {/* <span className="btn-icon">📍</span> */}
                                                    <span className="btn-text">Tôi đã đến</span>
                                                </button>
                                            )}
                                            <button
                                                className='btn-action btn-tables'
                                                onClick={() => handleToTable(booking.BookingID)}
                                            >
                                                {/* <span className="btn-icon">🪑</span> */}
                                                <span className="btn-text">Xem bàn</span>
                                            </button>
                                            <button
                                                className='btn-action btn-orders'
                                                onClick={() => handleToOrder(booking.BookingID)}
                                            >
                                                {/* <span className="btn-icon">📦</span> */}
                                                <span className="btn-text">Chi tiết</span>
                                            </button>
                                            {canCancel(booking.Status) && (
                                                <button
                                                    className='btn-action btn-cancel'
                                                    onClick={() => handleCancelClick(booking)}
                                                >
                                                    {/* <span className="btn-icon">🗑️</span> */}
                                                    <span className="btn-text">Hủy</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
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

            {/* Checkin Modal */}
            {showCheckinModal && (
                <div className="modal-overlay" onClick={handleCloseCheckinModal}>
                    <div className="modal-content checkin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon checkin-icon">
                            <span>🎉</span>
                        </div>
                        <h3>Xác nhận Check-in</h3>
                        <p className="modal-info">Mã đặt bàn: <strong>#{bookingToCheckin?.BookingID}</strong></p>
                        <p className="modal-message">
                            Bạn đã đến cửa hàng?
                        </p>
                        <div className="modal-actions">
                            <button
                                className="btn-modal"
                                onClick={handleCloseCheckinModal}
                                disabled={checkinLoading}
                            >
                                Hủy
                            </button>
                            <button
                                className="btn-modal btn-confirm"
                                onClick={handleConfirmCheckin}
                                disabled={checkinLoading}
                            >
                                {checkinLoading ? "Đang xử lý..." : "Xác nhận đã đến"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="modal-overlay" onClick={handleCloseCancelModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">
                            <span>⚠️</span>
                        </div>
                        <h3>Xác nhận hủy đặt bàn</h3>
                        <p>
                            Bạn có chắc chắn muốn hủy đặt bàn <strong>#{bookingToCancel?.BookingID}</strong>?
                        </p>
                        <p className="modal-warning">Hành động này không thể hoàn tác.</p>
                        <div className="modal-actions">
                            <button 
                                className="btn-modal btn-cancel-modal"
                                onClick={handleCloseCancelModal}
                                disabled={cancelLoading}
                            >
                                Không, giữ lại
                            </button>
                            <button 
                                className="btn-modal btn-confirm-cancel"
                                onClick={handleConfirmCancel}
                                disabled={cancelLoading}
                            >
                                {cancelLoading ? (
                                    <span className="loading-text">Đang hủy...</span>
                                ) : (
                                    <>
                                        <span className="btn-icon">✓</span>
                                        <span className="btn-text">Có, hủy đặt bàn</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .show-booking-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #10302c 0%, #0a1f1c 100%);
                    padding-top: 80px;
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

                .booking-card.pending,
                .booking-card.confirmed {
                    border-left: 4px solid #f39c12;
                }

                .booking-card.completed {
                    border-left: 4px solid #4ecdc4;
                }

                .booking-card.cancelled {
                    border-left: 4px solid #e74c3c;
                    opacity: 0.7;
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

                .status-badge.confirmed {
                    background: rgba(52, 152, 219, 0.2);
                    color: #3498db;
                }

                .status-badge.cancelled {
                    background: rgba(231, 76, 60, 0.2);
                    color: #e74c3c;
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
                    flex-wrap: wrap;
                }

                .btn-action {
                    flex: 1;
                    min-width: 150px;
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

                .btn-cancel {
                    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                    color: #fff;
                    order: -1; /* Đưa nút hủy lên đầu */
                }

                .btn-cancel:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
                }

                .booking-card.completed .btn-cancel,
                .booking-card.cancelled .btn-cancel,
                .booking-card.completed .btn-checkin,
                .booking-card.cancelled .btn-checkin {
                    display: none;
                }

                .btn-checkin {
                    background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
                    color: #fff;
                }

                .btn-checkin:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
                }

                .btn-icon {
                    font-size: 18px;
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .modal-content {
                    background: linear-gradient(145deg, #1a2f2a 0%, #0d1f1c 100%);
                    border-radius: 20px;
                    padding: 32px;
                    max-width: 450px;
                    width: 90%;
                    text-align: center;
                    border: 1px solid rgba(214, 156, 82, 0.2);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    animation: slideUp 0.3s ease;
                }

                /* Checkin Modal Styles */
                .checkin-modal {
                    max-width: 500px;
                }

                .checkin-icon {
                    background: rgba(39, 174, 96, 0.2) !important;
                }

                .checkin-icon span {
                    font-size: 40px;
                }

                .modal-info {
                    background: rgba(214, 156, 82, 0.1);
                    padding: 10px 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                }

                .checkin-options {
                    margin: 20px 0;
                }

                .checkin-options h4 {
                    color: #d69c52;
                    font-size: 16px;
                    margin-bottom: 15px;
                }

                .btn-checkin-option {
                    width: 100%;
                    padding: 16px 20px;
                    margin-bottom: 12px;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .btn-checkin-option:hover:not(:disabled) {
                    border-color: #d69c52;
                    background: rgba(214, 156, 82, 0.1);
                    transform: translateY(-2px);
                }

                .btn-checkin-option:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-checkin-option .option-icon {
                    font-size: 32px;
                    margin-bottom: 8px;
                }

                .btn-checkin-option .option-text {
                    color: #fff;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }

                .btn-checkin-option .option-desc {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 13px;
                }

                .btn-pay-remaining {
                    border-color: rgba(39, 174, 96, 0.3);
                }

                .btn-pay-remaining:hover:not(:disabled) {
                    border-color: #27ae60;
                    background: rgba(39, 174, 96, 0.15);
                }

                .btn-order-more {
                    border-color: rgba(102, 126, 234, 0.3);
                }

                .btn-order-more:hover:not(:disabled) {
                    border-color: #667eea;
                    background: rgba(102, 126, 234, 0.15);
                }

                .btn-close-checkin {
                    background: rgba(255, 255, 255, 0.1) !important;
                    color: rgba(255, 255, 255, 0.8) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    margin-top: 10px;
                }

                .btn-close-checkin:hover:not(:disabled) {
                    background: rgba(255, 255, 255, 0.15) !important;
                    color: #fff !important;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .modal-icon {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: rgba(231, 76, 60, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                }

                .modal-icon span {
                    font-size: 40px;
                }

                .modal-content h3 {
                    color: #fff;
                    font-size: 24px;
                    margin-bottom: 16px;
                    font-weight: 700;
                }

                .modal-content p {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 16px;
                    margin-bottom: 12px;
                    line-height: 1.6;
                }

                .modal-content p strong {
                    color: #d69c52;
                }

                .modal-warning {
                    color: rgba(231, 76, 60, 0.8) !important;
                    font-size: 14px !important;
                    font-style: italic;
                }

                .modal-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 24px;
                }

                .btn-modal {
                    flex: 1;
                    padding: 14px 24px;
                    border: none;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .btn-cancel-modal {
                    background: rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .btn-cancel-modal:hover {
                    background: rgba(255, 255, 255, 0.15);
                    color: #fff;
                }

                .btn-confirm-cancel {
                    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                    color: #fff;
                }

                .btn-confirm-cancel:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
                }

                .btn-confirm-cancel:disabled,
                .btn-cancel-modal:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-confirm {
                    background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
                    color: #fff;
                }

                .btn-confirm:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
                }

                .loading-text {
                    display: inline-block;
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

                    .modal-content {
                        padding: 24px;
                    }

                    .modal-actions {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
}

export default Show_booking;
