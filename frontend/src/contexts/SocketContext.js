import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Kết nối Socket.IO
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
            console.log('[Socket] Connected:', newSocket.id);
            setIsConnected(true);

            // Đăng ký thông tin user (nếu có token)
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');

            if (token && role) {
                // Admin đăng ký với role ADMIN
                newSocket.emit('register', {
                    user_id: 0,
                    user_type: role.toUpperCase(),
                    account_id: null
                });
            }
        });

        newSocket.on('disconnect', () => {
            console.log('[Socket] Disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.log('[Socket] Connection error:', error.message);
        });

        setSocket(newSocket);

        // Gán vào window để các component khác có thể truy cập
        window.socket = newSocket;

        return () => {
            newSocket.disconnect();
            window.socket = null;
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}
