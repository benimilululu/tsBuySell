import React, { useState, useEffect, useContext, useRef } from 'react';
import Header from './components/Header.tsx';
import Section1 from './components/Section1.tsx';
import Categories from './components/Categories.tsx';
import AboutUs from './components/AboutUs.tsx';
import { db, auth } from './config/firebase.jsx';
import { getDocs, collection } from 'firebase/firestore';
import { AuthContext } from './context/AuthContext.jsx';
import toast, { Toaster } from 'react-hot-toast';

import { InfinitySpin } from 'react-loader-spinner';

import { useLocation } from 'react-router-dom';

import { DocumentData } from 'firebase/firestore';

import { type TCurrentUserDAta } from './components/Messages.tsx';
import SearchBar from './components/SearchBar.tsx';

function App() {
  const [listedItems, setListedItems] = useState<DocumentData | undefined>([]);
  const [overflowScroll, setOverflowScroll] = useState(true);

  const [showLoader, setShowLoader] = useState(true);

  const listedItemsCollectionRef = collection(db, 'ListedItems');

  const { currentUser } = useContext<TCurrentUserDAta>(AuthContext);

  const location = useLocation();
  const { action } = location.state || {};
  // console.log(action.state?.action);

  const categoriesRef = useRef<HTMLDivElement>(null);

  const aboutMeRef = useRef<HTMLDivElement>(null);

  const scrollToCategories = () => {
    categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAboutUs = () => {
    aboutMeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Accessing the action property from location.state
    if (action) {
      if (action === 'categories') {
        console.log('Action received:', action);
        setTimeout(() => {
          scrollToCategories();
        }, 1000);
      }
      if (action === 'about') {
        setTimeout(() => {
          scrollToAboutUs();
        }, 1000);
      }
    }
  }, [action]);

  useEffect(() => {
    const getListedItems = async () => {
      try {
        const items = await getDocs(listedItemsCollectionRef);
        // console.log(items.docs.data())
        const filteredItems = items.docs.map(
          (doc) =>
            // if (doc) {
            setListedItems((prevItems) => {
              if (Array.isArray(prevItems)) {
                return [...prevItems, doc.data()];
              } else {
                // Handle the case where prevItems is not an array
                console.error('State is not an array:', prevItems);
                return prevItems; // This will prevent state corruption
              }
            })
        );
      } catch (err) {
        console.error(err);
      }
    };
    getListedItems();
  }, []);

  const scrollHandler = () => {
    setOverflowScroll(!overflowScroll);
  };

  const loaderHandler = () => {
    setShowLoader(false);
  };

  return (
    <div
      className={`h-screen w-screen overflow-x-scroll${
        overflowScroll ? 'overflow-y-scroll' : 'overflow-hidden'
      }`}
    >
      <Toaster />
      {showLoader ? (
        <div className='h-screen w-screen'>
          <Section1 loadedSection1Img={loaderHandler} />
          <div className='h-5/6 flex items-center justify-center'>
            <InfinitySpin
            // visible={true}
            // size={100}
            // color='white'
            // ariaLabel='infinity-spin-loading'
            />
          </div>
        </div>
      ) : (
        <>
          <Toaster />

          <Header
            listedItems={listedItems}
            scrollHandler={scrollHandler}
            currentUser={currentUser}
            scrollToCategories={scrollToCategories}
            scrollToAboutUs={scrollToAboutUs}
          />

          <Section1 loadedSection1Img={loaderHandler} />

          <div ref={categoriesRef}>
            <Categories />
          </div>

          <div ref={aboutMeRef}>
            <AboutUs />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
