import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import Quikly from '../Quikly/Quikly';
import Notification from '../Notification';

const ProductFrame = ({ products }) => {
    const { addToCart } = useCart();

    const getImagePath = (imageUrl) => {
        if (!imageUrl) return '';
        return encodeURI(
            `http://localhost:8000/uploads/Categories/${imageUrl}`
        );
    };


    const handleAddToCart = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };


    return (
        <>
            <div className="row">
                {products?.map((product) => (
                    <div
                        key={product.MenuItemID}
                        className="col-md-2 text-center pro-item p-1 position-relative"
                        style={{ background: '#908f8f', marginBottom: '24px' }}
                    >
                        <div
                            className="pro-item_child"
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                background: '#fff',
                                top: '1%',
                                padding: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <img
                                    src={getImagePath(product.ImageURL)}
                                    alt={product.Name}
                                    style={{ height: '195px', width: '100%' }}
                                    className="mb-2"
                                />

                                <h5>{product.Name}</h5>
                            </div>

                            <div className="pro-item-actions" style={{ marginTop: '8px' }}>
                                <Link to={`/ProductDetails/${product.MenuItemID}`} className="btn-details">
                                    Xem chi tiết
                                </Link>
                                <button
                                    onClick={(e) => handleAddToCart(product, e)}
                                    className="btn-add-cart"
                                >
                                    Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Quikly />
            <Notification />
        </>
    );
};

export default ProductFrame;
