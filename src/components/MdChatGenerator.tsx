import React from 'react';
import Messages from './Messages.tsx';
import { useState, useEffect, useContext } from 'react';
import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ChatContext } from '../context/ChatContext';
import { TChatGenerator } from './ChatGenerator';
import DisplayingChatUsers from '../actions/DisplayingChatUsers';

const MdChatGenerator: React.FC<TChatGenerator> = ({
  currentUser,
  setUserName,
}) => {
  const { dispatch } = useContext(ChatContext);

  const [chat, setChats] = useState<DocumentData | undefined>([]);

  useEffect(() => {
    const getChats = () => {
      const unSub = onSnapshot(doc(db, 'chatUsers', currentUser.uid), (doc) => {
        if (doc) {
          setChats(doc.data());
        }
      });

      return () => {
        unSub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const selectHandler = (u: string) => {
    dispatch({ type: 'CHANGE_USER', payload: u });
    setUserName('');
  };

  return (
    <div className=' grid grid-cols-3 m-auto h-4/6'>
      <div className='animate-fade-in-from-bottom border-4 rounded-xl m-4 overflow-y-scroll p-2 max-h-svh'>
        <p className='mx-2 mt-4 border-b-2 text-white'>Messages</p>
        <DisplayingChatUsers
          chat={chat}
          selectHandler={selectHandler}
          setUserName={setUserName}
        />
      </div>
      <div className='col-span-2'>
        <Messages />{' '}
      </div>
    </div>
  );
};

export default MdChatGenerator;
