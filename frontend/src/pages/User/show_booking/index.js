import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import table_bookingApi from "../../../api/booking_tableApi";

function Show_booking() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    const handleToOrder = (BookingID) => {
        navigate(`/Order/${BookingID}`);
    };

    const handleToTable = (BookingID) => {
        navigate(`/Show_bookingTable/${BookingID}`);
    };

    useEffect(() => {
        table_bookingApi
            .getAllOfCustomer()
            .then((res) => {
                setBookings(res.data || []);
            })
            .catch((err) => {
                console.error("Lỗi lấy booking của khách hàng:", err);
            });
    }, []);

    return (
        <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0' style={{ height: '50px', background: '#000' }}>
                <div className='container h-100 d-flex align-items-center'>
                    <p className='m-0' style={{ color: '#fff' }}>Trang chủ / </p>
                    <p className='m-0' style={{ color: '#d69c52' }}>  Các lượt đặt bàn của tôi</p>
                </div>
            </div>
            <div className='container order'>
                <div className='container  pb-3 mt-5'>
                    <table className="w-100 " style={{
                    }}>
                        <thead>
                            <tr style={{ background: '#135b50', color: 'white' }}>
                                <th scope="col">Thời gian đặt bàn</th>
                                <th scope="col">Trạng thái lượt đặt</th>
                                <th scope="col">Các bàn đã đặt</th>
                                <th scope="col">Chi tiết đơn hàng</th>
                                <th scope="col" />
                            </tr>
                        </thead>
                        <tbody>
                            {bookings?.map(booking => (
                                <tr style={{ background: '#135b50', color: 'white' }}>

                                    <td>{booking.BookingTime}</td>
                                    <td>{booking.Status ? 'hoàn thành' : 'chưa hoàn thành'}</td>

                                    <td><i className="fa-solid fa-eye" onClick={() => handleToTable(booking.BookingID)} /></td>
                                    <td><i className="fa-solid fa-eye" onClick={() => handleToOrder(booking.BookingID)} /></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Show_booking;
