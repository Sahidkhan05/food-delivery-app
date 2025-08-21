import React from 'react';
import { FaUser, FaSignOutAlt, FaShoppingBag, FaUtensils } from 'react-icons/fa';

const menuItems = [
  { label: 'Profile', icon: <FaUser /> },
  { label: 'Order Now', icon: <FaUtensils /> },
  { label: 'My Orders', icon: <FaShoppingBag /> },
  { label: 'Logout', icon: <FaSignOutAlt /> },
];

const UserSidebar = ({ activeTab, onTabClick }) => {
  return (
    <aside className="w-64 bg-orange-500 dark:bg-gray-900 text-white dark:text-white p-6 min-h-screen transition-colors">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.label}
            onClick={() => onTabClick(item.label)}
            className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md transition-colors
              ${activeTab === item.label 
                ? 'bg-yellow-400 text-black dark:bg-yellow-500 dark:text-black' 
                : 'hover:text-yellow-400 dark:hover:text-yellow-300'
              }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default UserSidebar;
