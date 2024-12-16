import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { getDocs, collection } from 'firebase/firestore';

import CategoriesHandler2 from '../actions/CategoriesHandler';

import { InfinitySpin } from 'react-loader-spinner';

export type TCat = {
  cat: string;
  img: string;
};

export default function Categories() {
  const [cat1, setCat1] = useState<TCat[]>([]);
  const [cat2, setCat2] = useState<TCat[]>([]);

  const [showCategories, setShowCategories] = useState(false);

  const categoriesCollectionRef = collection(db, 'Catrgories');

  useEffect(() => {
    const getListedItems = async () => {
      try {
        const items = await getDocs(categoriesCollectionRef);
        const filteredItems = items.docs.map((doc) => ({
          allData: doc.data(),
          id: doc.id,
        }));

        const shoesCategories: object = filteredItems[0].allData.cat.shoes;
        const insideCat = Object.entries(shoesCategories).map(
          ([key, value], index) => {
            const newObj = {
              cat: key,
              img: value.img,
            };
            return newObj;
          }
        );
        setCat1(insideCat);

        const clothesCategories: object = filteredItems[0].allData.cat.clothes;
        const insideClothesCat = Object.entries(clothesCategories).map(
          ([key, value], index) => {
            const newObj: { cat: string; img: string } = {
              cat: key,
              img: value.img,
            };
            return newObj;
          }
        );
        setCat2(insideClothesCat);
      } catch (err) {
        console.error(err);
      }
    };
    getListedItems();
  }, []);

  return (
    <section className=' text-black text-center border-y-4 pt-1 pb-5 animate-fade-in-from-bottom'>
      <p className='text-3xl font-bold text-white text-center md:text-4xl'>
        Categories
      </p>
      {showCategories ? (
        <div className='animate-fade-in-from-bottom md:m-2'>
          <p className='mt-2 text-2xl text-white font-bold text-start ml-4 md:text-4xl'>
            Shoes
          </p>
          <div className='grid grid-cols-2 mt-2 md:grid-cols-4 md:gap-8 gap-4 text-white mx-4 align-text-bottom'>
            <CategoriesHandler2
              cat={cat1}
              setShowCategories={setShowCategories}
            />
          </div>
          <div>
            <p className='md:text-4xl mt-10 text-2xl text-white font-bold text-start ml-4'>
              Clothes
            </p>
            <div className='mt-2 grid grid-cols-2 md:grid-cols-4 md:gap-8 gap-4 text-white mx-4 align-text-bottom'>
              <CategoriesHandler2
                cat={cat2}
                setShowCategories={setShowCategories}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className='w-screen h-5/6 flex items-center justify-center pb-44'>
            <InfinitySpin
              // visible={true}
              // size={100}
              // color='white'
              // ariaLabel='infinity-spin-loading'
            />
          </div>
          <div className='grid grid-cols-2 gap-4 text-white mx-4 align-text-bottom'>
            <CategoriesHandler2
              cat={cat1}
              setShowCategories={setShowCategories}
            />
          </div>
        </>
      )}
    </section>
  );
}
