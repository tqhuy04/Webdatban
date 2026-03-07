import React from 'react'

const Notification = ({ message, type }) => {
    return (
        <div
            className={`alert alert-${type} position-fixed`}
            style={{
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: message ? 'block' : 'none',
            }}
            role="alert"
        >
            {message}
        </div>
    );
};

export default Notification