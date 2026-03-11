import React from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaShoppingBag,
  FaUtensils,
  FaTruck
} from "react-icons/fa";
import DarkModeToggle from "./DarkModeToggle";

const menuItems = [
  { label: "Profile", icon: <FaUser /> },
  { label: "Order Now", icon: <FaUtensils /> },
  { label: "My Orders", icon: <FaShoppingBag /> },
  { label: "Track Orders", icon: <FaTruck /> },
  { label: "Logout", icon: <FaSignOutAlt /> },
];

const UserSidebar = ({ activeTab, onTabClick }) => {
  return (
    <aside
      className="
      fixed left-0 top-0 h-screen w-64
      bg-[#1E1B4B] dark:bg-gray-900
      text-white p-6 shadow-2xl
      flex flex-col justify-between
      transition-colors duration-300
      "
    >
      
      {/* Top Section */}
      <div>

        {/* Logo */}
        <h2
          className="
          text-2xl font-bold mb-10
          bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
          bg-clip-text text-transparent
          "
        >
          🍔 FoodExpress
        </h2>

        {/* Menu */}
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li
              key={item.label}
              onClick={() => onTabClick(item.label)}
              className={`
              flex items-center gap-3 cursor-pointer
              px-4 py-3 rounded-xl transition-all duration-300
              ${
                activeTab === item.label
                  ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg scale-[1.03]"
                  : "text-gray-300 hover:bg-indigo-900 dark:hover:bg-gray-800 hover:scale-[1.02]"
              }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </li>
          ))}
        </ul>

      </div>

      {/* Bottom Section */}
      <div className="pt-6 border-t border-indigo-800 dark:border-gray-700 flex justify-center">
        <DarkModeToggle />
      </div>

    </aside>
  );
};

export default UserSidebar;