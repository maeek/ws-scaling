import React from 'react';
import { ChannelsList } from './ChannelsList';
import { SocketProvider } from './Context';

export const App = () => {

  return (
    <SocketProvider>
      <ChannelsList />
      <ul className="messages-list"></ul>
      <section className="input-box"></section>
    </ SocketProvider>
  );
};