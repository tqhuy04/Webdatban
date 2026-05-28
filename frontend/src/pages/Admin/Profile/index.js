import React, { useEffect, useState } from "react";
import profileApi from "../../../api/profileApi";
import "./Profile.css";

function Profile() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        profileApi.getMe()
            .then((res) => setProfile(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const roleLabel = (role) => {
        const map = { ADMIN: "Quản trị viên", STAFF: "Nhân viên", CUSTOMER: "Khách hàng" };
        return map[role] || role;
    };

    const roleIcon = (role) => {
        const map = {
            ADMIN: "fa-shield-halved",
            STAFF: "fa-user-gear",
            CUSTOMER: "fa-user",
        };
        return map[role] || "fa-user";
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <i className="fas fa-spinner fa-spin" />
                <span>Đang tải...</span>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="profile-loading">
                <span>Không thể tải thông tin</span>
            </div>
        );
    }

    const initials = profile.username
        ? profile.username.charAt(0).toUpperCase()
        : "A";

    return (
        <div className="admin-profile">
            <div className="admin-profile-header">
                <h2>
                    <span className="header-icon">
                        <i className="fa fa-user-circle" />
                    </span>
                    Thông tin cá nhân
                </h2>
                <p>
                    <span className="status-dot" />
                    Xem thông tin tài khoản của bạn
                </p>
            </div>

            <div className="profile-content">
                {/* Avatar Card */}
                <div className="profile-avatar-card">
                    <div className="profile-avatar">
                        {initials}
                    </div>
                    <h3>{profile.username}</h3>
                    <span className={`profile-role-badge role-${(profile.role || "").toLowerCase()}`}>
                        <i className={`fa ${roleIcon(profile.role)}`} />
                        {roleLabel(profile.role)}
                    </span>
                </div>

                {/* Info Card */}
                <div className="profile-info-card">
                    <div className="profile-card-header">
                        <div className="profile-card-icon">
                            <i className="fa fa-id-card" />
                        </div>
                        <div>
                            <h3>Chi tiết tài khoản</h3>
                            <p>Thông tin cơ bản của bạn</p>
                        </div>
                    </div>

                    <div className="profile-info-grid">
                        <div className="profile-info-item">
                            <div className="profile-info-label">
                                <i className="fa fa-user" />
                                Tên đăng nhập
                            </div>
                            <div className="profile-info-value">{profile.username}</div>
                        </div>

                        <div className="profile-info-item">
                            <div className="profile-info-label">
                                <i className="fa fa-envelope" />
                                Email
                            </div>
                            <div className="profile-info-value">{profile.email || "—"}</div>
                        </div>

                        <div className="profile-info-item">
                            <div className="profile-info-label">
                                <i className="fa fa-shield-halved" />
                                Vai trò
                            </div>
                            <div className="profile-info-value">
                                <span className={`profile-role-badge role-${(profile.role || "").toLowerCase()}`}>
                                    <i className={`fa ${roleIcon(profile.role)}`} />
                                    {roleLabel(profile.role)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Stats */}
                <div className="profile-stats-card">
                    <div className="profile-card-header">
                        <div className="profile-card-icon purple-icon">
                            <i className="fa fa-chart-line" />
                        </div>
                        <div>
                            <h3>Tài khoản</h3>
                            <p>ID: #{profile.account_id}</p>
                        </div>
                    </div>
                    <div className="profile-stats-note">
                        <i className="fa fa-info-circle" />
                        <span>Để thay đổi thông tin, vui lòng vào <strong>Cài đặt</strong></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
