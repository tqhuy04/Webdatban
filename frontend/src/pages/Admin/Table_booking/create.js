import React, { useEffect, useState } from "react";
import tableApi from "../../../api/tableApi";
import table_bookingApi from "../../../api/table_bookingApi";
import { useNotify } from "../../../contexts/ToastContext";

const CreateForm = ({ setisShowFormCreate, GetTable_bookings }) => {
    const notify = useNotify();
    const [CustomerName, setCustomerName] = useState("");
    const [CustomerPhone, setCustomerPhone] = useState("");
    const [BookingDate, setBookingDate] = useState("");
    const [BookingTime, setBookingTime] = useState("");
    const [TableIDs, setTableIDs] = useState([]);
    const [Status, setStatus] = useState(0);
    const [Tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Set default date to today
        const today = new Date().toISOString().split("T")[0];
        setBookingDate(today);

        tableApi.getAll()
            .then(res => {
                // Chỉ hiển thị bàn còn trống (Status = 0)
                const availableTables = (res.data || []).filter(t => t.Status === 0);
                setTables(availableTables);
            })
            .catch(() => { });
    }, []);

    const handleTableChange = (tableId) => {
        const id = Number(tableId);
        if (TableIDs.includes(id)) {
            setTableIDs(TableIDs.filter(t => t !== id));
        } else {
            setTableIDs([...TableIDs, id]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!CustomerName.trim()) {
            notify.warning("Vui lòng nhập tên khách hàng");
            return;
        }

        if (!BookingDate || !BookingTime) {
            notify.warning("Vui lòng chọn ngày và giờ đặt bàn");
            return;
        }

        if (TableIDs.length === 0) {
            notify.warning("Vui lòng chọn ít nhất một bàn");
            return;
        }

        setLoading(true);

        // ⏰ Ghép ngày + giờ → datetime ISO
        const bookingDateTime = `${BookingDate}T${BookingTime}:00`;

        const data = {
            customer_name: CustomerName.trim(),
            customer_phone: CustomerPhone.trim() || null,
            booking_time: bookingDateTime,
            table_ids: TableIDs
        };

        table_bookingApi.create(data)
            .then(() => {
                notify.success("Thêm booking thành công");
                GetTable_bookings();
                setisShowFormCreate(false);
            })
            .catch((error) => {
                console.error("[CreateForm] Error:", error);
                const errorMsg = error.response?.data?.detail || error.message;
                notify.error("Thêm booking thất bại: " + errorMsg);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
                <h4>Thêm booking mới</h4>

                <form onSubmit={handleSubmit}>
                    {/* Thông tin khách hàng */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Tên khách hàng <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                value={CustomerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Nhập tên khách hàng"
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Số điện thoại</label>
                            <input
                                type="text"
                                className="form-control"
                                value={CustomerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                placeholder="Nhập SĐT (không bắt buộc)"
                            />
                        </div>
                    </div>

                    {/* Ngày và Giờ đặt */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Ngày đặt <span className="text-danger">*</span></label>
                            <input
                                type="date"
                                className="form-control"
                                value={BookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Giờ đặt <span className="text-danger">*</span></label>
                            <input
                                type="time"
                                className="form-control"
                                value={BookingTime}
                                onChange={(e) => setBookingTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Chọn bàn */}
                    <div className="mb-3">
                        <label className="form-label">Chọn bàn <span className="text-danger">*</span></label>
                        <div className="table-selection-grid">
                            {Tables.length === 0 ? (
                                <p className="text-muted">Không có bàn trống nào</p>
                            ) : (
                                <div className="row">
                                    {Tables.map(table => (
                                        <div key={table.TableID} className="col-4 col-md-3 mb-2">
                                            <div
                                                className={`table-item ${TableIDs.includes(table.TableID) ? 'selected' : ''}`}
                                                onClick={() => handleTableChange(table.TableID)}
                                                style={{
                                                    padding: "10px",
                                                    border: TableIDs.includes(table.TableID) ? "2px solid #d69c52" : "1px solid #ddd",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    textAlign: "center",
                                                    backgroundColor: TableIDs.includes(table.TableID) ? "#fff3e0" : "#fff",
                                                    transition: "all 0.2s"
                                                }}
                                            >
                                                <i className="fa fa-chair" style={{ marginRight: "5px" }}></i>
                                                {table.TableNumber}
                                                <br />
                                                <small className="text-muted">Sức chứa: {table.Capacity}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {TableIDs.length > 0 && (
                            <small className="text-success">
                                Đã chọn: {TableIDs.length} bàn
                            </small>
                        )}
                    </div>

                    {/* Trạng thái */}
                    <div className="mb-3">
                        <label className="form-label">Trạng thái</label>
                        <select
                            value={Status}
                            onChange={(e) => setStatus(Number(e.target.value))}
                            className="form-control"
                        >
                            <option value={0}>Chưa xác nhận</option>
                            <option value={1}>Đã xác nhận</option>
                        </select>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setisShowFormCreate(false)}
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

export default CreateForm;
