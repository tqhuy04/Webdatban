import React, { useState } from "react";
import menu_categoryApi from "../../../api/menu_categoryApi";
import { useNotify } from "../../../contexts/ToastContext";

const CreateForm = ({ setisShowFormCreate, GetMenu_categorys }) => {
    const notify = useNotify();
    const [CategoryName, setCategoryName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        menu_categoryApi
            .create({ CategoryName })
            .then(() => {
                notify.success("Bạn đã thêm nhóm thành công");
                GetMenu_categorys();
                setisShowFormCreate(false);
            })
            .catch((error) => {
                console.error("Có lỗi:", error);
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Thêm dữ liệu</h4>
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
