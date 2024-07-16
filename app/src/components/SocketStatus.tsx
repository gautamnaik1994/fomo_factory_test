import React from 'react';
import { useAppSelector } from '@/store/hooks';


const SocketStatus = (): React.ReactNode => {
    
    const socketDisconnected  = useAppSelector((state) => state.socket.socketDisconnected);
    
    if(socketDisconnected){
        return (
            <div className={`socket-status`}>
                <p>Socket Disconnected</p>
            </div>
        );
    }
   
}

export default SocketStatus;