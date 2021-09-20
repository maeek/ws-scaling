import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { SOCKET_IO_PATH } from "../config";
import { httpServer } from "../httpServer";
import { createSocketWorker } from "./factory";

const channelsList = [
  'Main',
  'Secondary',
  'Some other channel'
]

const handleConnection = (socket: Socket) => {
  console.log(socket.id, 'connected');

  socket.on('requestChannels', (_arg: any) => {
    console.log(socket.id, 'requestChannels');
    socket.emit('channelsList', channelsList);
  });

  socket.on('requestChannelJoin', (data) => {
    console.log(socket.id, 'joined room - ', data);
    socket.join(data.name)
  });

  socket.on('requestChannelLeave', (data) => {
    console.log(socket.id, 'left room - ', data);
    socket.leave(data.name)
  });

  socket.on('message', (message, callback) => {
    const msid = uuidv4();
    const ms = {
      ...message,
      id: msid
    };

    socket.to(message.room).emit(ms)

    callback({
      msid
    })
  });

  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected')
  })
};

export const io = createSocketWorker(httpServer, handleConnection, {
  transports: [ 'websocket' ],
  path: SOCKET_IO_PATH,
  cors: {
    origin: ['*'],
    allowedHeaders: []
  },
  
});
