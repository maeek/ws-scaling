import { createAdapter } from '@socket.io/redis-adapter';
import { Server as ServerHttp } from 'http';
import { createClient } from 'redis';
import { Server, ServerOptions, Socket } from 'socket.io';

export const createSocketWorker = (
  httpServer: ServerHttp,
  fn: (socket: Socket) => void,
  options?: Partial<ServerOptions>
) => {
  const io = new Server(httpServer, options);

  const pubClient = createClient({
    host: 'redis',
    port: process.env.REDIS_MASTER_PORT 
      ? parseInt(process.env.REDIS_MASTER_PORT)
      : 6379
  });
  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  io.on('connection', (socket) => {
    fn(socket);
  });

  return io;
};
