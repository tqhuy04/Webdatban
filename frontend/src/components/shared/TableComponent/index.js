import React from "react";

const TableComponent = ({
    columns = [],
    data = [],
    onAdd,
    onEdit,
    onDelete,
}) => {
    return (
        <div>
            {onAdd && (
                <div className="d-flex justify-content-end mb-4">
                    <button className="admin-btn-add" onClick={onAdd}>
                        <i className="fa fa-plus"></i> Thêm mới
                    </button>
                </div>
            )}

            <div className="account-table-wrapper">
                <table className="account-table">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index}>{col.label}</th>
                            ))}
                            {(onEdit || onDelete) && <th style={{ textAlign: "center" }}>Hành động</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center py-5">
                                    <div className="empty-state">
                                        <i className="fa fa-inbox"></i>
                                        <p>Không có dữ liệu</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={row.id || rowIndex}>
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex}>
                                            {col.render
                                                ? col.render(row)
                                                : row[col.key]}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td>
                                            <div className="action-group" style={{ justifyContent: "center" }}>
                                                {onEdit && (
                                                    <button
                                                        className="action-btn edit-btn"
                                                        onClick={() => onEdit(row)}
                                                    >
                                                        <i className="fa fa-pen"></i> Sửa
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        className="action-btn delete-btn"
                                                        onClick={() => onDelete(row)}
                                                    >
                                                        <i className="fa fa-trash"></i> Xóa
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableComponent;
