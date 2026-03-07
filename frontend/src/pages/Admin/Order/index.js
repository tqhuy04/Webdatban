import React, { useEffect, useState } from "react";
import orderApi from "../../../api/orderApi";
import CreateForm from "./create";
import EditForm from "./edit";
import { useParams, useNavigate } from "react-router-dom";
import { formatNumber } from "../../../components/utils/format_number";

function Order() {
    const navigate = useNavigate();
    const { BookingID, CustomerID } = useParams();

    const [orders, setOrders] = useState([]);
    const [isShowFormCreate, setIsShowFormCreate] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);

    useEffect(() => {
        if (BookingID) {
            getOrders();
        }
    }, [BookingID]);

    const getOrders = () => {
        orderApi
            .getByBooking(BookingID)
            .then(res => {
                setOrders(res.data ?? []);
            })
            .catch(err => {
                console.error("Lỗi lấy đơn hàng:", err);
            });
    };

    const deleteOrder = (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) return;

        orderApi
            .delete(id)
            .then(() => {
                alert("Xóa đơn hàng thành công");
                getOrders();
            })
            .catch(err => {
                console.error("Lỗi xóa đơn hàng:", err);
            });
    };

    const handleToOrderDetail = (orderID) => {
        navigate(`/Admin/Order_detail/${orderID}`);
    };

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <button
                    className="btn btn-primary"
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
                                Không có đơn hàng
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
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => setEditingOrder(order)}
                                >
                                    <i className="fa fa-edit"></i> Sửa
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteOrder(order.OrderID)}
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
                                <i
                                    className="fa-solid fa-eye"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleToOrderDetail(order.OrderID)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Order;
