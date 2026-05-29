import React, { useEffect, useState } from "react";
import table_bookingApi from "../../../api/table_bookingApi";
import { useNotify } from "../../../contexts/ToastContext";

const EditForm = ({ setisShowFormEdit, GetTable_bookings, data, id }) => {
    const notify = useNotify();
    const [BookingDate, setBookingDate] = useState("");
    const [BookingTime, setBookingTime] = useState("");
    const [People, setPeople] = useState(1);
    const [Status, setStatus] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
            const date = new Date(data.BookingTime);
            setBookingDate(date.toISOString().split("T")[0]);
            setBookingTime(date.toTimeString().substring(0, 5));
            setPeople(data.People || 1);
            setStatus(Number(data.Status) || 0);
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!BookingDate || !BookingTime) {
            notify.warning("Vui lòng chọn ngày và giờ");
            return;
        }

        setLoading(true);

        const bookingDateTime = `${BookingDate}T${BookingTime}:00`;

        const payload = {
            booking_time: bookingDateTime,
            people: Number(People),
            status: parseInt(Status)
        };

        table_bookingApi.update(id, payload)
            .then(() => {
                notify.success("Cập nhật booking thành công");
                GetTable_bookings();
                setisShowFormEdit(null);
            })
            .catch((error) => {
                console.error("[EditForm] Error:", error);
                notify.error("Cập nhật thất bại: " + (error.response?.data?.detail || error.message));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Sửa booking #{id}</h4>

                <form onSubmit={handleSubmit}>
                    {/* Ngày và Giờ */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Ngày đặt</label>
                            <input
                                type="date"
                                className="form-control"
                                value={BookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Giờ đặt</label>
                            <input
                                type="time"
                                className="form-control"
                                value={BookingTime}
                                onChange={(e) => setBookingTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Số người */}
                    <div className="mb-3">
                        <label className="form-label">Số người</label>
                        <input
                            type="number"
                            className="form-control"
                            value={People}
                            onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
                            min="1"
                            max="20"
                        />
                    </div>

                    {/* Trạng thái */}
                    <div className="mb-3">
                        <label className="form-label">Trạng thái</label>
                        <select
                            className="form-control"
                            value={Status}
                            onChange={(e) => setStatus(Number(e.target.value))}
                        >
                            <option value={0}>Chưa xác nhận</option>
                            <option value={1}>Đã xác nhận</option>
                            <option value={2}>Đang sử dụng</option>
                            <option value={3}>Đã hủy</option>
                        </select>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setisShowFormEdit(null)}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={loading}
                        >
                            {loading ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
