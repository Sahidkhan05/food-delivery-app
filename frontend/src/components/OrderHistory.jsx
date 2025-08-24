import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:5000/api/deliveryboy/delivered",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDeliveredOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch delivered orders:", err);
        setError("Failed to load order history");
        setLoading(false);
      }
    };

    fetchDeliveredOrders();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-700 dark:text-gray-200">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Order History</h2>
      {deliveredOrders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No delivered orders yet</p>
      ) : (
        deliveredOrders.map((req) => (
          <div
            key={req._id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-gray-900 dark:text-gray-100">Order ID: {req.order._id}</p>
              <span className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 px-2 py-1 rounded text-sm">
                {req.status.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Restaurant:</span> {req.order.restaurant.name}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Customer:</span> {req.order.user.name} ({req.order.user.phone})
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Address:</span> {req.order.shippingAddress}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Total:</span> ₹{req.order.totalPrice}
            </p>
            <div className="mt-2 text-gray-700 dark:text-gray-300">
              <p className="font-semibold">Items:</p>
              <ul className="list-disc list-inside">
                {req.order.items.map((item, index) => (
                  <li key={index}>
                    {item.food.name} × {item.quantity} — ₹{item.food.price}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-gray-400 dark:text-gray-400 text-sm mt-2">
              Delivered on: {new Date(req.updatedAt).toLocaleString("en-IN")}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
