import order_detailApi from "../../../api/order_detailApi";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { apiUrl } from "../../../config";

function OrderDetail() {
    const [order_details, setorder_details] = useState(null);
    const { OrderID } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!OrderID) return;

        order_detailApi.getAllOfOrder(OrderID)
            .then(response => {
                setorder_details(response.data);
            })
            .catch(error => {
                console.error('có lỗi trong quá trình lấy dl: ' + error);
            });
    }, [OrderID]);

    const getImagePath = (imageUrl) => {
        if (!imageUrl) return "";
        // Encode URL de xu ly ky tu dac biet (dau cach, tieng Viet)
        const encodedPath = imageUrl.split('/').map(part => encodeURIComponent(part)).join('/');
        // Localhost
        return `http://localhost:8000/uploads/Categories/${encodedPath}`;
        // Deploy
    };

    const handleBackToOrder = () => {
        navigate(-1);
    };

    return (
        <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0' style={{ height: '50px', background: '#000' }}>
                <div className='container h-100 d-flex align-items-center'>
                    <p className='m-0' style={{ color: '#fff' }}>Trang chủ / </p>
                    <p className='m-0' style={{ color: '#d69c52' }}>Chi tiết đơn hàng</p>
                </div>
            </div>

            <div className='container order'>
                <div className='container pb-3 mt-5'>
                    <button onClick={handleBackToOrder} className="mb-3 btn btn-warning">
                        ⬅ Quay lại
                    </button>

                    <table className="w-100">
                        <thead>
                            <tr style={{ background: '#135b50', color: 'white' }}>
                                <th>Ảnh món ăn</th>
                                <th>Tên món ăn</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order_details?.map((order_detail, index) => (
                                <tr key={index} style={{ background: '#135b50', color: 'white' }}>
                                    <td>
                                        <img
                                            style={{ width: '108px', cursor: 'pointer' }}
                                            src={getImagePath(order_detail.menu_item.ImageURL)}
                                            alt={order_detail.menu_item.Name}
                                            onClick={handleBackToOrder}
                                        />
                                    </td>
                                    <td>{order_detail.menu_item.Name}</td>
                                    <td>{order_detail.Price}</td>
                                    <td>{order_detail.Quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
