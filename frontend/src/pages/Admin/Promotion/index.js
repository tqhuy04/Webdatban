import React, { useEffect, useState } from "react";
import promotionApi from "../../../api/promotionApi";
import CreateForm from "./create";
import EditForm from "./edit";
import { formatNumber } from "../../../components/utils/format_number";

function Promotion() {
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
            .catch((err) => {
                console.error("Lỗi lấy danh sách khuyến mãi:", err);
            });
    }

    function DeletePromotion(id) {
        if (!window.confirm("Bạn có chắc muốn xóa mã giảm giá này không?")) return;

        promotionApi
            .delete(id)
            .then(() => {
                alert("Xóa thành công");
                GetPromotions();
            })
            .catch((err) => {
                console.error("Lỗi xóa:", err);
                alert("Xóa thất bại");
            });
    }

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreate(true)}
                >
                    <i className="fa fa-plus"></i> Thêm
                </button>

                {showCreate && (
                    <CreateForm
                        setisShowFormCreate={setShowCreate}
                        GetPromotions={GetPromotions}
                    />
                )}
            </div>

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
                    {promotions.map((promotion) => (
                        <tr key={promotion.PromotionID}>
                            <td>{promotion.Name}</td>
                            <td>{promotion.Description}</td>
                            <td>{promotion.DiscountPercent ? formatNumber(promotion.DiscountPercent) : "0"}</td>
                            <td>{promotion.StartDate}</td>
                            <td>{promotion.EndDate}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => setEditPromotion(promotion)}
                                >
                                    <i className="fa fa-edit"></i> Sửa
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                        DeletePromotion(promotion.PromotionID)
                                    }
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Promotion;
