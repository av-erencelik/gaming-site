import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdKeyboardArrowDown } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { filtersActions } from "../../state/filters";
import { gamesActions } from "../../state/games";

const Categories = (props) => {
  const activeButton = useSelector((state) => state.filters.categorySelectedButton);
  const genres = useSelector((state) => state.games.genres);
  const dispatch = useDispatch();
  const [categoriesOpened, setCategoriesOpened] = useState(false);
  const handleClick = () => {
    setCategoriesOpened((prev) => !prev);
  };
  const genreChoice = (e) => {
    dispatch(filtersActions.setCategorySelectedButton(e.target.innerHTML));
    const selectedGenre = `&genres=${e.target.value}`;
    window.scrollTo({ top: 0 });
    if (e.target.innerHTML == "All") {
      setCategoriesOpened(false);
      dispatch(gamesActions.setGames([]));
      dispatch(gamesActions.setPage(1));
      dispatch(filtersActions.setGenreEmpty());
    } else {
      setCategoriesOpened(false);
      dispatch(gamesActions.setGames([]));
      dispatch(gamesActions.setPage(1));
      dispatch(filtersActions.setGenre(selectedGenre));
    }
  };
  return (
    <div className=" inline-block w-[50%] gap-3 rounded-b-none bg-gray-800 p-2 transition-all sm:flex sm:w-[100%] sm:flex-col sm:flex-wrap sm:items-center sm:justify-center sm:rounded-l-md sm:p-5">
      <div className="flex cursor-pointer flex-row items-center justify-center " onClick={handleClick}>
        <h2 className="text-sm font-bold text-gray-300 sm:text-base">Categories</h2>
        <motion.div animate={{ rotate: categoriesOpened ? 0 : 180 }}>
          <MdKeyboardArrowDown className="h-[25px] w-[25px] font-bold text-gray-200"></MdKeyboardArrowDown>
        </motion.div>
      </div>
      <AnimatePresence>
        {categoriesOpened && (
          <motion.div
            className="sm:max-h-none flex max-h-[100px] w-[100%] flex-col flex-nowrap gap-1 overflow-scroll sm:max-h-max sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 sm:overflow-hidden"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              className={`rounded-md ${
                activeButton === "" && "bg-gray-900"
              } p-2 font-normal text-gray-200 transition hover:bg-gray-700 hover:text-white sm:font-semibold`}
              id="all"
              onClick={genreChoice}
            >
              All
            </button>
            {genres.map((genre) => {
              return (
                <button
                  className={`rounded-md ${
                    activeButton === genre.name && "bg-gray-900"
                  } p-2 font-normal text-gray-200 transition hover:bg-gray-700 hover:text-white sm:font-semibold`}
                  key={genre.id}
                  value={genre.slug}
                  onClick={genreChoice}
                >
                  {genre.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Categories;
