import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import LogoutButton from './LogoutButton';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  return (
    <nav className="bg-black dark:bg-gray-900 shadow-md p-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-white dark:text-white hover:text-green-500">
        FoodExpress
      </Link>

      {/* Menu Links */}
      <div className="flex gap-4 items-center">
        {!isLoggedIn && (
          <>
            <Link to="/login" className="text-white dark:text-white font-medium hover:text-green-600">
              Login
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white dark:text-white font-medium hover:text-green-600"
              >
                Signup ⌄
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg border rounded w-48 z-10 transition">
                  <Link to="/signup/user" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                    User Signup
                  </Link>
                  <Link to="/signup/restaurant" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                    Restaurant Signup
                  </Link>
                  <Link to="/signup/delivery" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                    Delivery Signup
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {isLoggedIn && <LogoutButton />}

        {/* Dark Mode Toggle */}
        <DarkModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
