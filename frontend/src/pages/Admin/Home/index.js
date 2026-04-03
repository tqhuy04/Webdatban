import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import statisticalApi from "../../../api/statisticalApi";
import { formatNumber } from "../../../components/utils/format_number";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function Home() {
    const [SumOrder, setSumOrder] = useState(0);
    const [CountTable, setCountTable] = useState(0);
    const [SumRevenue, setSumRevenue] = useState(0);

    const [labels, setLabels] = useState([]);
    const [datasets, setDatasets] = useState([]);

    // lọc ngày (chưa xử lý backend, chỉ giữ UI)
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [timeFrame, setTimeFrame] = useState("morning");

    useEffect(() => {
        // tổng đơn + tổng bàn + doanh thu
        statisticalApi.getOrderandTable()
            .then(response => {
                setSumOrder(response.data.totalOrders);
                setCountTable(response.data.totalTables);
                if (typeof response.data.totalRevenue !== "undefined") {
                    setSumRevenue(response.data.totalRevenue);
                }
            })
            .catch(() => {
                // Silently fail
            });

        // chart order theo ngày
        statisticalApi.getChartOfOrder()
            .then(response => {
                const chartLabels = response.data.map(item => item.date);
                const chartData = response.data.map(item => item.total);

                setLabels(chartLabels);
                setDatasets(chartData);
            })
            .catch(() => {
                // Silently fail
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
        <div className="admin-home col-md-10-content">
            <div className="admin-home-header">
                <div className="admin-header-content">
                    <div className="admin-header-text">
                        <h2>
                            <span className="header-icon">
                                <i className="fas fa-chart-line"></i>
                            </span>
                            Dashboard
                        </h2>
                        <p>
                            <span className="status-dot"></span>
                            Xin chào! Chào mừng bạn quay trở lại với Dola Restaurant
                        </p>
                    </div>
                    <div className="admin-header-actions">
                        <button className="header-btn refresh">
                            <i className="fas fa-sync-alt"></i>
                            <span>Làm mới</span>
                        </button>
                        <button className="header-btn notification">
                            <i className="fas fa-bell"></i>
                            <span className="notification-badge">3</span>
                        </button>
                        <div className="admin-avatar">
                            <i className="fas fa-user"></i>
                        </div>
                    </div>
                </div>
                <div className="admin-header-stats">
                    <div className="mini-stat">
                        <i className="fas fa-calendar-day"></i>
                        <span>Hôm nay</span>
                    </div>
                    <div className="mini-stat">
                        <i className="fas fa-clock"></i>
                        <span id="current-time">--:--</span>
                    </div>
                </div>
            </div>

            {/* THỐNG KÊ — luôn 3 cột một hàng */}
            <div className="admin-home-stats-row">
            <div className="stats-grid stats-grid--three">
                <div className="stat-card orders">
                    <div className="stat-card-icon">
                        <i className="fas fa-shopping-bag"></i>
                    </div>
                    <h6>Tổng số đơn hàng</h6>
                    <p className="stat-value">{SumOrder}</p>
                    <div className="stat-card-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>Tăng trưởng</span>
                    </div>
                </div>

                <div className="stat-card tables">
                    <div className="stat-card-icon">
                        <i className="fas fa-chair"></i>
                    </div>
                    <h6>Tổng số bàn</h6>
                    <p className="stat-value">{CountTable}</p>
                    <div className="stat-card-trend">
                        <i className="fas fa-check-circle"></i>
                        <span>Đang hoạt động</span>
                    </div>
                </div>

                <div className="stat-card revenue">
                    <div className="stat-card-icon">
                        <i className="fas fa-dollar-sign"></i>
                    </div>
                    <h6>Tổng doanh thu</h6>
                    <p className="stat-value currency">{formatNumber(SumRevenue)} đ</p>
                    <div className="stat-card-trend">
                        <i className="fas fa-arrow-up"></i>
                        <span>Tăng trưởng</span>
                    </div>
                </div>
            </div>
            </div>

            {/* BỘ LỌC */}
            <div className="filter-section">
                <div className="filter-section-header">
                    <div className="filter-icon">
                        <i className="fas fa-filter"></i>
                    </div>
                    <h5>Bộ lọc thống kê</h5>
                </div>
                <div className="filter-row">
                    <div className="filter-group">
                        <label>
                            <i className="far fa-calendar-alt"></i>
                            Ngày bắt đầu
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>
                            <i className="far fa-calendar-alt"></i>
                            Ngày kết thúc
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>
                            <i className="far fa-clock"></i>
                            Mốc thời gian
                        </label>
                        <select
                            value={timeFrame}
                            onChange={(e) => setTimeFrame(e.target.value)}
                        >
                            <option value="morning">Sáng</option>
                            <option value="afternoon">Chiều</option>
                            <option value="evening">Tối</option>
                        </select>
                    </div>

                    <button className="filter-btn" onClick={handleSubmitDates}>
                        <i className="fas fa-search"></i>
                        Xác Nhận
                    </button>
                </div>
            </div>

            {/* BIỂU ĐỒ */}
            <div className="charts-section">
                <div className="chart-card">
                    <div className="chart-card-header">
                        <h5>
                            <i className="fas fa-chart-bar"></i>
                            Đơn hàng theo ngày
                        </h5>
                    </div>
                    <div className="chart-container">
                        <Bar data={dataBar} options={options} />
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-card-header">
                        <h5>
                            <i className="fas fa-chart-pie"></i>
                            Phân bổ theo mốc thời gian
                        </h5>
                    </div>
                    <div className="chart-container pie">
                        <div>
                            <Pie data={dataPie} options={options} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
