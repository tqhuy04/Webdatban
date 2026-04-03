import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import booking_tableApi from "../../../api/booking_tableApi";

function Booking_table() {
    const { BookingID } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (BookingID) {
            fetchBooking();
        }
    }, [BookingID]);

    const fetchBooking = async () => {
        try {
            setLoading(true);
            const res = await booking_tableApi.getFull(BookingID);
            setBooking(res.data);
        } catch (err) {
            console.error("Lỗi lấy booking:", err);
            setBooking(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="admin-booking-table">
            <div className="admin-booking-table-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-chair"></i>
                    </span>
                    Danh sách Bàn đã đặt
                </h2>
                <p>
                    <span className="status-dot"></span>
                    Thông tin các bàn được đặt trong booking
                </p>
            </div>
            <div className="admin-data-card">
                <div className="text-center py-4">
                    <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px', color: '#d69c52' }}></i>
                    <p className="mt-2">Đang tải dữ liệu...</p>
                </div>
            </div>
        </div>;
    }

    if (!booking) {
        return <div className="admin-booking-table">
            <div className="admin-booking-table-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-chair"></i>
                    </span>
                    Danh sách Bàn đã đặt
                </h2>
                <p>
                    <span className="status-dot"></span>
                    Thông tin các bàn được đặt trong booking
                </p>
            </div>
            <div className="admin-data-card">
                <div className="empty-state">
                    <i className="fa fa-chair"></i>
                    <p>Không có dữ liệu booking</p>
                </div>
            </div>
        </div>;
    }

    return (
        <div className="admin-booking-table">
            <div className="admin-booking-table-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-chair"></i>
                    </span>
                    Danh sách Bàn đã đặt
                </h2>
                <p>
                    <span className="status-dot"></span>
                    Thông tin các bàn được đặt trong booking
                </p>
            </div>

            <div className="admin-data-card">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Mã số bàn đã đặt</th>
                            <th>Thời gian</th>
                            <th>Các bàn</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{booking.BookingID}</td>
                            <td>
                                {booking.BookingTime
                                    ? new Date(booking.BookingTime).toLocaleString()
                                    : "—"}
                            </td>
                            <td>
                                {Array.isArray(booking.tables) &&
                                    booking.tables.length > 0 ? (
                                    booking.tables
                                        .map(t => t.TableNumber)
                                        .join(", ")
                                ) : (
                                    <span className="text-muted">Không có bàn</span>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Booking_table;
