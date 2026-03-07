import React, { useEffect, useState } from "react";
import menu_categoryApi from "../../../api/menu_categoryApi";
import menu_itemApi from "../../../api/menu_itemApi";

const EditForm = ({ setisShowFormEdit, GetMenu_items, data, id }) => {
    const [CategoryID, setCategoryID] = useState("");
    const [Name, setName] = useState("");
    const [Description, setDescription] = useState("");
    const [Price, setPrice] = useState("");
    const [File, setFile] = useState(null);
    const [Status, setStatus] = useState("");
    const [Menu_categorys, setMenu_categorys] = useState([]);

    useEffect(() => {
        setCategoryID(data.CategoryID);
        setName(data.Name);
        setDescription(data.Description);
        setPrice(data.Price);
        setStatus(data.Status);

        menu_categoryApi
            .getAll()
            .then(res => setMenu_categorys(res.data))
            .catch(err => console.error(err));
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // 👇 GỬI OBJECT, API sẽ tự tạo FormData
        const payload = {
            CategoryID,
            Name,
            Description,
            Price,
            Status,
            img: File, // có thì gửi, không thì null
        };

        menu_itemApi
            .update(id, payload)
            .then(() => {
                alert("Cập nhật thành công");
                GetMenu_items();
                setisShowFormEdit(false);
            })
            .catch(err => {
                console.error("Lỗi khi cập nhật:", err);
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Sửa dữ liệu</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Nhóm</label>
                        <select
                            className="form-control"
                            value={CategoryID}
                            onChange={(e) => setCategoryID(e.target.value)}
                            required
                        >
                            {Menu_categorys.map(item => (
                                <option
                                    key={item.CategoryID}
                                    value={item.CategoryID}
                                >
                                    {item.CategoryName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label>Tên</label>
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
                            className="form-control"
                            value={Price}
                            onChange={e => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Ảnh mới (nếu có)</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={e => setFile(e.target.files[0])}
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
