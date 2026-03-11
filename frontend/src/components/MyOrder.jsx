import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const MyOrder = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchRestaurant, setSearchRestaurant] = useState("");
  const [searchFood, setSearchFood] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [dayFilter, setDayFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/order/my-orders",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setOrders(res.data || []);

      } catch (error) {

        console.error("Fetch orders error:", error);
        setOrders([]);

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, []);

  /* ================= FILTER ================= */

  const filteredOrders = useMemo(() => {

    return orders.filter((order) => {

      const orderDate = new Date(order.createdAt);

      const restaurantMatch =
        order.restaurant?.restaurantName
          ?.toLowerCase()
          .includes(searchRestaurant.toLowerCase());

      const foodMatch = order.items?.some((item) =>
        item.food?.name
          ?.toLowerCase()
          .includes(searchFood.toLowerCase())
      );

      const dateMatch = selectedDate
        ? orderDate.toDateString() === new Date(selectedDate).toDateString()
        : true;

      let dayMatch = true;

      const today = new Date();

      if (dayFilter === "Today") {

        dayMatch = orderDate.toDateString() === today.toDateString();

      } else if (dayFilter === "Last 7 Days") {

        const last7 = new Date();
        last7.setDate(today.getDate() - 7);

        dayMatch = orderDate >= last7;

      }

      return restaurantMatch && foodMatch && dateMatch && dayMatch;

    });

  }, [orders, searchRestaurant, searchFood, selectedDate, dayFilter]);

  /* ================= PAGINATION ================= */

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;

  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 dark:text-gray-400">
        Loading orders...
      </p>
    );

  return (

    <div className="max-w-6xl mx-auto p-6
    text-gray-900 dark:text-gray-100
    transition-colors duration-300">

      <h2 className="text-3xl font-bold mb-6
      bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
      bg-clip-text text-transparent">
        📦 My Orders
      </h2>

      {/* FILTER BAR */}

      <div className="bg-white/90 dark:bg-gray-900/90
      backdrop-blur-lg shadow rounded-xl p-4 mb-6
      grid md:grid-cols-4 gap-4">

        <input
          type="text"
          placeholder="Search Restaurant"
          value={searchRestaurant}
          onChange={(e) => setSearchRestaurant(e.target.value)}
          className="border p-2 rounded
          dark:bg-gray-800 dark:border-gray-700
          focus:ring-2 focus:ring-[#6366F1]"
        />

        <input
          type="text"
          placeholder="Search Food"
          value={searchFood}
          onChange={(e) => setSearchFood(e.target.value)}
          className="border p-2 rounded
          dark:bg-gray-800 dark:border-gray-700
          focus:ring-2 focus:ring-[#6366F1]"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded
          dark:bg-gray-800 dark:border-gray-700
          focus:ring-2 focus:ring-[#6366F1]"
        />

        <select
          value={dayFilter}
          onChange={(e) => setDayFilter(e.target.value)}
          className="border p-2 rounded
          dark:bg-gray-800 dark:border-gray-700
          focus:ring-2 focus:ring-[#6366F1]"
        >
          <option value="All">All</option>
          <option value="Today">Today</option>
          <option value="Last 7 Days">Last 7 Days</option>
        </select>

      </div>

      {/* ORDERS */}

      {currentOrders.length === 0 ? (

        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No matching orders found
        </p>

      ) : (

        <div className="space-y-6">

          {currentOrders.map((order) => (

            <div
              key={order._id}
              className="bg-white/90 dark:bg-gray-900/90
              backdrop-blur-lg border dark:border-gray-700
              rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >

              {/* TOP */}

              <div className="flex justify-between mb-4">

                <div>

                  <h3 className="text-lg font-bold text-[#6366F1]">
                    {order.restaurant?.restaurantName || "Restaurant"}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 text-sm rounded-full font-semibold
                    ${
                      order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-600"
                        : order.orderStatus === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-indigo-100 text-indigo-600"
                    }`}
                >
                  {order.orderStatus.replace("_", " ").toUpperCase()}
                </span>

              </div>

              {/* ITEMS */}

              <div className="space-y-3">

                {order.items?.map((item, i) => (

                  <div
                    key={i}
                    className="flex items-center justify-between
                    bg-indigo-50 dark:bg-gray-800
                    rounded-xl p-3"
                  >

                    <div className="flex items-center gap-3">

                      <img
                        src={
                          item.food?.image
                            ? `http://localhost:5000/uploads/${item.food.image}`
                            : "/images/no-preview.png"
                        }
                        alt={item.food?.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />

                      <div>

                        <p className="font-semibold">
                          {item.food?.name}
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>

                      </div>

                    </div>

                    <div className="text-right">

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ₹{item.food?.price}
                      </p>

                      <p className="font-semibold">
                        ₹{(item.food?.price || 0) * item.quantity}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

              {/* BOTTOM */}

              <div className="mt-6 pt-4 border-t
              dark:border-gray-700 flex justify-between">

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Payment: {order.paymentMethod}
                </p>

                <p className="text-xl font-bold text-[#6366F1]">
                  ₹{order.totalPrice}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex justify-center mt-8 gap-2">

          {Array.from({ length: totalPages }, (_, i) => (

            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === i + 1
                  ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>

          ))}

        </div>

      )}

    </div>

  );

};

export default MyOrder;