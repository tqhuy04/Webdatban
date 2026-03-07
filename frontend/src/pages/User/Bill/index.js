
import React, { useState, useEffect } from "react";
import { formatNumber } from "../../../components/utils/format_number";
import VoucherShop from "./show_voucher";
import bankingApi from "../../../api/bankingApi";
import table_bookingApi from "../../../api/table_bookingApi";
import booking_tableApi from "../../../api/booking_tableApi";
import tableApi from "../../../api/tableApi";
import orderApi from "../../../api/orderApi";
import order_detailApi from "../../../api/order_detailApi";
import { useNavigate } from 'react-router-dom';
// import { apiUrl } from "../../../config";


function Bill() {
    const [timeLeft, setTimeLeft] = useState(3600);
    const [menu_items, setmenu_items] = useState([]);
    const [table_bookings, settable_bookings] = useState(null);
    const [tables, settables] = useState([]);
    const [total_price, settotal_price] = useState(0);
    const [show_formVoucher, setshow_formVoucher] = useState(false);
    const [Promotion, setPromotion] = useState(null);
    const navigate = useNavigate();

    /* ================= LOAD SESSION ================= */
    useEffect(() => {
        const tables = JSON.parse(sessionStorage.getItem("tables")) || [];
        const menu = JSON.parse(sessionStorage.getItem("menu_items")) || [];
        const total = JSON.parse(sessionStorage.getItem("total_price")) || 0;
        const booking = JSON.parse(sessionStorage.getItem("table_bookings"));
        const customer = JSON.parse(sessionStorage.getItem("customer"));

        if (!booking) {
            alert("Thiếu thông tin đặt bàn");
            navigate("/");
            return;
        }

        // GẮN customer_id nếu thiếu
        if (!booking.customer_id && customer?.CustomerID) {
            booking.customer_id = customer.CustomerID;
            sessionStorage.setItem("table_bookings", JSON.stringify(booking));
        }

        setmenu_items(menu);
        settable_bookings(booking);
        settables(tables);
        settotal_price(total);

        console.log("TABLE_BOOKINGS:", booking);
    }, [navigate]);

    /* ================= COUNTDOWN ================= */
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    /* ================= BANKING CHECK ================= */
    function HandleCheckBanking() {
        if (!table_bookings?.customer_id) {
            alert("Thiếu CustomerID – vui lòng đăng nhập lại");
            return;
        }

        alert("Vui lòng đợi hệ thống kiểm tra chuyển khoản");

        const data = {
            amount: Number(total_price),
            bank_code: "VCB",
            content: `${table_bookings.full_name}-${table_bookings.phone_number}`,
        };

        bankingApi
            .check(data)
            .then(() => {
                createTableBooking();
            })
            .catch(error => {
                console.error("Lỗi check banking:", error.response?.data || error);
            });
    }

    /* ================= CREATE BOOKING ================= */
function createTableBooking() {
    const bookingDateTime =
        `${table_bookings.booking_date}T${table_bookings.booking_time}:00`;

    const payload = {
        CustomerID: table_bookings.customer_id,
        FullName: table_bookings.full_name,
        Email: table_bookings.email || null,
        PhoneNumber: table_bookings.phone_number,
        Address: table_bookings.address,
        BookingTime: bookingDateTime, // ⭐ FIX Ở ĐÂY
        People: Number(table_bookings.people),
        Status: table_bookings.status,
    };

    console.log("BOOKING PAYLOAD SEND:", payload);

    table_bookingApi
        .create(payload)
        .then(res => {
            const bookingID = res.data.BookingID;
            createBookingTables(bookingID);
            createOrder(bookingID);
        })
        .catch(err => {
            console.error("Lỗi tạo booking:", err.response?.data || err);
        });
}



    /* ================= BOOKING TABLE ================= */
function createBookingTables() {
    if (!tables || tables.length === 0) {
        console.error("table_ids rỗng");
        return;
    }

    const payload = {
        customer_id: table_bookings.customer_id,
        booking_time: `${table_bookings.booking_date}T${table_bookings.booking_time}:00`,
        table_ids: tables.map(t => Number(t.TableID)),
    };

    console.log("BOOKING_TABLE PAYLOAD:", payload);

    booking_tableApi
        .create(payload)
        .then(() => {
            console.log("Tạo booking_table thành công");
        })
        .catch(err => {
            console.error(
                "Lỗi tạo booking_table:",
                err.response?.data || err
            );
        });
}

    /* ================= ORDER ================= */
function createOrder(BookingID) {
    const now = new Date();

    const payload = {
        BookingID,
        CustomerID: table_bookings.customer_id,
        PromotionID: Promotion?.PromotionID || null,
        TotalAmount: total_price,
        OrderDate: now.toISOString(),
    };

    console.log("ORDER PAYLOAD SEND:", payload);

    orderApi
        .create(payload)
        .then(res => {
            createOrderDetail(res.data.OrderID);
        })
        .catch(err => {
            console.error("Lỗi tạo order:", err.response?.data || err);
        });
}

    /* ================= ORDER DETAIL ================= */
    function createOrderDetail(OrderID) {
        menu_items.forEach(item => {
            order_detailApi.create({
                OrderID,
                MenuItemID: item.MenuItemID,
                Quantity: item.Quantity || 1,
                Price: item.Price,
            }).catch(err => console.error(err));
        });

        setStatusOfTable();
    }

async function setStatusOfTable() {
    try {
        for (const table of tables) {
            await tableApi.update(table.TableID, {
                TableNumber: table.TableNumber,
                Capacity: table.Capacity,
                Status: 1, // 1 = đang sử dụng
            });
        }

        HandleClean(); // chỉ chạy khi update xong hết
    } catch (error) {
        console.error('Có lỗi trong quá trình cập nhật trạng thái bàn:', error);
    }
}


    function HandleClean() {
        sessionStorage.clear();
        navigate('/Thanks')
    }

    const onCloseFormVoucher = () => {
        setshow_formVoucher(false);
    }

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const getImagePath = (imageUrl) => {
        if (!imageUrl) return '';
        return encodeURI(
            `http://localhost:8000/uploads/Categories/${imageUrl}`
        );
    };

    return (
        <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0' style={{ height: '50px', background: '#000' }}>
                <div className='container h-100 d-flex align-items-center'>
                    <p className='m-0' style={{ color: '#fff' }}>Trang chủ / </p>
                    <p className='m-0' style={{ color: '#d69c52' }}>  Thông tin đặt bàn</p>
                </div>
            </div>
            <div className='container text-white pb-3 mt-5'>
                <div className='d-flex align-items-center'>
                    <h4>Trạng thái:</h4>
                    <p className='m-0' style={{ color: ' #bd8133', paddingLeft: '12px' }}>Chờ xác nhận</p>
                </div>
                <div className='row'>
                    <div className='col-md-8 '>
                        <h5>Thông tin bàn</h5>
                        <div className='row'>
                            <div className='col-md-4'>
                                <p>
                                    <span>Khách hàng:</span>
                                    <span>{table_bookings?.full_name}</span>
                                </p>
                                <p>
                                    <span>Số điện thoại:</span>
                                    <span>{table_bookings?.phone_number}</span>
                                </p>
                                <p>
                                    <span>Thời gian:</span>
                                    <span>{table_bookings?.BookingTime}</span>
                                </p>
                            </div>
                            <div className='col-md-8'>
                                <div style={{ border: '1px solid #fff' }}>
                                    <div className='row p-2'>
                                        <div className='col-md-6'>Sản phẩm</div>
                                        <div className='col-md-3'>Đơn giá</div>
                                        <div className='col-md-3'>Số lượng</div>
                                    </div>
                                    {menu_items?.map((menu_item) => (
                                        <>
                                            <div className='row p-2 w-100 m-0 align-items-center' style={{ borderTop: '1px solid #fff' }} >
                                                <div className='col-md-6 d-flex align-items-center'>
                                                    <img style={{ width: '108px' }} src={getImagePath(menu_item.ImageURL)} alt="" />
                                                    <div style={{ marginLeft: '8px' }}>
                                                        <p>{menu_item.Name}</p>
                                                        {/* <button style={{ border: 'none', color: '#c8760b', background: 'none' }}>Xóa</button> */}
                                                    </div>
                                                </div>
                                                <div className='col-md-3' style={{ color: '#c8760b' }}>{formatNumber(menu_item.Price)}</div>
                                                <div className='col-md-3' style={{ color: '#c8760b' }}>{(menu_item.Quantity)}</div>
                                            </div>
                                        </>
                                    ))}
                                    <div className='row p-2 w-100 m-0 align-items-center' style={{ borderTop: '1px solid #fff' }} >
                                        <div className='col-md-9 d-flex align-items-center'>
                                            <span style={{ width: '108px' }}>Tổng tiền: </span>
                                            <div style={{ marginLeft: '8px' }}>

                                            </div>
                                        </div>
                                        <span className='col-md-3' style={{ color: '#c8760b' }}>{formatNumber(total_price)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='col-md-4'>
                        <h5>Hóa đơn</h5>
                        <button onClick={() => setshow_formVoucher(true)}>Voucher Shop </button>
                        {show_formVoucher && (
                            <VoucherShop
                                setPromotion={setPromotion}
                                onClose={onCloseFormVoucher}
                                Promotion={Promotion}
                            />
                        )
                        }

                        <div className='mt-2' style={{ borderBottom: '1px solid #fff' }}>
                            <div className='d-flex align-items-center justify-content-between '>
                                <p className='d-flex align-items-center'>
                                    <span>Tổng tiền: </span>
                                    <span style={{ color: 'red' }}>(100%)</span>
                                </p>
                                <p>{formatNumber(total_price)}</p>
                            </div>
                            {Promotion ?
                                <>
                                    <div className='d-flex align-items-center justify-content-between '>
                                        <p className='d-flex align-items-center'>
                                            <span>Giảm giá: </span>
                                        </p>
                                        <p>{formatNumber(Promotion.DiscountPercent)}</p>
                                    </div>

                                    <div className='d-flex align-items-center justify-content-between '>
                                        <p className='d-flex align-items-center'>
                                            <span>Thanh toán: </span>
                                        </p>
                                        <p>{formatNumber(total_price - Promotion.DiscountPercent)}</p>
                                    </div>
                                </>
                                : ''}


                        </div>
                        <div className=' mt-2 d-flex align-items-center justify-content-center flex-column'>
                            <p style={{ color: '#c8760b', padding: '8px', border: '1px solid #c8760b', borderRadius: '5px' }}>
                                Quý khách vui lòng chuyển khoản với nd : Tên khách hàng-số điện thoại
                            </p>
                            <p style={{ color: '#c8760b', padding: '8px', border: '1px solid #c8760b', borderRadius: '5px' }}>
                                Hệ thống sẽ check lại trong vòng vài phút và phản hồi vào phần đặt hàng của quý khách ạ.
                            </p>
                            <img style={{ width: '200px' }} src='qr.jpg' alt="" />
                            <div style={{ textAlign: "center", fontSize: "24px", marginTop: "20px" }}>
                                <h5>Vui lòng thanh toán trong : </h5>
                                <div style={{ fontWeight: "bold", color: "red" }}>{formatTime(timeLeft)}</div>
                            </div>
                            <div style={{ color: '#c8760b', padding: '8px', border: '1px solid #c8760b', borderRadius: '5px' }}>
                                <button
                                    style={{ backgroundColor: '#198754', color: 'white', fontSize: '22px' }}
                                    onClick={() => { HandleCheckBanking() }}
                                >
                                    Đã thanh toán</button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Bill