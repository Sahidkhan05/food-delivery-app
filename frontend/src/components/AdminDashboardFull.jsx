import React from "react";
import {
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

const StatCard = ({ title, value, delta, icon }) => {
  return (
    <div
      className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md p-6
      hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-2xl font-bold text-gray-800">{value}</h2>

            {delta && (
              <span className="text-green-500 text-sm font-medium">
                +{delta}%
              </span>
            )}
          </div>
        </div>

        <div
          className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
          text-white p-4 rounded-xl text-lg shadow-md"
        >
          {icon}
        </div>

      </div>
    </div>
  );
};

const AdminDashboardFull = () => {

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Orders",
        data: [120, 190, 300, 500, 200, 300],
        borderColor: "#6366F1",
        backgroundColor: "#6366F1",
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: ["Pizza", "Burger", "Pasta", "Drinks", "Desserts"],
    datasets: [
      {
        label: "Sales",
        data: [500, 300, 200, 150, 100],
        backgroundColor: "#8B5CF6",
      },
    ],
  };

  return (
    <div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total Restaurants"
          value="120"
          delta="12"
          icon={<FaShoppingBag />}
        />

        <StatCard
          title="Delivery Boys"
          value="35"
          delta="5"
          icon={<FaTruck />}
        />

        <StatCard
          title="Total Users"
          value="980"
          delta="8"
          icon={<FaUsers />}
        />

        <StatCard
          title="Monthly Orders"
          value="2,430"
          delta="15"
          icon={<FaChartLine />}
        />

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div
          className="bg-white/80 backdrop-blur-lg rounded-2xl
          shadow-md p-6 hover:shadow-xl transition-all duration-300"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Orders Overview
          </h2>

          <Line data={lineData} />
        </div>

        <div
          className="bg-white/80 backdrop-blur-lg rounded-2xl
          shadow-md p-6 hover:shadow-xl transition-all duration-300"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Top Selling Items
          </h2>

          <Bar data={barData} />
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardFull;