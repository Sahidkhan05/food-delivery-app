import React from 'react'
import { FaHome, FaClipboardList, FaHistory, FaMoneyBillWave, FaUser, FaSignOutAlt } from 'react-icons/fa';

const menuItems = [
  { label: 'Profile', icon: <FaUser /> },
  { label: 'Orders', icon: <FaClipboardList /> },
  { label: 'Order History', icon: <FaHistory /> },
  { label: 'Earnings', icon: <FaMoneyBillWave /> },

  { label: 'Logout', icon: <FaSignOutAlt /> },
];

const DeliverySidebar = ({ activeTab, onTabClick }) => {
  return (
    <aside className="w-64 bg-orange-500 dark:bg-gray-900 text-white dark:text-gray-100 min-h-screen p-4 shadow-md">
      <h2 className="text-2xl font-bold mb-6">Delivery Panel</h2>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.label}
            onClick={() => onTabClick(item.label)}
            className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md 
              ${activeTab === item.label ? 'bg-yellow-400 text-black' : 'hover:text-yellow-400'}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default DeliverySidebar;
