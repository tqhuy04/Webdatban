import React, { useEffect, useState } from "react";
import orderDetailApi from "../../../api/order_detailApi";
import CreateForm from "./create";
import { useParams } from "react-router-dom";
import { formatNumber } from "../../../components/utils/format_number";

function Order_detail() {
    const { OrderID } = useParams();

    const [orderDetails, setOrderDetails] = useState([]);
    const [isShowFormCreate, setIsShowFormCreate] = useState(false);

    useEffect(() => {
        GetOrderDetails();
    }, [OrderID]);

    const GetOrderDetails = () => {
        orderDetailApi
            .getByOrder(OrderID)
            .then(res => {
                setOrderDetails(res.data || []);
            })
            .catch(() => {
                // Silently fail
            });
    };

    const getImagePath = (imageUrl) => {
        if (!imageUrl) return '';
        return encodeURI(
            `http://localhost:8000/uploads/Categories/${imageUrl}`
        );
    };

    return (
        <div className="admin-order-detail">
            <div className="admin-order-detail-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-list"></i>
                    </span>
                    Chi tiết Đơn hàng
                </h2>
                <p>
                    <span className="status-dot"></span>
                    Thông tin chi tiết các món trong đơn hàng
                </p>
            </div>

            <div className="admin-data-card">
                <div className="d-flex justify-content-end mb-3">
                    <button
                        className="admin-btn-add"
                        onClick={() => setIsShowFormCreate(true)}
                    >
                        <i className="fa fa-plus"></i> Thêm món
                    </button>
                </div>

                {isShowFormCreate && (
                    <CreateForm
                        setisShowFormCreate={setIsShowFormCreate}
                        GetOrder_details={GetOrderDetails}
                        OrderID={OrderID}
                    />
                )}

                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Ảnh</th>
                            <th>Tên món</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetails.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <div className="empty-state">
                                        <i className="fa fa-list"></i>
                                        <p>Không có dữ liệu</p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {orderDetails.map(detail => (
                            <tr key={detail.OrderDetailID}>
                                <td>
                                    <img
                                        src={getImagePath(detail.menu_item?.ImageURL)}
                                        alt=""
                                        style={{ width: "80px", borderRadius: '8px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{detail.menu_item?.Name}</td>
                                <td>{formatNumber(detail.menu_item?.Price)}</td>
                                <td>{detail.Quantity}</td>
                                <td>{formatNumber(detail.Price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Order_detail;
