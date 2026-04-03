import React, { useEffect, useState } from "react";
import menu_categoryApi from "../../../api/menu_categoryApi";
import CreateForm from "./create";
import EditForm from "./edit";
import { useNotify } from "../../../contexts/ToastContext";

function Menu_category() {
    const notify = useNotify();
    const [Menu_categorys, setMenu_categorys] = useState([]);
    const [isShowFormCreate, setisShowFormCreate] = useState(false);
    const [isShowFormEdit, setisShowFormEdit] = useState(null);

    useEffect(() => {
        GetMenu_categorys();
    }, []);

    function GetMenu_categorys() {
        menu_categoryApi
            .getAll()
            .then((response) => {
                setMenu_categorys(response.data);
            })
            .catch(() => {
                // Silently fail
            });
    }

    function Deletetable(id) {
        if (window.confirm("Bạn có chắc muốn xóa nhóm này không?")) {
            menu_categoryApi
                .delete(id)
                .then(() => {
                    notify.success("Xóa nhóm thành công");
                    GetMenu_categorys();
                })
                .catch(() => {
                    notify.error("Xóa thất bại");
                });
        }
    }

    return (
        <div className="admin-menu-category">
            <div className="admin-menu-category-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-utensils"></i>
                    </span>
                    Quản lý Nhóm Món Ăn
                </h2>
                <p>
                    <span className="status-dot"></span>
                    Quản lý danh mục nhóm món ăn trong hệ thống
                </p>
            </div>

            <div className="admin-data-card">
                <div className="d-flex justify-content-end mb-3">
                    <button
                        className="admin-btn-add"
                        onClick={() => setisShowFormCreate(true)}
                    >
                        <i className="fa fa-plus"></i> Thêm
                    </button>
                </div>

                {isShowFormCreate && (
                    <CreateForm
                        setisShowFormCreate={setisShowFormCreate}
                        GetMenu_categorys={GetMenu_categorys}
                    />
                )}

                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Tên nhóm món ăn</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Menu_categorys.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="text-center">
                                    <div className="empty-state">
                                        <i className="fa fa-utensils"></i>
                                        <p>Không có dữ liệu nhóm món ăn</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            Menu_categorys.map((menu_category) => (
                                <tr key={menu_category.CategoryID}>
                                    <td>{menu_category.CategoryName}</td>
                                    <td>
                                        <button
                                            className="admin-btn-edit"
                                            onClick={() => setisShowFormEdit(menu_category)}
                                        >
                                            <i className="fa fa-edit"></i> Sửa
                                        </button>
                                        <button
                                            className="admin-btn-delete"
                                            onClick={() => Deletetable(menu_category.CategoryID)}
                                        >
                                            <i className="fa fa-trash"></i> Xóa
                                        </button>

                                        {isShowFormEdit?.CategoryID === menu_category.CategoryID && (
                                            <EditForm
                                                setisShowFormEdit={setisShowFormEdit}
                                                GetMenu_categorys={GetMenu_categorys}
                                                data={menu_category}
                                                id={menu_category.CategoryID}
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

export default Menu_category;
