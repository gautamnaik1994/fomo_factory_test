import React, { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = (): SocketContextType => {
  return useContext(SocketContext);
};
