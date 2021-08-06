import { io } from 'socket.io-client';

const socket = io('http://localhost:8080/', {
  transports: [ 'websocket' ],
  path: '/transport'
});

socket.on("connect", () => {
  console.log(socket.id);
});

socket.emit('data', { test: true })