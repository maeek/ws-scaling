import React, { useEffect, useState } from 'react';
import { useSocket } from '../socket';
import { InputBox } from './InputBox';

export interface MessagesListProps {
  room: string;
}

export const MessagesList = ({ room }: MessagesListProps) => {
  const { socket, connected } = useSocket();
  const [ list, setList ] = useState([]);

  useEffect(() => {
    if (!connected || !room) {
      setList([]);
      return;
    }

    const listener = (res: any) => {
      if (res.data.response.room === room) {
        console.warn(res.data);
        setList((prev) => [ ...prev, {
          id: res.data.msid,
          value: res.data.response.value,
          room: res.data.response.value,
          timestamp: res.data.timestamp,
          self: res.data.toSelf
        } ]);
      }
    };

    socket.on('message', listener);

    return () => {
      socket.off('message', listener);
    };
  }, [ socket, connected, room ]);

  const addMessage = (msg: any) => {
    setList((prev) => [ ...prev, msg ]);
  };

  return (
    <>
      <ul className="messages-list">
        {
          list.map(({ value, self }) => (
            <li
              key={value}
              className="messages-list-item"
              data-self={self}
            >
              {value}
            </li>
          ))
        }
      </ul>
      <InputBox
        room={room}
        onSelfMessage={addMessage}
      />
    </>
  );
};
