import React, { useEffect, useState } from "react";
import customerApi from "../../../api/customerApi";
import table_bookingApi from "../../../api/table_bookingApi";

const CreateForm = ({ setisShowFormCreate, GetTable_bookings }) => {
    const [CustomerID, setCustomerID] = useState("");
    const [BookingTime, setBookingTime] = useState("");
    const [Status, setStatus] = useState("");
    const [Customers, setCustomers] = useState([]);

    useEffect(() => {
        customerApi.getAll()
            .then(res => setCustomers(res.data || []))
            .catch(err => console.error("Lỗi lấy khách hàng:", err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // ⏰ Ghép ngày + giờ → datetime ISO
        const today = new Date().toISOString().split("T")[0];
        const bookingDateTime = `${today}T${BookingTime}:00`;

        const data = {
            CustomerID: Number(CustomerID),
            BookingTime: bookingDateTime,
            Status: Number(Status)
        };

        table_bookingApi.create(data)
            .then(() => {
                alert("Thêm booking thành công");
                GetTable_bookings();
                setisShowFormCreate(false);
            })
            .catch(err => {
                console.error("Lỗi tạo booking:", err.response?.data || err);
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Thêm booking</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Khách hàng</label>
                        <select
                            value={CustomerID}
                            onChange={(e) => setCustomerID(e.target.value)}
                            className="form-control"
                            required
                        >
                            <option value="">-- Chọn khách hàng --</option>
                            {Customers.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.full_name}
                                </option>
                            ))}
                        </select>
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
                            required
                        >
                            <option value="">-- Chọn trạng thái --</option>
                            <option value={0}>Chưa xác nhận</option>
                            <option value={1}>Đã xác nhận</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success me-2">Lưu</button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setisShowFormCreate(false)}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateForm;
