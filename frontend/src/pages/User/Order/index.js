import orderApi from "../../../api/orderApi";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.css';

function Order() {
    const navigate = useNavigate();
    const [orders, setorders] = useState(null);
    const { BookingID } = useParams();

    const handleToOrderDetail = (OrderID) => {
        navigate(`/OrderDetail/${OrderID}`);
    };

    useEffect(() => {
        if (!BookingID) return;

        orderApi.getByBooking(BookingID)
            .then(response => {
                setorders(response.data);
            })
            .catch(error => {
                console.error('có lỗi trong quá trình lấy dl: ' + error);
            });
    }, [BookingID]);

    return (
        <div className='container-fluid w-100 order-page' style={{ padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0 breadcrumb-bar'>
                <div className='container h-100 d-flex align-items-center breadcrumb-nav'>
                    <p className='m-0 breadcrumb-link'>Trang chủ / </p>
                    <p className='m-0 breadcrumb-current'>Các lượt đặt bàn của tôi</p>
                </div>
            </div>

            <div className='container order-container'>
                <h2 className='order-title'>Danh sách đơn hàng</h2>
                <div className='pb-3'>
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
                            {orders?.map((order) => (
                                <tr key={order.OrderID}>
                                    <td className='order-date'>{order.OrderDate}</td>
                                    <td className='order-amount'>{order.TotalAmount.toLocaleString()} VNĐ</td>
                                    <td>
                                        {order.promotion?.DiscountPercent ? (
                                            <span className='order-discount'>{order.promotion.DiscountPercent}%</span>
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
                </div>
            </div>
        </div>
    );
}

export default Order;
