import React, { useState } from 'react';
import { ChannelsList } from './components/ChannelsList';
import { MessagesList } from './components/MessagesList';
import { SocketProvider } from './socket';

export const App = () => {
  const [ currentRoom, setCurrentRoom ] = useState('');

  return (
    <SocketProvider>
      <ChannelsList onRoomChange={(room: string) => setCurrentRoom(room)} />
      <div className="content-box">
        <MessagesList room={currentRoom} />
      </div>
    </ SocketProvider>
  );
};
