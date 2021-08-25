import { Socket } from "socket.io";
import { SOCKET_IO_PATH } from "../config";
import { httpServer } from "../httpServer";
import { createSocketWorker } from "./factory";

const channelsList = [
  'Main',
  'Secondary',
  'Some other channel'
]

const handleConnection = (socket: Socket) => {
  console.log('connected', socket.id);
  socket.on('requestChannels', () => {
    socket.emit('channelsList', { data: channelsList });
  })

  socket.on('disconnect', () => {
    console.log('disconnected', socket.id)
  })

  socket.emit('channelsList', { data: channelsList });
};

export const io = createSocketWorker(httpServer, handleConnection, {
  transports: [ 'websocket' ],
  path: SOCKET_IO_PATH,
  cors: {
    origin: ['*'],
    allowedHeaders: []
  }
});
