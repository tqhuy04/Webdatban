import React, { useEffect, useState } from "react";
import tableApi from "../../../api/tableApi";
import CreateForm from "./create";
import EditForm from "./edit";

function Table() {
    const [Tables, setTables] = useState([]);
    const [isShowFormCreate, setisShowFormCreate] = useState(false);
    const [editTable, setEditTable] = useState(null); // ✅ object bàn đang sửa

    useEffect(() => {
        GetTables();
    }, []);

    function GetTables() {
        tableApi
            .getAll()
            .then((response) => {
                setTables(response.data);
            })
            .catch((error) => {
                console.error("Lỗi lấy danh sách bàn:", error);
            });
    }

    function Deletetable(id) {
        if (window.confirm("Bạn có chắc muốn xóa bàn này không?")) {
            tableApi
                .delete(id)
                .then(() => {
                    alert("Xóa bàn thành công");
                    GetTables();
                })
                .catch((error) => {
                    console.error("Lỗi xóa bàn:", error);
                });
        }
    }

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <button
                    className="btn btn-primary"
                    onClick={() => setisShowFormCreate(true)}
                >
                    <i className="fa fa-plus"></i> Thêm
                </button>

                {isShowFormCreate && (
                    <CreateForm
                        setisShowFormCreate={setisShowFormCreate}
                        GetTables={GetTables}
                    />
                )}
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Tên bàn</th>
                        <th>Sức chứa</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {Tables.map((table) => (
                        <tr key={table.TableID}>
                            <td>{table.TableNumber}</td>
                            <td>{table.Capacity}</td>
                            <td>
                                {Number(table.Status) === 0
                                    ? "Còn bàn"
                                    : "Đã đặt"}
                            </td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => setEditTable(table)} // ✅ TRUYỀN CẢ OBJECT
                                >
                                    <i className="fa fa-edit"></i> Sửa
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => Deletetable(table.TableID)}
                                >
                                    <i className="fa fa-trash"></i> Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* FORM SỬA */}
            {editTable && (
                <EditForm
                    table={editTable}
                    setEditTable={setEditTable}
                    GetTables={GetTables}
                />
            )}
        </div>
    );
}

export default Table;
