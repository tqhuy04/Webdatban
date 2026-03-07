import React, { useEffect, useState } from "react";
import booking_tableApi from "../../../api/booking_tableApi";
import tableApi from "../../../api/tableApi";

const CreateForm = ({
    setisShowFormCreate,
    GetBooking_tables,
    BookingID
}) => {

    const [TableID, setTableID] = useState("");
    const [Tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);

    // load danh sách bàn
    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        try {
            const res = await tableApi.getAll();
            setTables(res.data);
        }
        catch (err) {
            console.error("Lỗi load tables:", err);
        }
    };

    // submit thêm bàn vào booking
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!TableID) {
            alert("Vui lòng chọn bàn");
            return;
        }

        try {

            setLoading(true);

            // 👇 API thêm bàn vào booking hiện tại
            await booking_tableApi.addTable(BookingID, {
                table_id: Number(TableID)
            });

            // update status bàn
            await tableApi.setStatus(TableID);

            alert("Thêm bàn thành công ✅");

            // reload danh sách bàn của booking
            await GetBooking_tables();

            setisShowFormCreate(false);

        }
        catch (err) {

            console.error(err);
            alert("Lỗi thêm bàn ❌");

        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">

            <div className="modal-content">

                <h4>Thêm bàn vào booking #{BookingID}</h4>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label className="form-label">
                            Chọn bàn
                        </label>

                        <select
                            className="form-select"
                            value={TableID}
                            onChange={(e) =>
                                setTableID(e.target.value)
                            }
                        >

                            <option value="">
                                -- Chọn bàn --
                            </option>

                            {Tables
                                .filter(t => t.Status === 0)
                                .map(t => (
                                    <option
                                        key={t.TableID}
                                        value={t.TableID}
                                    >
                                        Bàn {t.TableNumber}
                                    </option>
                                ))}

                        </select>

                    </div>

                    <button
                        type="submit"
                        className="btn btn-success me-2"
                        disabled={loading}
                    >
                        {loading ? "Đang lưu..." : "Lưu"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                            setisShowFormCreate(false)
                        }
                    >
                        Hủy
                    </button>

                </form>

            </div>

        </div>
    );
};

export default CreateForm;