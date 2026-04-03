import React, { useEffect, useState } from "react";
import menu_itemApi from "../../../api/menu_itemApi";
import menu_categoryApi from "../../../api/menu_categoryApi";
import CreateForm from "./create";
import EditForm from "./edit";
import Pagination from "../../../components/shared/Pagination";
import { formatNumber } from "../../../components/utils/format_number";
import { useNotify } from "../../../contexts/ToastContext";

function Menu_item() {
    const notify = useNotify();
    const [Menu_items, setMenu_items] = useState([]);
    const [Categories, setCategories] = useState([]);
    const [isShowFormCreate, setisShowFormCreate] = useState(false);
    const [isShowFormEdit, setisShowFormEdit] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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

    const totalPages = Math.ceil(Menu_items.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMenuItems = Menu_items.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
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
                notify.success("Xóa thành công");
                GetMenu_items();
            })
            .catch(err => {
                console.error(err);
                notify.error("Xóa thất bại");
            });
    };

    const getImagePath = (imageUrl) => {
        if (!imageUrl) return "";
        return encodeURI(
            `http://localhost:8000/uploads/Categories/${imageUrl}`
        );
    };

    return (
        <div className="admin-menu-item">
            <div className="admin-menu-item-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-hamburger"></i>
                    </span>
                    Quản lý Món Ăn
                </h2>
                <p>
                    <span className="status-dot"></span>
                    Quản lý danh sách món ăn trong hệ thống
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
                        {currentMenuItems.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <div className="empty-state">
                                        <i className="fa fa-hamburger"></i>
                                        <p>Không có dữ liệu món ăn</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            currentMenuItems.map(item => (
                                <tr key={item.MenuItemID}>
                                    <td>{getCategoryName(item.CategoryID)}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.Description}</td>
                                    <td>{formatNumber(item.Price)}</td>
                                    <td>
                                        <img
                                            src={getImagePath(item.ImageURL)}
                                            alt={item.Name}
                                            width={80}
                                            style={{ borderRadius: '8px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>
                                        <span className={`status-badge ${item.Status === 'Còn món' ? 'active' : 'inactive'}`}>
                                            {item.Status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="admin-btn-edit"
                                            onClick={() => setisShowFormEdit(item)}
                                        >
                                            <i className="fa fa-edit"></i> Sửa
                                        </button>
                                        <button
                                            className="admin-btn-delete"
                                            onClick={() => handleDelete(item.MenuItemID)}
                                        >
                                            <i className="fa fa-trash"></i> Xóa
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
                            ))
                        )}
                    </tbody>
                </table>

                {/* ===== PAGINATION ===== */}
                <div className="pagination-wrapper">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default Menu_item;
