import React, { useEffect, useState } from "react";
import tableApi from "../../../api/tableApi";
import { useNotify } from "../../../contexts/ToastContext";

const EditForm = ({ table, setEditTable, GetTables }) => {
    const notify = useNotify();
    const [TableNumber, setTableNumber] = useState("");
    const [Capacity, setCapacity] = useState("");
    const [Status, setStatus] = useState(0);

    useEffect(() => {
        if (table) {
            setTableNumber(table.TableNumber);
            setCapacity(table.Capacity);
            setStatus(Number(table.Status));
        }
    }, [table]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            TableNumber,
            Capacity: Number(Capacity),
            Status: Number(Status),
        };

        tableApi
            .update(table.TableID, data)
            .then(() => {
                notify.success("Cập nhật bàn thành công");
                GetTables();
                setEditTable(null);
            })
            .catch(() => {
                notify.error("Cập nhật thất bại");
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Sửa bàn</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Tên bàn</label>
                        <input
                            type="text"
                            className="form-control"
                            value={TableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Sức chứa</label>
                        <input
                            type="number"
                            className="form-control"
                            value={Capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Trạng thái</label>
                        <select
                            className="form-control"
                            value={Status}
                            onChange={(e) =>
                                setStatus(Number(e.target.value))
                            }
                        >
                            <option value={0}>Còn bàn</option>
                            <option value={1}>Đã đặt</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        Lưu
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setEditTable(null)}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditForm;
