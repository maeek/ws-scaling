import io from 'socket.io-client';
import { BROADCAST_CHANNEL, SOCKET_IO_ADDR, SOCKET_IO_PATH } from '../../config';
import { BChannelMessageMessage, BChannelMessageStatus, MessageTypesEnum } from './types';

const ctx: SharedWorker = self as any;

const socket = io(SOCKET_IO_ADDR, {
  path: SOCKET_IO_PATH,
  transports: [ 'websocket' ]
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
  } as BChannelMessageStatus);
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
  } as BChannelMessageStatus);
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
  } as BChannelMessageMessage);
});

const ports: MessagePort[] = [];

ctx.addEventListener('connect', (event: any) => {
  const port = event.ports[ 0 ];

  ports.push(port);

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
      (ack: any) => {
        port.postMessage({
          type: MessageTypesEnum.ACK,
          data: ack,
          ackId: message.data.ackId
        });

        if (message.data.toSelf) {
          ports.forEach(p => {
            p.postMessage({
              ...message.data,
              type: MessageTypesEnum.RELAY,
              data: {
                ...message.data.data,
                response: {
                  ...message.data.data
                },
                toSelf: true,
                ...ack
              }
            });
          });
        }
      }
    );
  };

  port.postMessage({
    type: MessageTypesEnum.STATUS,
    from: 'worker',
    data: {
      name: 'status',
      wsState: socket.connected ? 'connected' : 'disconnected'
    }
  } as BChannelMessageStatus);
});

export default null as any;
