import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/deliveryboy/delivered",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const validOrders = (res.data || []).filter((req) => req?.order);

        setOrders(validOrders);
        setFilteredOrders(validOrders);
        setLoading(false);

      } catch (err) {

        console.error(err);
        setError("Failed to load order history");
        setLoading(false);

      }

    };

    fetchOrders();

  }, []);

  /* ================= SEARCH + FILTER ================= */

  useEffect(() => {

    let filtered = [...orders];

    if (search) {

      filtered = filtered.filter((req) =>

        req.order?._id?.toLowerCase().includes(search.toLowerCase()) ||
        req.order?.restaurant?.restaurantName?.toLowerCase().includes(search.toLowerCase()) ||
        req.order?.user?.name?.toLowerCase().includes(search.toLowerCase())

      );

    }

    if (dateFilter) {

      filtered = filtered.filter((req) => {

        const orderDate = new Date(req.updatedAt)
          .toISOString()
          .split("T")[0];

        return orderDate === dateFilter;

      });

    }

    setFilteredOrders(filtered);
    setCurrentPage(1);

  }, [search, dateFilter, orders]);

  /* ================= PAGINATION ================= */

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;

  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 dark:text-gray-400">
        Loading...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-red-500">
        {error}
      </p>
    );

  return (

    <div className="max-w-6xl mx-auto p-6
    text-gray-900 dark:text-gray-100">

      <h2
        className="text-3xl font-bold mb-8
        bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
        bg-clip-text text-transparent"
      >
        📦 Delivered Orders
      </h2>

      {/* SEARCH + FILTER */}

      <div
        className="bg-white/80 dark:bg-gray-900/80
        backdrop-blur-lg
        shadow-lg rounded-2xl p-4 mb-8
        grid md:grid-cols-3 gap-4"
      >

        <input
          type="text"
          placeholder="Search Order / Customer / Restaurant"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border dark:border-gray-700
          dark:bg-gray-800 p-2 rounded-lg
          focus:ring-2 focus:ring-[#6366F1]"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border dark:border-gray-700
          dark:bg-gray-800 p-2 rounded-lg
          focus:ring-2 focus:ring-[#6366F1]"
        />

        <button
          onClick={() => {
            setSearch("");
            setDateFilter("");
            setFilteredOrders(orders);
          }}
          className="bg-gradient-to-r
          from-[#6366F1] to-[#8B5CF6]
          text-white rounded-lg px-4 py-2"
        >
          Reset
        </button>

      </div>

      {/* ORDERS */}

      {currentOrders.length === 0 ? (

        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No delivered orders found
        </p>

      ) : (

        <div className="space-y-6">

          {currentOrders.map((req) => (

            <div
              key={req._id}
              className="bg-white/90 dark:bg-gray-900/90
              backdrop-blur-lg
              shadow-lg rounded-2xl p-6
              border dark:border-gray-700
              hover:shadow-xl transition"
            >

              <div className="flex justify-between mb-3">

                <p className="font-semibold">
                  Order ID: {req.order?._id}
                </p>

                <span
                  className="bg-green-100 text-green-700
                  px-3 py-1 rounded-full text-sm font-semibold"
                >
                  Delivered
                </span>

              </div>

              <p className="text-gray-700 dark:text-gray-300">
                <strong>Restaurant:</strong>{" "}
                {req.order?.restaurant?.restaurantName || "Restaurant"}
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                <strong>Customer:</strong>{" "}
                {req.order?.user?.name || "Customer"} (
                {req.order?.user?.phone || "N/A"})
              </p>

              <p className="text-[#6366F1] font-semibold mt-1">
                Total: ₹{req.order?.totalPrice}
              </p>

              {/* ITEMS */}

              <div className="mt-3">

                <p className="font-semibold mb-1">
                  🍔 Items
                </p>

                <div className="space-y-1">

                  {req.order?.items?.map((item, index) => (

                    <div
                      key={index}
                      className="flex justify-between
                      bg-gray-50 dark:bg-gray-800
                      rounded-lg px-3 py-2 text-sm"
                    >

                      <span>
                        {item.food?.name || "Item"}
                      </span>

                      <span>
                        × {item.quantity}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

              <p className="text-gray-400 text-sm mt-3">
                Delivered on:{" "}
                {new Date(req.updatedAt).toLocaleString("en-IN")}
              </p>

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
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-white"
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

export default OrderHistory;