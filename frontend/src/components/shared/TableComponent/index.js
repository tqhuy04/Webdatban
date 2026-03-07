import React from "react";

const TableComponent = ({
    columns = [],
    data = [],
    onAdd,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="container mt-3">
            {onAdd && (
                <div className="d-flex justify-content-between mb-3">
                    <button className="btn btn-primary" onClick={onAdd}>
                        <i className="fa fa-plus"></i> Thêm
                    </button>
                </div>
            )}

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col.label}</th>
                        ))}
                        {(onEdit || onDelete) && <th>Hành động</th>}
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1} className="text-center">
                                Không có dữ liệu
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
                                        {onEdit && (
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => onEdit(row)}
                                            >
                                                <i className="fa fa-edit"></i> Sửa
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => onDelete(row)}
                                            >
                                                <i className="fa fa-trash"></i> Xóa
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableComponent;
