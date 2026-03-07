import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authUser from "../../../api/authUser";

const Login = ({ isVisible = true, onClose }) => {
    const navigate = useNavigate();

    const [isRightPanelActive, setRightPanelActive] = useState(false);

    // ===== LOGIN =====
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // ===== REGISTER =====
    const [regUsername, setRegUsername] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");

    const [loading, setLoading] = useState(false);

    if (!isVisible) return null;

    // ================= LOGIN =================
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await authUser.login({ username, password });

            localStorage.setItem("token", res.access_token);
            localStorage.setItem("role", res.role);

            onClose && onClose();

            if (res.role === "ADMIN") {
                navigate("/Admin/Home", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        } catch (err) {
            alert("Đăng nhập thất bại");
        } finally {
            setLoading(false);
        }
    };


    // ================= REGISTER =================
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authUser.register({
                username: regUsername,
                email: regEmail,
                password: regPassword,
                role: "STAFF"
            });

            alert("Đăng ký thành công, vui lòng đăng nhập");

            setRightPanelActive(false);
            setRegUsername("");
            setRegEmail("");
            setRegPassword("");

        } catch (err) {
            alert(err.response?.data?.detail || "Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: "420px" }}>
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.5)",
                    zIndex: 999,
                }}
            />

            <div className="login-container">
                <div className={`container1 ${isRightPanelActive ? "right-panel-active" : ""}`}>

                    {/* ===== REGISTER ===== */}
                    <div className="form-container sign-up-container">
                        <form onSubmit={handleRegister}>
                            <h1>Create Account</h1>

                            <input
                                type="text"
                                placeholder="Username"
                                value={regUsername}
                                onChange={(e) => setRegUsername(e.target.value)}
                                required
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                                required
                            />

                            <button disabled={loading}>
                                {loading ? "Loading..." : "Sign Up"}
                            </button>
                        </form>
                    </div>

                    {/* ===== LOGIN ===== */}
                    <div className="form-container sign-in-container">
                        <form onSubmit={handleLogin}>
                            <h1>Sign in</h1>

                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button disabled={loading}>
                                {loading ? "Loading..." : "Sign In"}
                            </button>
                        </form>
                    </div>

                    {/* ===== OVERLAY ===== */}
                    <div className="overlay-container">
                        <div className="overlay2">
                            <div className="overlay-panel overlay-left">
                                <h1>Welcome Back!</h1>
                                <p>Please login with your account</p>
                                <button
                                    className="ghost"
                                    onClick={() => setRightPanelActive(false)}
                                >
                                    Sign In
                                </button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1>Hello, Friend!</h1>
                                <p>Create your account</p>
                                <button
                                    className="ghost"
                                    onClick={() => setRightPanelActive(true)}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
