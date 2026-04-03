import React, { useEffect, useState } from "react";
import TableComponent from '../../../components/shared/TableComponent';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import Pagination from '../../../components/shared/Pagination';
import userApi from '../../../api/userApi';
import CreateForm from "./create";
import EditForm from "./edit";

function Account() {
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
            .catch(err => console.error(err));
    };

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    /* ================= TABLE CONFIG ================= */

    const columns = [
        { label: "Tên người dùng", key: "username" },
        { label: "Email", key: "email" },
        { label: "Vai trò", key: "role" },
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
                getUsers();
            })
            .catch(err => console.error(err));
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
                <TableComponent
                    columns={columns}
                    data={currentUsers}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

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
