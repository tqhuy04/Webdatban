import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // chỉ cần import là đủ
import statisticalApi from "../../../api/statisticalApi";

function Home() {
    const [SumOrder, setSumOrder] = useState(0);
    const [CountTable, setCountTable] = useState(0);

    const [labels, setLabels] = useState([]);
    const [datasets, setDatasets] = useState([]);

    // lọc ngày (chưa xử lý backend, chỉ giữ UI)
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [timeFrame, setTimeFrame] = useState("morning");

    useEffect(() => {
        // tổng đơn + tổng bàn
        statisticalApi.getOrderandTable()
            .then(response => {
                setSumOrder(response.data.totalOrders);
                setCountTable(response.data.totalTables);
            })
            .catch(error => {
                console.error("có lỗi trong quá trình lấy dl: ", error);
            });

        // chart order theo ngày
        statisticalApi.getChartOfOrder()
            .then(response => {
                const chartLabels = response.data.map(item => item.date);
                const chartData = response.data.map(item => item.total);

                setLabels(chartLabels);
                setDatasets(chartData);
            })
            .catch(error => {
                console.error("có lỗi trong quá trình lấy dl: ", error);
            });
    }, []);

    const handleSubmitDates = () => {
        console.log("Start:", startDate);
        console.log("End:", endDate);
        console.log("Time frame:", timeFrame);
        // sau này gọi API lọc
    };

    const dataBar = {
        labels: labels,
        datasets: [
            {
                label: "Số lượng đơn theo ngày",
                data: datasets,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const dataPie = {
        labels: ["Sáng", "Chiều", "Tối"],
        datasets: [
            {
                label: "Mốc Thời Gian",
                data: [30, 50, 20],
                backgroundColor: ["#ff9999", "#66b3ff", "#99ff99"],
                borderColor: ["#ff6666", "#3399ff", "#33cc33"],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    return (
        <div className="p-3">
            <div className="border-bottom mb-2">
                <i style={{ color: "#62677399" }}>Welcome!</i>
            </div>

            {/* THỐNG KÊ */}
            <div className="row mt-2 p-2">
                <div className="col-md-6 p-2" style={{ height: "100px" }}>
                    <div
                        style={{
                            boxShadow: "0 -4px 10px 4px rgba(0, 0, 0, 0.1)",
                            width: "100%",
                            height: "100%",
                            textAlign: "center",
                        }}
                    >
                        <h6 className="pt-3">Tổng số đơn hàng</h6>
                        <p>{SumOrder}</p>
                    </div>
                </div>

                <div className="col-md-6 p-2" style={{ height: "100px" }}>
                    <div
                        style={{
                            boxShadow: "0 -4px 10px 4px rgba(0, 0, 0, 0.1)",
                            width: "100%",
                            height: "100%",
                            textAlign: "center",
                        }}
                    >
                        <h6 className="pt-3">Tổng số bàn</h6>
                        <p>{CountTable}</p>
                    </div>
                </div>
            </div>

            {/* BỘ LỌC */}
            <div className="container mt-3">
                <div className="row align-items-end">
                    <div className="col-md-3">
                        <label>Chọn Ngày Bắt Đầu</label>
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3">
                        <label>Chọn Ngày Kết Thúc</label>
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <div className="col-md-2">
                        <button
                            className="btn btn-primary w-100"
                            onClick={handleSubmitDates}
                        >
                            Xác Nhận
                        </button>
                    </div>

                    <div className="col-md-2">
                        <label>Chọn Mốc Thời Gian</label>
                        <select
                            className="form-control"
                            value={timeFrame}
                            onChange={(e) => setTimeFrame(e.target.value)}
                        >
                            <option value="morning">Sáng</option>
                            <option value="afternoon">Chiều</option>
                            <option value="evening">Tối</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* BIỂU ĐỒ */}
            <div className="row mt-4">
                <div className="col-md-6">
                    <Bar data={dataBar} options={options} />
                </div>

                <div className="col-md-6 d-flex justify-content-center">
                    <div style={{ width: "60%" }}>
                        <Pie data={dataPie} options={options} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
