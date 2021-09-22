import React, { useEffect, useState } from 'react';
import { useSocket } from '../socket';

export interface ChannelsListProps {
  onRoomChange: (room: string) => void;
}

export const ChannelsList = ({ onRoomChange }: ChannelsListProps) => {
  const { socket, connected, emit } = useSocket();
  const [ list, setList ] = useState([]);
  const [ active, setActive ] = useState('');
  const [ shouldFetch, setShouldFetch ] = useState(true);

  useEffect(() => {
    if (!connected) {
      setList([]);
      setShouldFetch(true);
      return;
    }

    const listener = (res: any) => {
      setList(res.data.response);
    };

    socket.on('channelsList', listener);

    return () => {
      socket.off('channelsList', listener);
    };
  }, [ socket, connected ]);

  useEffect(() => {
    if (!active && list.length > 0 && onRoomChange) {
      setActive(list[ 0 ]);
      onRoomChange(list[ 0 ]);
    }
  }, [ active, list, onRoomChange ]);

  useEffect(() => {
    if (shouldFetch && connected) {
      setShouldFetch(false);
      emit('requestChannels');
    }
  }, [ emit, shouldFetch, connected ]);

  const onChannelClick = (name: string) => () => {
    setActive(name);
    emit('requestChannelJoin', { name });
    onRoomChange(name);
  };

  return (
    <ul className="channels-list">
      {
        list.map((name) => (
          <li
            key={name}
            onClick={onChannelClick(name)}
            className={`channels-list-item ${active === name ? 'channels-list-item--active' : ''}`}
          >
            {name}
          </li>
        ))
      }
    </ul>
  );
};
