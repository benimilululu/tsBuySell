import React from 'react';
import Messages from './Messages.tsx';
import { useState, useEffect, useContext } from 'react';
import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ChatContext } from '../context/ChatContext';
import DisplayingChatUsers from '../actions/DisplayingChatUsers';

export type TChatGenerator = {
  currentUser: {
    uid: string;
  };
  chatOpen: boolean;
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
};

const ChatGenerator: React.FC<TChatGenerator> = ({
  currentUser,
  chatOpen,
  setChatOpen,
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
    setChatOpen(!chatOpen);
  };


  return (
    <div className=' h-full overflow-hidden'>
      {!chatOpen ? (
        <div className='animate-fade-in-from-bottom '>
          <p className='mx-2 mt-4 border-b-2'>Messages</p>
          <DisplayingChatUsers
            chat={chat}
            selectHandler={selectHandler}
            setUserName={setUserName}
          />
        </div>
      ) : (
        <div className='h-full'>
          {' '}
          <Messages />{' '}
        </div>
      )}
    </div>
  );
};

export default ChatGenerator