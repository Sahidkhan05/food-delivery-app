import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const DeliveryEarnings = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchDate, setSearchDate] = useState("");
  const [filterDay, setFilterDay] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const token = localStorage.getItem("token");

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/deliveryboy/delivered",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const validOrders = (res.data || []).filter((req) => req?.order);

        setOrders(validOrders);
        setLoading(false);

      } catch (error) {

        console.error("Earnings fetch error:", error);
        setLoading(false);

      }

    };

    fetchOrders();

  }, [token]);

  /* ================= FILTER ================= */

  const filteredOrders = useMemo(() => {

    return orders.filter((req) => {

      const date = new Date(req.updatedAt);

      const orderDay = date.toLocaleString("en-US", { weekday: "long" });

      const matchesDate = searchDate
        ? date.toISOString().split("T")[0] === searchDate
        : true;

      const matchesDay = filterDay
        ? orderDay === filterDay
        : true;

      return matchesDate && matchesDay;

    });

  }, [orders, searchDate, filterDay]);

  /* ================= STATS ================= */

  const totalEarnings = filteredOrders.reduce(
    (sum, req) => sum + (req.order?.totalPrice || 0),
    0
  );

  const totalDeliveries = filteredOrders.length;

  const today = new Date().toISOString().split("T")[0];

  const todayEarnings = orders
    .filter((req) =>
      new Date(req.updatedAt).toISOString().split("T")[0] === today
    )
    .reduce((sum, req) => sum + (req.order?.totalPrice || 0), 0);

  /* ================= PAGINATION ================= */

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;

  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 dark:text-gray-400">
        Loading earnings...
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
        💰 Delivery Earnings Dashboard
      </h2>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <StatCard title="Total Earnings" value={`₹${totalEarnings}`} />
        <StatCard title="Total Deliveries" value={totalDeliveries} />
        <StatCard title="Today's Earnings" value={`₹${todayEarnings}`} />

      </div>

      {/* FILTER BAR */}

      <div
        className="bg-white/80 dark:bg-gray-900/80
        backdrop-blur-lg
        p-4 shadow-lg rounded-2xl mb-8
        grid md:grid-cols-3 gap-4"
      >

        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border dark:border-gray-700
          dark:bg-gray-800 p-2 rounded-lg
          focus:ring-2 focus:ring-[#6366F1]"
        />

        <select
          value={filterDay}
          onChange={(e) => setFilterDay(e.target.value)}
          className="border dark:border-gray-700
          dark:bg-gray-800 p-2 rounded-lg
          focus:ring-2 focus:ring-[#6366F1]"
        >
          <option value="">Filter by Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>

        <button
          onClick={() => {
            setSearchDate("");
            setFilterDay("");
          }}
          className="bg-gradient-to-r
          from-[#6366F1] to-[#8B5CF6]
          text-white rounded-lg px-4 py-2"
        >
          Reset Filter
        </button>

      </div>

      {/* ORDERS LIST */}

      {currentOrders.length === 0 ? (

        <p className="text-gray-500 dark:text-gray-400">
          No earnings found
        </p>

      ) : (

        <div className="space-y-5">

          {currentOrders.map((req) => (

            <div
              key={req._id}
              className="bg-white/90 dark:bg-gray-900/90
              backdrop-blur-lg
              shadow-lg p-5 rounded-2xl
              border dark:border-gray-700
              hover:shadow-xl transition"
            >

              <div className="flex justify-between mb-2">

                <p className="font-semibold">
                  Order ID: {req.order?._id}
                </p>

                <p className="text-[#6366F1] font-bold text-lg">
                  ₹{req.order?.totalPrice}
                </p>

              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Restaurant: {req.order?.restaurant?.restaurantName}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customer: {req.order?.user?.name}
              </p>

              <p className="text-sm text-gray-400">
                Delivered on: {new Date(req.updatedAt).toLocaleString()}
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

/* ================= STAT CARD ================= */

const StatCard = ({ title, value }) => {

  return (

    <div
      className="bg-white/80 dark:bg-gray-900/80
      backdrop-blur-lg
      shadow-lg rounded-2xl p-6
      border dark:border-gray-700
      text-center hover:shadow-xl transition"
    >

      <p className="text-gray-500 dark:text-gray-400 text-sm">
        {title}
      </p>

      <p className="text-3xl font-bold mt-2 text-[#6366F1]">
        {value}
      </p>

    </div>

  );

};

export default DeliveryEarnings;