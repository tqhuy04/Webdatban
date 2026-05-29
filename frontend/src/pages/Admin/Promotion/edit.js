import React, { useEffect, useState } from "react";
import promotionApi from "../../../api/promotionApi";
import format_date from "../../../components/utils/format_date";
import { useNotify } from "../../../contexts/ToastContext";

const EditForm = ({ setisShowFormEdit, GetPromotions, data, id }) => {
    const notify = useNotify();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // đổ dữ liệu backend vào form
    useEffect(() => {
        if (!data) return;

        setName(data.Name ?? "");
        setDescription(data.Description ?? "");
        setDiscountPercent(data.DiscountPercent ?? "");
        setStartDate(format_date(data.StartDate));
        setEndDate(format_date(data.EndDate));
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!id) {
            notify.warning("Không xác định được khuyến mãi");
            return;
        }

        const payload = {
            name: name.trim(),
            description: description ? description.trim() : null,
            discount_percent: Number(discountPercent),
            start_date: format_date(startDate),
            end_date: format_date(endDate),
        };

        promotionApi
            .update(id, payload)
            .then(() => {
                notify.success("Cập nhật khuyến mãi thành công");
                GetPromotions();
                setisShowFormEdit(false);
            })
            .catch(() => {
                notify.error("Cập nhật thất bại");
            });
    };

    if (!data) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Sửa khuyến mãi</h4>

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
                        <label className="form-label">Giảm giá (VNĐ)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={discountPercent}
                            min="0"
                            onChange={(e) =>
                                setDiscountPercent(e.target.value)
                            }
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
