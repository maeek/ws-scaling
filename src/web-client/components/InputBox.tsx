import React, { KeyboardEvent, useRef } from 'react';
import { useSocket } from '../socket';

export interface InputBoxProps {
  room: string;
  onSelfMessage: (message: any) => void;
}

export const InputBox = ({ room, onSelfMessage }: InputBoxProps) => {
  const { emit } = useSocket();
  const inputRef = useRef(null);

  const inputHandler = (e: KeyboardEvent) => {
    if (e.code === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      const value = inputRef.current.value;

      if (value.trim().length === 0) return;

      emit(
        'message',
        {
          value,
          room
        },
        ({ id, timestamp }: any) => {
          onSelfMessage({
            id,
            value,
            room,
            timestamp,
            self: true
          });

          inputRef.current.value = '';
        },
        true
      );
    }
  };

  return (
    <section className="input-box">
      <textarea ref={inputRef} onKeyDown={inputHandler}></textarea>
    </section>
  );
};
