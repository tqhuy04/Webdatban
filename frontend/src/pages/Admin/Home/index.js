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

    // phân bổ Sáng/Chiều/Tối cho biểu đồ tròn
    const [pieLabels, setPieLabels] = useState(["Sáng", "Chiều", "Tối"]);
    const [pieData, setPieData] = useState([0, 0, 0]);

    // lọc ngày + mốc thời gian
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [timeFrame, setTimeFrame] = useState("all");
    const [loading, setLoading] = useState(false);

    // đồng hồ thời gian thực
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    const formatDate = (date) => {
        const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
        return `${days[date.getDay()]}, ${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    };

    const formatClock = (date) => {
        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    };

    // tách hàm fetch ra để tái sử dụng khi lọc
    const fetchStats = (params = {}) => {
        return Promise.all([
            statisticalApi.getOrderandTable(params),
            statisticalApi.getChartOfOrder(params),
            statisticalApi.getPieTimeframe(params),
        ]).then(([statsRes, chartRes, pieRes]) => {
            if (statsRes?.data) {
                setSumOrder(statsRes.data.totalOrders ?? 0);
                setCountTable(statsRes.data.totalTables ?? 0);
                setSumRevenue(statsRes.data.totalRevenue ?? 0);
            }
            if (Array.isArray(chartRes?.data)) {
                setLabels(chartRes.data.map(item => item.date));
                setDatasets(chartRes.data.map(item => item.total));
            }
            if (Array.isArray(pieRes?.data)) {
                const labelMap = { morning: "Sáng", afternoon: "Chiều", evening: "Tối" };
                setPieLabels(pieRes.data.map(item => labelMap[item.label] || item.label));
                setPieData(pieRes.data.map(item => item.value));
            }
        });
    };

    useEffect(() => {
        fetchStats().catch(() => {
            // Silently fail
        });
    }, []);

    const buildParams = () => {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        if (timeFrame && timeFrame !== "all") params.time_frame = timeFrame;
        return params;
    };

    const handleApplyFilter = async () => {
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            alert("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.");
            return;
        }
        try {
            setLoading(true);
            await fetchStats(buildParams());
        } catch (err) {
            // Silently fail
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilter = async () => {
        setStartDate("");
        setEndDate("");
        setTimeFrame("all");
        try {
            setLoading(true);
            await fetchStats();
        } catch (err) {
            // Silently fail
        } finally {
            setLoading(false);
        }
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
        labels: pieLabels,
        datasets: [
            {
                label: "Mốc Thời Gian",
                data: pieData,
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
                        <button className="header-btn refresh" onClick={handleResetFilter} disabled={loading}>
                            <i className="fas fa-sync-alt"></i>
                            <span>Làm mới</span>
                        </button>
                    </div>
                </div>
                <div className="admin-header-stats">
                    <div className="mini-stat">
                        <i className="fas fa-calendar-day"></i>
                        <span>{formatDate(currentTime)}</span>
                    </div>
                    <div className="mini-stat">
                        <i className="fas fa-clock"></i>
                        <span>{formatClock(currentTime)}</span>
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
                            max={endDate || undefined}
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
                            min={startDate || undefined}
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
                            <option value="all">Tất cả</option>
                            <option value="morning">Sáng (5h - 12h)</option>
                            <option value="afternoon">Chiều (12h - 18h)</option>
                            <option value="evening">Tối (18h - 24h)</option>
                        </select>
                    </div>

                    <div className="filter-actions">
                        <button
                            className="filter-btn"
                            onClick={handleApplyFilter}
                            disabled={loading}
                        >
                            <i className="fas fa-search"></i>
                            {loading ? "Đang lọc..." : "Xác Nhận"}
                        </button>
                        <button
                            className="filter-btn filter-btn--reset"
                            onClick={handleResetFilter}
                            disabled={loading}
                        >
                            <i className="fas fa-undo"></i>
                            Đặt lại
                        </button>
                    </div>
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
