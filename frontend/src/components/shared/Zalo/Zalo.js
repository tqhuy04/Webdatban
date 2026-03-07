import React from 'react';


const Zalo = () => {
    const phoneNumber = "0376457448"; // Thay bằng số điện thoại Zalo của bạn

    const openZaloChat = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // Kiểm tra thiết bị di động
        const zaloLink = isMobile
            ? `zalo://chat?phone=${phoneNumber}` // Mở ứng dụng Zalo trên điện thoại
            : `https://zalo.me/${phoneNumber}`;  // Mở Zalo Web trên máy tính
        window.open(zaloLink, "_blank");
    };

    return (
        <div className="zalo-button" onClick={openZaloChat}>
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png"
                alt="Chat Zalo"
            />
        </div>
    );
};

export default Zalo;