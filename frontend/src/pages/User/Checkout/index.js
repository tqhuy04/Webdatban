import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import customerApi from '../../../api/customerApi';
import userApi from '../../../api/userApi';
import tableApi from '../../../api/tableApi';
import { useNotify } from '../../../contexts/ToastContext';

function Checkout() {
    const navigate = useNavigate();
    const notify = useNotify();
    const { cartItems, getCartTotal, clearCart } = useCart();

    const [customer, setCustomer] = useState(null);
    /** Email nằm trên Account (/accounts/me), không có trong Customer */
    const [accountEmail, setAccountEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showTableModal, setShowTableModal] = useState(false);
    const [tables, setTables] = useState([]);
    const [loadingTables, setLoadingTables] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/Login');
            return;
        }

        customerApi.getByIdUser()
            .then(res => {
                setCustomer(res.data);
            })
            .catch(() => {
                notify.warning('Vui lòng cập nhật thông tin cá nhân trước!');
                navigate('/PersonalIn4');
            })
            .finally(() => setLoading(false));

        userApi.getMe()
            .then(res => setAccountEmail(res.data?.email || ''))
            .catch(() => {});
    }, [navigate, notify]);

    const getImagePath = (imageUrl) => {
        if (!imageUrl) return 'https://bizweb.dktcdn.net/thumb/compact/100/469/097/products/untitled1bb4fdbb3bd7845448a799-a1c5a559-3505-435f-9278-d7ba29e9c529.jpg';
        // Encode URL de xu ly ky tu dac biet (dau cach, tieng Viet)
        const encodedPath = imageUrl.split('/').map(part => encodeURIComponent(part)).join('/');
        // Localhost
        return `http://localhost:8000/uploads/Categories/${encodedPath}`;
        // Deploy
    };

    const formatNumber = (num) => {
        if (num === undefined || num === null) return "0";
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    useEffect(() => {
        if (!showTableModal || tables.length > 0) return;

        setLoadingTables(true);
        tableApi
            .getAll()
            .then(res => {
                setTables(res.data || []);
            })
            .catch(err => {
                console.error('Lỗi lấy danh sách bàn:', err);
            })
            .finally(() => setLoadingTables(false));
    }, [showTableModal, tables.length]);

    const handleOpenTableModal = () => {
        if (cartItems.length === 0) {
            notify.warning('Giỏ hàng trống!');
            return;
        }

        if (!customer) {
            notify.warning('Vui lòng cập nhật thông tin cá nhân!');
            return;
        }

        if (!bookingDate || !bookingTime) {
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10);
            const timeStr = now.toTimeString().slice(0, 5);
            setBookingDate(dateStr);
            setBookingTime(timeStr);
        }

        setShowTableModal(true);
    };

    const handleSubmitOrder = () => {
        if (!bookingDate || !bookingTime) {
            notify.warning('Vui lòng chọn ngày và giờ đến!');
            return;
        }

        if (!selectedTable) {
            notify.warning('Vui lòng chọn bàn trước khi đặt hàng!');
            return;
        }

        setSubmitting(true);

        try {
            // Lưu thông tin sang sessionStorage để trang Bill sử dụng
            const customerId = customer?.id || customer?.CustomerID;

            const emailForOrder = accountEmail || customer?.email || '';

            const bookingInfo = {
                booking_date: bookingDate,
                booking_time: bookingTime,
                customer_id: customerId,
                full_name: customer?.full_name,
                email: emailForOrder,
                phone_number: customer?.phone_number,
                address: customer?.address,
                people: selectedTable?.Capacity || 1,
                status: 0,
                BookingTime: `${bookingDate} ${bookingTime}`,
            };

            sessionStorage.setItem('table_bookings', JSON.stringify(bookingInfo));
            sessionStorage.setItem('tables', JSON.stringify([selectedTable]));
            sessionStorage.setItem('menu_items', JSON.stringify(cartItems));
            sessionStorage.setItem('total_price', JSON.stringify(getCartTotal()));
            // Dùng localStorage để giữ dữ liệu khi redirect từ VNPay về
            localStorage.setItem('table_bookings', JSON.stringify(bookingInfo));
            localStorage.setItem('tables', JSON.stringify([selectedTable]));
            localStorage.setItem('menu_items', JSON.stringify(cartItems));
            localStorage.setItem('total_price', JSON.stringify(getCartTotal()));
            sessionStorage.setItem(
                'customer',
                JSON.stringify({
                    CustomerID: customerId,
                    full_name: customer?.full_name,
                    email: emailForOrder,
                    phone_number: customer?.phone_number,
                    address: customer?.address,
                })
            );
            localStorage.setItem(
                'customer',
                JSON.stringify({
                    CustomerID: customerId,
                    full_name: customer?.full_name,
                    email: emailForOrder,
                    phone_number: customer?.phone_number,
                    address: customer?.address,
                })
            );

            clearCart();
            notify.success('Đặt bàn & chuyển sang thanh toán!');
            setShowTableModal(false);
            setSelectedTable(null);
            setBookingDate('');
            setBookingTime('');
            navigate('/Bill');
        } catch (error) {
            console.error('Error preparing bill data:', error);
            notify.error('Có lỗi xảy ra khi chuẩn bị thanh toán. Vui lòng thử lại!');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0', minHeight: '100vh' }}>
                <div className='container text-center text-white py-5'>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
                <div className='container-fluid p-0' style={{ height: '50px', background: '#000' }}>
                    <div className='container h-100 d-flex align-items-center'>
                        <p className='m-0' style={{ color: '#fff' }}>Trang chủ / </p>
                        <p className='m-0' style={{ color: '#d69c52' }}> Thanh toán</p>
                    </div>
                </div>
                <div className='container text-white pb-3 mt-5 text-center'>
                    <p style={{ fontSize: '22px' }}>Giỏ hàng trống</p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            marginTop: '20px',
                            padding: '10px 30px',
                            borderRadius: '6px',
                            color: '#fff',
                            background: '#d69c52',
                            border: 'none'
                        }}
                    >
                        Tiếp tục mua hàng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0' style={{ height: '50px', background: '#000' }}>
                <div className='container h-100 d-flex align-items-center'>
                    <p className='m-0' style={{ color: '#fff' }}>Trang chủ / </p>
                    <p className='m-0' style={{ color: '#d69c52' }}> Thanh toán</p>
                </div>
            </div>

            <div className='container text-white pb-3 mt-5'>
                <p style={{ fontSize: '22px' }}>Thanh toán đơn hàng</p>

                <div className='row'>
                    <div className='col-md-8'>
                        <div style={{ border: '1px solid #fff' }}>
                            <div className='row p-2'>
                                <div className='col-md-6'>Thông tin sản phẩm</div>
                                <div className='col-md-2'>Đơn giá</div>
                                <div className='col-md-2'>Số lượng</div>
                                <div className='col-md-2'>Thành tiền</div>
                            </div>

                            {cartItems.map((item) => (
                                <div
                                    key={item.MenuItemID}
                                    className='row p-2 w-100 m-0 align-items-center'
                                    style={{ borderTop: '1px solid #fff' }}
                                >
                                    <div className='col-md-6 d-flex align-items-center'>
                                        <img
                                            style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                                            src={getImagePath(item.ImageURL)}
                                            alt={item.Name}
                                        />
                                        <div style={{ marginLeft: '8px' }}>
                                            <p className='mb-1' style={{ fontWeight: 'bold' }}>{item.Name}</p>
                                        </div>
                                    </div>

                                    <div className='col-md-2' style={{ color: '#c8760b' }}>
                                        {formatNumber(item.Price)}đ
                                    </div>

                                    <div className='col-md-2'>
                                        {item.Quantity}
                                    </div>

                                    <div className='col-md-2' style={{ color: '#c8760b', fontWeight: 'bold' }}>
                                        {formatNumber(item.Price * item.Quantity)}đ
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='mt-4' style={{ border: '1px solid #fff', padding: '20px' }}>
                            <h5 style={{ color: '#d69c52' }}>Thông tin khách hàng</h5>
                            <div className='row mt-3'>
                                <div className='col-md-6'>
                                    <p><strong>Họ tên:</strong> {customer?.full_name}</p>
                                    <p><strong>SĐT:</strong> {customer?.phone_number}</p>
                                </div>
                                <div className='col-md-6'>
                                    <p><strong>Email:</strong> {(accountEmail || customer?.email) || 'Chưa cập nhật'}</p>
                                    <p><strong>Địa chỉ:</strong> {customer?.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div style={{ border: '1px solid #fff', padding: '20px', position: 'sticky', top: '100px' }}>
                            <h5 style={{ color: '#d69c52' }}>Tổng quan đơn hàng</h5>

                            <div className='mt-3'>
                                <p>Số sản phẩm: <strong>{cartItems.length}</strong></p>
                                <p>Tổng số lượng: <strong>{cartItems.reduce((sum, item) => sum + item.Quantity, 0)}</strong></p>
                            </div>

                            <hr style={{ borderColor: '#fff' }} />

                            <div className='d-flex justify-content-between'>
                                <p style={{ fontSize: '18px' }}>Tổng cộng:</p>
                                <p style={{ color: '#d69c52', fontSize: '24px', fontWeight: 'bold' }}>
                                    {formatNumber(getCartTotal())}đ
                                </p>
                            </div>

                            <button
                                onClick={handleOpenTableModal}
                                disabled={submitting}
                                style={{
                                    width: '100%',
                                    height: '50px',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    background: '#d69c52',
                                    border: 'none',
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    marginTop: '20px',
                                    opacity: submitting ? 0.7 : 1
                                }}
                            >
                                {submitting ? 'Đang xử lý...' : 'Đặt hàng'}
                            </button>

                            <button
                                onClick={() => navigate('/Cart')}
                                style={{
                                    width: '100%',
                                    height: '45px',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    background: 'transparent',
                                    border: '1px solid #fff',
                                    cursor: 'pointer',
                                    marginTop: '10px'
                                }}
                            >
                                Quay lại giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showTableModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: '10px',
                            padding: '20px',
                            width: '700px',
                            maxHeight: '80vh',
                            overflowY: 'auto'
                        }}
                    >
                        <h4 style={{ marginBottom: '16px', color: '#10302c' }}>Chọn bàn</h4>
                        <div
                            style={{
                                display: 'flex',
                                gap: '12px',
                                marginBottom: '16px'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontWeight: '500',
                                        marginBottom: '4px'
                                    }}
                                >
                                    Ngày đến
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={bookingDate}
                                    onChange={e => setBookingDate(e.target.value)}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontWeight: '500',
                                        marginBottom: '4px'
                                    }}
                                >
                                    Giờ đến
                                </label>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={bookingTime}
                                    onChange={e => setBookingTime(e.target.value)}
                                />
                            </div>
                        </div>
                        {loadingTables ? (
                            <p>Đang tải danh sách bàn...</p>
                        ) : (
                            <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '16px' }}>
                                {tables
                                    .filter(table => table.Status !== 1)
                                    .map(table => (
                                        <div
                                            key={table.TableID}
                                            onClick={() => setSelectedTable(table)}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '10px 12px',
                                                borderRadius: '6px',
                                                border: selectedTable?.TableID === table.TableID
                                                    ? '2px solid #d69c52'
                                                    : '1px solid #ddd',
                                                marginBottom: '8px',
                                                cursor: 'pointer',
                                                background: selectedTable?.TableID === table.TableID ? '#fff6eb' : '#fff'
                                            }}
                                        >
                                            <div>
                                                <strong>{table.TableNumber}</strong>
                                                <p className='mb-0' style={{ fontSize: '13px' }}>
                                                    Sức chứa: {table.Capacity} người
                                                </p>
                                            </div>
                                            {table.Status === 1 && (
                                                <span style={{ color: 'red', fontSize: '13px' }}>Đã được đặt</span>
                                            )}
                                        </div>
                                    ))}
                                {tables.filter(table => table.Status !== 1).length === 0 && (
                                    <p>Hiện tại chưa có bàn trống.</p>
                                )}
                            </div>
                        )}

                        <h5 style={{ marginTop: '8px', color: '#10302c' }}>Hóa đơn</h5>
                        <div
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                padding: '10px',
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }}
                        >
                            {cartItems.map(item => (
                                <div
                                    key={item.MenuItemID}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '6px'
                                    }}
                                >
                                    <span>{item.Name} x {item.Quantity}</span>
                                    <span style={{ color: '#c8760b' }}>
                                        {formatNumber(item.Price * item.Quantity)}đ
                                    </span>
                                </div>
                            ))}
                            <hr />
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontWeight: 'bold'
                                }}
                            >
                                <span>Tổng cộng:</span>
                                <span style={{ color: '#d69c52' }}>
                                    {formatNumber(getCartTotal())}đ
                                </span>
                            </div>
                        </div>

                        <div className='text-end mt-3'>
                            <button
                                onClick={() => {
                                    setShowTableModal(false);
                                    if (!submitting) {
                                        setSelectedTable(null);
                                    }
                                }}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid #6c757d',
                                    background: '#fff',
                                    marginRight: '10px'
                                }}
                                disabled={submitting}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmitOrder}
                                disabled={submitting}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: '#d69c52',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    opacity: submitting ? 0.7 : 1,
                                    cursor: submitting ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {submitting ? 'Đang xử lý...' : 'Xác nhận đặt bàn & đặt món'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Checkout;
