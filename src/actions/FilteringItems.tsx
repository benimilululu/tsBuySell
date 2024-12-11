import { DocumentData } from "firebase/firestore";
import React from "react";
import { Link } from "react-router-dom";
import { type TItem } from "../components/SearchBarResults";

//  !Search bar result handler ->
export type ProductObjectType = {
  cat: string;
  Company: string;
  Condition: boolean;
  Description: string;
  ImageUrl: string;
  Name: string;
  Number: string;
  UserID: string;
  id: string;
  uid: string;
  Price: string;
};

type FilteringItemsProps = {
  items: DocumentData | undefined;
  searchBarValue: string;
};

// Filtering Listed Items ->
const FilteringItems: React.FC<FilteringItemsProps> = ({
  items,
  searchBarValue,
}) => {
  const filteredItems = items?.filter((item: TItem) =>
    item.Name.toLowerCase().includes(searchBarValue.toLowerCase())
  );

  if (filteredItems.length) {
    return filteredItems.map((item: ProductObjectType) => (
      <Link key={item.id} to={`/listed-item/${item.id}`}>
        <div
          key={item.id}
          className='border-2 text-sm p-2 md:text-lg grid grid-cols-2  rounded-2xl m-4 text-center h-fit'
        >
          <div className='m-auto'>
            <img className='rounded-xl' src={item.ImageUrl} />
          </div>
          <div className='h-full m-auto w-fit'>
            <p>
              Name: {item.Company} {item.Name}
            </p>
            <p>Size : {item.Number}</p>
            <p>Price : {item.Price}$</p>
            <p>{item.UserID}</p>
          </div>
        </div>
      </Link>
    ));
  } else {
    return (
      <div className='flex justify-center items-center h-full'>
        <p className='font-bold'>No Items Found ...</p>
      </div>
    );
  }
};

export default FilteringItems