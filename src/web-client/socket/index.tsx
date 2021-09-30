import React, { useEffect, useState } from 'react';
import { SocketService } from './SocketService';
import { BChannelMessageType, WsState } from './types';

export interface SocketContextType {
  socket: SocketService;
  connected?: boolean;
  status: WsState;
  emit: (name: string, data?: any, ack?: Function, toSelf?: boolean) => void;
}

const SocketContext = React.createContext<SocketContextType | undefined>(undefined);

const socket = new SocketService();

export const SocketProvider = ({ children }: any) => {
  const [ connected, setConnected ] = useState(false);
  
  useEffect(() => {
    const listener = (ms: BChannelMessageType) => {
      console.log('Socket state -', ms.data.wsState);
      setConnected(ms.data.wsState === 'connected');
    };
  
    socket.on('status', listener);

    return () => socket.off('status', listener);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socket,
        connected,
        emit: socket.emit,
        status: socket.status
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketContext');
  }

  return context;
};
