import React, { useEffect, useState } from "react";
import tableApi from "../../../api/tableApi";
import CreateForm from "./create";
import EditForm from "./edit";
import Pagination from "../../../components/shared/Pagination";
import ConfirmModal from "../../../components/shared/ConfirmModal";
import { useNotify } from "../../../contexts/ToastContext";

function Table() {
    const notify = useNotify();
    const [Tables, setTables] = useState([]);
    const [isShowFormCreate, setisShowFormCreate] = useState(false);
    const [editTable, setEditTable] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [refreshKey, setRefreshKey] = useState(0); // Force re-render

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        GetTables();
    }, []);

    function GetTables() {
        tableApi
            .getAll()
            .then((response) => {
                console.log("[DEBUG GetTables] Raw response:", response.data);
                setTables(response.data);
                setRefreshKey(prev => prev + 1); // Force re-render
            })
            .catch(() => {
                // Silently fail
            });
    }

    const totalPages = Math.ceil(Tables.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTables = Tables.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteClick = (id) => {
        setDeleteModal({ show: true, id });
    };

    const handleConfirmDelete = () => {
        tableApi.delete(deleteModal.id)
            .then(() => {
                notify.success("Xóa bàn thành công");
                GetTables();
            })
            .catch(() => {
                notify.error("Xóa bàn thất bại");
            });
        setDeleteModal({ show: false, id: null });
    };

    const handleCancelDelete = () => {
        setDeleteModal({ show: false, id: null });
    };

    return (
        <div className="admin-table">
            <div className="admin-table-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-chair"></i>
                    </span>
                    Quản lý Bàn
                </h2>
                <p>
                    <span className="status-dot"></span>
                    Quản lý thông tin bàn trong nhà hàng
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
                        GetTables={GetTables}
                    />
                )}

                <table className="table table-bordered table-hover" key={`tables-${refreshKey}`}>
                    <thead className="table-dark">
                        <tr>
                            <th>Tên bàn</th>
                            <th>Sức chứa</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTables.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <div className="empty-state">
                                        <i className="fa fa-chair"></i>
                                        <p>Không có dữ liệu bàn</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            currentTables.map((table) => (
                                <tr key={table.TableID}>
                                    <td>{table.TableNumber}</td>
                                    <td>{table.Capacity}</td>
                                    <td>
                                        <span className={`status-badge ${Number(table.Status) === 0 ? 'active' : 'pending'}`}>
                                            {Number(table.Status) === 0 ? "Còn bàn" : "Đã đặt"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="admin-btn-edit"
                                            onClick={() => setEditTable(table)}
                                        >
                                            <i className="fa fa-edit"></i> Sửa
                                        </button>
                                        <button
                                            className="admin-btn-delete"
                                            onClick={() => handleDeleteClick(table.TableID)}
                                        >
                                            <i className="fa fa-trash"></i> Xóa
                                        </button>
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

                {/* FORM SỬA */}
                {editTable && (
                    <EditForm
                        key={editTable.TableID}
                        table={editTable}
                        setEditTable={setEditTable}
                        GetTables={GetTables}
                    />
                )}
            </div>

            <ConfirmModal
                isVisible={deleteModal.show}
                title="Xác nhận xóa"
                message="Bạn có chắc muốn xóa bàn này không?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
}

export default Table;
