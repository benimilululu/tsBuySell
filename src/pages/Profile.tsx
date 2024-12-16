import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header.tsx';
import { AuthContext } from '../context/AuthContext.jsx';

import { auth } from '../config/firebase.jsx';
import { db } from '../config/firebase.jsx';
import { getDocs, collection } from 'firebase/firestore';
import { Fade } from 'react-reveal';

import { Link } from 'react-router-dom';

type User = string | null | undefined

type Item = {
  UserID?: string;
  id?: string;
  ImageUrl?: string;
  Company?: string;
  Name?: string;
  Number?: string;
  Price?: string;
};

export default function Profile() {
  // const userEmail = auth?.currentUser?.email;

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthContextProvider');
  }

  const { currentUser } = authContext;

  // console.log(userEmail)

  return (
    <div className='h-screen w-screen overflow-y-scroll'>
      <Header scrollHandler={function (): void | undefined {
        throw new Error('Function not implemented.');
      } } scrollToCategories={function (): void | undefined {
        throw new Error('Function not implemented.');
      } } scrollToAboutUs={function (): void | undefined {
        throw new Error('Function not implemented.');
      } } />
      <div className='text-center m-5 border-4 rounded-2xl p-5 text-2xl text-white animate-fade-in-from-bottom md:w-3/6 md:m-auto'>
        <p>My Profile</p>
        <p className='mt-4'>Email: {currentUser?.email}</p>
        <div className='mt-5'></div>
      </div>
      <div className='text-center m-5 border-4 rounded-2xl p-5 text-2xl text-white  animate-fade-in-from-bottom h-fit'>
        <p>My Listing's</p>
        <div className='md:grid md:grid-cols-3 md:gap-5'>
          <GetFilteredItems user={currentUser?.email} />
        </div>
      </div>
    </div>
  );
}

const GetFilteredItems = ({ user }: { user: User }) => {
  const [listedItems, setListedItems] = useState<Item[]>([]); 

  const listedItemsCollectionRef = collection(db, 'ListedItems');

  useEffect(() => {
    const getListedItems = async () => {
      try {
        const items = await getDocs(listedItemsCollectionRef);
        const filteredItems = items.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Item[];
        setListedItems(filteredItems);
      } catch (err) {
        console.error(err);
      }
    };
    getListedItems();
  }, []);

  const filteredItems = listedItems.filter((item: Item) => {
    return item.UserID === user;
  });

  if (filteredItems.length) {
    return (
      <>
        {filteredItems.map((item: Item) => (
          <Link to={`/listed-item/${item.id}`} key={item.id}>
            <div className='border-2 p-4 rounded-2xl mx-5 text-center text-xl my-4 md:h-fit md:p-3 md:flex md:justify-between md:flex-col md:hover:scale-105 md:duration-300 md:mt-10'>
              <img className='rounded-xl' src={item.ImageUrl} alt='Item' />
              <p className='mt-5'>
                Name: {item.Company} {item.Name}
              </p>
              <p>Size : {item.Number}</p>
              <p>Price : {item.Price}$</p>
              <p>Owner : {item.UserID}</p>
            </div>
          </Link>
        ))}
      </>
    );
  } else {
    return (
      <div>
        <p className='mt-20 text-white font-bold text-2xl'>
          You have no listing's yet . . .
          <Link to={'/list-item'}>
            <button className='mt-4 border-2 rounded-xl p-2'>
              Start listing Item's
            </button>
          </Link>
        </p>
      </div>
    );
  }
};
