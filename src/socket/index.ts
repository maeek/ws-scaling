import { Socket } from "socket.io";
import { httpServer } from "../httpServer";
import { createSocketWorker } from "./factory";

const handleConnection = (socket: Socket) => {
  socket.on('data', (data) => {
    console.log(data);
    socket.emit('data-recvd', { status: true });
  })
};

export const io = createSocketWorker(httpServer, handleConnection, {
  transports: [ 'websocket' ],
  path: '/transport',
  cors: {
    origin: ['*'],
    allowedHeaders: []
  }
});
