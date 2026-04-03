import React, { useEffect, useState } from "react";
import TableComponent from '../../../components/shared/TableComponent';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import Pagination from '../../../components/shared/Pagination';
import userApi from '../../../api/userApi';
import CreateForm from "./create";
import EditForm from "./edit";
import { useNotify } from "../../../contexts/ToastContext";
import "./Account.css";

function Account() {
    const notify = useNotify();
    const [users, setUsers] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteUser, setDeleteUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        userApi.getAll()
            .then(res => setUsers(res.data))
            .catch(() => {});
    };

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    /* ================= TABLE CONFIG ================= */

    const roleClass = (role) => {
        const r = (role || "").toLowerCase();
        if (r === "admin") return "role-badge admin";
        if (r === "staff") return "role-badge staff";
        return "role-badge customer";
    };

    const roleIcon = (role) => {
        const r = (role || "").toLowerCase();
        if (r === "admin") return <i className="fa fa-shield-halved"></i>;
        if (r === "staff") return <i className="fa fa-user-gear"></i>;
        return <i className="fa fa-user"></i>;
    };

    const columns = [
        {
            label: "Tên người dùng",
            key: "username",
            render: (row) => (
                <div className="username-cell">
                    <div className="username-avatar">
                        {row.username ? row.username.charAt(0).toUpperCase() : "?"}
                    </div>
                    <span>{row.username}</span>
                </div>
            ),
        },
        { label: "Email", key: "email" },
        {
            label: "Vai trò",
            key: "role",
            render: (row) => (
                <span className={roleClass(row.role)}>
                    {roleIcon(row.role)}
                    {row.role || "—"}
                </span>
            ),
        },
    ];

    /* ================= HANDLERS ================= */

    const handleAdd = () => {
        setShowCreate(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowEdit(true);
    };

    const handleDelete = (user) => {
        setDeleteUser(user);
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        userApi.delete(deleteUser.account_id)
            .then(() => {
                setShowConfirm(false);
                setDeleteUser(null);
                notify.success("Xóa tài khoản thành công");
                getUsers();
            })
            .catch((err) => {
                setShowConfirm(false);
                const msg = err.response?.data?.detail
                    || "Không thể xóa tài khoản. Tài khoản có thể đang được sử dụng.";
                notify.error(msg);
            });
    };

    return (
        <div className="admin-account">
            <div className="admin-account-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-users-cog"></i>
                    </span>
                    Quản lý Tài khoản
                </h2>
                <p>
                    <span className="status-dot"></span>
                    Quản lý tài khoản người dùng trong hệ thống
                </p>
            </div>

            <div className="admin-data-card">
                {/* ===== TABLE ===== */}
                <div className="account-table-wrapper">
                    <TableComponent
                        columns={columns}
                        data={currentUsers}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                {/* ===== PAGINATION ===== */}
                <div className="pagination-wrapper">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>

                {/* ===== CREATE ===== */}
                {showCreate && (
                    <CreateForm
                        setisShowFormCreate={setShowCreate}
                        GetUsers={getUsers}
                    />
                )}

                {/* ===== EDIT ===== */}
                {showEdit && selectedUser && (
                    <EditForm
                        setisShowFormEdit={setShowEdit}
                        GetUsers={getUsers}
                        data={selectedUser}
                        id={selectedUser.account_id}
                    />
                )}

                {/* ===== CONFIRM DELETE ===== */}
                <ConfirmDialog
                    show={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={confirmDelete}
                />
            </div>
        </div>
    );
}

export default Account;
