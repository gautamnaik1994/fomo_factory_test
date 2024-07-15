import React, { useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketContext } from './socketContext';

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const URL = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080' 
      : 'http://localhost:8080';

    const socketIo = io(URL, {
      autoConnect: true,
      reconnection: true,
      transports: ['websocket'],
      upgrade: false,
      forceNew: true,
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
