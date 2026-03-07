import React, { useEffect, useState } from "react";
import TableComponent from '../../../components/shared/TableComponent';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
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

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        userApi.getAll()
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
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
        <div className="container mt-3">

            {/* ===== TABLE ===== */}
            <TableComponent
                columns={columns}
                data={users}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

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
    );
}

export default Account;
