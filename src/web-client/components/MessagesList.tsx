import React, { useEffect, useState } from 'react';
import { useSocket } from '../socket';

export interface MessagesListProps {
  room: string;
}

export const MessagesList = ({ room }: MessagesListProps) => {
  const { socket, connected } = useSocket();
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!connected || !room) {
      setList([]);
      return;
    }

    const listener = (res: any) => {
      if (res.data.response.room === room) {
        setList((prev) => [...prev, res.data.response.message]);
      }
    }

    socket.on('messages', listener);

    // socket.emit('message', {
    //   value: 'test message',
    //   room
    // }, (data: any) => console.log(data))

    return () => {
      socket.off('messages', listener);
    };
  }, [socket, connected, room]);

  return (
    <ul className="messages-list">
      {
        list.map(({ value }) => (
          <li
            key={value}
            className="messages-list-item"
          >
            {value}
          </li>
        ))
      }
    </ul>
  );
};
