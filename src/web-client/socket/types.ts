
export enum MessageTypesEnum {
  ACK = 'ACK',
  MESSAGE = 'MESSAGE',
  STATUS = 'STATUS',
  RELAY = 'RELAY',
}

export type WsState = 'connected' | 'disconnected' | 'reconnecting';

export interface BChannelMessage {
  type: MessageTypesEnum;
  from: string;
  data: any;
}

export interface BChannelMessageMessage extends BChannelMessage {
  type: MessageTypesEnum.MESSAGE;
  data: {
    name: string;
    response: Message | any;
  }
}

export interface BChannelMessageRelay extends BChannelMessage {
  type: MessageTypesEnum.RELAY;
}

export interface Message {
  id: string;
  value: string;
  timestamp: string;
  user: string;
}

export interface BChannelMessageStatus extends BChannelMessage {
  type: MessageTypesEnum.STATUS;
  data: {
    name: 'status';
    wsState: WsState
  }
}

export interface BChannelMessageAck extends BChannelMessage {
  type: MessageTypesEnum.ACK;
  data: any;
  ackId: string;
}

export type BChannelMessageType = BChannelMessageMessage | BChannelMessageStatus | BChannelMessageAck;
