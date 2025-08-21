import React from 'react';
import { FaUser, FaUtensils, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';

const menuItems = [
  { label: 'Profile', icon: <FaUser /> },
  { label: 'Orders', icon: <FaUtensils /> },
  { label: 'Add Food', icon: <FaShoppingBag /> },
  { label: 'Logout', icon: <FaSignOutAlt /> },
];

const RestaurantSidebar = ({ activeTab, onTabClick }) => {
  return (
    <aside className="w-64 bg-orange-500 dark:bg-gray-800 text-white dark:text-gray-200 p-6 min-h-screen transition-colors">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.label}
            onClick={() => onTabClick(item.label)}
            className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md 
              ${activeTab === item.label ? 'bg-yellow-400 dark:bg-yellow-600 text-black dark:text-white' : 'hover:text-yellow-400 dark:hover:text-yellow-300'}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default RestaurantSidebar;
