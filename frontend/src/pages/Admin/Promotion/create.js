import React, { useState } from "react";
import promotionApi from "../../../api/promotionApi";
import format_date from "../../../components/utils/format_date"; // ❗ GIỮ
import { useNotify } from "../../../contexts/ToastContext";

const CreateForm = ({ setisShowFormCreate, GetPromotions }) => {
    const notify = useNotify();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            name: name.trim(),
            description: description ? description.trim() : null,
            discount_percent: Number(discountPercent),
            start_date: format_date(startDate),
            end_date: format_date(endDate),
        };

        promotionApi
            .create(payload)
            .then(() => {
                notify.success("Bạn đã thêm mã giảm giá thành công");
                GetPromotions();
                setisShowFormCreate(false);
            })
            .catch(() => {
                notify.error("Tạo khuyến mãi thất bại");
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Thêm khuyến mãi</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tên khuyến mãi</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Mô tả</label>
                        <input
                            type="text"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Giảm giá (%)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={discountPercent}
                            onChange={(e) =>
                                setDiscountPercent(e.target.value)
                            }
                            min="0"
                            max="100"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Ngày bắt đầu</label>
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Ngày kết thúc</label>
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
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
