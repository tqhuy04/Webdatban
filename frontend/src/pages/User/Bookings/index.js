import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authUserApi from "../../../api/authUser";
import MenuSelection from "../../../components/shared/MenuSelection";
import customerApi from "../../../api/customerApi";
import BookingTable from "../../../components/shared/BookingTable";
import Title from "../../../components/shared/Title";
import { useNotify } from "../../../contexts/ToastContext";

function Bookings() {
    const navigate = useNavigate();
    const notify = useNotify();

    const [customer, setCustomer] = useState(null);
    const [userId, setUserId] = useState(null);

    const [BookingDate, setBookingDate] = useState("");
    const [BookingTime, setBookingTime] = useState("");
    const [People, setPeople] = useState("");

    const [minDate, setMinDate] = useState("");

    const [showBookingTable, setShowBookingTable] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // 🔐 Lấy user_id
    useEffect(() => {
        authUserApi
            .get_user_id()
            .then((res) => setUserId(res.user_id))
            .catch(() => navigate("/Login"));
    }, [navigate]);

    // 👤 Lấy customer theo account
    useEffect(() => {
        if (!userId) return;

        customerApi
            .getByIdUser()
            .then((res) => setCustomer(res.data || res))
            .catch(() => {
                notify.warning("Vui lòng nhập thông tin cá nhân trước!");
                navigate("/PersonalIn4");
            });
    }, [userId, navigate, notify]);

    // Helper lấy thời gian tối thiểu cho input time
    const getMinTime = () => {
        if (BookingDate !== minDate) return "";
        const now = new Date();
        const h = String(now.getHours()).padStart(2, "0");
        const m = String(now.getMinutes()).padStart(2, "0");
        return `${h}:${m}`;
    };

    // 🔥 Submit form
    const handleBooking = (e) => {
        e.preventDefault();

        if (!customer || !BookingDate || !BookingTime || !People) {
            notify.warning("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        setShowConfirmModal(true);
    };

    // Xóa dữ liệu booking cũ khi bắt đầu đặt mới
    useEffect(() => {
        // Xóa booking cũ khi component mount
        localStorage.removeItem("current_booking_id");
        sessionStorage.removeItem("current_booking_id");

        // Set min date để không chọn ngày trước thực tế
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        setMinDate(`${year}-${month}-${day}`);
    }, []);

    // ✅ Xác nhận đặt bàn
    const confirmBooking = () => {
        const table_booking = {
            customer_id: customer.id,
            full_name: customer.full_name,
            email: customer.email || "",
            phone_number: customer.phone_number,
            address: customer.address,
            booking_date: BookingDate,
            booking_time: BookingTime,
            people: People,
            status: 1,
        };

        // Xóa booking cũ trước khi lưu booking mới
        localStorage.removeItem("current_booking_id");
        sessionStorage.removeItem("current_booking_id");

        sessionStorage.setItem(
            "table_bookings",
            JSON.stringify(table_booking)
        );

        setShowConfirmModal(false);
        setShowBookingTable(true);
        setShowMenu(true);
    };

    return (
        <div
            className="container-fluid w-100 pb-5"
            style={{ background: "#10302c", padding: "80px 0 0 0" }}
        >
            {/* Breadcrumb */}
            <div
                className="container-fluid p-0"
                style={{ height: "50px", background: "#000" }}
            >
                <div className="container h-100 d-flex align-items-center">
                    <p className="m-0 text-white">Trang chủ /</p>
                    <p className="m-0" style={{ color: "#d69c52" }}>
                        Đặt bàn
                    </p>
                </div>
            </div>

            {/* FORM */}
            <div
                className="container mt-5 d-flex align-items-center justify-content-center"
                style={{
                    height: "574px",
                    borderRadius: "10px",
                    background:
                        "url('https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/datban.jpg?1705898785025')",
                }}
            >
                <div
                    style={{
                        width: "600px",
                        height: "470px",
                        borderRadius: "10px",
                        background: "#10302c",
                        padding: "20px",
                    }}
                >
                    <Title title="Liên hệ đặt bàn" />

                    <form onSubmit={handleBooking}>
                        <div className="row text-white p-3">
                            {/* LEFT */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Tên của bạn:
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="form-control"
                                        value={customer?.full_name || ""}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Số điện thoại:
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="form-control"
                                        value={customer?.phone_number || ""}
                                    />
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Ngày bạn đến:
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={BookingDate}
                                        min={minDate}
                                        onChange={(e) => {
                                            setBookingDate(e.target.value);
                                            // Nếu chọn ngày hôm nay thì reset thời gian về rỗng
                                            // để áp dụng lại minTime
                                            if (e.target.value === minDate) {
                                                setBookingTime("");
                                            } else {
                                                setBookingTime("");
                                            }
                                        }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Số người:
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="form-control"
                                        value={People}
                                        onChange={(e) =>
                                            setPeople(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Thời gian đến:
                                    </label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={BookingTime}
                                        min={getMinTime()}
                                        onChange={(e) =>
                                            setBookingTime(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-3">
                            <button
                                type="submit"
                                style={{
                                    width: "180px",
                                    height: "45px",
                                    borderRadius: "6px",
                                    border: "none",
                                    background: "#d69c52",
                                    color: "#fff",
                                    fontWeight: "600",
                                }}
                            >
                                Đặt bàn ngay
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Confirm Modal đồng bộ màu */}
            {showConfirmModal && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <h5 style={{ color: "#10302c" }}>
                            Bạn có muốn đặt bàn ngay không?
                        </h5>
                        <div className="text-end mt-3">
                            <button
                                onClick={confirmBooking}
                                style={okButton}
                            >
                                Đồng ý
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                style={cancelButton}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BookingTable
                isVisible={showBookingTable}
                onClose={() => setShowBookingTable(false)}
                people={People}
            />

            <MenuSelection
                isVisible={showMenu}
                onClose={() => setShowMenu(false)}
            />
        </div>
    );
}

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
};

const modalStyle = {
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    width: "380px",
};

const okButton = {
    background: "#d69c52",
    border: "none",
    padding: "8px 16px",
    color: "#fff",
    borderRadius: "6px",
    marginRight: "10px",
};

const cancelButton = {
    background: "#6c757d",
    border: "none",
    padding: "8px 16px",
    color: "#fff",
    borderRadius: "6px",
};

export default Bookings;