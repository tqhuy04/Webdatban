import React, { useEffect, useState } from "react";
import promotionApi from "../../../api/promotionApi";
import orderApi from "../../../api/orderApi";
import { useNotify } from "../../../contexts/ToastContext";

const EditForm = ({ setisShowFormEdit, GetOrders, data, id }) => {
    const notify = useNotify();
    const [OrderTime, setOrderTime] = useState("");
    const [TotalAmount, setTotalAmount] = useState("");
    const [PromotionID, setPromotionID] = useState(null);
    const [Promotions, setPromotions] = useState([]);

    useEffect(() => {
        promotionApi.getAll()
            .then(res => setPromotions(res.data || []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (data) {
            // Parse OrderDate
            const date = new Date(data.OrderDate);
            const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            setOrderTime(time);
            setTotalAmount(data.TotalAmount || 0);
            setPromotionID(data.PromotionID);
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!OrderTime) {
            notify.warning("Vui lòng chọn giờ tạo đơn");
            return;
        }

        // Parse time
        const [hour, minute] = OrderTime.split(":");
        const orderDate = new Date();
        orderDate.setHours(parseInt(hour));
        orderDate.setMinutes(parseInt(minute));
        orderDate.setSeconds(0);

        const formdata = {
            BookingID: data.BookingID,
            CustomerID: data.CustomerID,
            PromotionID: PromotionID ? parseInt(PromotionID) : null,
            OrderDate: orderDate.toISOString(),
            TotalAmount: parseFloat(TotalAmount) || 0
        };

        orderApi.update(id, formdata)
            .then(() => {
                notify.success("Đã cập nhật đơn hàng thành công");
                GetOrders();
                setisShowFormEdit(false);
            })
            .catch(() => {
                notify.error("Cập nhật thất bại");
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Sửa đơn hàng</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Giờ tạo đơn</label>
                        <input
                            type="time"
                            className="form-control"
                            value={OrderTime}
                            onChange={(e) => setOrderTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Tổng tiền</label>
                        <input
                            type="number"
                            className="form-control"
                            value={TotalAmount}
                            onChange={(e) => setTotalAmount(e.target.value)}
                            min="0"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Khuyến mãi</label>
                        <select
                            className="form-control"
                            value={PromotionID || ""}
                            onChange={(e) => setPromotionID(e.target.value || null)}
                        >
                            <option value="">-- Không áp dụng --</option>
                            {Promotions.map(p => (
                                <option key={p.PromotionID} value={p.PromotionID}>
                                    {p.DiscountPercent} VNĐ
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success me-2">Lưu</button>
                    <button type="button" className="btn btn-secondary"
                        onClick={() => setisShowFormEdit(false)}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
