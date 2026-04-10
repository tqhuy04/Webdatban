import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/banking";

const bankingApi = {
    // Legacy check banking
    check(data) {
        return axios.post(
            `${API_BASE_URL}/check_banking`,
            {
                amount: Number(data.amount),
                bank_code: data.bank_code || null,
                content: data.content || null,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    },

    // VNPay: Lấy danh sách ngân hàng
    getBankList() {
        return axios.get(`${API_BASE_URL}/vnpay/bank-list`);
    },

    // VNPay: Tạo URL thanh toán
    createVNPayPayment(data) {
        const token = localStorage.getItem("token");
        return axios.post(
            `${API_BASE_URL}/vnpay/create`,
            {
                order_id: data.order_id,
                amount: Number(data.amount),
                order_desc: data.order_desc,
                bank_code: data.bank_code || null,
                ip_addr: data.ip_addr || "127.0.0.1",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
            }
        );
    },

    // VNPay: Health check
    healthCheck() {
        return axios.get(`${API_BASE_URL}/vnpay/health`);
    },
};

export default bankingApi;
