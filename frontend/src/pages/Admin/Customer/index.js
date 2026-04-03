import React, { useEffect, useState } from "react";
import customerApi from "../../../api/customerApi";
import CreateForm from "./create";
import EditForm from "./edit";
import Pagination from "../../../components/shared/Pagination";
import { useNotify } from "../../../contexts/ToastContext";

function Customer() {
    const notify = useNotify();
    const [customers, setCustomers] = useState([]);
    const [isShowFormCreate, setIsShowFormCreate] = useState(false);
    const [editCustomer, setEditCustomer] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        getCustomers();
    }, []);

    const getCustomers = () => {
        customerApi.getAll()
            .then(res => {
                setCustomers(res.data);
            })
            .catch(() => {
                // Silently fail
            });
    };

    const totalPages = Math.ceil(customers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const deleteCustomer = (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;

        customerApi.delete(id)
            .then(() => {
                notify.success("Xóa khách hàng thành công");
                getCustomers();
            })
            .catch(() => {
                // Silently fail
            });
    };

    return (
        <div className="admin-customer">
            <div className="admin-customer-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-user-friends"></i>
                    </span>
                    Quản lý Khách hàng
                </h2>
                <p>
                    <span className="status-dot"></span>
                    Quản lý thông tin khách hàng trong hệ thống
                </p>
            </div>

            <div className="admin-data-card">
                <div className="d-flex justify-content-end mb-3">
                    <button
                        className="admin-btn-add"
                        onClick={() => setIsShowFormCreate(true)}
                    >
                        <i className="fa fa-plus"></i> Thêm
                    </button>
                </div>

                {isShowFormCreate && (
                    <CreateForm
                        onClose={() => setIsShowFormCreate(false)}
                        reload={getCustomers}
                    />
                )}

                {editCustomer && (
                    <EditForm
                        data={editCustomer}
                        onClose={() => setEditCustomer(null)}
                        reload={getCustomers}
                    />
                )}

                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Tên khách hàng</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th width="160">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCustomers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <div className="empty-state">
                                        <i className="fa fa-users"></i>
                                        <p>Không có dữ liệu khách hàng</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            currentCustomers.map(customer => (
                                <tr key={customer.id}>
                                    <td>{customer.full_name}</td>
                                    <td>{customer.phone_number}</td>
                                    <td>{customer.address}</td>
                                    <td>
                                        <button
                                            className="admin-btn-edit"
                                            onClick={() => setEditCustomer(customer)}
                                        >
                                            <i className="fa fa-edit"></i> Sửa
                                        </button>
                                        <button
                                            className="admin-btn-delete"
                                            onClick={() => deleteCustomer(customer.id)}
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
            </div>
        </div>
    );
}

export default Customer;
