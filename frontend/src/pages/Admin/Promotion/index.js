import React, { useEffect, useState } from "react";
import promotionApi from "../../../api/promotionApi";
import CreateForm from "./create";
import EditForm from "./edit";
import { formatNumber } from "../../../components/utils/format_number";
import { useNotify } from "../../../contexts/ToastContext";

function Promotion() {
    const notify = useNotify();
    const [promotions, setPromotions] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editPromotion, setEditPromotion] = useState(null);

    useEffect(() => {
        GetPromotions();
    }, []);

    function GetPromotions() {
        promotionApi
            .getAllOfAdmin()
            .then((res) => {
                setPromotions(res.data);
            })
            .catch(() => {
                // Silently fail
            });
    }

    function DeletePromotion(id) {
        if (!window.confirm("Bạn có chắc muốn xóa mã giảm giá này không?")) return;

        promotionApi
            .delete(id)
            .then(() => {
                notify.success("Xóa thành công");
                GetPromotions();
            })
            .catch(() => {
                notify.error("Xóa thất bại");
            });
    }

    return (
        <div className="admin-promotion">
            <div className="admin-promotion-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-tags"></i>
                    </span>
                    Quản lý Khuyến Mãi
                </h2>
                <p>
                    <span className="status-dot"></span>
                    Quản lý các chương trình khuyến mãi và mã giảm giá
                </p>
            </div>

            <div className="admin-data-card">
                <div className="d-flex justify-content-end mb-3">
                    <button
                        className="admin-btn-add"
                        onClick={() => setShowCreate(true)}
                    >
                        <i className="fa fa-plus"></i> Thêm
                    </button>
                </div>

                {showCreate && (
                    <CreateForm
                        setisShowFormCreate={setShowCreate}
                        GetPromotions={GetPromotions}
                    />
                )}

                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Tiêu đề</th>
                            <th>Mô tả</th>
                            <th>Giảm giá</th>
                            <th>Ngày bắt đầu</th>
                            <th>Ngày kết thúc</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {promotions.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    <div className="empty-state">
                                        <i className="fa fa-tags"></i>
                                        <p>Không có dữ liệu khuyến mãi</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            promotions.map((promotion) => (
                                <tr key={promotion.PromotionID}>
                                    <td>{promotion.Name}</td>
                                    <td>{promotion.Description}</td>
                                    <td>
                                        <span className="status-badge active">
                                            {promotion.DiscountPercent ? formatNumber(promotion.DiscountPercent) : "0"}VND
                                        </span>
                                    </td>
                                    <td>{promotion.StartDate}</td>
                                    <td>{promotion.EndDate}</td>
                                    <td>
                                        <button
                                            className="admin-btn-edit"
                                            onClick={() => setEditPromotion(promotion)}
                                        >
                                            <i className="fa fa-edit"></i> Sửa
                                        </button>
                                        <button
                                            className="admin-btn-delete"
                                            onClick={() => DeletePromotion(promotion.PromotionID)}
                                        >
                                            <i className="fa fa-trash"></i> Xóa
                                        </button>

                                        {editPromotion?.PromotionID === promotion.PromotionID && (
                                            <EditForm
                                                data={editPromotion}
                                                id={editPromotion.PromotionID}
                                                setisShowFormEdit={() => setEditPromotion(null)}
                                                GetPromotions={GetPromotions}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Promotion;
