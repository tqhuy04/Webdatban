import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import booking_tableApi from '../../../api/booking_tableApi';
import Pagination from '../../../components/shared/Pagination';

const PAGE_SIZE = 6;

function Show_bookingTable() {
    const navigate = useNavigate();
    const [tables, setTables] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const { BookingID } = useParams();

    // ✅ DÙNG THẬT
    const handleToOrder = () => {
        navigate(`/Order/${BookingID}`);
    };

    const handleToTable = () => {
        navigate(`/OrderDetail/${BookingID}`);
    };

    useEffect(() => {
        if (!BookingID) return;
        setLoading(true);

        booking_tableApi.getTablesOfBooking(BookingID)
            .then(response => {
                setTables(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('có lỗi trong quá trình lấy id', error);
                setLoading(false);
            });
    }, [BookingID]);

    const totalPages = Math.ceil(tables.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const currentTables = tables.slice(startIndex, startIndex + PAGE_SIZE);

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
                {/* Action Buttons */}
                <div className='action-buttons'>
                    <button className="btn-action btn-order" onClick={handleToOrder}>
                        <span className="btn-icon">📋</span>
                        <span className="btn-text">Xem đơn đặt món</span>
                    </button>
                    <button className="btn-action btn-detail" onClick={handleToTable}>
                        <span className="btn-icon">📦</span>
                        <span className="btn-text">Chi tiết đơn</span>
                    </button>
                </div>

                {/* Tables Section */}
                <div className='tables-section'>
                    <h2 className='section-title'>
                        <span className="title-icon">🪑</span>
                        Danh sách bàn đã đặt
                    </h2>

                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Đang tải thông tin bàn...</p>
                        </div>
                    ) : tables && tables.length > 0 ? (
                        <>
                            <div className='tables-grid'>
                                {currentTables.map((table, index) => (
                                    <div
                                        key={`${table.BookingID}-${table.TableID}`}
                                        className={`table-card ${table.table.Status === 0 ? 'available' : 'occupied'}`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className='table-card-header'>
                                            <div className='table-number'>
                                                <span className="table-icon">🪑</span>
                                                Bàn {table.table.TableNumber}
                                            </div>
                                            <span className={`status-badge ${table.table.Status === 0 ? 'available' : 'occupied'}`}>
                                                {table.table.Status === 0 ? 'Còn trống' : 'Hết bàn'}
                                            </span>
                                        </div>
                                        <div className='table-card-body'>
                                            <div className='table-info-item'>
                                                <span className="info-label">Kích thước</span>
                                                <span className="info-value">
                                                    <span className="capacity-icon">👥</span>
                                                    {table.table.Capacity} người
                                                </span>
                                            </div>
                                            <div className='table-info-item'>
                                                <span className="info-label">Sức chứa</span>
                                                <span className="info-value">
                                                    <span className="capacity-icon">🍽️</span>
                                                    {table.table.Capacity} ghế
                                                </span>
                                            </div>
                                        </div>
                                        <div className='table-card-footer'>
                                            <div className='table-id'>ID: {table.TableID}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {tables.length > PAGE_SIZE && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </>
                    ) : (
                        <div className='empty-state'>
                            <span className="empty-icon">🪑</span>
                            <p>Chưa có bàn nào được đặt</p>
                        </div>
                    )}
                </div>
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
                    transition: color 0.3s;
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

                /* Action Buttons */
                .action-buttons {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 40px;
                    flex-wrap: wrap;
                }

                .btn-action {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 28px;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }

                .btn-order {
                    background: linear-gradient(135deg, #d69c52 0%, #c48840 100%);
                    color: #fff;
                }

                .btn-order:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(214, 156, 82, 0.4);
                }

                .btn-detail {
                    background: linear-gradient(135deg, #4ecdc4 0%, #3dbdb5 100%);
                    color: #fff;
                }

                .btn-detail:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
                }

                .btn-icon {
                    font-size: 20px;
                }

                /* Section Title */
                .tables-section {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 20px;
                    padding: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #fff;
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .title-icon {
                    font-size: 28px;
                }

                /* Tables Grid */
                .tables-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                }

                /* Table Card */
                .table-card {
                    background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
                    border-radius: 16px;
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

                .table-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(214, 156, 82, 0.3);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
                }

                .table-card.available {
                    border-left: 4px solid #4ecdc4;
                }

                .table-card.occupied {
                    border-left: 4px solid #ff6b6b;
                }

                .table-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .table-number {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #fff;
                    font-size: 20px;
                    font-weight: 700;
                }

                .table-icon {
                    font-size: 24px;
                }

                .status-badge {
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .status-badge.available {
                    background: rgba(78, 205, 196, 0.2);
                    color: #4ecdc4;
                }

                .status-badge.occupied {
                    background: rgba(255, 107, 107, 0.2);
                    color: #ff6b6b;
                }

                .table-card-body {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin-bottom: 20px;
                }

                .table-info-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                }

                .info-label {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 14px;
                }

                .info-value {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #fff;
                    font-weight: 600;
                }

                .capacity-icon {
                    font-size: 16px;
                }

                .table-card-footer {
                    padding-top: 16px;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }

                .table-id {
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 12px;
                }

                /* Loading State */
                .loading-spinner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 0;
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

                /* Empty State */
                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 0;
                    color: rgba(255, 255, 255, 0.5);
                }

                .empty-icon {
                    font-size: 60px;
                    margin-bottom: 20px;
                    opacity: 0.5;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .action-buttons {
                        flex-direction: column;
                    }

                    .btn-action {
                        width: 100%;
                        justify-content: center;
                    }

                    .tables-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

export default Show_bookingTable;
