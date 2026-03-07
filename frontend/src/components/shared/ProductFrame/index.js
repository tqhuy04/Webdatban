import React from 'react';
import { Link } from 'react-router-dom';
// import { apiUrl } from '../../../config';
import Quikly from '../Quikly/Quikly';
import Notification from '../Notification';

const ProductFrame = ({ products }) => {

    const getImagePath = (imageUrl) => {
    if (!imageUrl) return '';
    return encodeURI(
        `http://localhost:8000/uploads/Categories/${imageUrl}`
    );
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
                            }}
                        >
                            <img
                                src={getImagePath(product.ImageURL)}
                                alt={product.Name}
                                style={{ height: '195px', width: '100%' }}
                                className="mb-2"
                            />

                            <h5 style={{ height: '48px' }}>{product.Name}</h5>
                            <p className="text-danger">{product.Price}</p>
                        </div>

                        <Link to={`/ProductDetails/${product.MenuItemID}`}>
                            <button
                                style={{
                                    position: 'absolute',
                                    bottom: '-5%',
                                    left: '30%',
                                    border: 'none',
                                    borderRadius: '5px',
                                    background: '#bd8133',
                                    color: '#fff',
                                    padding: '5px',
                                }}
                            >
                                Xem chi tiết
                            </button>
                        </Link>
                    </div>
                ))}
            </div>

            <Quikly />
            <Notification />
        </>
    );
};

export default ProductFrame;
