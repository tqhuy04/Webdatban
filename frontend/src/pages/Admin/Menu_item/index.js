import React, { useEffect, useState } from "react";
import menu_itemApi from "../../../api/menu_itemApi";
import menu_categoryApi from "../../../api/menu_categoryApi";
import CreateForm from "./create";
import EditForm from "./edit";
import { formatNumber } from "../../../components/utils/format_number";

function Menu_item() {
    const [Menu_items, setMenu_items] = useState([]);
    const [Categories, setCategories] = useState([]);
    const [isShowFormCreate, setisShowFormCreate] = useState(false);
    const [isShowFormEdit, setisShowFormEdit] = useState(null);

    useEffect(() => {
        GetMenu_items();
        GetCategories();
    }, []);

    // ===== API =====
    const GetMenu_items = () => {
        menu_itemApi.getAll()
            .then(res => setMenu_items(res.data))
            .catch(err => console.error(err));
    };

    const GetCategories = () => {
        menu_categoryApi.getAll()
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    };

    // ===== MAP CategoryID -> CategoryName =====
    const getCategoryName = (categoryId) => {
        const category = Categories.find(
            c => c.CategoryID === categoryId
        );
        return category ? category.CategoryName : "—";
    };

    // ===== DELETE =====
    const handleDelete = (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa món này?")) return;

        menu_itemApi.delete(id)
            .then(() => {
                alert("Xóa thành công");
                GetMenu_items();
            })
            .catch(err => {
                console.error(err);
                alert("Xóa thất bại");
            });
    };

    const getImagePath = (imageUrl) => {
        if (!imageUrl) return "";
        return encodeURI(
            `http://localhost:8000/uploads/Categories/${imageUrl}`
        );
    };

    return (
        <div className="container mt-3">
            <button
                className="btn btn-primary mb-3"
                onClick={() => setisShowFormCreate(true)}
            >
                + Thêm
            </button>

            {isShowFormCreate && (
                <CreateForm
                    setisShowFormCreate={setisShowFormCreate}
                    GetMenu_items={GetMenu_items}
                />
            )}

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Tên nhóm</th>
                        <th>Tên món</th>
                        <th>Mô tả</th>
                        <th>Giá</th>
                        <th>Ảnh</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {Menu_items.map(item => (
                        <tr key={item.MenuItemID}>
                            {/* ✅ TÊN NHÓM */}
                            <td>{getCategoryName(item.CategoryID)}</td>

                            <td>{item.Name}</td>
                            <td>{item.Description}</td>
                            <td>{formatNumber(item.Price)}</td>

                            <td>
                                <img
                                    src={getImagePath(item.ImageURL)}
                                    alt={item.Name}
                                    width={130}
                                />
                            </td>

                            <td>{item.Status}</td>

                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => setisShowFormEdit(item)}
                                >
                                    Sửa
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(item.MenuItemID)}
                                >
                                    Xóa
                                </button>

                                {isShowFormEdit?.MenuItemID === item.MenuItemID && (
                                    <EditForm
                                        setisShowFormEdit={setisShowFormEdit}
                                        GetMenu_items={GetMenu_items}
                                        id={item.MenuItemID}
                                        data={{
                                            CategoryID: item.CategoryID,
                                            Name: item.Name,
                                            Description: item.Description,
                                            Price: item.Price,
                                            Status: item.Status,
                                        }}
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

export default Menu_item;
