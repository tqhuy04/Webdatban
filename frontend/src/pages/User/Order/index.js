import orderApi from "../../../api/orderApi";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Pagination from '../../../components/shared/Pagination';
import './index.css';

const PAGE_SIZE = 5;

function Order() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const { BookingID } = useParams();

    const handleToOrderDetail = (OrderID) => {
        navigate(`/OrderDetail/${OrderID}`);
    };

    useEffect(() => {
        if (!BookingID) return;
        setLoading(true);

        orderApi.getByBooking(BookingID)
            .then(response => {
                setOrders(response.data || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('có lỗi trong quá trình lấy dl: ' + error);
                setLoading(false);
            });
    }, [BookingID]);

    const totalPages = Math.ceil(orders.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const currentOrders = orders.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <div className='container-fluid w-100 order-page' style={{ padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0 breadcrumb-bar'>
                <div className='container h-100 d-flex align-items-center breadcrumb-nav'>
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
                            padding: '0',
                            marginRight: '8px'
                        }}
                    >
                        ← Quay lại
                    </button>
                    <p className='m-0 breadcrumb-link'> / </p>
                    <p className='m-0 breadcrumb-current'>Các lượt đặt bàn của tôi</p>
                </div>
            </div>

            <div className='container order-container'>
                <h2 className='order-title'>Danh sách đơn hàng</h2>
                <div className='pb-3'>
                    {loading ? (
                        <div className="order-loading">
                            <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : orders.length > 0 ? (
                        <>
                            <table className="order-table">
                                <thead>
                                    <tr>
                                        <th>Thời gian đơn hàng</th>
                                        <th>Tổng tiền</th>
                                        <th>Mã giảm giá</th>
                                        <th>Xem chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrders.map((order) => (
                                        <tr key={order.OrderID}>
                                            <td className='order-date'>{order.OrderDate}</td>
                                            <td className='order-amount'>{order.TotalAmount.toLocaleString()} VNĐ</td>
                                            <td>
                                                {order.promotion?.DiscountPercent ? (
                                                    <span className='order-discount'>{order.promotion.DiscountPercent} VND</span>
                                                ) : (
                                                    <span className='order-discount-none'>Không có</span>
                                                )}
                                            </td>
                                            <td className='order-action'>
                                                <button
                                                    className='view-btn'
                                                    onClick={() => handleToOrderDetail(order.OrderID)}
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                    Xem
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    ) : (
                        <div className="order-empty">
                            <div className="order-empty-icon">📋</div>
                            <p>Chưa có đơn hàng nào.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Order;
