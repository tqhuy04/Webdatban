import React, { useEffect, useState } from "react";
import customerApi from "../../../api/customerApi";
import CreateForm from "./create";
import EditForm from "./edit";

function Customer() {
    const [customers, setCustomers] = useState([]);
    const [isShowFormCreate, setIsShowFormCreate] = useState(false);
    const [editCustomer, setEditCustomer] = useState(null);

    useEffect(() => {
        getCustomers();
    }, []);

    const getCustomers = () => {
        customerApi.getAll()
            .then(res => {
                setCustomers(res.data);
            })
            .catch(err => {
                console.error("Có lỗi khi lấy khách hàng:", err);
            });
    };

    const deleteCustomer = (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;

        customerApi.delete(id)
            .then(() => {
                alert("Xóa khách hàng thành công");
                getCustomers();
            })
            .catch(err => {
                console.error("Lỗi xóa khách hàng:", err);
            });
    };

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <button
                    className="btn btn-primary"
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
                    {customers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.full_name}</td>
                            <td>{customer.phone_number}</td>
                            <td>{customer.address}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => setEditCustomer(customer)}
                                >
                                    <i className="fa fa-edit"></i> Sửa
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteCustomer(customer.id)}
                                >
                                    <i className="fa fa-trash"></i> Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Customer;
