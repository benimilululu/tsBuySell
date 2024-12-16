import React from 'react';
import FilteringItems from '../actions/FilteringItems';
import { DocumentData } from 'firebase/firestore';

type TSearchBar = {
  className?: string;
  searchBarValue: string;
  searchResultIsOpen: boolean;
  storingInputValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchResultsRef: React.RefObject<HTMLDivElement>;
  listedItems: DocumentData | undefined;
};
const SearchBar: React.FC<TSearchBar> =({
  searchBarValue,
  searchResultIsOpen,
  storingInputValue,
  searchResultsRef,
  listedItems,
}) => {
  return (
    <div>
      {location.pathname === '/' && (
        <div className='col-span-2 md:col-span-1 flex mt-4'>
          <p className='text-2xl'>Search</p>
          <input
            type='text'
            value={searchBarValue}
            className='px-2 ml-4 text-black rounded-lg w-full md:w-4/6'
            onChange={(e) => {
              storingInputValue(e);
            }}
          />
        </div>
      )}

      <div></div>
      {searchResultIsOpen && (
        <div
          className='absolute  mt-2 inset-y-28 left-28 border-2 w-4/6 h-96 rounded-3xl backdrop-blur-xl overflow-auto md:w-2/6 md:h-4/6 overflow-x-hidden'
          ref={searchResultsRef}
        >
          <FilteringItems items={listedItems} searchBarValue={searchBarValue} />
        </div>
      )}
    </div>
  );
}

export default SearchBar