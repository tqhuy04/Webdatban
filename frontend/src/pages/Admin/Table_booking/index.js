import React, { useEffect, useState } from "react";
import table_bookingApi from "../../../api/table_bookingApi";
import CreateForm from "./create";
import EditForm from "./edit";
import Pagination from "../../../components/shared/Pagination";
import { useNavigate } from "react-router-dom";

function Table_booking() {
    const navigate = useNavigate();

    const [tableBookings, setTableBookings] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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

    const totalPages = Math.ceil(tableBookings.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBookings = tableBookings.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
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
        <div className="admin-table-booking">
            <div className="admin-table-booking-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-calendar-check"></i>
                    </span>
                    Quản lý Đặt Bàn
                </h2>
                <p>
                    <span className="status-dot"></span>
                    Quản lý các yêu cầu đặt bàn của khách hàng
                </p>
            </div>

            <div className="admin-data-card">
                <div className="d-flex justify-content-end mb-3">
                    <button
                        className="admin-btn-add"
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
                                    <div className="empty-state">
                                        <i className="fa fa-calendar-check"></i>
                                        <p>Không có dữ liệu đặt bàn</p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {currentBookings.map((tb) => (
                            <tr key={tb.BookingID}>
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
                                    <span className={`status-badge ${tb.Status === 1 ? 'confirmed' : 'pending'}`}>
                                        {tb.Status === 1 ? "Đã xác nhận" : "Chưa xác nhận"}
                                    </span>
                                </td>

                                <td>
                                    <button
                                        className="admin-btn-edit"
                                        onClick={() => setEditingBooking(tb)}
                                    >
                                        <i className="fa fa-edit"></i> Sửa
                                    </button>
                                    <button
                                        className="admin-btn-delete"
                                        onClick={() => deleteTableBooking(tb.BookingID)}
                                    >
                                        <i className="fa fa-trash"></i> Xóa
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
                                    <button
                                        className="admin-btn-action view"
                                        onClick={() =>
                                            handleToOrder(tb.BookingID, tb.CustomerID)
                                        }
                                        title="Xem đơn hàng"
                                    >
                                        <i className="fa-solid fa-eye"></i>
                                    </button>
                                </td>

                                <td className="text-center">
                                    <button
                                        className="admin-btn-action view"
                                        onClick={() =>
                                            handleToTable(tb.BookingID, tb.CustomerID)
                                        }
                                        title="Xem bàn"
                                    >
                                        <i className="fa-solid fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ===== PAGINATION ===== */}
                <div className="pagination-wrapper">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default Table_booking;
