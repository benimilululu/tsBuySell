import React from "react";
import { type TCat } from "../components/Categories";
import { Link } from "react-router-dom";

type CategoriesHandler2Props = {
  cat: TCat[];
  setShowCategories: React.Dispatch<React.SetStateAction<boolean>>;
};

const CategoriesHandler2: React.FC<CategoriesHandler2Props> = ({
  cat,
  setShowCategories,
}) => {
  return cat.map((obj, index) => (
    <Link to={`/categories/${obj.cat}`}>
      <div
        className='border-4 md:border-teal-600 duration-200  md:hover:border-4 md:hover:border-white rounded-2xl h-48  align-text-bottom mb-5 md:hover:scale-105  md:duration-300 md:z-0'
        key={index + 1}
      >
        <img
          className='rounded-xl h-full w-full object-cover'
          onLoad={() => setShowCategories(true)}
          src={obj.img}
        />
        <p className='text-xl mt-1 md:text-2xl md:font-bold'>{obj.cat}</p>
      </div>
    </Link>
  ));
};

export default CategoriesHandler2