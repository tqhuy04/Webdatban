import React, { useEffect, useState } from "react";
import promotionApi from "../../../api/promotionApi";
import orderApi from "../../../api/orderApi";
import { useNotify } from "../../../contexts/ToastContext";

const EditForm = ({ setisShowFormEdit, GetOrders, data, id }) => {
    const notify = useNotify();
    const [OrderDate, setOrderDate] = useState('');
    const [TotalAmount, setTotalAmount] = useState(0);
    const [PromotionID, setPromotionID] = useState();
    const [Promotions, setPromotions] = useState(null);

    useEffect(() => {
        promotionApi.getAll()
            .then(response => {
                setPromotions(response.data);
            })
            .catch(() => {});
        if (data) {
            const date = new Date(data.OrderDate);
            const time = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
            setOrderDate(time);
            setTotalAmount(data.TotalAmount);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const handleSubmit = (e) => {
        e.preventDefault();
        const formdata = {
            BookingID: data.BookingID,
            CustomerID: data.CustomerID,
            PromotionID,
            OrderDate,
            TotalAmount,
        }
        orderApi.update(id, formdata)
            .then(response => {
                notify.success("Đã cập nhật đơn hàng thành công");
                GetOrders();
                setisShowFormEdit(false);
            })
            .catch(() => {
                notify.error("Cập nhật thất bại");
            })
    };


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>{"Sửa dữ liệu"}</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Thời gian tạo đơn hàng: </label>
                        <input
                            type="time"
                            className="form-control"
                            value={OrderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Tổng tiền đơn hàng</label>
                        <input
                            type="text"
                            className="form-control"
                            value={TotalAmount}
                            // onChange={(e) => setTotalAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Giảm giá: </label>
                        <select
                            onChange={(e) => setPromotionID(e.target.value)}
                            style={{ width: '100%', height: '30px', border: '1px solid black' }}
                        >
                            <option value={data.PromotionID} hidden>{data.DiscountPercent}</option>
                            {Promotions?.map((promotion) => (
                                <option value={promotion.PromotionID}>{promotion.DiscountPercent}</option>
                            ))}
                        </select>

                    </div>

                    <button type="submit" className="btn btn-success me-2">Lưu</button>
                    <button type="button" className="btn btn-secondary"
                        onClick={() => { setisShowFormEdit(false) }}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditForm