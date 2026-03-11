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
import AdminHeader from "./AdminHeader";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: <FaHome size={18} /> },
  { id: "restaurants", label: "Restaurants", icon: <FaShoppingBag size={18} /> },
  { id: "deliveryboys", label: "Delivery Boys", icon: <FaTruck size={18} /> },
  { id: "users", label: "Users", icon: <FaUsers size={18} /> },
  { id: "logout", label: "Logout", icon: <FaSignOutAlt size={18} /> },
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
    <div className="flex h-screen bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 bg-[#1E1B4B] text-white flex flex-col shadow-2xl">

        {/* Logo */}
        <div className="text-center py-6 border-b border-indigo-900">
          <h1 className="text-2xl font-bold tracking-wide 
          bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] 
          bg-clip-text text-transparent">
            🍔 FoodExpress
          </h1>
        </div>

        {/* Menu */}
        <div className="flex-1 p-4 space-y-2">

          {menuItems.map((item) => {

            const isActive = activeTab === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                transition-all duration-300 group
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg scale-[1.03]"
                    : "text-gray-300 hover:bg-indigo-900"
                }`}
              >

                {/* Active Left Border */}
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-md"></span>
                )}

                {/* Icon */}
                <span className="transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>

                {/* Label */}
                <span className="text-sm font-medium">{item.label}</span>

              </div>
            );

          })}

        </div>

      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <AdminHeader />

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">

          <div className="bg-white/80 backdrop-blur-xl
          rounded-2xl shadow-xl p-6 min-h-full
          transition-all duration-300">

            {activeTab === "dashboard" && <AdminDashboardFull />}
            {activeTab === "restaurants" && <AdminRestaurantList />}
            {activeTab === "deliveryboys" && <DeliveryBoyApproval />}
            {activeTab === "users" && <AdminUsers />}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminSidebar;