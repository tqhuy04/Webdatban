import React, { useEffect, useState, useCallback } from "react";
import orderApi from "../../../api/orderApi";
import CreateForm from "./create";
import EditForm from "./edit";
import ConfirmModal from "../../../components/shared/ConfirmModal";
import { useParams, useNavigate } from "react-router-dom";
import { formatNumber } from "../../../components/utils/format_number";
import { useNotify } from "../../../contexts/ToastContext";

function Order() {
    const notify = useNotify();
    const navigate = useNavigate();
    const { BookingID, CustomerID } = useParams();

    const [orders, setOrders] = useState([]);
    const [isShowFormCreate, setIsShowFormCreate] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getOrders = useCallback(() => {
        orderApi
            .getByBooking(BookingID)
            .then(res => {
                setOrders(res.data ?? []);
            })
            .catch(() => {});
    }, [BookingID]);

    useEffect(() => {
        getOrders();
    }, [getOrders]);

    const handleDeleteClick = (id) => {
        setDeleteModal({ show: true, id });
    };

    const handleConfirmDelete = () => {
        orderApi.delete(deleteModal.id)
            .then(() => {
                notify.success("Xóa đơn hàng thành công");
                getOrders();
            })
            .catch(() => {
                notify.error("Xóa đơn hàng thất bại");
            });
        setDeleteModal({ show: false, id: null });
    };

    const handleCancelDelete = () => {
        setDeleteModal({ show: false, id: null });
    };

    const handleToOrderDetail = (orderID) => {
        navigate(`/Admin/Order_detail/${orderID}`);
    };

    return (
        <div className="admin-order">
            <div className="admin-order-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-receipt"></i>
                    </span>
                    Quản lý Đơn hàng
                </h2>
                <p>
                    <span className="status-dot"></span>
                    Quản lý danh sách đơn hàng trong hệ thống
                </p>
            </div>

            <div className="admin-data-card">
                <div className="d-flex justify-content-end mb-3">
                    <button
                        className="admin-btn-add"
                        onClick={() => setIsShowFormCreate(true)}
                    >
                        <i className="fa fa-plus"></i> Thêm
                    </button>
                </div>

                {isShowFormCreate && (
                    <CreateForm
                        setisShowFormCreate={setIsShowFormCreate}
                        GetOrders={getOrders}
                        BookingID={BookingID}
                        CustomerID={CustomerID}
                    />
                )}

                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Ngày tạo</th>
                            <th>Khuyến mãi</th>
                            <th>Tổng tiền</th>
                            <th>Hành động</th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <div className="empty-state">
                                        <i className="fa fa-receipt"></i>
                                        <p>Không có đơn hàng</p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {orders.map(order => (
                            <tr key={order.OrderID}>
                                <td>
                                    {new Date(order.OrderDate).toLocaleString("vi-VN")}
                                </td>

                                <td>
                                    {order.PromotionID ? `#${order.PromotionID}` : "Không"}
                                </td>

                                <td>
                                    {formatNumber(order.TotalAmount)}
                                </td>

                                <td>
                                    <button
                                        className="admin-btn-edit"
                                        onClick={() => setEditingOrder(order)}
                                    >
                                        <i className="fa fa-edit"></i> Sửa
                                    </button>

                                    <button
                                        className="admin-btn-delete"
                                        onClick={() => handleDeleteClick(order.OrderID)}
                                    >
                                        <i className="fa fa-trash"></i> Xóa
                                    </button>

                                    {editingOrder?.OrderID === order.OrderID && (
                                        <EditForm
                                            setisShowFormEdit={setEditingOrder}
                                            GetOrders={getOrders}
                                            id={order.OrderID}
                                            data={{
                                                OrderDate: order.OrderDate,
                                                TotalAmount: order.TotalAmount,
                                                BookingID: Number(BookingID),
                                                CustomerID: Number(CustomerID),
                                                PromotionID: order.PromotionID ?? null,
                                                Discount: 0,
                                            }}
                                        />
                                    )}
                                </td>

                                <td className="text-center">
                                    <button
                                        className="admin-btn-action view"
                                        onClick={() => handleToOrderDetail(order.OrderID)}
                                        title="Xem chi tiết"
                                    >
                                        <i className="fa-solid fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                isVisible={deleteModal.show}
                title="Xác nhận xóa"
                message="Bạn có chắc muốn xóa đơn hàng này không?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
}

export default Order;
