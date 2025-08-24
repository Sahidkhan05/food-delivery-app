import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryEarnings = () => {
  const [earnings, setEarnings] = useState({ totalEarnings: 0, totalDeliveries: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:5000/api/deliveryboy/earnings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEarnings(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch earnings:", err);
        setError("Failed to load earnings data");
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-6">💰 Earnings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 text-center shadow">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Total Earnings</p>
          <p className="text-3xl font-bold mt-2">₹{earnings.totalEarnings || 0}</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 text-center shadow">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Total Deliveries</p>
          <p className="text-3xl font-bold mt-2">{earnings.totalDeliveries || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryEarnings;
