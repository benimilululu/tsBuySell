import React from 'react';
import { DocumentData } from 'firebase/firestore';

type TDisplayingChatUsers = {
  chat: DocumentData | undefined;
  selectHandler: (e: string) => void;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
};

const DisplayingChatUsers: React.FC<TDisplayingChatUsers> = ({
  chat,
  selectHandler,
  setUserName
})  => {
  return (
    <div>
      {' '}
      {chat &&
        Object.entries(chat)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <div
              key={chat[0]}
              className='border-2 w-11/12 m-auto mt-3 rounded p-2 text-white md:hover:scale-105  md:duration-300 z-0  md:hover:bg-teal-600 cursor-pointer'
              onClick={() => {
                selectHandler(chat[1].userInfo);
                setUserName('');
              }}
            >
              <p className='text-2xl font-bold'>
                {chat[1]?.userInfo.email.split('@')[0].toUpperCase()}
              </p>
              <p
                className='text-lg'
                onClick={() =>
                  console.log(
                    new Date(
                      chat[1].date.seconds * 1000 +
                        chat[1].date.nanoseconds / 1000000
                    )
                  )
                }
              >
                Messages: {chat[1].lastMessage?.text}
                {/* <ConvertToRealDate
                      a={chat[1].date.seconds}
                      b={chat[1].date.nanoseconds}
                    /> */}
              </p>
            </div>
          ))}
    </div>
  );
};

export default DisplayingChatUsers;
