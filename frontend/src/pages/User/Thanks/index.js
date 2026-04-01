import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Thanks() {
    const navigate = useNavigate()

    // Auto redirect sang Bills sau 10 giây
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/user/bill')
        }, 10000)
        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            padding: '20px'
        }}>
            {/* Icon */}
            <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#d69c52',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
            }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </div>

            {/* Title */}
            <h1 style={{
                fontSize: '32px',
                color: '#d69c52',
                marginBottom: '10px'
            }}>
                Cảm ơn bạn đã đặt bàn!
            </h1>

            {/* Message */}
            <p style={{
                fontSize: '18px',
                color: '#666',
                marginBottom: '20px',
                textAlign: 'center'
            }}>
                Chúng tôi đã nhận được thông tin đặt bàn của bạn. Cảm ơn bạn đã tin tưởng!
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    onClick={() => navigate('/user/home')}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    Về trang chủ
                </button>
            </div>

            <p style={{ color: '#999', marginTop: '20px', fontSize: '14px' }}>
                Tự động chuyển về trang hóa đơn sau 10 giây...
            </p>
        </div>
    )
}

export default Thanks
