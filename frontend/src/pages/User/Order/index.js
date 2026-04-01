import orderApi from "../../../api/orderApi";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
        <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0' style={{ height: '50px', background: '#000' }}>
                <div className='container h-100 d-flex align-items-center'>
                    <p className='m-0' style={{ color: '#fff' }}>Trang chủ / </p>
                    <p className='m-0' style={{ color: '#d69c52' }}>Các lượt đặt bàn của tôi</p>
                </div>
            </div>

            <div className='container order'>
                <div className='container pb-3 mt-5'>
                    <table className="w-100">
                        <thead>
                            <tr style={{ background: '#135b50', color: 'white' }}>
                                <th>Thời gian đơn hàng</th>
                                <th>Tổng tiền</th>
                                <th>Mã giảm giá</th>
                                <th>Xem chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.map((order) => (
                                <tr key={order.OrderID} style={{ background: '#135b50', color: 'white' }}>
                                    <td>{order.OrderDate}</td>
                                    <td>{order.TotalAmount}</td>
                                    <td>{order.promotion?.DiscountPercent ?? 0}</td>
                                    <td>
                                        <i
                                            className="fa-solid fa-eye"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleToOrderDetail(order.OrderID)}
                                        />
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
