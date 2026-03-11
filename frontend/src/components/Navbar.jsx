import React, { useState } from "react";
import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const closeDropdown = () => {
    setIsOpen(false);
    setMobileMenu(false);
  };

  return (
    <nav className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] dark:from-gray-900 dark:to-gray-800 shadow-lg sticky top-0 z-50 backdrop-blur-md">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeDropdown}
          className="text-2xl font-extrabold text-white tracking-wide 
          hover:scale-110 transition duration-300"
        >
          🍔 FoodExpress
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/login"
            onClick={closeDropdown}
            className="text-white font-medium relative group"
          >
            Login
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Signup Dropdown */}
          <div className="relative">

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 text-white font-medium relative group"
            >
              Signup <ChevronDown size={18} className="group-hover:rotate-180 transition duration-300" />

              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>

            {isOpen && (

              <div className="absolute right-0 mt-4 w-56 rounded-xl 
              bg-white/90 backdrop-blur-md shadow-2xl border border-gray-200 
              overflow-hidden animate-fade-in">

                <Link
                  to="/signup/user"
                  onClick={closeDropdown}
                  className="block px-5 py-3 hover:bg-gray-100 transition duration-200"
                >
                  👤 User Signup
                </Link>

                <Link
                  to="/signup/restaurant"
                  onClick={closeDropdown}
                  className="block px-5 py-3 hover:bg-gray-100 transition duration-200"
                >
                  🏪 Restaurant Signup
                </Link>

                <Link
                  to="/signup/delivery"
                  onClick={closeDropdown}
                  className="block px-5 py-3 hover:bg-gray-100 transition duration-200"
                >
                  🚴 Delivery Signup
                </Link>

              </div>

            )}

          </div>

          <DarkModeToggle />

        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden text-white">

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="hover:scale-110 transition duration-200"
          >
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}

      {mobileMenu && (

        <div className="md:hidden bg-white dark:bg-gray-900 px-6 pb-6 space-y-4 shadow-xl animate-fade-in">

          <Link
            to="/login"
            onClick={closeDropdown}
            className="block text-[#111827] dark:text-white font-medium hover:translate-x-1 transition"
          >
            Login
          </Link>

          <Link
            to="/signup/user"
            onClick={closeDropdown}
            className="block text-[#111827] dark:text-white hover:translate-x-1 transition"
          >
            User Signup
          </Link>

          <Link
            to="/signup/restaurant"
            onClick={closeDropdown}
            className="block text-[#111827] dark:text-white hover:translate-x-1 transition"
          >
            Restaurant Signup
          </Link>

          <Link
            to="/signup/delivery"
            onClick={closeDropdown}
            className="block text-[#111827] dark:text-white hover:translate-x-1 transition"
          >
            Delivery Signup
          </Link>

          <DarkModeToggle />

        </div>

      )}

    </nav>
  );
};

export default Navbar;