import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../config/firebase';
import { getDocs, collection, doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';


import Header from '../components/Header';

export default function Item() {
  const params = useParams();
  const [listedItems, setListedItems] = useState<{ id: string; }[]>([]);
  const { currentUser } = useContext(AuthContext);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const listedItemsCollectionRef = collection(db, 'ListedItems');

  useEffect(() => {
    const getListedItems = async () => {
      try {
        const items = await getDocs(listedItemsCollectionRef);
        const filteredItems = items.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setListedItems(filteredItems);
        // console.log(filteredItems);
      } catch (err) {
        console.error(err);
      }
    };
    getListedItems();
  }, []);

  const deleteListingHandler = (e) => {
    const selectedItem = doc(db, 'ListedItems', e);

    deleteDoc(selectedItem);
  };

  return (
    <div className=' w-screen text-center h-screen'>
      <Header
        scrollHandler={() => undefined}
        scrollToAboutUs={() => undefined}
        scrollToCategories={() => undefined}
        listedItems={() => undefined}
      />
      <div className='md:w-4/6 md:m-auto '>
        <FilteringItems
          items={listedItems}
          name={params.itemId}
          currentUser={currentUser}
          deleteListingHandler={deleteListingHandler}
          // handleClose={handleClose}
          // handleOpen={handleOpen}
        />
      </div>
    </div>
  );
}

const FilteringItems = ({ items, name, currentUser, deleteListingHandler }) => {
  const navigate = useNavigate();

  const handleButtonClick = (itemID, UserID) => {
    navigate('/chat', { state: { action: `${itemID + '/' + UserID}` } });
  };

  return items
    ?.filter((item) => item.id.includes(name))
    .map((item) => (
      <div
        key={item.id}
        className='border-4 p-4 rounded-2xl
           m-5 text-center text-xl text-white md:grid md:grid-cols-2 items-center'
      >
        <img className='rounded-xl  md:m-auto' src={item.ImageUrl} />
        <div className='md:grid md:gap-4'>
          <p className='mt-5'>
            Name: {item.Company} {item.Name}
          </p>
          <p>Size : {item.Number}</p>
          <p>Price : {item.Price}$</p>
          <p>Owner : {item.UserID.split('@')[0]}</p>

          {currentUser && currentUser.email !== item.UserID && (
            <button
              className='border-4 p-1 rounded-xl m-2 md:w-fit md:m-auto md:p-2 md:hover:scale-105  md:duration-300 md:hover:bg-teal-600'
              onClick={() => handleButtonClick(item.uid, item.UserID)}
            >
              Send Message
            </button>
          )}
          {currentUser.email === item.UserID && (
            <button
              className='border-4 p-1 rounded-xl m-2 md:w-fit md:m-auto md:p-2 md:hover:scale-105  md:duration-300 md:hover:bg-teal-600'
              onClick={() => {
                deleteListingHandler(item.id);
                navigate('/');
                toast.success('Successfully Deleted Listing!');
              }}
            >
              Delete Listing
            </button>
          )}
          {!currentUser && (
            <Link to='/login'>
              <button
                className='border-4 p-2 rounded-xl m-2 md:w-fit md:m-auto md:p-2 md:hover:scale-105  md:duration-300 md:hover:bg-teal-600'
                // onClick={}
              >
                Sign in to send Message
              </button>
            </Link>
          )}
        </div>
      </div>
    ));
};
