import React, { useEffect, useState } from "react";
import menu_categoryApi from "../../../api/menu_categoryApi";
import menu_itemApi from "../../../api/menu_itemApi";

const CreateForm = ({ setisShowFormCreate, GetMenu_items }) => {
    const [CategoryID, setCategoryID] = useState("");
    const [Name, setName] = useState("");
    const [Description, setDescription] = useState("");
    const [Price, setPrice] = useState("");
    const [img, setImg] = useState(null);
    const [Status, setStatus] = useState("");
    const [Menu_categorys, setMenu_categorys] = useState([]);

    useEffect(() => {
        menu_categoryApi.getAll()
            .then(res => setMenu_categorys(res.data))
            .catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await menu_itemApi.create({
                CategoryID,
                Name,
                Description,
                Price,
                Status,
                img      // 👈 FILE
            });

            alert("Thêm món ăn thành công");
            GetMenu_items();
            setisShowFormCreate(false);
        } catch (err) {
            console.error("Lỗi khi thêm món ăn:", err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Thêm món ăn</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Nhóm</label>
                        <select
                            className="form-control"
                            value={CategoryID}
                            onChange={e => setCategoryID(e.target.value)}
                            required
                        >
                            <option value="">-- Chọn nhóm --</option>
                            {Menu_categorys.map(c => (
                                <option key={c.CategoryID} value={c.CategoryID}>
                                    {c.CategoryName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label>Tên món</label>
                        <input
                            className="form-control"
                            value={Name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Mô tả</label>
                        <input
                            className="form-control"
                            value={Description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Giá</label>
                        <input
                            type="number"
                            className="form-control"
                            value={Price}
                            onChange={e => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Ảnh</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={e => setImg(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Trạng thái</label>
                        <input
                            className="form-control"
                            value={Status}
                            onChange={e => setStatus(e.target.value)}
                        />
                    </div>

                    <button className="btn btn-success me-2">Lưu</button>
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
