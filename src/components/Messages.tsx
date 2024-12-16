import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import {
  doc,
  arrayUnion,
  updateDoc,
  Timestamp,
  serverTimestamp,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { v4 as uuid } from 'uuid';
import MessagesData from '../actions/DisplayingMessages';

export type TData = {
  user: {
    email: string;
    uid: string;
  };
  chatId: string;
};

export type TCurrentUserDAta = {
  currentUser: {
    email: string;
    uid: string;
  };
};

export type TChatContext = {
  data: {
    user: {
      email: string;
      uid: string;
    };
    chatId: string;
  };
};

export default function Messages() {
  const [text, setText] = useState('');
  const { data } = useContext<TChatContext>(ChatContext);
  const { currentUser } = useContext<TCurrentUserDAta>(AuthContext);

  //   Sending message to the backend ->
  const sendHandler = async (data: TData) => {
    setText('');
    if (text.length) {
      // Generating chat if there is no chat
      const combinedId =
        currentUser.uid > data.user.uid
          ? currentUser.uid + data.user.uid
          : data.user.uid + currentUser.uid;

      const res = await getDoc(doc(db, 'chats', combinedId));
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, 'chats', combinedId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });

        //create user chats
        await updateDoc(doc(db, 'chatUsers', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: data.user.uid,
            email: data.user.email,
          },
          [combinedId + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'chatUsers', currentUser.uid), {
          [data.chatId + '.lastMessage']: {
            text,
          },
          [data.chatId + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'chatUsers', data.user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            email: currentUser.email,
          },
          [combinedId + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'chatUsers', data.user.uid), {
          [data.chatId + '.lastMessage']: {
            text,
          },
          [data.chatId + '.date']: serverTimestamp(),
        });

        setText('');
      }

      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
      await updateDoc(doc(db, 'chatUsers', currentUser.uid), {
        [data.chatId + '.lastMessage']: {
          text,
        },
        [data.chatId + '.date']: serverTimestamp(),
      });

      await updateDoc(doc(db, 'chatUsers', data.user.uid), {
        [data.chatId + '.lastMessage']: {
          text,
        },
        [data.chatId + '.date']: serverTimestamp(),
      });

      setText('');
    }
  };

  return (
    <div className=' mx-3 h-full overflow-hidden'>
      {data.user?.email && (
        <div className='h-4/6 md:h-5/6'>
          <p className='text-center text-white inset-x-1 mt-4 text-2xl'>
            to: {data.user?.email.split('@')[0].toUpperCase()}
          </p>
          <div className='h-full text-white md:h-96 relative overflow-y-scroll mt-2'>
            {' '}
            <MessagesData />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendHandler(data);
            }}
          >
            <div className=' bottom-0 grid grid-cols-4 mt-3 border-t'>
              <input
                placeholder='Type Message'
                className=' text-black p-1 rounded-lg col-span-3 m-3'
                onChange={(e) => setText(e.target.value)}
                value={text}
                maxLength={30}
              />
              <button
                className='bg-sky-500/75 border m-3 p-1 rounded-xl w-5/6'
                type='submit'
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
