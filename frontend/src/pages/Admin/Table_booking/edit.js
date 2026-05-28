import React, { useEffect, useState } from "react";
import customerApi from "../../../api/customerApi";
import table_bookingApi from "../../../api/table_bookingApi";
import { useNotify } from "../../../contexts/ToastContext";

const EditForm = ({ setisShowFormEdit, GetTable_bookings, data, id }) => {
    const notify = useNotify();
    const [CustomerID, setCustomerID] = useState("");
    const [BookingTime, setBookingTime] = useState("");
    const [Status, setStatus] = useState("");
    const [Customers, setCustomers] = useState([]);

    useEffect(() => {
        if (data) {
            const date = new Date(data.BookingTime);
            const time = date.toISOString().substring(11, 16);

            setCustomerID(data.CustomerID);
            setBookingTime(time);
            setStatus(data.Status);
        }

        customerApi.getAll()
            .then(res => setCustomers(res.data || []))
            .catch(() => { });
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            Status: parseInt(Status),
            BookingTime: BookingTime
        };

        table_bookingApi.update(id, payload)
            .then(() => {
                notify.success("Cập nhật booking thành công");
                GetTable_bookings();
                setisShowFormEdit(null);
            })
            .catch(() => {
                notify.error("Cập nhật thất bại");
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Sửa booking</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Khách hàng</label>
                        <input
                            type="text"
                            className="form-control"
                            value={Customers.find(c => c.CustomerID === data?.CustomerID)?.full_name || ""}
                            disabled
                        />
                        <small className="text-muted">Không thể sửa khách hàng</small>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Thời gian đặt</label>
                        <input
                            type="time"
                            className="form-control"
                            value={BookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Trạng thái</label>
                        <select
                            value={Status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="form-control"
                        >
                            <option value={0}>Chưa xác nhận</option>
                            <option value={1}>Đã xác nhận</option>
                            <option value={2}>Đang sử dụng</option>
                            <option value={3}>Đã hủy</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success me-2">Lưu</button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setisShowFormEdit(null)}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
