import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { useNotify } from '../../../contexts/ToastContext';

function Cart() {
    const navigate = useNavigate();
    const notify = useNotify();
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

    const handleToPay = () => {
        if (cartItems.length === 0) {
            notify.warning('Giỏ hàng trống! Vui lòng thêm sản phẩm vào giỏ hàng.');
            return;
        }
        navigate('/Checkout');
    };

    const getImagePath = (imageUrl) => {
        if (!imageUrl) return 'https://bizweb.dktcdn.net/thumb/compact/100/469/097/products/untitled1bb4fdbb3bd7845448a799-a1c5a559-3505-435f-9278-d7ba29e9c529.jpg';
        return `http://localhost:8000/uploads/Categories/${imageUrl}`;
    };

    const formatNumber = (num) => {
        if (num === undefined || num === null) return "0";
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleIncrease = (item) => {
        updateQuantity(item.MenuItemID, item.Quantity + 1);
    };

    const handleDecrease = (item) => {
        if (item.Quantity > 1) {
            updateQuantity(item.MenuItemID, item.Quantity - 1);
        } else {
            removeFromCart(item.MenuItemID);
        }
    };

    const handleRemove = (menuItemId) => {
        removeFromCart(menuItemId);
    };

    if (cartItems.length === 0) {
        return (
            <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
                <div className='container-fluid p-0' style={{ height: '50px', background: '#000' }}>
                    <div className='container h-100 d-flex align-items-center'>
                        <p className='m-0' style={{ color: '#fff' }}>Trang chủ / </p>
                        <p className='m-0' style={{ color: '#d69c52' }}> Giỏ hàng</p>
                    </div>
                </div>

                <div className='container text-white pb-3 mt-5 text-center'>
                    <p style={{ fontSize: '22px' }}>Giỏ hàng của bạn</p>
                    <div style={{ border: '1px solid #fff', padding: '50px', marginTop: '20px' }}>
                        <p style={{ fontSize: '18px', color: '#aaa' }}>Giỏ hàng trống</p>
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
            </div>
        );
    }

    return (
        <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0' style={{ height: '50px', background: '#000' }}>
                <div className='container h-100 d-flex align-items-center'>
                    <p className='m-0' style={{ color: '#fff' }}>Trang chủ / </p>
                    <p className='m-0' style={{ color: '#d69c52' }}> Giỏ hàng</p>
                </div>
            </div>

            <div className='container text-white pb-3 mt-5'>
                <p style={{ fontSize: '22px' }}>Giỏ hàng của bạn</p>

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
                                            style={{ width: '108px', height: '80px', objectFit: 'cover' }}
                                            src={getImagePath(item.ImageURL)}
                                            alt={item.Name}
                                        />
                                        <div style={{ marginLeft: '8px' }}>
                                            <p className='mb-1' style={{ fontWeight: 'bold' }}>{item.Name}</p>
                                            <button
                                                onClick={() => handleRemove(item.MenuItemID)}
                                                style={{ border: 'none', color: '#c8760b', background: 'none', cursor: 'pointer' }}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>

                                    <div className='col-md-2' style={{ color: '#c8760b' }}>
                                        {formatNumber(item.Price)}đ
                                    </div>

                                    <div className='col-md-2'>
                                        <div className='d-flex' style={{ width: '100px', height: '30px' }}>
                                            <button
                                                className='border-0'
                                                style={{
                                                    width: '30px',
                                                    backgroundColor: '#d69c52',
                                                    marginRight: '8px',
                                                    borderRadius: '5px',
                                                    color: '#fff'
                                                }}
                                                onClick={() => handleDecrease(item)}
                                            >
                                                -
                                            </button>

                                            <input
                                                className='w-100 border-0 text-center'
                                                type="number"
                                                style={{ borderRadius: '5px' }}
                                                value={item.Quantity}
                                                readOnly
                                            />

                                            <button
                                                className='border-0'
                                                style={{
                                                    width: '30px',
                                                    backgroundColor: '#d69c52',
                                                    marginLeft: '8px',
                                                    borderRadius: '5px',
                                                    color: '#fff'
                                                }}
                                                onClick={() => handleIncrease(item)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className='col-md-2' style={{ color: '#c8760b', fontWeight: 'bold' }}>
                                        {formatNumber(item.Price * item.Quantity)}đ
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='row'>
                            <div className='col-md-8'></div>
                            <div className='col-md-4 d-flex align-items-center justify-content-between mt-3'>
                                <p>Tổng tiền:</p>
                                <p style={{ color: '#d69c52', fontSize: '20px', fontWeight: 'bold' }}>
                                    {formatNumber(getCartTotal())}đ
                                </p>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-8'></div>
                            <div className='col-md-4 mt-3'>
                                <button
                                    onClick={handleToPay}
                                    style={{
                                        width: '100%',
                                        height: '45px',
                                        borderRadius: '6px',
                                        color: '#fff',
                                        background: '#d69c52',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Thanh toán
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div style={{ border: '1px solid #fff', padding: '20px' }}>
                            <h5 style={{ color: '#d69c52' }}>Thông tin đơn hàng</h5>
                            <p className='mt-3'>Số sản phẩm: <strong>{cartItems.length}</strong></p>
                            <p>Tổng số lượng: <strong>{cartItems.reduce((sum, item) => sum + item.Quantity, 0)}</strong></p>
                            <hr style={{ borderColor: '#fff' }} />
                            <p>Tổng cộng: <strong style={{ color: '#d69c52', fontSize: '18px' }}>{formatNumber(getCartTotal())}đ</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
