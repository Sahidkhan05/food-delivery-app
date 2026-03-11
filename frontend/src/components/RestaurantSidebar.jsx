import React from "react";
import {
  FaUser,
  FaUtensils,
  FaShoppingBag,
  FaSignOutAlt,
} from "react-icons/fa";
import DarkModeToggle from "./DarkModeToggle";

const menuItems = [
  { label: "Profile", icon: <FaUser /> },
  { label: "Orders", icon: <FaUtensils /> },
  { label: "Add Food", icon: <FaShoppingBag /> },
  { label: "Logout", icon: <FaSignOutAlt /> },
];

const RestaurantSidebar = ({ activeTab, onTabClick }) => {

  return (

    <aside
      className="fixed top-0 left-0 h-screen w-64
      bg-[#1E1B4B] dark:bg-gray-900
      text-white p-6 shadow-2xl z-50
      flex flex-col justify-between
      transition-colors duration-300"
    >

      {/* Top Section */}

      <div>

        {/* Logo */}

        <h2 className="text-2xl font-bold mb-10 tracking-wide
        bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
        bg-clip-text text-transparent">
          🍔 Restaurant
        </h2>

        {/* Menu */}

        <ul className="space-y-2">

          {menuItems.map((item) => {

            const isActive = activeTab === item.label;

            return (

              <li
                key={item.label}
                onClick={() => onTabClick(item.label)}
                className={`relative flex items-center gap-3 cursor-pointer
                px-4 py-3 rounded-xl transition-all duration-300 group
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg scale-[1.02]"
                    : "text-gray-300 hover:bg-indigo-900 dark:hover:bg-gray-800"
                }`}
              >

                {/* Active indicator */}

                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-md"></span>
                )}

                {/* Icon */}

                <span className="text-lg group-hover:scale-110 transition">
                  {item.icon}
                </span>

                {/* Label */}

                <span className="font-medium text-sm">
                  {item.label}
                </span>

              </li>

            );

          })}

        </ul>

      </div>

      {/* Bottom Section */}

      <div className="pt-6 border-t border-indigo-800 dark:border-gray-700 flex justify-center">
        <DarkModeToggle />
      </div>

    </aside>

  );

};

export default RestaurantSidebar;