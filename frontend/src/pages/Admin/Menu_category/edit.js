import React, { useEffect, useState } from "react";
import menu_categoryApi from "../../../api/menu_categoryApi";
import { useNotify } from "../../../contexts/ToastContext";

const EditForm = ({ setisShowFormEdit, GetMenu_categorys, data, id }) => {
    const notify = useNotify();
    const [CategoryName, setCategoryName] = useState("");

    useEffect(() => {
        if (data) {
            setCategoryName(data.CategoryName);
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        menu_categoryApi
            .update(id, { CategoryName })
            .then(() => {
                notify.success("Cập nhật nhóm thành công");
                GetMenu_categorys();
                setisShowFormEdit(null);
            })
            .catch((error) => {
                console.error("Có lỗi:", error);
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Sửa dữ liệu</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tên nhóm:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={CategoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-success me-2">
                        Lưu
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setisShowFormEdit(null)}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
