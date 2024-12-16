import React, { useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase.jsx';
import { collection, query, getDocs, DocumentData } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext.jsx';
import { ChatContext } from '../context/ChatContext.jsx';
import Header from '../components/Header.tsx';
import Messages from '../components/Messages.tsx';
import ChatGenerator from '../components/ChatGenerator.tsx';
import { useLocation } from 'react-router-dom';

import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import MdChatGenerator from '../components/MdChatGenerator.tsx';
import SearchBarResults from '../components/SearchBarResults.tsx';
import { type TCurrentUserDAta } from '../components/Messages.tsx';

export default function Chat() {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState<DocumentData>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  const { currentUser } = useContext<TCurrentUserDAta>(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const location = useLocation();
  const { action } = location.state || {};

  useEffect(() => {
    if (action) {
      const userData = action.split('/');
      const user = {
        uid: userData[0],
        email: userData[1],
      };

      if (currentUser.email !== user.email) {
        dispatch({ type: 'CHANGE_USER', payload: user });
        setChatOpen(!chatOpen);
      }
    }
  }, [action]);

  useEffect(() => {
    const searchResultHandler = async () => {
      const q = query(collection(db, 'users'));

      const querySnapshot = await getDocs(q);

      const allUsers: DocumentData = [];

      await querySnapshot.forEach((doc) => allUsers.push(doc.data()));

      setUser(allUsers);
    };

    searchResultHandler();
  }, []);

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <Header
        scrollHandler={() => undefined}
        scrollToAboutUs={() => undefined}
        scrollToCategories={() => undefined}
        listedItems={() => undefined}
      />
      <div className='flex items-center h-4/6 animate-fade-in-from-bottom md:hidden'>
        <div
          className={`${
            !chatOpen ? 'overflow-y-scroll' : ''
          } h-full  mt-5  w-5/6 m-auto justify-center items-center rounded-lg`}
        >
          {chatOpen && (
            <div className='relative' onClick={() => setChatOpen(!chatOpen)}>
              <MdOutlineArrowBackIosNew className='text-white mt-2 ml-2 text-2xl absolute' />
              <span className='absolute mt-2 ml-7 text-white'>back</span>
            </div>
          )}
          {!chatOpen && (
            <div className=''>
              <p className='text-center text-xl font-bold mt-2 text-white'>
                TopFindChat
              </p>
              <div className='flex justify-center items-center mt-2'>
                <input
                  className='border-black w-4/5 h-10 m-auto rounded-xl p-2'
                  placeholder='Search User ...'
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              </div>
            </div>
          )}
          {!chatOpen && (
            <SearchBarResults
              items={user}
              searchBarValue={userName}
              currUser={currentUser}
              setChatOpen={setChatOpen}
              chatOpen={chatOpen}
              setChatBarValue={setUserName}
              setSearchResultsOpen={setSearchResultsOpen}
            />
          )}
          <div className='h-full flex flex-col text-white text-xl'>
            <ChatGenerator
              currentUser={currentUser}
              chatOpen={chatOpen}
              setChatOpen={setChatOpen}
              setUserName={setUserName}
            />
          </div>
        </div>
      </div>
      <div className='hidden md:grid h-5/6'>
        <div className=' rounded-3xl p-4 h-5/6'>
          <div className=''>
            <p className='w-fit m-auto text-center text-2xl font-bold mt-2 text-white'>
              TopFindChat
            </p>
            <div className='flex justify-center items-center mt-2 w-2/6'>
              <input
                className='border-black w-4/5 h-10 m-auto  rounded-xl p-2'
                placeholder='Search User ...'
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </div>
            <div
              className={`absolute w-2/6 rounded-2xl py-4 ${
                searchResultsOpen && 'bg-black/90'
              } mt-2`}
            >
              <SearchBarResults
                items={user}
                searchBarValue={userName}
                currUser={currentUser}
                setChatOpen={setChatOpen}
                chatOpen={chatOpen}
                setChatBarValue={setUserName}
                setSearchResultsOpen={setSearchResultsOpen}
              />
            </div>
          </div>
          <MdChatGenerator
            currentUser={currentUser}
            chatOpen={chatOpen}
            setChatOpen={setChatOpen}
            setUserName={setUserName}
          />
        </div>
      </div>
    </div>
  );
}
