import React, { useEffect, useState } from "react";
import profileApi from "../../../api/profileApi";
import { useNotify } from "../../../contexts/ToastContext";
import "./Settings.css";

function Settings() {
    const notify = useNotify();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [profile, setProfile] = useState({
        username: "",
        email: "",
    });

    const [passwords, setPasswords] = useState({
        current: "",
        newPass: "",
        confirm: "",
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        profileApi.getMe()
            .then((res) => {
                setProfile({
                    username: res.data.username || "",
                    email: res.data.email || "",
                });
            })
            .catch(() => {
                notify.error("Không thể tải thông tin tài khoản");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleProfileChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!profile.username.trim()) {
            notify.warning("Vui lòng nhập tên đăng nhập");
            return;
        }
        if (!profile.email.trim()) {
            notify.warning("Vui lòng nhập email");
            return;
        }

        setSaving(true);
        try {
            await profileApi.updateMe({
                username: profile.username,
                email: profile.email,
            });
            notify.success("Cập nhật thông tin thành công");
        } catch (err) {
            notify.error(err.response?.data?.detail || "Cập nhật thất bại");
        } finally {
            setSaving(false);
        }
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        if (!passwords.current) {
            notify.warning("Vui lòng nhập mật khẩu hiện tại");
            return;
        }
        if (!passwords.newPass) {
            notify.warning("Vui lòng nhập mật khẩu mới");
            return;
        }
        if (passwords.newPass.length < 6) {
            notify.warning("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }
        if (passwords.newPass !== passwords.confirm) {
            notify.warning("Mật khẩu xác nhận không khớp");
            return;
        }

        setSaving(true);
        try {
            await profileApi.updateMe({
                current_password: passwords.current,
                new_password: passwords.newPass,
            });
            notify.success("Đổi mật khẩu thành công");
            setPasswords({ current: "", newPass: "", confirm: "" });
        } catch (err) {
            notify.error(err.response?.data?.detail || "Đổi mật khẩu thất bại");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="settings-loading">
                <i className="fas fa-spinner fa-spin" />
                <span>Đang tải...</span>
            </div>
        );
    }

    return (
        <div className="admin-settings">
            <div className="admin-settings-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-gear" />
                    </span>
                    Cài đặt tài khoản
                </h2>
                <p>
                    <span className="status-dot" />
                    Quản lý thông tin và bảo mật tài khoản của bạn
                </p>
            </div>

            <div className="settings-content">
                <div className="settings-grid">

                    {/* ===== THÔNG TIN TÀI KHOẢN ===== */}
                    <div className="settings-card">
                        <div className="settings-card-header">
                            <div className="settings-card-icon">
                                <i className="fa fa-user-pen" />
                            </div>
                            <div>
                                <h3>Thông tin tài khoản</h3>
                                <p>Cập nhật tên đăng nhập và email</p>
                            </div>
                        </div>

                        <form onSubmit={handleSaveProfile} className="settings-form">
                            <div className="form-group-modal">
                                <label>
                                    <i className="fa fa-user" />
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="text"
                                    className="modal-input"
                                    value={profile.username}
                                    onChange={(e) => handleProfileChange("username", e.target.value)}
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </div>

                            <div className="form-group-modal">
                                <label>
                                    <i className="fa fa-envelope" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="modal-input"
                                    value={profile.email}
                                    onChange={(e) => handleProfileChange("email", e.target.value)}
                                    placeholder="Nhập địa chỉ email"
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="submit"
                                    className="btn-modal-save"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <><i className="fas fa-spinner fa-spin" /> Đang lưu...</>
                                    ) : (
                                        <><i className="fa fa-floppy-disk" /> Lưu thay đổi</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ===== ĐỔI MẬT KHẨU ===== */}
                    <div className="settings-card">
                        <div className="settings-card-header">
                            <div className="settings-card-icon password-icon">
                                <i className="fa fa-lock" />
                            </div>
                            <div>
                                <h3>Đổi mật khẩu</h3>
                                <p>Cập nhật mật khẩu để bảo vệ tài khoản</p>
                            </div>
                        </div>

                        <form onSubmit={handleSavePassword} className="settings-form">
                            <div className="form-group-modal">
                                <label>
                                    <i className="fa fa-key" />
                                    Mật khẩu hiện tại
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        className="modal-input"
                                        value={passwords.current}
                                        onChange={(e) => handlePasswordChange("current", e.target.value)}
                                        placeholder="Nhập mật khẩu hiện tại"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        tabIndex={-1}
                                    >
                                        <i className={`fa-solid ${showCurrent ? "fa-eye-slash" : "fa-eye"}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="form-group-modal">
                                <label>
                                    <i className="fa fa-key" />
                                    Mật khẩu mới
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        className="modal-input"
                                        value={passwords.newPass}
                                        onChange={(e) => handlePasswordChange("newPass", e.target.value)}
                                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowNew(!showNew)}
                                        tabIndex={-1}
                                    >
                                        <i className={`fa-solid ${showNew ? "fa-eye-slash" : "fa-eye"}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="form-group-modal">
                                <label>
                                    <i className="fa fa-key" />
                                    Xác nhận mật khẩu mới
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        className="modal-input"
                                        value={passwords.confirm}
                                        onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        tabIndex={-1}
                                    >
                                        <i className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="submit"
                                    className="btn-modal-save"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <><i className="fas fa-spinner fa-spin" /> Đang lưu...</>
                                    ) : (
                                        <><i className="fa fa-floppy-disk" /> Đổi mật khẩu</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Settings;
