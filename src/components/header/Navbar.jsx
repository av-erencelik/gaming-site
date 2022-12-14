import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { VscThreeBars } from "react-icons/vsc";
import { GiGamepad } from "react-icons/gi";
import SearchCard from "./SearchCard";
import { useContext } from "react";
import { AuthContext } from "../../state/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchInput = useRef(null);
  const controls = useAnimation();
  const [searchParameter, setSearchParameter] = useState("");
  const [returnedGames, setReturnedGames] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const handleInputFocus = () => {
    controls.start({
      x: 5,
      transition: { duration: 0.2 },
    });
  };
  useEffect(() => {
    function modalClose(e) {
      if (!e.target.classList.contains("game-card")) {
        setIsSearched(false);
      }
    }
    window.addEventListener("mousedown", modalClose);
    return () => window.removeEventListener("mousedown", modalClose);
  }, []);

  const handleInputBlur = () => {
    controls.start({
      x: 0,
      transition: { duration: 0.2 },
    });
  };
  const handleChange = (e) => {
    setSearchParameter(e.target.value.trim().replace(/ /g, "-"));
  };

  useEffect(() => {
    const search = async () => {
      if (!searchParameter) {
        return;
      }

      const response = await fetch(
        `https://rawg.io/api/games?&search=${searchParameter}&page=1&token&key=${import.meta.env.VITE_RAWG_API_KEY}`
      );
      const data = await response.json();
      setReturnedGames(data.results);
      setIsSearched(true);
    };

    const makeSearch = setTimeout(() => {
      search();
    }, 1000);

    return () => clearTimeout(makeSearch);
  }, [searchParameter]);

  return (
    <header className="z-40 flex justify-center bg-gray-800">
      <nav className="flex w-[100%] flex-col items-center gap-1 bg-gray-800 p-1 sm:justify-between sm:gap-4 sm:p-6 md:flex-row lg:w-[65%]">
        <div className="items-center]  flex">
          <GiGamepad className="h-10 w-10 text-gray-400"></GiGamepad>
        </div>
        <div className="relative inline-block text-gray-800">
          <div className="relative inline-block">
            <input
              ref={searchInput}
              type="text"
              placeholder="Search"
              className="focus:shadow-outline-blue w-[300px] rounded-full border-2 px-4 py-1 text-gray-800 transition focus:border-gray-400 focus:outline-none sm:w-[500px]"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={handleChange}
            />
            <motion.svg
              animate={controls}
              initial={{ x: 0 }}
              className="absolute top-0 right-0 mt-2 mr-4 h-5 w-5 fill-current text-gray-400"
              viewBox="0 0 20 20"
            >
              <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
            </motion.svg>
          </div>
          {isSearched && (
            <div className="absolute top-10 z-50 h-[200px] w-full overflow-y-scroll rounded-xl bg-white">
              {returnedGames.map((game, index) => {
                return <SearchCard name={game.name} image={game.background_image} key={index} id={game.id} />;
              })}
            </div>
          )}
        </div>
        <div className="relative inline-block text-gray-200 md:hidden">
          <button
            className="focus:shadow-outline-blue relative z-10 inline-flex items-center rounded-full px-2 py-2 text-gray-400 hover:text-white focus:border-blue-300 focus:outline-none active:bg-gray-100 active:text-gray-500"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <VscThreeBars className="h-8 w-8 text-gray-400"></VscThreeBars>
          </button>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 w-56 rounded-lg bg-gray-800 py-2 shadow-xl"
            >
              <a
                href="/home"
                className="block px-4 py-2 text-center text-lg text-gray-400 transition hover:bg-gray-700
                hover:text-white"
              >
                HOME
              </a>
              {currentUser ? (
                <>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-center text-lg text-gray-400 transition hover:bg-gray-700
                hover:text-white"
                  >
                    PROFILE
                  </a>
                  <button
                    onClick={() => signOut(auth)}
                    className="block w-full px-4 py-2 text-center text-lg text-gray-400 transition
                hover:bg-gray-700 hover:text-white"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="block px-4 py-2 text-center text-lg text-gray-400 transition hover:bg-gray-700
                hover:text-white"
                >
                  LOGIN
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline">
            <a
              href="/home"
              className=" rounded-md px-3 py-2 text-base font-semibold text-gray-300 transition hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white focus:outline-none"
            >
              HOME
            </a>
            {currentUser ? (
              <>
                <a
                  href="/profile"
                  className="ml-4 rounded-md px-3 py-2 text-base font-semibold text-gray-300 transition hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white focus:outline-none"
                >
                  PROFILE
                </a>
                <button
                  onClick={() => signOut(auth)}
                  className="ml-4 rounded-md px-3 py-2 text-base font-semibold text-gray-300 transition hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white focus:outline-none"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="ml-4 rounded-md px-3 py-2 text-base font-semibold text-gray-300 transition hover:bg-gray-700 hover:text-white "
              >
                LOGIN
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
