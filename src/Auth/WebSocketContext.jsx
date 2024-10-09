// websocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { URL } from '../utils/utils';

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(URL, {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });
    
        newSocket.on('connect', () => {
            console.log('WebSocket connected:', newSocket.id);
        });
    
        newSocket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });
    
        newSocket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
        });
    
        setSocket(newSocket);
    
        return () => {
            newSocket.disconnect(); // Disconnect when the component unmounts
        };
    }, []);
    
    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};
