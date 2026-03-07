import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../../../components/shared/Title';
import menuItemApi from '../../../api/menu_itemApi';

function ProductDetails() {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                console.log('Fetching product with ID:', id);
                const response = await menuItemApi.getById(id);
                console.log('API Response:', response);
                console.log('Response data:', response.data);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
                if (error.response) {
                    console.error('Error response:', error.response);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    const getImagePath = (imageUrl) => {
        if (!imageUrl) return '';
        return `http://localhost:8000/uploads/Categories/${imageUrl}`;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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

    if (!product) {
        return (
            <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0', minHeight: '100vh' }}>
                <div className='container text-center text-white py-5'>
                    <p>Không tìm thấy sản phẩm</p>
                </div>
            </div>
        );
    }

    return (
        <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0' style={{ height: '50px', background: '#000' }}>
                <div className='container h-100 d-flex align-items-center'>
                    <p className='m-0' style={{ color: '#fff' }}>Trang chủ / </p>
                    <p className='m-0' style={{ color: '#d69c52' }}>{product.Name}</p>
                </div>
            </div>

            <div className='container mt-5 pb-5'>
                <div className='row'>
                    <div className='col-md-9'>
                        <div className='row'>
                            <div className='col-md-5'>
                                <img
                                    className='w-100'
                                    src={getImagePath(product.ImageURL)}
                                    alt={product.Name}
                                />
                            </div>

                            <div className='col-md-7'>
                                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '50px', color: '#fff' }}>
                                    {product.Name}
                                </p>

                                <p style={{ color: 'red', fontSize: '30px' }}>{formatPrice(product.Price)}</p>

                                <p style={{ color: '#fff', fontSize: '20px' }}>Số lượng :</p>

                                <div className='d-flex' style={{ width: '120px', height: '30px' }}>
                                    <button
                                        className='border-0'
                                        style={{ width: '40px', backgroundColor: '#d69c52', marginRight: '8px', borderRadius: '5px' }}
                                        onClick={handleDecrease}
                                    >
                                        -
                                    </button>

                                    <input
                                        className='w-100 border-0 text-center'
                                        type="number"
                                        style={{ borderRadius: '5px' }}
                                        value={quantity}
                                        readOnly
                                    />

                                    <button
                                        className='border-0'
                                        style={{ width: '40px', backgroundColor: '#d69c52', marginLeft: '8px', borderRadius: '5px' }}
                                        onClick={handleIncrease}
                                    >
                                        +
                                    </button>
                                </div>

                                <button className='bt-booking mt-4' style={{ width: '180px' }}>
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>

                        {/* mô tả */}
                        <div className='mt-3 text-white'>
                            <Title title='Mô tả món ăn' />

                            <p className='mt-3'>
                                {product.Description || 'Đang cập nhật mô tả...'}
                            </p>

                            <h4>Trạng thái :</h4>
                            <p>{product.Status || 'Còn hàng'}</p>
                        </div>
                    </div>

                    {/* gợi ý */}
                    <div className='col-md-3 p-2'>
                        <div style={{ border: '1px solid #d69c52', borderRadius: '10px', background: '#d69c52', height: '440px' }}>
                            <p style={{ color: '#fff', fontSize: '20px', textAlign: 'center', paddingTop: '8px' }}>
                                Có thể bạn đang tìm
                            </p>

                            <div style={{ background: '#10302c', height: '87.5%', borderRadius: '0 0 10px 10px' }}>
                                <div className='row p-2'>
                                    <div className="col-md-5">
                                        <img
                                            className='w-100'
                                            style={{ borderRadius: '5px' }}
                                            src='https://bizweb.dktcdn.net/thumb/medium/100/469/097/products/1c8da310231574e189b9012e3125a3.jpg?v=1667881665957'
                                            alt='Dương cam chi lộ'
                                        />
                                    </div>
                                    <div className="col-md-7 d-flex flex-column justify-content-center">
                                        <p style={{ color: '#fff' }}>Dương cam chi lộ</p>
                                        <p style={{ color: 'red' }}>55.000đ</p>
                                    </div>
                                </div>
                                <div className='row p-2'>
                                    <div className="col-md-5">
                                        <img
                                            className='w-100'
                                            style={{ borderRadius: '5px' }}
                                            src='https://bizweb.dktcdn.net/thumb/medium/100/469/097/products/19fe207c1918443c493a8ffc37de05.jpg?v=1667881644533'
                                            alt='Trà nhài nhãn'
                                        />
                                    </div>
                                    <div className="col-md-7 d-flex flex-column justify-content-center">
                                        <p style={{ color: '#fff' }}>Trà nhài nhãn</p>
                                        <p style={{ color: 'red' }}>48.000đ</p>
                                    </div>
                                </div>
                                <div className='row p-2'>
                                    <div className="col-md-5">
                                        <img
                                            className='w-100'
                                            style={{ borderRadius: '5px' }}
                                            src='https://bizweb.dktcdn.net/thumb/medium/100/469/097/products/1f8b8eb2049ed4362bd32f0899192c.jpg?v=1667881453383'
                                            alt='Trà sữa ô long'
                                        />
                                    </div>
                                    <div className="col-md-7 d-flex flex-column justify-content-center">
                                        <p style={{ color: '#fff' }}>Trà sữa ô long</p>
                                        <p style={{ color: 'red' }}>45.000đ</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
