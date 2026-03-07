import React, { useEffect, useState } from "react";
import table_bookingApi from "../../../api/table_bookingApi";
import CreateForm from "./create";
import EditForm from "./edit";
import { useNavigate } from "react-router-dom";

function Table_booking() {
    const navigate = useNavigate();

    const [tableBookings, setTableBookings] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);

    // =====================
    // LOAD DATA
    // =====================
    useEffect(() => {
        getTableBookings();
    }, []);

    const getTableBookings = () => {
        table_bookingApi
            .getAll()
            .then((res) => {
                setTableBookings(res.data || []);
            })
            .catch((err) => {
                console.error("Lỗi lấy danh sách booking:", err);
                setTableBookings([]);
            });
    };

    // =====================
    // DELETE
    // =====================
    const deleteTableBooking = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá booking này không?")) return;

        try {
            await table_bookingApi.delete(id);
            alert("Xoá booking thành công");
            getTableBookings();
        } catch (error) {
            console.error("Lỗi xoá booking:", error);
        }
    };

    // =====================
    // NAVIGATE
    // =====================
    const handleToOrder = (BookingID, CustomerID) => {
        navigate(`/Admin/Order/${BookingID}/${CustomerID}`);
    };

    const handleToTable = (BookingID, CustomerID) => {
        navigate(`/Admin/Booking_table/${BookingID}/${CustomerID}`);
    };

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreate(true)}
                >
                    <i className="fa fa-plus"></i> Thêm
                </button>
            </div>

            {showCreate && (
                <CreateForm
                    setisShowFormCreate={setShowCreate}
                    GetTable_bookings={getTableBookings}
                />
            )}

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Tên khách hàng</th>
                        <th>Thời gian đặt</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                        <th>Đơn hàng</th>
                        <th>Bàn</th>
                    </tr>
                </thead>

                <tbody>
                    {tableBookings.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center">
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}

                    {tableBookings.map((tb) => (
                        <tr key={tb.BookingID}>
                            {/* ✅ HIỆN TÊN KHÁCH HÀNG */}
                            <td>
                                {tb.customer
                                    ? tb.customer.full_name
                                    : <span className="text-muted">Không có</span>}
                            </td>

                            <td>
                                {tb.BookingTime
                                    ? new Date(tb.BookingTime).toLocaleString()
                                    : ""}
                            </td>

                            <td>
                                {tb.Status === 1
                                    ? "Đã xác nhận"
                                    : "Chưa xác nhận"}
                            </td>

                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => setEditingBooking(tb)}
                                >
                                    <i className="fa fa-edit"></i> Sửa
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteTableBooking(tb.BookingID)}
                                >
                                    <i className="fa fa-trash"></i> Xoá
                                </button>

                                {editingBooking?.BookingID === tb.BookingID && (
                                    <EditForm
                                        setisShowFormEdit={setEditingBooking}
                                        GetTable_bookings={getTableBookings}
                                        id={tb.BookingID}
                                        data={{
                                            CustomerID: tb.CustomerID,
                                            BookingTime: tb.BookingTime,
                                            Status: tb.Status
                                        }}
                                    />
                                )}
                            </td>

                            <td className="text-center">
                                <i
                                    className="fa-solid fa-eye text-primary"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        handleToOrder(tb.BookingID, tb.CustomerID)
                                    }
                                />
                            </td>

                            <td className="text-center">
                                <i
                                    className="fa-solid fa-eye text-success"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        handleToTable(tb.BookingID, tb.CustomerID)
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table_booking;
