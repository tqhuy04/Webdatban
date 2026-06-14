
import React, { useState, useEffect, useRef } from "react";
import { formatNumber } from "../../../components/utils/format_number";
import VoucherShop from "./show_voucher";
import bankingApi from "../../../api/bankingApi";
import booking_tableApi from "../../../api/booking_tableApi";
import tableApi from "../../../api/tableApi";
import orderApi from "../../../api/orderApi";
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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
    const location = useLocation();

    const hasProcessedPayment = useRef(false);
    const customerFetchedRef = useRef(false);

    // Reload data khi location thay đổi (ví dụ: user quay lại từ Cart)
    useEffect(() => {
        console.log("=== BILL LOCATION CHANGED - Reloading data ===");
        const cartData = JSON.parse(localStorage.getItem("cartItems")) || [];
        const menuDataFromCheckout = JSON.parse(localStorage.getItem("menu_items")) || JSON.parse(sessionStorage.getItem("menu_items")) || [];

        console.log("cartItems:", cartData.length);
        console.log("menu_items:", menuDataFromCheckout.length);

        const menu = cartData.length > 0 ? cartData : menuDataFromCheckout;

        let total = 0;
        if (menu.length > 0) {
            total = menu.reduce((sum, item) => sum + (item.Price * (item.Quantity || 1)), 0);
        }

        setmenu_items(menu);
        settotal_price(total);
        console.log("Updated menu_items state:", menu.length);
    }, [location.pathname]);

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

        // Hàm load data từ storage
        const loadBillData = async () => {
            // Ưu tiên đọc từ cartItems (CartContext) để luôn có data mới nhất
            // Fallback về menu_items (từ Checkout) nếu cartItems trống
            const cartData = JSON.parse(localStorage.getItem("cartItems")) || [];
            const menuDataFromCheckout = JSON.parse(localStorage.getItem("menu_items")) || JSON.parse(sessionStorage.getItem("menu_items")) || [];

            // Debug: log để xem data
            console.log("=== LOAD BILL DATA ===");
            console.log("cartItems:", cartData.length, cartData);
            console.log("menu_items:", menuDataFromCheckout.length, menuDataFromCheckout);

            // Nếu có cartItems, dùng cartItems (từ Cart)
            // Nếu không có cartItems nhưng có menu_items, dùng menu_items (từ Checkout)
            const menu = cartData.length > 0 ? cartData : menuDataFromCheckout;

            console.log("Final menu to display:", menu.length, menu);

            // Tính total_price từ menu items
            let total = 0;
            if (menu.length > 0) {
                total = menu.reduce((sum, item) => sum + (item.Price * (item.Quantity || 1)), 0);
            }

            let tables = JSON.parse(localStorage.getItem("tables")) || JSON.parse(sessionStorage.getItem("tables")) || [];
            let booking = JSON.parse(localStorage.getItem("table_bookings")) || JSON.parse(sessionStorage.getItem("table_bookings"));
            const customer = JSON.parse(localStorage.getItem("customer")) || JSON.parse(sessionStorage.getItem("customer"));

            // Debug: log storage data
            console.log("[DEBUG BILL] booking from storage:", booking);
            console.log("[DEBUG BILL] customer from storage:", customer);
            console.log("[DEBUG BILL] booking.customer_id:", booking?.customer_id);
            console.log("[DEBUG BILL] booking.CustomerID:", booking?.CustomerID);
            console.log("[DEBUG BILL] customer.CustomerID:", customer?.CustomerID);

            // Kiểm tra payment_success từ localStorage
            if (localStorage.getItem("payment_success") === "true") {
                setPaymentSuccess(true);
            }

            if (!booking && !paymentSuccess) {
                console.log("NO BOOKING DATA - Redirecting to Bookings page");
                navigate("/Bookings");
                return false;
            }

            // GẮN customer_id nếu thiếu (hỗ trợ cả PascalCase và snake_case)
            if (!booking?.customer_id && !booking?.CustomerID) {
                let customerId = null;

                // Thử lấy từ customer storage trước
                if (customer?.CustomerID) {
                    customerId = customer.CustomerID;
                } else if (customer?.customer_id) {
                    customerId = customer.customer_id;
                }

                // Nếu không có trong storage, thử lấy từ API (chỉ gọi 1 lần)
                if (!customerId && !customerFetchedRef.current) {
                    const token = localStorage.getItem('token');
                    // Chỉ gọi API nếu có token (đã đăng nhập)
                    if (token) {
                        customerFetchedRef.current = true; // Đánh dấu đã gọi
                        console.log("[DEBUG BILL] No customerId in storage, fetching from API...");
                        try {
                            const res = await fetch("http://localhost:8000/api/customers/me", {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            if (res.ok) {
                                const customerData = await res.json();
                                customerId = customerData.CustomerID || customerData.id;
                                console.log("[DEBUG BILL] Got customerId from API:", customerId);
                            } else if (res.status === 401 || res.status === 404) {
                                // Không có customer hoặc chưa đăng nhập - không retry
                                console.log("[DEBUG BILL] No customer found or not authenticated");
                            }
                        } catch (e) {
                            console.error("[DEBUG BILL] Error fetching customer:", e);
                        }
                    } else {
                        // Không có token - đánh dấu đã xử lý để không retry
                        customerFetchedRef.current = true;
                        console.log("[DEBUG BILL] No token - skipping customer fetch");
                    }
                }

                if (customerId) {
                    booking.customer_id = customerId;
                    localStorage.setItem("table_bookings", JSON.stringify(booking));
                    sessionStorage.setItem("table_bookings", JSON.stringify(booking));
                    console.log("[DEBUG BILL] Attached customer_id to booking:", customerId);
                }
            }

            setmenu_items(menu);
            settable_bookings(booking);
            settables(tables);
            settotal_price(total);
            setIsDataLoaded(true);

            console.log("DATA LOADED - Bill ready, menu_items:", menu.length);
            return true;
        };

        // Load data lần đầu
        loadBillData();

        // Listener để reload data khi user quay lại trang (ví dụ: từ Cart)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log("=== BILL VISIBLE AGAIN - Reloading data ===");
                loadBillData();
            }
        };

        // Listener cho storage change (khi user thêm món từ trang khác)
        const handleStorageChange = (e) => {
            if (e.key === 'cartItems' || e.key === 'menu_items') {
                console.log("=== BILL STORAGE CHANGED - Reloading data ===", e.key);
                loadBillData();
            }
        };

        // Listener cho focus event (khi user click vào tab)
        const handleFocus = () => {
            console.log("=== BILL WINDOW FOCUSED - Reloading data ===");
            loadBillData();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('focus', handleFocus);

        // Cleanup listeners
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [navigate, searchParams, paymentSuccess]);

    // Polling để check localStorage thay đổi (cho cùng tab)
    useEffect(() => {
        const checkInterval = setInterval(() => {
            const currentCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            const currentMenuItems = JSON.parse(localStorage.getItem("menu_items")) || JSON.parse(sessionStorage.getItem("menu_items")) || [];
            const allItems = currentCartItems.length > 0 ? currentCartItems : currentMenuItems;

            // So sánh với state hiện tại
            if (allItems.length !== menu_items.length) {
                console.log("=== BILL POLLING DETECTED CHANGE - Updating ===");
                setmenu_items(allItems);
                const newTotal = allItems.reduce((sum, item) => sum + (item.Price * (item.Quantity || 1)), 0);
                settotal_price(newTotal);
            }
        }, 1000); // Check mỗi 1 giây

        return () => clearInterval(checkInterval);
    }, [menu_items.length]);

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
            // Lấy menu_items trực tiếp từ storage
            const storedMenuItems = JSON.parse(localStorage.getItem("menu_items")) || JSON.parse(sessionStorage.getItem("menu_items")) || [];
            createOrder(existingBookingId, storedMenuItems);
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

        // Lấy tables từ storage để tạo booking kèm bàn trong cùng 1 request
        const currentTables = JSON.parse(localStorage.getItem("tables"))
            || JSON.parse(sessionStorage.getItem("tables"))
            || [];
        const tableIds = currentTables.map(t => Number(t.TableID));

        const payload = {
            customer_id: booking.customer_id || booking.CustomerID,
            booking_time: bookingDateTime,
            table_ids: tableIds,
            people: Number(booking.people) || 1,
            total_amount: 0,
        };

        console.log("BOOKING PAYLOAD SEND:", payload);

        // Sử dụng booking_tableApi thay vì table_bookingApi để đồng bộ với show_booking
        booking_tableApi
            .create(payload)
            .then(res => {
                console.log("[DEBUG] booking_tableApi.create response:", res);
                const bookingID = res.data?.BookingID || res.data?.booking_id;
                console.log("[DEBUG] Extracted bookingID:", bookingID);
                if (!bookingID) {
                    console.error("[ERROR] bookingID is undefined!");
                    setIsProcessingPayment(false);
                    notify.error("Lỗi tạo booking. Vui lòng thử lại.");
                    return;
                }
                // Lưu booking ID vào session để tránh tạo lại
                localStorage.setItem("current_booking_id", bookingID);
                sessionStorage.setItem("current_booking_id", bookingID);
                // Lấy menu_items trực tiếp từ storage
                const storedMenuItems = JSON.parse(localStorage.getItem("menu_items")) || JSON.parse(sessionStorage.getItem("menu_items")) || [];
                createOrder(bookingID, storedMenuItems);
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

        if (!currentTables || currentTables.length === 0) {
            console.error("table_ids rỗng - Kiểm tra lại session storage");
            notify.warning("Không tìm thấy thông tin bàn đã chọn. Vui lòng đặt bàn lại!");
            setIsProcessingPayment(false);
            return;
        }

        const table_ids = currentTables.map(t => Number(t.TableID));

        console.log("ADD TABLES TO BOOKING:", { bookingID, table_ids });

        // Gọi endpoint addTablesToBooking thay vì create() để tránh tạo booking trùng.
        // Endpoint này chỉ thêm liên kết BookingTable cho booking đã tồn tại.
        booking_tableApi
            .addTablesToBooking(bookingID, table_ids)
            .then(() => {
                console.log("Đã liên kết bàn vào booking thành công");
            })
            .catch(err => {
                console.error(
                    "Lỗi liên kết bàn vào booking:",
                    err.response?.data || err
                );
            });
    }

    /* ================= ORDER ================= */
    function createOrder(BookingID, menuItems = []) {
        const now = new Date();

        // Sử dụng menuItems được truyền vào, hoặc lấy từ state, hoặc từ storage
        const itemsToUse = menuItems.length > 0 ? menuItems : menu_items;

        // Chuẩn bị items cho order
        const items = itemsToUse.map(item => ({
            MenuItemID: item.MenuItemID,
            Quantity: item.Quantity || 1
        }));

        const payload = {
            BookingID,
            CustomerID: table_bookings.customer_id || table_bookings.CustomerID,
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
        // Clear storage để lần đặt bàn sau là hoàn toàn mới (không bị dính booking cũ)
        sessionStorage.clear();
        localStorage.removeItem("current_booking_id");
        localStorage.removeItem("current_order_id");
        localStorage.removeItem("vnp_order_id");
        localStorage.removeItem("payment_success");
        localStorage.removeItem("payment_time");
        localStorage.removeItem("table_bookings");
        localStorage.removeItem("tables");
        localStorage.removeItem("menu_items");
        localStorage.removeItem("total_price");
        navigate('/Thanks')
    }

    // Hiển thị kết quả thanh toán VNPay
    const paymentStatus = searchParams.get('payment_status');
    const paymentMessage = searchParams.get('payment_message');

    if (isProcessingPayment) {
        return (
            <div className='container-fluid w-100' style={{ background: 'linear-gradient(135deg, #10302c 0%, #1a4a42 100%)', padding: '80px 0 0 0', minHeight: '100vh' }}>
                <div className='container text-center text-white'>
                    <div style={{ marginTop: '100px' }}>
                        {/* Animated Payment Icon */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 30px',
                            boxShadow: '0 10px 40px rgba(20, 184, 166, 0.4)',
                            animation: 'pulse 2s infinite'
                        }}>
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="white" style={{ animation: 'spin 2s linear infinite' }}>
                                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" strokeDasharray="60" strokeDashoffset="20" />
                            </svg>
                        </div>
                        <h2 className="mt-4" style={{ fontWeight: '600', fontSize: '1.8rem' }}>Đang xử lý thanh toán</h2>
                        <p className="mt-3" style={{ opacity: 0.8, fontSize: '1.1rem' }}>Vui lòng đợi trong giây lát...</p>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '20px' }}>Đang kết nối với VNPay</p>
                    </div>
                    <style>{`
                        @keyframes pulse {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.05); }
                        }
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    // Hiển thị thông báo thanh toán thành công khi redirect từ VNPay
    if (paymentSuccess || (paymentStatus === '00')) {
        return (
            <div className='container-fluid w-100' style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)', padding: '80px 0 0 0', minHeight: '100vh' }}>
                <div className='container text-center text-white'>
                    <div style={{ marginTop: '80px' }}>
                        {/* Success Icon with Animation */}
                        <div style={{
                            width: '140px',
                            height: '140px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 30px',
                            boxShadow: '0 15px 50px rgba(16, 185, 129, 0.5)',
                            animation: 'bounceIn 0.6s ease-out'
                        }}>
                            <svg width="70" height="70" viewBox="0 0 24 24" fill="white">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        </div>
                        <h2 className="mt-4" style={{
                            fontWeight: '700',
                            fontSize: '2rem',
                            color: '#d1fae5'
                        }}>
                            Thanh toán thành công!
                        </h2>
                        <p className="mt-3" style={{
                            opacity: 0.95,
                            fontSize: '1.15rem',
                            maxWidth: '500px',
                            margin: '0 auto'
                        }}>
                            Cảm ơn bạn đã thanh toán qua VNPay.
                            Đơn hàng của bạn đang được xử lý.
                        </p>
                        {paymentMessage && (
                            <div style={{
                                background: 'rgba(255,255,255,0.15)',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                marginTop: '20px',
                                display: 'inline-block'
                            }}>
                                <span style={{ opacity: 0.8 }}>{decodeURIComponent(paymentMessage)}</span>
                            </div>
                        )}
                        <p className="mt-4" style={{ opacity: 0.7, fontSize: '0.95rem' }}>
                            Đang chuyển sang trang cảm ơn...
                        </p>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '3px solid rgba(255,255,255,0.3)',
                            borderTop: '3px solid white',
                            borderRadius: '50%',
                            margin: '20px auto 0',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                    </div>
                    <div className='mt-5'>
                        <button
                            onClick={() => navigate('/user/home')}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderRadius: '12px',
                                padding: '14px 32px',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Về trang chủ
                        </button>
                    </div>
                    <style>{`
                        @keyframes bounceIn {
                            0% { transform: scale(0); opacity: 0; }
                            50% { transform: scale(1.1); }
                            100% { transform: scale(1); opacity: 1; }
                        }
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
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
        if (!table_bookings?.customer_id && !table_bookings?.CustomerID) {
            notify.warning("Thiếu CustomerID – vui lòng đăng nhập lại");
            return;
        }

        setIsProcessingPayment(true);

        // Kiểm tra xem booking đã tồn tại chưa
        const existingBookingId = localStorage.getItem("current_booking_id") || sessionStorage.getItem("current_booking_id");

        // Nếu đã có booking, chỉ cần tạo order mới và thanh toán
        if (existingBookingId) {
            const bookingId = parseInt(existingBookingId);
            if (isNaN(bookingId) || bookingId <= 0) {
                console.error("Invalid booking ID from storage:", existingBookingId);
                notify.error("Mã booking không hợp lệ. Vui lòng đặt bàn lại.");
                setIsProcessingPayment(false);
                return;
            }
            // Tạo booking_tables trước (nếu chưa có)
            createBookingTablesForExistingBooking(bookingId)
                .then(() => {
                    createOrderAndPay(bookingId);
                })
                .catch(err => {
                    console.error("Lỗi tạo booking_tables:", err);
                    setIsProcessingPayment(false);
                });
            return;
        }

        // Tạo booking mới trước
        const bookingDateTime = `${table_bookings.booking_date}T${table_bookings.booking_time}:00`;

        // Lấy tables từ storage
        const currentTables = JSON.parse(localStorage.getItem("tables"))
            || JSON.parse(sessionStorage.getItem("tables"))
            || [];

        const bookingPayload = {
            customer_id: table_bookings.customer_id || table_bookings.CustomerID,
            booking_time: bookingDateTime,
            table_ids: currentTables.map(t => Number(t.TableID)),
        };

        console.log("Creating booking with booking_tableApi:", bookingPayload);

        booking_tableApi
            .create(bookingPayload)
            .then(res => {
                console.log("[DEBUG] Full response from create booking:", res);
                console.log("[DEBUG] res.data:", res.data);
                console.log("[DEBUG] res.data keys:", res.data ? Object.keys(res.data) : "N/A");
                const bookingID = res.data?.BookingID || res.data?.booking_id || res.data?.id || res.data?.ID;
                console.log("[DEBUG] Booking created, ID:", bookingID);
                if (!bookingID) {
                    console.error("[ERROR] bookingID is undefined!");
                    setIsProcessingPayment(false);
                    notify.error("Lỗi tạo booking. Vui lòng thử lại.");
                    return;
                }
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

        // Lấy menu_items trực tiếp từ storage
        const storedMenuItems = JSON.parse(localStorage.getItem("menu_items")) || JSON.parse(sessionStorage.getItem("menu_items")) || [];
        const itemsToUse = storedMenuItems.length > 0 ? storedMenuItems : menu_items;

        // Chuẩn bị items cho order
        const items = itemsToUse.map(item => ({
            MenuItemID: item.MenuItemID,
            Quantity: item.Quantity || 1
        }));

        const orderPayload = {
            BookingID: bookingID,
            CustomerID: table_bookings.customer_id || table_bookings.CustomerID,
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
        // Ảnh mặc định nếu không có URL
        const defaultImage = 'https://bizweb.dktcdn.net/thumb/compact/100/469/097/products/untitled1bb4fdbb3bd7845448a799-a1c5a559-3505-435f-9278-d7ba29e9c529.jpg';
        if (!imageUrl) return defaultImage;
        // Encode URL de xu ly ky tu dac biet (dau cach, tieng Viet)
        const encodedPath = imageUrl.split('/').map(part => encodeURIComponent(part)).join('/');
        // Localhost
        return `http://localhost:8000/uploads/Categories/${encodedPath}`;
        // Deploy
    };

    return (
        <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 40px 0', minHeight: '70vh' }}>
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
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            padding: '0',
                            marginRight: '8px'
                        }}
                    >
                        ← Quay lại
                    </button>
                    <p className='m-0' style={{ color: '#fff' }}> / </p>
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
                                    <span>Ngày đặt:</span>
                                    <span>{table_bookings?.booking_date}</span>
                                </p>
                                <p>
                                    <span>Giờ đặt:</span>
                                    <span>{table_bookings?.booking_time}</span>
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
                            <h5 className="mb-3" style={{ fontWeight: '600' }}>Chọn phương thức thanh toán</h5>
                            <div className="d-flex gap-3 w-100">
                                <button
                                    style={{
                                        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                                        color: 'white',
                                        fontSize: '16px',
                                        padding: '16px 20px',
                                        border: 'none',
                                        borderRadius: '12px',
                                        flex: 1,
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => { HandlePayCash() }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(107, 114, 128, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(107, 114, 128, 0.3)';
                                    }}
                                >
                                    💵 Thanh toán tiền mặt
                                </button>
                                <button
                                    style={{
                                        background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
                                        color: 'white',
                                        fontSize: '16px',
                                        padding: '16px 20px',
                                        border: 'none',
                                        borderRadius: '12px',
                                        flex: 1,
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(13, 110, 253, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => { HandlePayVNPay() }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(13, 110, 253, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(13, 110, 253, 0.3)';
                                    }}
                                >
                                    💳 Thanh toán trực tuyến
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