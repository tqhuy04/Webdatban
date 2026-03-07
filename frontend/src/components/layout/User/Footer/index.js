import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <div
            className="container-fluid pt-3 text-white"
            style={{
                height: "300px",
                background: "#10302c",
                borderTop: "1px solid #fff",
            }}
        >
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <Link to="/">
                            <img
                                src="https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/logo-ft.png?1705898809027"
                                alt="Dola Restaurant"
                            />
                        </Link>

                        <p>
                            Nhà hàng chúng tôi luôn luôn đặt khách hàng lên hàng
                            đầu, tận tâm phục vụ, mang lại cho khách hàng những
                            trãi nghiệm tuyệt với nhất. Các món ăn với công thức
                            độc quyền sẽ mang lại hương vị mới mẻ cho thực
                            khách. Dola Restaurant xin chân thành cảm ơn.
                        </p>
                    </div>

                    <div className="col-md-2">
                        <h4>HƯỚNG DẪN</h4>
                        <p>Hướng dẫn mua hàng</p>
                        <p>Hướng dẫn thanh toán</p>
                        <p>Đăng kí thành viên</p>
                        <p>Hỗ trợ khách hàng</p>
                    </div>

                    <div className="col-md-3">
                        <h4>CHÍNH SÁCH</h4>
                        <p>Chính sách thành viên</p>
                        <p>Hướng dẫn thanh toán</p>
                        <p>Đăng kí thành viên</p>
                        <p>Hỗ trợ khách hàng</p>
                    </div>

                    <div className="col-md-3">
                        <h4>CỬA HÀNG CHÍNH</h4>
                        <p>Địa chỉ: 54 Triều Khúc</p>
                        <p>Điện thoại: 0376457448</p>
                        <p>Email: dola@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
