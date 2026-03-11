import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const RestaurantOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDay, setFilterDay] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  const token = localStorage.getItem("token");

  /* ================= FETCH ORDERS ================= */

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/order/restaurant-orders",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setOrders(res.data);

      } catch (err) {

        console.error("Failed to fetch orders:", err.message);

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, [token]);

  /* ================= UPDATE STATUS ================= */

  const handleStatusChange = async (orderId, newStatus) => {

    try {

      const res = await axios.put(
        `http://localhost:5000/api/order/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: res.data.order.orderStatus }
            : order
        )
      );

    } catch (error) {

      console.error(
        "Failed to update status:",
        error.response?.data || error.message
      );

    }

  };

  /* ================= FILTER ================= */

  const filteredOrders = useMemo(() => {

    return orders.filter((order) => {

      const orderDate = new Date(order.createdAt);

      const orderDay = orderDate.toLocaleString("en-US", {
        weekday: "long",
      });

      const matchesOrderId = order._id
        .toLowerCase()
        .includes(searchOrderId.toLowerCase());

      const matchesCustomer =
        order.user.name
          .toLowerCase()
          .includes(searchCustomer.toLowerCase()) ||
        order.user.email
          .toLowerCase()
          .includes(searchCustomer.toLowerCase());

      const matchesDate = filterDate
        ? orderDate.toISOString().split("T")[0] === filterDate
        : true;

      const matchesDay = filterDay ? orderDay === filterDay : true;

      return (
        matchesOrderId &&
        matchesCustomer &&
        matchesDate &&
        matchesDay
      );

    });

  }, [orders, searchOrderId, searchCustomer, filterDate, filterDay]);

  /* ================= PAGINATION ================= */

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;

  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const resetFilters = () => {

    setSearchOrderId("");
    setSearchCustomer("");
    setFilterDate("");
    setFilterDay("");
    setCurrentPage(1);

  };

  /* ================= STATUS COLOR ================= */

  const getStatusColor = (status) => {

    switch (status) {

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "accepted":
        return "bg-blue-100 text-blue-700";

      case "out_for_delivery":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";

    }

  };

  if (loading) {

    return (
      <div className="text-center py-10 dark:text-gray-200">
        Loading orders...
      </div>
    );

  }

  return (

    <div className="max-w-6xl mx-auto p-6 dark:text-gray-200">

      <h2 className="text-3xl font-bold mb-6">
        📦 Restaurant Orders
      </h2>

      {/* FILTER BAR */}

      <div className="bg-white/90 dark:bg-gray-900
      backdrop-blur-lg border dark:border-gray-700
      p-4 rounded-xl shadow-lg mb-6 grid md:grid-cols-5 gap-4">

        <input
          type="text"
          placeholder="Search Order ID"
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
          className="border p-2 rounded-lg
          dark:bg-gray-800 dark:border-gray-700"
        />

        <input
          type="text"
          placeholder="Search Customer"
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
          className="border p-2 rounded-lg
          dark:bg-gray-800 dark:border-gray-700"
        />

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border p-2 rounded-lg
          dark:bg-gray-800 dark:border-gray-700"
        />

        <select
          value={filterDay}
          onChange={(e) => setFilterDay(e.target.value)}
          className="border p-2 rounded-lg
          dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="">Filter by Day</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
          <option>Sunday</option>
        </select>

        <button
          onClick={resetFilters}
          className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
          text-white rounded-lg px-4 py-2"
        >
          Reset
        </button>

      </div>

      {/* ORDER CARDS */}

      {currentOrders.length === 0 ? (

        <p className="dark:text-gray-400">
          No matching orders found.
        </p>

      ) : (

        <div className="grid md:grid-cols-2 gap-6">

          {currentOrders.map((order) => (

            <div
              key={order._id}
              className="bg-white/90 dark:bg-gray-900
              backdrop-blur-lg border dark:border-gray-700
              rounded-2xl shadow-lg p-6"
            >

              {/* ORDER HEADER */}

              <div className="flex justify-between items-center
              bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
              text-white px-4 py-2 rounded-lg mb-4">

                <span>
                  Order #{order._id.slice(-6)}
                </span>

                <span>
                  ₹{order.totalPrice}
                </span>

              </div>

              <p className="text-sm text-gray-500 mb-2">
                🕒 {new Date(order.createdAt).toLocaleString()}
              </p>

              {/* STATUS */}

              <div className="flex justify-between items-center mb-4">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>

                <select
                  value={order.orderStatus}
                  disabled={
                    order.orderStatus === "delivered" ||
                    order.orderStatus === "cancelled"
                  }
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="border px-3 py-1 rounded-lg
                  dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancel Order</option>
                </select>

              </div>

              {/* CUSTOMER */}

              <div className="mb-4 text-sm">

                <p>
                  <strong>Customer:</strong> {order.user.name}
                </p>

                <p>
                  <strong>Email:</strong> {order.user.email}
                </p>

              </div>

              {/* ITEMS */}

              <div className="border-t dark:border-gray-700 pt-4">

                <h4 className="font-semibold mb-3">
                  🍽 Ordered Items ({order.items.length})
                </h4>

                <div className="space-y-2">

                  {order.items.map((item, index) => (

                    <div
                      key={index}
                      className="flex justify-between
                      bg-indigo-50 dark:bg-gray-800
                      px-4 py-3 rounded-lg"
                    >

                      <div>

                        <p className="font-medium">
                          {item.food?.name || "Item"}
                        </p>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>

                      </div>

                      <div className="font-semibold">
                        ₹{item.food?.price || "N/A"}
                      </div>

                    </div>

                  ))}

                </div>

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
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white"
                  : "bg-gray-200 dark:bg-gray-700"
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

export default RestaurantOrders;