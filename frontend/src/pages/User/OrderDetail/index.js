import order_detailApi from "../../../api/order_detailApi";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatNumber } from "../../../components/utils/format_number";
import { useNotify } from "../../../contexts/ToastContext";
import './index.css';

function OrderDetail() {
    const navigate = useNavigate();
    const notify = useNotify();
    const [order_details, setorder_details] = useState(null);
    const [loading, setLoading] = useState(true);
    const { OrderID } = useParams();

    useEffect(() => {
        if (!OrderID) return;
        setLoading(true);

        order_detailApi.getByOrder(OrderID)
            .then(response => {
                console.log('OrderDetail API Response:', response.data);
                setorder_details(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
                notify.error("Không thể tải chi tiết đơn hàng");
                setLoading(false);
            });
    }, [OrderID]);

    const getImagePath = (productImg) => {
        if (!productImg) return '';
        // Encode URL de xu ly ky tu dac biet (dau cach, tieng Viet)
        const encodedPath = productImg.split('/').map(part => encodeURIComponent(part)).join('/');
        // Localhost
        return `http://localhost:8000/uploads/Categories/${encodedPath}`;
        // Deploy
    };

    return (
        <div className='container-fluid w-100 order-detail-page' style={{ padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0 order-detail-breadcrumb'>
                <div className='container h-100 d-flex align-items-center breadcrumb-inner'>
                    <p className='m-0'>Trang chủ / </p>
                    <p
                        className='m-0 breadcrumb-current'
                        onClick={() => navigate(-1)}
                    >
                        Chi tiết đơn hàng
                    </p>
                </div>
            </div>

            <div className='container order-detail-content'>
                <h2 className='order-detail-title'>Chi tiết món trong đơn</h2>

                {loading ? (
                    <div className="order-detail-loading">
                        <div className="spinner" />
                        <p>Đang tải chi tiết đơn hàng...</p>
                    </div>
                ) : order_details && order_details.length > 0 ? (
                    <>
                        <div className="order-detail-table-wrap">
                            <table className="order-detail-table">
                                <thead>
                                    <tr>
                                        <th>Ảnh món ăn</th>
                                        <th>Tên món ăn</th>
                                        <th>Đơn giá</th>
                                        <th>Số lượng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order_details.map((order_detail, index) => (
                                        <tr key={order_detail.OrderDetailID ?? index}>
                                            <td data-label="">
                                                <img
                                                    className="order-detail-img"
                                                    src={getImagePath(order_detail.menu_item.ImageURL)}
                                                    alt={order_detail.menu_item.Name}
                                                />
                                            </td>
                                            <td className="order-detail-name" data-label="Tên món">
                                                {order_detail.menu_item.Name}
                                            </td>
                                            <td className="order-detail-price" data-label="Đơn giá">
                                                {formatNumber(order_detail.Price)} đ
                                            </td>
                                            <td data-label="Số lượng">
                                                <span className="order-detail-qty">{order_detail.Quantity}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button
                            type="button"
                            className="order-detail-back"
                            onClick={() => navigate(-1)}
                        >
                            ← Quay lại
                        </button>
                    </>
                ) : (
                    <div className="order-detail-empty">
                        <div className="order-detail-empty-icon">🍽️</div>
                        <p>Không có món nào trong đơn này.</p>
                        <button
                            type="button"
                            className="order-detail-back"
                            onClick={() => navigate(-1)}
                        >
                            ← Quay lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderDetail;
