import React, { useState, useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

import { type TCurrentUserDAta, type TChatContext } from '../components/Messages';

type TMessageData = {
  senderId: string;
  id: string;
  text: string;
};

const MessagesData = () => {
  const [messages, setMessages] = useState<TMessageData[]>([]);
  const { data } = useContext<TChatContext>(ChatContext);
  const { currentUser } = useContext<TCurrentUserDAta>(AuthContext);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }, [messages]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages);
      } else {
        setMessages([]);
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  const DisplayMessagesHandler = () => {
    return messages.length
      ? messages?.map((m: TMessageData) => (
          <div
            ref={ref}
            className={`flow-root${m.senderId === currentUser.uid && ''}`}
            key={m.id}
          >
            <div
              className={` border w-fit p-2 m-2 rounded-full ${
                m.senderId === currentUser.uid && 'bg-teal-600 float-right'
              }`}
            >
              {m.text}
            </div>{' '}
          </div>
        ))
      : '';
  };

  return (
    <div className='h-full my-5 '>
      <DisplayMessagesHandler />
    </div>
  );
};

export default MessagesData;
