
import React, { useState, useEffect, useRef } from "react";
import { formatNumber } from "../../../components/utils/format_number";
import VoucherShop from "./show_voucher";
import bankingApi from "../../../api/bankingApi";
import table_bookingApi from "../../../api/table_bookingApi";
import booking_tableApi from "../../../api/booking_tableApi";
import tableApi from "../../../api/tableApi";
import orderApi from "../../../api/orderApi";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotify } from '../../../contexts/ToastContext';


function Bill() {
    const notify = useNotify();
    const [menu_items, setmenu_items] = useState([]);
    const [table_bookings, settable_bookings] = useState(null);
    const [tables, settables] = useState([]);
    const [total_price, settotal_price] = useState(0);
    const [show_formVoucher, setshow_formVoucher] = useState(false);
    const [Promotion, setPromotion] = useState(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const hasProcessedPayment = useRef(false);

    /* ================= LOAD SESSION ================= */
    useEffect(() => {
        console.log("=== BILL MOUNTED ===");
        console.log("Search params:", Object.fromEntries(searchParams.entries()));

        const paymentStatus = searchParams.get('payment_status');

        // Kiểm tra payment thành công từ VNPay redirect
        if (paymentStatus === '00') {
            console.log("PAYMENT SUCCESS DETECTED");
            setPaymentSuccess(true);
            setIsDataLoaded(true);

            // Lưu thông tin thanh toán thành công vào localStorage
            localStorage.setItem("payment_success", "true");
            localStorage.setItem("payment_time", new Date().toISOString());

            // Thử lấy data từ localStorage nếu có
            let tables = JSON.parse(localStorage.getItem("tables")) || [];
            let menu = JSON.parse(localStorage.getItem("menu_items")) || [];
            let total = JSON.parse(localStorage.getItem("total_price")) || 0;
            let booking = JSON.parse(localStorage.getItem("table_bookings"));

            if (booking) {
                settable_bookings(booking);
                setmenu_items(menu);
                settables(tables);
                settotal_price(total);
            }

            return;
        }

        // XÓA DỮ LIỆU CŨ KHI TEST LẠI (không có payment status)
        // Chỉ xóa nếu có booking data mới từ session
        const currentTables = JSON.parse(sessionStorage.getItem("tables"));
        const currentMenu = JSON.parse(sessionStorage.getItem("menu_items"));

        if (currentTables && currentMenu && currentTables.length > 0 && currentMenu.length > 0) {
            // Đây là phiên mới, xóa dữ liệu cũ
            console.log("Clearing old session data for new test...");
            localStorage.removeItem("payment_success");
            localStorage.removeItem("payment_time");
            localStorage.removeItem("current_booking_id");
            localStorage.removeItem("current_order_id");
            localStorage.removeItem("vnp_order_id");
        }

        // Không có payment status - lấy data từ session
        let tables = JSON.parse(localStorage.getItem("tables")) || JSON.parse(sessionStorage.getItem("tables")) || [];
        let menu = JSON.parse(localStorage.getItem("menu_items")) || JSON.parse(sessionStorage.getItem("menu_items")) || [];
        let total = JSON.parse(localStorage.getItem("total_price")) || JSON.parse(sessionStorage.getItem("total_price")) || 0;
        let booking = JSON.parse(localStorage.getItem("table_bookings")) || JSON.parse(sessionStorage.getItem("table_bookings"));
        const customer = JSON.parse(localStorage.getItem("customer")) || JSON.parse(sessionStorage.getItem("customer"));

        // Kiểm tra payment_success từ localStorage
        if (localStorage.getItem("payment_success") === "true") {
            setPaymentSuccess(true);
        }

        if (!booking && !paymentSuccess) {
            console.log("NO BOOKING DATA - Redirecting to Bookings page");
            navigate("/Bookings");
            return;
        }

        // GẮN customer_id nếu thiếu
        if (!booking?.customer_id && customer?.CustomerID) {
            booking.customer_id = customer.CustomerID;
            localStorage.setItem("table_bookings", JSON.stringify(booking));
            sessionStorage.setItem("table_bookings", JSON.stringify(booking));
        }

        setmenu_items(menu);
        settable_bookings(booking);
        settables(tables);
        settotal_price(total);
        setIsDataLoaded(true);

        console.log("DATA LOADED - Bill ready");
    }, [navigate, searchParams, paymentSuccess]);

    // Redirect sang Thanks page sau 5 giây khi thanh toán thành công
    useEffect(() => {
        const status = searchParams.get('payment_status');

        if (status === '00') {
            const timer = setTimeout(() => {
                navigate('/Thanks');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [searchParams, navigate]);

    /* ================= HANDLE VNPAY RETURN ================= */
    useEffect(() => {
        const paymentStatus = searchParams.get('payment_status');

        // Chỉ xử lý khi có payment_status từ VNPay redirect
        if (!paymentStatus) {
            return;
        }

        // Bỏ qua nếu đã xử lý thanh toán thành công rồi
        if (localStorage.getItem("payment_success") === "true") {
            console.log("Payment already processed - skipping");
            return;
        }

        const orderId = searchParams.get('vnp_TxnRef');

        console.log("=== VNPAY EFFECT ===");
        console.log("paymentStatus:", paymentStatus);
        console.log("isDataLoaded:", isDataLoaded);
        console.log("table_bookings:", table_bookings);
        console.log("hasProcessedPayment.current:", hasProcessedPayment.current);

        // Chỉ xử lý khi có payment_status VÀ data đã load xong
        if (paymentStatus === '00' && !hasProcessedPayment.current && isDataLoaded && table_bookings) {
            hasProcessedPayment.current = true;
            setIsProcessingPayment(true);

            console.log("=== PROCESSING VNPAY PAYMENT ===");

            // Lưu order ID từ VNPay vào localStorage
            localStorage.setItem("vnp_order_id", orderId || '');

            // Tạo booking và order
            createTableBooking(table_bookings);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, isDataLoaded, table_bookings, createTableBooking]);

    /* ================= COUNTDOWN ================= */
    // Timer state cho countdown (không hiển thị nhưng cần để tracking)
    const [, setCountdown] = useState(3600);

    useEffect(() => {
        const timerRef = { current: null };

        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    /* ================= CREATE BOOKING ================= */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function createTableBooking(bookingData) {
        const booking = bookingData || table_bookings;

        // Kiểm tra đã có booking chưa (từ session hoặc từ payment return)
        const existingBookingId = localStorage.getItem("current_booking_id") || sessionStorage.getItem("current_booking_id");

        if (existingBookingId) {
            // Đã có booking, chỉ cần tạo order
            console.log("Booking đã tồn tại, BookingID:", existingBookingId);
            createBookingTables(existingBookingId);
            createOrder(existingBookingId);
            return;
        }

        if (!booking) {
            console.error("Không có dữ liệu booking!");
            setIsProcessingPayment(false);
            notify.warning("Không có thông tin đặt bàn. Vui lòng đặt bàn lại.");
            navigate("/");
            return;
        }

        const bookingDateTime =
            `${booking.booking_date}T${booking.booking_time}:00`;

        const payload = {
            CustomerID: booking.customer_id,
            FullName: booking.full_name,
            Email: booking.email || null,
            PhoneNumber: booking.phone_number,
            Address: booking.address,
            BookingTime: bookingDateTime,
            People: Number(booking.people),
            Status: booking.status,
        };

        console.log("BOOKING PAYLOAD SEND:", payload);

        table_bookingApi
            .create(payload)
            .then(res => {
                const bookingID = res.data.BookingID;
                // Lưu booking ID vào session để tránh tạo lại
                localStorage.setItem("current_booking_id", bookingID);
                sessionStorage.setItem("current_booking_id", bookingID);
                createBookingTables(bookingID);
                createOrder(bookingID);
            })
            .catch(err => {
                console.error("Lỗi tạo booking:", err.response?.data || err);
                setIsProcessingPayment(false);
            });
    }



    /* ================= BOOKING TABLE ================= */
    function createBookingTables(bookingID) {
        // LUÔN LUÔN lấy tables từ storage mới nhất
        const currentTables = JSON.parse(localStorage.getItem("tables")) 
            || JSON.parse(sessionStorage.getItem("tables")) 
            || [];
        const currentBooking = JSON.parse(localStorage.getItem("table_bookings")) 
            || JSON.parse(sessionStorage.getItem("table_bookings")) 
            || table_bookings;

        if (!currentTables || currentTables.length === 0) {
            console.error("table_ids rỗng - Kiểm tra lại session storage");
            notify.warning("Không tìm thấy thông tin bàn đã chọn. Vui lòng đặt bàn lại!");
            setIsProcessingPayment(false);
            return;
        }

        const payload = {
            customer_id: currentBooking.customer_id,
            booking_time: `${currentBooking.booking_date}T${currentBooking.booking_time}:00`,
            table_ids: currentTables.map(t => Number(t.TableID)),
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

        // Chuẩn bị items cho order
        const items = menu_items.map(item => ({
            MenuItemID: item.MenuItemID,
            Quantity: item.Quantity || 1
        }));

        const payload = {
            BookingID,
            CustomerID: table_bookings.customer_id,
            PromotionID: Promotion?.PromotionID || null,
            TotalAmount: total_price,
            OrderDate: now.toISOString(),
            Items: items
        };

        console.log("ORDER PAYLOAD SEND:", payload);

        orderApi
            .create(payload)
            .then(res => {
                const orderId = res.data.OrderID;
                // Lưu order ID để VNPay callback có thể cập nhật
                localStorage.setItem("current_order_id", orderId);
                sessionStorage.setItem("current_order_id", orderId);
                // Order detail đã được tạo tự động bởi backend
                setStatusOfTable();
            })
            .catch(err => {
                console.error("Lỗi tạo order:", err.response?.data || err);
                setIsProcessingPayment(false);
            });
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

    // Hiển thị kết quả thanh toán VNPay
    const paymentStatus = searchParams.get('payment_status');
    const paymentMessage = searchParams.get('payment_message');

    if (isProcessingPayment) {
        return (
            <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0', minHeight: '100vh' }}>
                <div className='container text-center text-white'>
                    <div style={{ marginTop: '100px' }}>
                        <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h2 className="mt-4">Đang xử lý thanh toán...</h2>
                        <p>Vui lòng đợi trong giây lát</p>
                    </div>
                </div>
            </div>
        );
    }

    // Hiển thị thông báo thanh toán thành công khi redirect từ VNPay
    if (paymentSuccess || (paymentStatus === '00')) {
        return (
            <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0', minHeight: '100vh' }}>
                <div className='container text-center text-white'>
                    <div style={{ marginTop: '100px' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: '#28a745',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                        }}>
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        </div>
                        <h2 className="mt-4" style={{ color: '#28a745' }}>✓ Thanh toán VNPay thành công!</h2>
                        <p className="mt-3">Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được xử lý.</p>
                        {paymentMessage && <p>Chi tiết: {decodeURIComponent(paymentMessage)}</p>}
                        <p className="mt-4">Đang chuyển sang trang cảm ơn...</p>
                        <div className="spinner-border text-light mt-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className='mt-4'>
                            {/* <button
                                onClick={() => navigate('/Thanks')}
                                className='btn btn-warning me-2'
                            >
                                Đến trang cảm ơn ngay
                            </button> */}
                            <button
                                onClick={() => navigate('/user/home')}
                                className='btn btn-secondary'
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const onCloseFormVoucher = () => {
        setshow_formVoucher(false);
    }

    const HandlePayCash = () => {
        setIsProcessingPayment(true);
        createTableBooking();
    }

    const HandlePayVNPay = () => {
        if (!table_bookings?.customer_id) {
            notify.warning("Thiếu CustomerID – vui lòng đăng nhập lại");
            return;
        }

        setIsProcessingPayment(true);

        // Kiểm tra xem booking đã tồn tại chưa
        const existingBookingId = localStorage.getItem("current_booking_id") || sessionStorage.getItem("current_booking_id");

        // Nếu đã có booking, chỉ cần tạo order mới và thanh toán
        if (existingBookingId) {
            // Tạo booking_tables trước (nếu chưa có)
            createBookingTablesForExistingBooking(parseInt(existingBookingId))
                .then(() => {
                    createOrderAndPay(parseInt(existingBookingId));
                })
                .catch(err => {
                    console.error("Lỗi tạo booking_tables:", err);
                    setIsProcessingPayment(false);
                });
            return;
        }

        // Tạo booking mới trước
        const bookingDateTime = `${table_bookings.booking_date}T${table_bookings.booking_time}:00`;
        const bookingPayload = {
            CustomerID: table_bookings.customer_id,
            FullName: table_bookings.full_name,
            Email: table_bookings.email || null,
            PhoneNumber: table_bookings.phone_number,
            Address: table_bookings.address,
            BookingTime: bookingDateTime,
            People: Number(table_bookings.people),
            Status: table_bookings.status,
        };

        console.log("Creating booking first:", bookingPayload);

        table_bookingApi
            .create(bookingPayload)
            .then(res => {
                const bookingID = res.data.BookingID;
                localStorage.setItem("current_booking_id", bookingID);
                sessionStorage.setItem("current_booking_id", bookingID);

                // Tạo booking_tables ngay lập tức
                createBookingTables(bookingID);

                // Tạo order và thanh toán
                createOrderAndPay(bookingID);
            })
            .catch(err => {
                console.error("Lỗi tạo booking:", err.response?.data || err);
                setIsProcessingPayment(false);
                notify.error("Không tạo được đặt bàn. Vui lòng thử lại.");
            });
    }

    const createOrderAndPay = (bookingID) => {
        // LUÔN TẠO ORDER MỚI - xóa order_id cũ để tránh trùng lặp
        localStorage.removeItem("current_order_id");
        sessionStorage.removeItem("current_order_id");

        const now = new Date();

        // Chuẩn bị items cho order
        const items = menu_items.map(item => ({
            MenuItemID: item.MenuItemID,
            Quantity: item.Quantity || 1
        }));

        const orderPayload = {
            BookingID: bookingID,
            CustomerID: table_bookings.customer_id,
            PromotionID: Promotion?.PromotionID || null,
            OrderDate: now.toISOString(),
            Items: items
        };

        console.log("Creating order with payload:", orderPayload);

        orderApi
            .create(orderPayload)
            .then(res => {
                console.log("Order created:", res.data);
                const orderId = res.data.OrderID;
                localStorage.setItem("current_order_id", orderId);
                sessionStorage.setItem("current_order_id", orderId);
                initiateVNPayPayment(orderId);
            })
            .catch(err => {
                console.error("Lỗi tạo order:", err.response?.data || err);
                setIsProcessingPayment(false);
                notify.error("Không tạo được đơn hàng. Vui lòng thử lại.");
            });
    }

    // Hàm tạo booking_tables khi booking đã tồn tại
    const createBookingTablesForExistingBooking = (bookingID) => {
        const currentTables = JSON.parse(localStorage.getItem("tables")) 
            || JSON.parse(sessionStorage.getItem("tables")) 
            || [];

        if (!currentTables || currentTables.length === 0) {
            console.log("Không có tables để tạo booking_tables");
            return Promise.resolve();
        }

        const table_ids = currentTables.map(t => Number(t.TableID));

        return booking_tableApi.addTablesToBooking(bookingID, table_ids);
    }

    const initiateVNPayPayment = (orderId) => {
        const finalPrice = Promotion
            ? total_price - Promotion.DiscountPercent
            : total_price;

        const data = {
            order_id: orderId.toString(),
            amount: finalPrice,
            order_desc: `${table_bookings.full_name}-${table_bookings.phone_number}`,
            order_type: "other",
            locale: "vn"
        };

        setIsProcessingPayment(true);
        bankingApi
            .createVNPayPayment(data)
            .then((res) => {
                if (res?.data?.code === "00" && res?.data?.data) {
                    window.location.href = res.data.data;
                } else {
                    notify.error(res?.data?.message || "Không tạo được link thanh toán VNPay");
                    setIsProcessingPayment(false);
                }
            })
            .catch(error => {
                console.error("Lỗi tạo thanh toán VNPay:", error.response?.data || error);
                notify.error("Không tạo được link thanh toán. Vui lòng thử lại.");
                setIsProcessingPayment(false);
            });
    }

    // Format payment message
    const formatMessage = (msg) => {
        if (!msg) return '';
        try {
            return decodeURIComponent(msg);
        } catch {
            return msg;
        }
    };

    const getImagePath = (imageUrl) => {
        if (!imageUrl) return '';
        return encodeURI(
            `http://localhost:8000/uploads/Categories/${imageUrl}`
        );
    };

    return (
        <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
            {/* Thông báo thanh toán VNPay */}
            {paymentStatus && (
                <div className={`alert ${paymentStatus === '00' ? 'alert-success' : 'alert-danger'} m-3`} role="alert">
                    <h4 className="alert-heading">
                        {paymentStatus === '00' ? '✓ Thanh toán VNPay thành công!' : '✗ Thanh toán VNPay thất bại'}
                    </h4>
                    <p className="mb-0">{formatMessage(paymentMessage) || (paymentStatus === '00' ? 'Giao dịch thành công' : 'Giao dịch không thành công')}</p>
                    {searchParams.get('vnp_TxnRef') && (
                        <small className="text-muted">Mã đơn: {searchParams.get('vnp_TxnRef')}</small>
                    )}
                </div>
            )}

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
                                    {menu_items?.map((menu_item, index) => (
                                        <div key={index}>
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
                                        </div>
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
                            <h5 className="mb-3">Chọn phương thức thanh toán</h5>
                            <div className="d-flex gap-3 w-100">
                                <button
                                    style={{ backgroundColor: '#6c757d', color: 'white', fontSize: '18px', padding: '15px 20px', border: 'none', borderRadius: '8px', flex: 1 }}
                                    onClick={() => { HandlePayCash() }}
                                >
                                    Tiền mặt
                                </button>
                                <button
                                    style={{ backgroundColor: '#0d6efd', color: 'white', fontSize: '18px', padding: '15px 20px', border: 'none', borderRadius: '8px', flex: 1 }}
                                    onClick={() => { HandlePayVNPay() }}
                                >
                                    VNPay
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Bill