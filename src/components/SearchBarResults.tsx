import React from 'react';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

import { doc, DocumentData, getDoc } from 'firebase/firestore';

export type TItem = {
  Cat: string;
  Company: string;
  Condition: boolean;
  Description: string;
  ImageUrl: string;
  Name: string;
  Number: string;
  Price: string;
  UserID: string;
  uid:string
};

type TSearchBarResults = {
  items?: DocumentData;
  searchBarValue: string;
  currUser: {
    email: string;
    uid: string;
  };
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatOpen: boolean;
  setChatBarValue: React.Dispatch<React.SetStateAction<string>>;
  setSearchResultsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchBarResults: React.FC<TSearchBarResults> = ({
  items,
  searchBarValue,
  currUser,
  setChatOpen,
  chatOpen,
  setChatBarValue,
  setSearchResultsOpen,
}) => {
  const { dispatch } = useContext(ChatContext);

  const navigate = useNavigate();

  const handleClick = async (item: TItem) => {
    setChatBarValue('');
    const combinedId =
      currUser.uid > item.uid
        ? currUser.uid + item.uid
        : item.uid + currUser.uid;
    const res = await getDoc(doc(db, 'chats', combinedId));
    dispatch({ type: 'CHANGE_USER', payload: item.uid });
    setChatOpen(!chatOpen);
  };

  // const isSearchResultsOpen = (e) => {
  //   setSearchResultsOpen(e);
  // };

  if (searchBarValue.length > 0) {
    setSearchResultsOpen(true);
    return items
      ?.filter(
        (item: TItem) =>
          item.UserID !== currUser.email &&
          item.UserID.toLowerCase().includes(searchBarValue.toLowerCase())
      )
      .map((item: TItem, i: number) => {
        return (
          <div
            key={item.uid}
            className=' border-2 w-11/12 m-auto mt-3 rounded p-2 text-white overflow-hidden  md:hover:scale-105  md:duration-300 z-0  md:hover:bg-teal-600 cursor-pointer'
            onClick={() => handleClick(item)}
          >
            {item.UserID.split('@')[0]}
          </div>
        );
      });
  } else {
    setSearchResultsOpen(false);
  }
};

export default SearchBarResults;
