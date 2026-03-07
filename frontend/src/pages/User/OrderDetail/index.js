import order_detailApi from "../../../api/order_detailApi";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiUrl } from "../../../config";

function OrderDetail() {
    const navigate = useNavigate(); // ✅ dùng thật
    const [order_details, setorder_details] = useState(null);
    const { OrderID } = useParams();

    useEffect(() => {
        if (!OrderID) return;

        order_detailApi.getAllOfOrder(OrderID)
            .then(response => {
                setorder_details(response.data);
            })
            .catch(error => {
                console.error('có lỗi trong quá trình lấy dl: ' + error);
            });
    }, [OrderID]); // ✅ thêm dependency

    const getImagePath = (productImg) => {
        return `${apiUrl}/uploads/Categories/${productImg}`;
    };

    return (
        <div className='container-fluid w-100' style={{ background: '#10302c', padding: '80px 0 0 0' }}>
            <div className='container-fluid p-0' style={{ height: '50px', background: '#000' }}>
                <div className='container h-100 d-flex align-items-center'>
                    <p className='m-0' style={{ color: '#fff' }}>Trang chủ / </p>
                    <p
                        className='m-0'
                        style={{ color: '#d69c52', cursor: 'pointer' }}
                        onClick={() => navigate(-1)}   // ✅ dùng useNavigate
                    >
                        Chi tiết đơn hàng
                    </p>
                </div>
            </div>

            <div className='container order'>
                <div className='container pb-3 mt-5'>
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
                                            style={{ width: '108px' }}
                                            src={getImagePath(order_detail.menu_item.ImageURL)}
                                            alt={order_detail.menu_item.Name} // ✅ alt hợp lệ
                                        />
                                    </td>
                                    <td>{order_detail.menu_item.Name}</td>
                                    <td>{order_detail.Price}</td>
                                    <td>{order_detail.Quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* nút quay lại */}
                    <button
                        className="btn btn-secondary mt-3"
                        onClick={() => navigate(-1)}
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
