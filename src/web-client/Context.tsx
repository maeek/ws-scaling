import React, { useEffect, useRef, useState } from 'react';
// import { io } from 'socket.io-client';
import { SOCKET_IO_ADDR, SOCKET_IO_PATH } from '../config';
import wio from './socket.io-worker';

// const wio = require('socketio-shared-webworker/dist/socket.io-worker');

const SocketContext = React.createContext({
  socket: null as ReturnType<typeof wio>
});

// socket.on("connect", () => {
//   console.log('Connected to socket, pesonal id:', socket.id);
// });

// socket.on('channelsList', (res) => {
//   ChannelsDomService.channels = res.data
// })

export const SocketProvider = ({children}: any) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = wio(SOCKET_IO_ADDR, {
      transports: [ 'websocket' ],
      path: SOCKET_IO_PATH
    });
    
    ws.useWorker('shared-worker.js');
    debugger;
    // ws.start();
    // console.log(ws);


    ws.on('connect', (dt: any) => {
      console.log(dt)
      setSocket(ws);
    })

    ws.on('disconnect', () => {
      setSocket(null);
    })

    return () => {
      ws.disconnect();
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socket as ReturnType<typeof wio>
      }}
    >
      {children}
    </SocketContext.Provider>
  )
};

export const useSocket = () => {
  const context = React.useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketContext');
  }

  return context;
};
