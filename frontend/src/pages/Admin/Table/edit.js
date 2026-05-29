import React, { useEffect, useState, useRef } from "react";
import tableApi from "../../../api/tableApi";
import { useNotify } from "../../../contexts/ToastContext";

const EditForm = ({ table, setEditTable, GetTables }) => {
    const notify = useNotify();
    const [TableNumber, setTableNumber] = useState("");
    const [Capacity, setCapacity] = useState("");
    const [Status, setStatus] = useState(0);
    const statusRef = useRef(0);

    useEffect(() => {
        if (table) {
            console.log("[DEBUG EditForm] useEffect - table prop changed:", table);
            const newStatus = Number(table.Status);
            console.log("[DEBUG EditForm] Setting status to:", newStatus);
            setTableNumber(table.TableNumber);
            setCapacity(table.Capacity);
            setStatus(newStatus);
            statusRef.current = newStatus;
        }
    }, [table]);

    const handleStatusChange = (e) => {
        const newStatus = Number(e.target.value);
        console.log("[DEBUG EditForm] Status changed to:", newStatus);
        setStatus(newStatus);
        statusRef.current = newStatus;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("[DEBUG EditForm] Current form state - Status:", Status, "Ref:", statusRef.current);

        const data = {
            TableNumber,
            Capacity: Number(Capacity),
            Status: statusRef.current, // Use ref to ensure we get the latest value
        };

        console.log("[DEBUG EditForm] Submitting update:", { id: table.TableID, data });

        tableApi
            .update(table.TableID, data)
            .then((response) => {
                console.log("[DEBUG EditForm] Update response:", response.data);
                notify.success("Cập nhật bàn thành công");
                GetTables();
                setEditTable(null);
            })
            .catch((error) => {
                console.error("[DEBUG EditForm] Update error:", error);
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
                            onChange={handleStatusChange}
                        >
                            <option value={0}>Còn bàn</option>
                            <option value={1}>Đã đặt</option>
                            <option value={2}>Đang sử dụng</option>
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
