import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import orderDetailApi from "../../../api/order_detailApi";
import CreateForm from "./create";
import EditForm from "./edit";
import ConfirmModal from "../../../components/shared/ConfirmModal";
import { useParams } from "react-router-dom";
import { formatNumber } from "../../../components/utils/format_number";
import { useNotify } from "../../../contexts/ToastContext";

function Order_detail({ onOrderUpdated }) {
    const notify = useNotify();
    const { OrderID } = useParams();
    const navigate = useNavigate();

    const [orderDetails, setOrderDetails] = useState([]);
    const [isShowFormCreate, setIsShowFormCreate] = useState(false);
    const [editingDetail, setEditingDetail] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const GetOrderDetails = useCallback(() => {
        orderDetailApi
            .getByOrder(OrderID)
            .then(res => {
                setOrderDetails(res.data || []);
            })
            .catch(() => {});
    }, [OrderID]);

    useEffect(() => {
        GetOrderDetails();
    }, [GetOrderDetails]);

    // Bắt sự kiện khi quay lại trang Order (browser back)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                if (onOrderUpdated) onOrderUpdated();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [onOrderUpdated]);

    const handleOrderUpdated = () => {
        GetOrderDetails();
        if (onOrderUpdated) onOrderUpdated();
    };

    const handleDeleteClick = (detailId) => {
        setDeleteModal({ show: true, id: detailId });
    };

    const handleConfirmDelete = () => {
        orderDetailApi.delete(deleteModal.id)
            .then(() => {
                notify.success("Xóa món thành công");
                GetOrderDetails();
                if (onOrderUpdated) onOrderUpdated();
            })
            .catch(() => {
                notify.error("Xóa món thất bại");
            });
        setDeleteModal({ show: false, id: null });
    };

    const handleCancelDelete = () => {
        setDeleteModal({ show: false, id: null });
    };

    const getImagePath = (imageUrl) => {
        if (!imageUrl) return '';
        // Encode URL de xu ly ky tu dac biet (dau cach, tieng Viet)
        const encodedPath = imageUrl.split('/').map(part => encodeURIComponent(part)).join('/');
        // Localhost
        return `http://localhost:8000/uploads/Categories/${encodedPath}`;
        // Deploy
        // return encodeURI(`https://webdatbann.onrender.com/uploads/Categories/${encodedPath}`);
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
                        GetOrder_details={handleOrderUpdated}
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
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetails.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center">
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
                                <td>
                                    <button
                                        className="admin-btn-edit"
                                        onClick={() => setEditingDetail(detail)}
                                    >
                                        <i className="fa fa-edit"></i> Sửa
                                    </button>
                                    <button
                                        className="admin-btn-delete"
                                        onClick={() => handleDeleteClick(detail.OrderDetailID)}
                                    >
                                        <i className="fa fa-trash"></i> Xóa
                                    </button>

                                    {editingDetail?.OrderDetailID === detail.OrderDetailID && (
                                        <EditForm
                                            setisShowFormEdit={setEditingDetail}
                                            GetOrder_details={handleOrderUpdated}
                                            OrderID={OrderID}
                                            data={detail}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ConfirmModal
                    isVisible={deleteModal.show}
                    title="Xác nhận xóa"
                    message="Bạn có chắc muốn xóa món này khỏi đơn hàng?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            </div>
        </div>
    );
}

export default Order_detail;
