import { BROADCAST_CHANNEL } from '../../config';
import { v4 as uuidv4 } from 'uuid';
import SocketWorker from './socket.worker';
import {
  WsState,
  BChannelMessageType,
  MessageTypesEnum,
  BChannelMessageStatus } from './types';

export class SocketService {
  private worker: SharedWorker;

  private id: string;

  private bChannel!: BroadcastChannel;

  private socketObservers: { [name: string]: Function[] } = {};

  private wsState: WsState = 'disconnected';

  constructor() {
    this.worker = new SocketWorker();
    this.id = uuidv4();
    this.bChannel = new BroadcastChannel(BROADCAST_CHANNEL);
    this.bChannel.addEventListener('message', this.onBroadcastMessage);
    this.worker.port.addEventListener('message', this.onWorkerMessage);
    this.worker.port.start();
  }

  private onWorkerMessage = (message: MessageEvent) => {
    if (message.data.type === MessageTypesEnum.STATUS) {
      this.wsState = message.data.data.wsState;
      this.notifyMessageObservers(message as MessageEvent<BChannelMessageStatus>);
    }
    else if (message.data.type === MessageTypesEnum.ACK) {
      this.socketObservers[ message.data.ackId ]?.[ 0 ]?.(message.data.data);
      delete this.socketObservers[ message.data.ackId ];
    }
    else if (message.data.type === MessageTypesEnum.RELAY && message.data.from !== this.id) {
      this.notifyMessageObservers(message);
    }
  };

  private onBroadcastMessage = (message: MessageEvent<BChannelMessageType>) => {
    if (message.data.from === this.id) {
      console.warn('Broadcast received from same origin');
    }

    if (message.data.type === MessageTypesEnum.STATUS) {
      this.wsState = message.data.data.wsState;
      this.notifyMessageObservers(message as MessageEvent<BChannelMessageStatus>);
      return;
    }

    this.notifyMessageObservers(message);
  };

  private notifyMessageObservers = (message: MessageEvent<BChannelMessageType>) => {
    const { name } = message.data.data;

    this.socketObservers[ name ]?.forEach(fn => fn(message.data));
  };

  emit = (name: string, data?: any, ack?: Function, toSelf?: boolean, type?: string) => {
    const ackId = uuidv4();
  
    if (ack) {
      this.socketObservers[ ackId ] = [ ack ];
    }

    this.worker.port.postMessage({
      type: type || MessageTypesEnum.MESSAGE,
      from: this.id,
      name,
      ackId,
      toSelf,
      data: {
        name,
        ...data
      }
    });
  };

  on = (name: string, func: (data: BChannelMessageType) => void) => {
    if (!this.socketObservers[ name ]) {
      this.socketObservers[ name ] = [];
    }

    if (!this.socketObservers[ name ].includes(func)) {
      this.socketObservers[ name ].push(func);
    }
  }

  off = (name: string, func?: Function) => {
    if (!this.socketObservers[ name ] || !this.socketObservers[ name ].includes(func)) {
      return;
    }

    if (!func) {
      this.socketObservers[ name ] = [];
      return;
    }

    this.socketObservers[ name ] = this.socketObservers[ name ].filter(f => f !== func);
  };

  get status() {
    return this.wsState;
  }

  get broadcast() {
    return this.bChannel;
  }
}
