import React from "react";
import {
  FaBell,
  FaSearch,
  FaUsers,
  FaShoppingBag,
  FaTruck,
  FaChartLine,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminHeader = ({ title }) => {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Welcome back, Admin</h1>
        
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-2 text-gray-400 dark:text-gray-300" />
          <input
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 w-64 text-gray-900 dark:text-gray-100"
            placeholder="Search orders, restaurants..."
          />
        </div>

        <button className="relative">
          <FaBell className="text-xl text-gray-600 dark:text-gray-300" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
      </div>
    </header>
  );
};

const StatCard = ({ title, value, delta, icon, bgClass }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 hover:shadow-lg transition">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h2>
          {delta && <span className="text-sm text-green-500">+{delta}%</span>}
        </div>
      </div>
      <div
        className={`${bgClass} p-3 rounded-full text-white`}
        style={{
          minWidth: 56,
          minHeight: 56,
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </div>
    </div>
  </div>
);

const AdminDashboardFull = () => {
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Orders",
        data: [120, 190, 300, 500, 200, 300],
        fill: false,
        borderColor: "#4CAF50",
        tension: 0.1,
      },
    ],
  };

  const barData = {
    labels: ["Pizza", "Burger", "Pasta", "Drinks", "Desserts"],
    datasets: [
      {
        label: "Sales",
        data: [500, 300, 200, 150, 100],
        backgroundColor: "#ff9800",
      },
    ],
  };

  return (
    <div className="p-6">
      <AdminHeader title="Dashboard" />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Restaurants"
          value="120"
          delta="12"
          icon={<FaShoppingBag />}
          bgClass="bg-orange-500"
        />
        <StatCard
          title="Delivery Boys"
          value="35"
          delta="5"
          icon={<FaTruck />}
          bgClass="bg-green-500"
        />
        <StatCard
          title="Total Users"
          value="980"
          delta="8"
          icon={<FaUsers />}
          bgClass="bg-blue-500"
        />
        <StatCard
          title="Monthly Orders"
          value="2,430"
          delta="15"
          icon={<FaChartLine />}
          bgClass="bg-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Orders Overview
          </h2>
          <Line data={lineData} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Top Selling Items
          </h2>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardFull;
