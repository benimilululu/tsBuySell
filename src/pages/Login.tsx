import React, { useContext, useState, useRef } from 'react';
import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import Header from '../components/Header';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { setDoc, doc } from 'firebase/firestore';
import { strict } from 'assert';


export default function Login() {
  
  const [loginPage, setLoginPage] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const { currentUser } = useContext(AuthContext) || {};
  const nav = useNavigate();

  const register = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      await setDoc(doc(db, 'users', res.user.uid), {
        email,
        uid: res.user.uid,
      });
      await setDoc(doc(db, 'chatUsers', res.user.uid), {});
      nav('/');
    } catch (err) {
      toast.error('Cannot create account...');
      console.error(err);
    }
  };

  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully Logged In!');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        nav('/');
      }, 1200);
    } catch (err) {
      toast.error('Something is wrong with your email or password.');
      console.error(err);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully Logged Out!');
      setTimeout(() => {
        nav('/');
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };


  const showRegisterPage = () => (
    <div className='w-screen md:w-full text-center text-2xl text-white mt-20'>
      <div className='grid text-2xl border-4 rounded-lg mx-10 p-4 mt-10 justify-items-center text-white'>
        <p className='my-4'>Register</p>
        <input
          type='text'
          placeholder='Email...'
          className='my-2 rounded-lg text-black text-xl p-1'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type='password'
          placeholder='Password...'
          className='my-2 rounded-lg text-black text-xl p-1'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button
          onClick={register}
          className='border-2 rounded-lg px-4 p-1 mt-2 md:hover:scale-105 md:duration-300 md:hover:bg-teal-600'
        >
          Register
        </button>
      </div>
    </div>
  );

  const showLogInPage = () => (
    <div className='w-screen md:w-full text-center text-2xl text-white mt-20'>
      <div className='grid justify-items-center text-2xl border-4 rounded-lg mx-10 p-4 mt-10 text-white'>
        <p className='my-4'>Login</p>
        <input
          type='text'
          placeholder='Email...'
          className='my-2 rounded-lg text-xl text-black p-1'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type='password'
          placeholder='Password...'
          className='my-2 rounded-lg text-xl text-black p-1'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {auth?.currentUser?.email ? (
          <button
            className='border p-2 rounded-2xl my-2 text-black bg-sky-200'
            type='button'
            onClick={logOut}
          >
            LogOut
          </button>
        ) : (
          <button
            className='border-2 rounded-lg px-4 p-1 mt-2 md:hover:scale-105 md:duration-300 md:hover:bg-teal-600'
            type='button'
            onClick={logIn}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );

  return (
      <div className='h-screen w-screen'>
        <Toaster />
        <Header
          scrollHandler={() => {}}
          scrollToCategories={() => {}}
          scrollToAboutUs={() => {}}
        />
        {!currentUser && (
          <div>
            <div className='mt-10 md:w-3/6 md:m-auto grid grid-cols-2 text-center gap-2 text-xl items-center font-bold text-white'>
              <p
                className={`p-1 duration-300 mx-3 ${
                  loginPage ? 'bg-sky-200 rounded-full text-black' : ''
                }`}
                onClick={() => setLoginPage(true)}
              >
                Login
              </p>
              <p
                className={`p-1 duration-300 mx-3 ${
                  !loginPage ? 'bg-sky-200 rounded-full text-black' : ''
                }`}
                onClick={() => setLoginPage(false)}
              >
                Register
              </p>
            </div>
            <div className='md:w-3/6 md:m-auto'>
              {loginPage ? showLogInPage() : showRegisterPage()}
            </div>
          </div>
        )}
      </div>
  );
}
