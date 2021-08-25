import React, { useEffect, useState } from 'react';
import { useSocket } from './Context';

export const ChannelsList = () => {
  const { socket } = useSocket();
  const [list, setList] = useState([]);
  const [active, setActive] = useState('');
  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    console.log(socket);
    if (!socket) {
      setList([]);
      setShouldFetch(true);
      return;
    }

    const listener = (res: any) => {
      console.log(res);
      setList(res.data);
    }

    socket.on('channelsList', listener);
  }, [socket]);

  // useEffect(() => {
  //   if (!active && list.length > 0) {
  //     setActive(list[0]);
  //   }
  // }, [active, list]);

  // useEffect(() => {
  //   if (shouldFetch && socket) {
  //     socket.emit('requestChannels');
  //     setShouldFetch(false);
  //   }
  // }, [socket, shouldFetch]);

  const onChannelClick = (name: string) => () => {
    if (!socket) return;

    socket.emit('requestChannelJoin', { name  })
  };

  return (
    <ul className="channels-list" id="channels">
      {
        list.map((name) => (
          <li key={name} onClick={onChannelClick(name)} className="channels-list-item">{name}</li>
        ))
      }
    </ul>
  );
};
