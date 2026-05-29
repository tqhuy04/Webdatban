import React, { useEffect, useState } from "react";
import orderApi from "../../../api/orderApi";
import promotionApi from "../../../api/promotionApi";
import { useNotify } from "../../../contexts/ToastContext";

const CreateForm = ({ setisShowFormCreate, GetOrders, BookingID, CustomerID }) => {
    const notify = useNotify();

    const [OrderTime, setOrderTime] = useState("");
    const [PromotionID, setPromotionID] = useState(null);
    const [Promotions, setPromotions] = useState([]);

    const [TotalAmount, setTotalAmount] = useState(""); // ✅ THÊM

    useEffect(() => {
        promotionApi.getAll()
            .then(res => setPromotions(res.data || []))
            .catch(() => {});
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!OrderTime) {
            notify.warning("Vui lòng chọn giờ tạo đơn");
            return;
        }

        // OrderTime = "HH:mm"
        const [hour, minute] = OrderTime.split(":");

        const orderDate = new Date();
        orderDate.setHours(parseInt(hour));
        orderDate.setMinutes(parseInt(minute));
        orderDate.setSeconds(0);

        const data = {
            BookingID: parseInt(BookingID),
            CustomerID: parseInt(CustomerID),
            PromotionID: PromotionID ? parseInt(PromotionID) : null,
            OrderDate: orderDate.toISOString(),
            TotalAmount: parseFloat(TotalAmount) || 0
        };

        orderApi.create(data)
            .then(() => {
                notify.success("Tạo order thành công");
                GetOrders();
                setisShowFormCreate(false);
            })
            .catch(() => {
                notify.error("Tạo order thất bại");
            });
    };




    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Thêm đơn hàng</h4>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label>Giờ tạo đơn</label>
                        <input
                            type="time"
                            className="form-control"
                            value={OrderTime}
                            onChange={(e) => setOrderTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Tổng tiền</label>
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
                        <label>Khuyến mãi</label>
                        <select
                            className="form-control"
                            onChange={(e) => setPromotionID(e.target.value)}
                        >
                            <option value="">-- Không áp dụng --</option>
                            {Promotions.map(p => (
                                <option
                                    key={p.PromotionID}
                                    value={p.PromotionID}
                                >
                                    {p.DiscountPercent} VNĐ
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success me-2">
                        Lưu
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setisShowFormCreate(false)}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateForm;
