import React, { useState } from "react";
import tableApi from "../../../api/tableApi";

const CreateForm = ({ setisShowFormCreate, GetTables }) => {
    const [TableNumber, setTableNumber] = useState("");
    const [Capacity, setCapacity] = useState("");
    const [Status, setStatus] = useState(0); // INT 0 | 1

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            TableNumber,
            Capacity: Number(Capacity),
            Status: Number(Status),
        };

        tableApi
            .create(data)
            .then(() => {
                alert("Thêm bàn thành công");
                GetTables();
                setisShowFormCreate(false);
            })
            .catch((err) => {
                console.error("Lỗi thêm bàn:", err.response?.data || err);
                alert("Thêm bàn thất bại");
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Thêm bàn</h4>

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
                            onChange={(e) => setStatus(Number(e.target.value))}
                        >
                            <option value={0}>Còn bàn</option>
                            <option value={1}>Đã đặt</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success me-2">
                        Lưu
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setisShowFormCreate(false)}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateForm;
