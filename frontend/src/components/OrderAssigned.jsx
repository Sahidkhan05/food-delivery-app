import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderAssigned = () => {

  const [pendingRequests, setPendingRequests] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000/api/deliveryboy";

  /* ================= FETCH ORDERS ================= */

  const fetchOrders = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPendingRequests(res.data.pendingRequests || []);
      setAssignedOrders(res.data.assignedOrders || []);

    } catch (err) {

      console.error("Error fetching orders:", err);

    }

  };

  useEffect(() => {

    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  /* ================= ACCEPT ================= */

  const handleAccept = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/request/${id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order Accepted");

      fetchOrders();

    } catch (err) {

      console.error(err);

    }

  };

  /* ================= REJECT ================= */

  const handleReject = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/request/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order Rejected");

      fetchOrders();

    } catch (err) {

      console.error(err);

    }

  };

  /* ================= DELIVERED ================= */

  const handleDelivered = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/request/${id}/deliver`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order Delivered");

      fetchOrders();

    } catch (err) {

      console.error(err);

    }

  };

  /* ================= CANCEL ================= */

  const handleCancel = async (orderId) => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/order/${orderId}/status`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order Cancelled");

      fetchOrders();

    } catch (err) {

      console.error(err);

    }

  };

  /* ================= UPDATE LOCATION ================= */

  const handleUpdateLocation = () => {

    if (!navigator.geolocation) {

      alert("Geolocation not supported");

      return;

    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {

      try {

        const token = localStorage.getItem("token");

        await axios.put(
          `${API}/location`,
          {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        alert("Location Updated");

        fetchOrders();

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    });

  };

  return (

    <div className="max-w-6xl mx-auto">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Delivery Orders
        </h2>

        <button
          onClick={handleUpdateLocation}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
        >
          {loading ? "Updating..." : "Update Location"}
        </button>

      </div>

      {/* ================= PENDING ================= */}

      <h3 className="text-xl font-semibold mb-4">
        Pending Requests
      </h3>

      {pendingRequests.length === 0 && (
        <p className="text-gray-500">No pending requests</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {pendingRequests.map((req) => (

          <div
            key={req._id}
            className="bg-white shadow-md rounded-xl p-5 border"
          >

            <h4 className="font-bold text-lg text-orange-600 mb-2">
              {req.order?.restaurant?.restaurantName}
            </h4>

            <p><b>Customer:</b> {req.order?.user?.name}</p>
            <p><b>Phone:</b> {req.order?.user?.phone}</p>

            <p>
              <b>Address:</b>{" "}
              {req.order?.shippingAddress?.street},{" "}
              {req.order?.shippingAddress?.city},{" "}
              {req.order?.shippingAddress?.state} -
              {req.order?.shippingAddress?.pincode}
            </p>

            <p><b>Total:</b> ₹{req.order?.totalPrice}</p>

            <div className="mt-3">

              <p className="font-semibold">Items</p>

              <ul className="list-disc ml-5">

                {req.order?.items?.map((item, i) => (

                  <li key={i}>
                    {item.food?.name} × {item.quantity}
                  </li>

                ))}

              </ul>

            </div>

            <div className="flex gap-3 mt-4">

              <button
                onClick={() => handleAccept(req._id)}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Accept
              </button>

              <button
                onClick={() => handleReject(req._id)}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Reject
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* ================= ASSIGNED ================= */}

      <h3 className="text-xl font-semibold mt-10 mb-4">
        Assigned Orders
      </h3>

      {assignedOrders.length === 0 && (
        <p className="text-gray-500">No assigned orders</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {assignedOrders.map((req) => (

          <div
            key={req._id}
            className="bg-white shadow-md rounded-xl p-5 border"
          >

            <h4 className="font-bold text-lg text-green-600 mb-2">
              {req.order?.restaurant?.restaurantName}
            </h4>

            <p><b>Customer:</b> {req.order?.user?.name}</p>
            <p><b>Phone:</b> {req.order?.user?.phone}</p>

            <p>
              <b>Address:</b>{" "}
              {req.order?.shippingAddress?.street},{" "}
              {req.order?.shippingAddress?.city},{" "}
              {req.order?.shippingAddress?.state} -
              {req.order?.shippingAddress?.pincode}
            </p>

            <p><b>Total:</b> ₹{req.order?.totalPrice}</p>

            <div className="mt-3">

              <p className="font-semibold">Items</p>

              <ul className="list-disc ml-5">

                {req.order?.items?.map((item, i) => (

                  <li key={i}>
                    {item.food?.name} × {item.quantity}
                  </li>

                ))}

              </ul>

            </div>

            <div className="flex gap-3 mt-4">

              <button
                onClick={() => handleDelivered(req._id)}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Mark as Delivered
              </button>

              <button
                onClick={() => handleCancel(req.order._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default OrderAssigned;