import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="
      bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
      dark:bg-gray-950
      text-white pt-16 pb-10
      transition-colors duration-300
      "
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Column 1 */}

        <div>
          <Link to="/">
            <h2 className="text-2xl font-bold mb-3">
              🍔 FoodExpress
            </h2>
          </Link>

          <p className="text-sm text-indigo-100 dark:text-gray-400 leading-relaxed max-w-sm">
            Your favorite food delivered hot & fresh at your doorstep.
            Fast, reliable, and delicious every time.
          </p>
        </div>

        {/* Column 2 */}

        <div>
          <h3 className="font-semibold mb-4 text-lg">
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm text-indigo-100 dark:text-gray-400">

            <li>
              <Link
                to="/"
                className="hover:text-white dark:hover:text-indigo-400 transition"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/restaurants"
                className="hover:text-white dark:hover:text-indigo-400 transition"
              >
                Restaurants
              </Link>
            </li>

          </ul>
        </div>

        {/* Column 3 */}

        <div>
          <h3 className="font-semibold mb-4 text-lg">
            Follow Us
          </h3>

          <div className="flex gap-5 text-indigo-100 dark:text-gray-400">

            <a
              href="#"
              className="hover:text-white dark:hover:text-indigo-400 hover:scale-110 transition"
            >
              <Instagram size={22} />
            </a>

            <a
              href="#"
              className="hover:text-white dark:hover:text-indigo-400 hover:scale-110 transition"
            >
              <Facebook size={22} />
            </a>

            <a
              href="#"
              className="hover:text-white dark:hover:text-indigo-400 hover:scale-110 transition"
            >
              <Twitter size={22} />
            </a>

          </div>
        </div>

      </div>

      {/* Divider */}

      <div className="border-t border-indigo-400 dark:border-gray-800 mt-12 pt-6 text-center text-sm text-indigo-200 dark:text-gray-500">

        © {new Date().getFullYear()} FoodExpress. All rights reserved.

      </div>

    </footer>
  );
};

export default Footer;