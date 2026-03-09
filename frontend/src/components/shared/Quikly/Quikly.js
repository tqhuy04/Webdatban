import { useState } from 'react';
import Notification from '../Notification';
import { formatNumber } from '../../utils/format_number';

const Quikly = ({ onClose, ImageURL, menu_item }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState({
        message: '',
        type: '',
    });

    if (!menu_item) return null;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        setNotification({ message: 'Thêm vào giỏ hàng thành công!', type: 'success' });

        setTimeout(() => {
            setNotification({ message: '', type: '' });
        }, 3000);
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200);
    };

    return (
        <>
            {notification.message && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                />
            )}

            <div className={`form-popup ${isVisible ? 'slide-in' : 'slide-out'}`} onClick={handleClose}>
                <button onClick={handleClose}>X</button>

                <div className="row p-2">
                    <div className="col-md-6">
                        <img src={ImageURL} alt={menu_item.Name} style={{ width: '90%' }} />
                    </div>

                    <div className="col-md-6">
                        <p>{menu_item.Name}</p>
                        <p style={{ color: 'red' }}>{formatNumber(menu_item.Price)}</p>

                        <div className="d-flex">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <input value={quantity} readOnly />
                            <button onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>

                        <button onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Quikly;
