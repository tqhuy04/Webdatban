import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    const handleToPay = () => {
        navigate('/Pay');
    };

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

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

                            <div
                                className='row p-2 w-100 m-0 align-items-center'
                                style={{ borderTop: '1px solid #fff' }}
                            >
                                <div className='col-md-6 d-flex align-items-center'>
                                    <img
                                        style={{ width: '108px' }}
                                        src='https://bizweb.dktcdn.net/thumb/compact/100/469/097/products/untitled1bb4fdbb3bd7845448a799-a1c5a559-3505-435f-9278-d7ba29e9c529.jpg'
                                        alt='Salad rau màu sốt mác mác'   // ✅ alt hợp lệ
                                    />
                                    <div style={{ marginLeft: '8px' }}>
                                        <p>Salad rau màu sốt mác mác</p>
                                        <button
                                            style={{ border: 'none', color: '#c8760b', background: 'none' }}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>

                                <div className='col-md-2' style={{ color: '#c8760b' }}>
                                    68.000đ
                                </div>

                                <div className='col-md-2'>
                                    <div className='d-flex' style={{ width: '100px', height: '30px' }}>
                                        <button
                                            className='border-0'
                                            style={{
                                                width: '50px',
                                                backgroundColor: '#d69c52',
                                                marginRight: '8px',
                                                borderRadius: '5px'
                                            }}
                                            onClick={handleDecrease}   // ✅ dùng setQuantity
                                        >
                                            -
                                        </button>

                                        <input
                                            className='w-100 border-0'
                                            type="number"
                                            style={{ borderRadius: '5px' }}
                                            value={quantity}
                                            readOnly
                                        />

                                        <button
                                            className='border-0'
                                            style={{
                                                width: '50px',
                                                backgroundColor: '#d69c52',
                                                marginLeft: '8px',
                                                borderRadius: '5px'
                                            }}
                                            onClick={handleIncrease}   // ✅ dùng setQuantity
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className='col-md-2' style={{ color: '#c8760b' }}>
                                    {68_000 * quantity}đ
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-8'></div>
                            <div className='col-md-4 d-flex align-items-center justify-content-between mt-3'>
                                <p>Tổng tiền:</p>
                                <p style={{ color: '#d69c52' }}>
                                    {68_000 * quantity}đ
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
                                        border: 'none'
                                    }}
                                >
                                    Thanh toán
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-4'></div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
