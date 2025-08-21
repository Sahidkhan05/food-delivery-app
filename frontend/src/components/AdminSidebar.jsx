import React, { useState } from "react";
import {
  FaHome,
  FaUsers,
  FaShoppingBag,
  FaTruck,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import AdminDashboardFull from "./AdminDashboardFull";
import AdminRestaurantList from "./AdminRestaurantList";
import DeliveryBoyApproval from "./DeliveryBoyApproval";
import AdminUsers from "./AdminUsers";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: <FaHome size={20} /> },
  { id: "restaurants", label: "Restaurants", icon: <FaShoppingBag size={20} /> },
  { id: "deliveryboys", label: "Delivery Boys", icon: <FaTruck size={20} /> },
  { id: "users", label: "Users", icon: <FaUsers size={20} /> },
  { id: "logout", label: "Logout", icon: <FaSignOutAlt size={20} /> },
];

const AdminSidebar = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleClick = (id) => {
    if (id === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }
    setActiveTab(id);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-500">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white p-5 flex flex-col overflow-y-auto dark:bg-gray-900">
        <h2 className="mb-8 text-xl font-bold">Admin Panel</h2>
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
              activeTab === item.id
                ? "bg-slate-700 dark:bg-gray-700"
                : "hover:bg-slate-700 dark:hover:bg-gray-700"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-5 overflow-y-auto text-gray-900 dark:text-gray-100" >
        {activeTab === "dashboard" && <AdminDashboardFull />}
        {activeTab === "restaurants" && <AdminRestaurantList />}
        {activeTab === "deliveryboys" && <DeliveryBoyApproval />}
        {activeTab === "users" && <AdminUsers />}
      </div>
    </div>
  );
};

export default AdminSidebar;
