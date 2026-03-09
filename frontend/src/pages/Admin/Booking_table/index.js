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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        return <div className="container mt-3">Đang tải dữ liệu...</div>;
    }

    if (!booking) {
        return <div className="container mt-3">Không có dữ liệu booking</div>;
    }

    return (
        <div className="container mt-3">
            <h5 className="mb-3">Danh sách bàn đã đặt</h5>

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
    );
}

export default Booking_table;
