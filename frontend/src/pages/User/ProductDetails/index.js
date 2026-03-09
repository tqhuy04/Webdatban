import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Title from '../../../components/shared/Title';
import menuItemApi from '../../../api/menu_itemApi';
import { useCart } from '../../../contexts/CartContext';
import Notification from '../../../components/shared/Notification';

const SUGGEST_LIMIT = 3;

function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({
        message: '',
        type: 'success',
    });

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await menuItemApi.getById(id);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!product) return;
            try {
                const res = await menuItemApi.getAll();
                const all = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
                const others = all.filter((item) => item.MenuItemID !== product.MenuItemID);
                const sameCategory = others.filter((item) => item.CategoryID === product.CategoryID);
                const rest = others.filter((item) => item.CategoryID !== product.CategoryID);
                const list = [...sameCategory, ...rest].slice(0, SUGGEST_LIMIT);
                setSuggestions(list);
            } catch (e) {
                console.error('Error fetching suggestions:', e);
            }
        };
        fetchSuggestions();
    }, [product]);

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

    const handleAddToCart = () => {
        if (!product) return;

        addToCart(product, quantity);
        setNotification({
            message: 'Thêm vào giỏ hàng thành công!',
            type: 'success',
        });

        setTimeout(() => {
            setNotification({
                message: '',
                type: 'success',
            });
        }, 3000);
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
            <Notification message={notification.message} type={notification.type} />

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

                                <button
                                    className='bt-booking mt-4'
                                    style={{ width: '180px' }}
                                    onClick={handleAddToCart}
                                >
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

                    {/* Có thể bạn đang tìm - gợi ý từ API */}
                    <div className='col-md-3 p-2'>
                        <div style={{ border: '1px solid #d69c52', borderRadius: '10px', background: '#d69c52', minHeight: '200px' }}>
                            <p style={{ color: '#fff', fontSize: '20px', textAlign: 'center', paddingTop: '8px' }}>
                                Có thể bạn đang tìm
                            </p>
                            <div style={{ background: '#10302c', padding: '8px 0', borderRadius: '0 0 10px 10px' }}>
                                {suggestions.length === 0 ? (
                                    <p className="text-white text-center small mb-0 py-2">Đang tải gợi ý...</p>
                                ) : (
                                    suggestions.map((item) => (
                                        <Link
                                            key={item.MenuItemID}
                                            to={`/ProductDetails/${item.MenuItemID}`}
                                            className="text-decoration-none d-block"
                                        >
                                            <div className="row p-2 align-items-center mx-0">
                                                <div className="col-5 p-0 pl-2">
                                                    <img
                                                        className="w-100"
                                                        style={{ borderRadius: '5px', aspectRatio: '1', objectFit: 'cover' }}
                                                        src={getImagePath(item.ImageURL)}
                                                        alt={item.Name}
                                                    />
                                                </div>
                                                <div className="col-7 d-flex flex-column justify-content-center">
                                                    <p className="mb-0 text-white small" style={{ color: '#fff' }}>{item.Name}</p>
                                                    <p className="mb-0 small" style={{ color: 'red' }}>{formatPrice(item.Price)}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
