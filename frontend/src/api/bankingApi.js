import axios from "axios";

const bankingApi = {
    check(data) {
        return axios.post(
            "http://localhost:8000/api/banking/check_banking",
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
};

export default bankingApi;
