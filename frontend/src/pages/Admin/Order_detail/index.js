import React, { useEffect, useState } from "react";
import orderDetailApi from "../../../api/order_detailApi"; // ✅ đúng file
import CreateForm from "./create";
import { useParams } from "react-router-dom";
// import { apiUrl } from "../../../config";
import { formatNumber } from "../../../components/utils/format_number";

function Order_detail() {
    const { OrderID } = useParams();

    const [orderDetails, setOrderDetails] = useState([]);
    const [isShowFormCreate, setIsShowFormCreate] = useState(false);

    useEffect(() => {
        GetOrderDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [OrderID]);

    const GetOrderDetails = () => {
        orderDetailApi
            .getByOrder(OrderID) // ✅ DÙNG getByOrder
            .then(res => {
                setOrderDetails(res.data || []);
            })
            .catch(err => {
                console.error("Lỗi lấy order detail:", err);
            });
    };

    const getImagePath = (imageUrl) => {
        if (!imageUrl) return '';
        return encodeURI(
            `http://localhost:8000/uploads/Categories/${imageUrl}`
        );
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

                {isShowFormCreate && (
                    <CreateForm
                        setisShowFormCreate={setIsShowFormCreate}
                        GetOrder_details={GetOrderDetails}
                        OrderID={OrderID}
                    />
                )}
            </div>

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
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}

                    {orderDetails.map(detail => (
                        <tr key={detail.OrderDetailID}>
                            <td>
                                <img
                                    src={getImagePath(detail.menu_item?.ImageURL)}
                                    alt=""
                                    style={{ width: "120px" }}
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
    );
}

export default Order_detail;
