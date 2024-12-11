import React from "react";

import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { auth } from '../config/firebase';

import { Link } from 'react-router-dom';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

// !Menu button function ->
type MenuButtonProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  genericHamburgerLine: string;
  scrollHandler: Function;
  isHomePage: boolean;
};
const MenuButton: React.FC<MenuButtonProps> = ({
  isOpen,
  setIsOpen,
  genericHamburgerLine,
  scrollHandler,
  isHomePage,
}) => {
  return (
    <button
      className='flex flex-col h-10 w-10 border-2  rounded justify-center items-center group'
      onClick={() => {
        setIsOpen(!isOpen);
        if (isHomePage) {
          return scrollHandler();
        }
      }}
    >
      <div
        className={`${genericHamburgerLine} ${
          isOpen
            ? 'rotate-45 translate-y-3 opacity-50 group-hover:opacity-100'
            : 'opacity-50 group-hover:opacity-100'
        }`}
      />
      <div
        className={`${genericHamburgerLine} ${
          isOpen ? 'opacity-0' : 'opacity-50 group-hover:opacity-100'
        }`}
      />
      <div
        className={`${genericHamburgerLine} ${
          isOpen
            ? '-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100'
            : 'opacity-50 group-hover:opacity-100'
        }`}
      />
    </button>
  );
};

// !Hamburger menu function ->
type HamburgerMenuProps = {
  e: string | null | undefined;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToCategories: Function;
  scrollHandler: Function;
  scrollToAboutUs: Function;
  isHomePage: boolean;
};

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  e,
  setIsOpen,
  scrollToCategories,
  scrollHandler,
  scrollToAboutUs,
  isHomePage,
}) => {
  const nav = useNavigate();

  const logOut = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully Logged Out!');
      nav('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleButtonClick = (e: string): void => {
    if (isHomePage) {
      if (e === 'categories') {
        setIsOpen(false);
        scrollHandler();
        scrollToCategories();
      } else if (e === 'about') {
        setIsOpen(false);
        scrollHandler();
        scrollToAboutUs();
      }
    } else {
      nav('/', { state: { action: 'someAction' } });
    }
  };

  return (
    <div
      className={`absolute md:duration-300 animate-slide-down  mt-12 grid text-center w-11/12 md:w-3/12  mx-auto border-4 rounded-xl  drop-shadow-2xl backdrop-blur-3xl md:text-2xl z-20`}
      // ref={hamburgerMenuRef}
    >
      {location.pathname != '/' && (
        <Link
          className=' border rounded-lg m-4 p-2 md:duration-300 md:hover:bg-teal-600'
          to='/'
        >
          Home Page
        </Link>
      )}
      {e ? (
        <>
          <Link
            className=' border rounded-lg m-4 p-2 md:duration-300 md:hover:bg-teal-600'
            to='/profile'
          >
            My Profile
          </Link>
          <Link
            className=' border rounded-lg m-4 p-2 md:duration-300 md:hover:bg-teal-600'
            to='/chat'
          >
            Chat
          </Link>
        </>
      ) : (
        <Link
          className='border rounded-lg m-4 p-2 md:duration-300 md:hover:bg-teal-600'
          to='/login'
        >
          Login
        </Link>
      )}
      <Link
        className='border rounded-lg m-4 p-2 md:hover:bg-teal-600 md:duration-300'
        to={'/list-item'}
      >
        List Item
      </Link>
      <Link
        className='border rounded-lg m-4 p-2 md:hover:bg-teal-600 md:duration-300'
        to='/how-it-works'
      >
        How it Works ?
      </Link>
      <Link
        className='border rounded-lg m-4 p-2 md:hover:bg-teal-600 md:duration-300'
        to={'/'}
        state={{ action: 'categories' }}
        onClick={() => handleButtonClick('categories')}
      >
        <p>Categories</p>
      </Link>
      <Link
        className='border rounded-lg m-4 p-2 md:hover:bg-teal-600 md:duration-300'
        to={'/'}
        state={{ action: 'about' }}
        onClick={() => handleButtonClick('about')}
      >
        <p> About Us</p>
      </Link>
      {e && (
        <button
          className='border rounded-lg m-4 p-2  md:hover:bg-teal-600 md:duration-300'
          onClick={() => {
            setIsOpen(false);
            logOut();
          }}
        >
          Log Out
        </button>
      )}
    </div>
  );
};

export {
    HamburgerMenu,
    MenuButton
}