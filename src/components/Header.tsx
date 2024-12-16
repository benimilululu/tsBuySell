import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase';

import toast, { Toaster } from 'react-hot-toast';
import { FaRocketchat } from 'react-icons/fa';
import { Fade } from 'react-reveal';
import { NightModeContext } from '../context/NightModeContext';
import Night_LightModeButton from './Night-lightModeButton';

import { MenuButton } from './HamburgerMenu';
import { HamburgerMenu } from './HamburgerMenu';
import FilteringItems from '../actions/FilteringItems';
import { DocumentData } from 'firebase/firestore';
import SearchBar from './SearchBar';

const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-white transition ease transform duration-300`;

const isHomePage = location.pathname === '/';

type TFunction = () => void | undefined;

type HeaderProps = {
  listedItems?: DocumentData | undefined;
  scrollHandler: TFunction;
  currentUser?: {
    email: string;
    uid: string;
  };
  scrollToCategories: TFunction;
  scrollToAboutUs: TFunction;
};

const Header: React.FC<HeaderProps> = ({
  listedItems,
  scrollHandler,
  currentUser,
  scrollToCategories,
  scrollToAboutUs,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [searchBarValue, setSearchBarValue] = useState('');
  const [searchResultIsOpen, setSearchResultsIsOpen] = useState(false);

  const searchResultsRef = useRef<HTMLDivElement>(null);

  const { nightMode } = useContext(NightModeContext);
  const { setNightMode } = useContext(NightModeContext);

  useEffect(() => {
    if (nightMode) {
      document.body.style.backgroundImage =
        'linear-gradient(to bottom, #119191,#053535)';
    } else {
      document.body.style.backgroundImage =
        'linear-gradient(to bottom, #111827, #064242)';
    }

    // Reset to default background
    return () => {
      document.body.style.background = '';
    };
  }, [nightMode]);

  useEffect(() => {
    // !Hiding Search Result div if we click outside that div ->
    function handleClickOutside(e) {
      if (searchResultsRef.current && !searchResultsRef.current.contains(e)) {
        setSearchBarValue('');
        setSearchResultsIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const storingInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBarValue(e.target.value);

    // Showing the results if we have value in input ->
    if (e.target.value.length) {
      setSearchResultsIsOpen(true);
    } else {
      setSearchResultsIsOpen(false);
    }
  };

  return (
    <div className=''>
      <Toaster />
      <div className='text-3xl p-4 md:ml-3 text-white grid grid-cols-2 md:text-4xl'>
        {/* <Fade top duration={1500}> */}
          <p className='w-fit font-extrabold'>
            <Link
              to='/'
              onClick={() => {
                if (isHomePage) {
                  toast.success('This is Home Page... ENJOY!');
                }
              }}
              className=''
            >
              TopFind
            </Link>
          </p>
        {/* </Fade> */}

        <div className='flex justify-end'>
          {/* <Fade top duration={1500}> */}
            <div
              className='m-1  rounded-full'
              onClick={() => setNightMode(!nightMode)}
            >
              <Night_LightModeButton
                nightMode={nightMode}
                setNightMode={setNightMode}
              />
            </div>
            <MenuButton
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              genericHamburgerLine={genericHamburgerLine}
              scrollHandler={scrollHandler}
              isHomePage={isHomePage}
            />
          {/* </Fade> */}

          {isOpen && (
            <HamburgerMenu
              e={auth?.currentUser?.email}
              setIsOpen={setIsOpen}
              scrollToCategories={scrollToCategories}
              scrollHandler={scrollHandler}
              scrollToAboutUs={scrollToAboutUs}
              isHomePage={isHomePage}
            />
          )}
        </div>
        <SearchBar
          className={`search-bar ${location.pathname === '/' ? 'visible' : ''}`}
          searchBarValue={searchBarValue}
          searchResultIsOpen={searchResultIsOpen}
          storingInputValue={storingInputValue}
          searchResultsRef={searchResultsRef}
          listedItems={listedItems}
        />
        {isHomePage && currentUser && (
          // <Fade bottom duration={1500}>
            <div
              className={`fixed bottom-2 right-2 size-5 border-4 h-28 w-28 object-cover backdrop-blur-xl rounded-full md:z-20`}
            >
              <Link to='/chat'>
                <FaRocketchat className='h-16 w-16 m-auto mt-3 drop-shadow-2xl' />
                <p className='m-auto text-center text-xl font-bold'>Chat</p>
              </Link>
            </div>
          // </Fade>
        )}
      </div>
    </div>
  );
};

export default Header;
