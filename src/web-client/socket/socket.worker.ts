import io from 'socket.io-client';
import { BROADCAST_CHANNEL, SOCKET_IO_ADDR, SOCKET_IO_PATH } from '../../config';
import { BChannelMessageMessage, BChannelMessageStatus, BChannelMessageType, MessageTypesEnum } from './types';

self.name = 'socket-worker'

const ctx: SharedWorker = self as any;

const socket = io(SOCKET_IO_ADDR, {
  path: SOCKET_IO_PATH,
  transports: ['websocket']
});

const broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL);

socket.on('connect', () => {
  console.log('Connected');

  broadcastChannel.postMessage({
    type: MessageTypesEnum.STATUS,
    data: {
      name: 'status',
      wsState: 'connected'
    },
    from: 'worker'
  } as BChannelMessageStatus)
});

socket.on('disconnect', () => {
  console.log('Disconnected');

  broadcastChannel.postMessage({
    type: MessageTypesEnum.STATUS,
    data: {
      name: 'status',
      wsState: 'disconnected'
    },
    from: 'worker'
  } as BChannelMessageStatus)
});

socket.onAny((evt, response) => {
  console.log('Received evt -', evt, response);

  broadcastChannel.postMessage({
    type: MessageTypesEnum.MESSAGE,
    data: {
      name: evt,
      response
    },
    from: 'worker'
  } as BChannelMessageMessage)
});

ctx.addEventListener("connect", (event: any) => {
  const port = event.ports[0];

  port.onmessage = (message: MessageEvent) => {
    console.log('EMIT - ', message.data);
    socket.emit(
      message.data.name,
      {
        ...message.data.data,
        meta: {
          from: message.data.from
        }
      },
      (ack: unknown) => {
        port.postMessage({
          type: MessageTypesEnum.ACK,
          data: ack,
          ackId: message.data.ackId
        })
      }
    )
  }

  port.postMessage({
    type: MessageTypesEnum.STATUS,
    from: 'worker',
    data: {
      name: 'status',
      wsState: socket.connected ? 'connected' : 'disconnected'
    }
  } as BChannelMessageStatus)
});

export default null as any;
