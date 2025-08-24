import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderAssigned = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch pending requests & assigned orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found. Please login first.");

      const res = await axios.get(
        "http://localhost:5000/api/deliveryboy/orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingRequests(res.data.pendingRequests || []);
      setAssignedOrders(res.data.assignedOrders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Accept request
  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/deliveryboy/request/${id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Request Accepted!");
      fetchOrders();
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  // Reject request
  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/deliveryboy/request/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Request Rejected!");
      fetchOrders();
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  // Mark order as delivered
  const handleDelivered = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/deliveryboy/request/${requestId}/deliver`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Order Delivered!");
      fetchOrders(); // refresh dashboard
    } catch (err) {
      console.error("Error marking delivered:", err);
      alert("Failed to mark delivered");
    }
  };

  // Update current location
  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser");
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const token = localStorage.getItem("token");

          await axios.put(
            "http://localhost:5000/api/deliveryboy/location",
            { latitude, longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          alert("📍 Location updated successfully!");
        } catch (err) {
          console.error("Error updating location:", err);
          alert("Failed to update location");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Could not fetch location");
        setLoading(false);
      }
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📦 Delivery Dashboard</h2>
        <button
          onClick={handleUpdateLocation}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          {loading ? "Updating..." : "Update Location"}
        </button>
      </div>

      {/* Pending Requests */}
      <h3 className="text-lg font-semibold mb-2">⏳ Pending Requests</h3>
      {pendingRequests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        pendingRequests.map((req) => (
          <div key={req._id} className="border rounded p-4 mb-4 shadow">
            <p><b>Request ID:</b> {req._id}</p>
            <p><b>Order ID:</b> {req.order?._id}</p>
            <p><b>Customer:</b> {req.order?.user?.name || "N/A"}</p>
            <p><b>Phone:</b> {req.order?.user?.phone || "N/A"}</p>
            <p><b>Address:</b> {req.order?.shippingAddress || "N/A"}</p>
            <p><b>Restaurant:</b> {req.order?.restaurant?.name || "N/A"}</p>

            <h4 className="font-semibold mt-2">Items:</h4>
            <ul className="list-disc ml-6">
              {req.order?.items?.map((item, i) => (
                <li key={i}>
                  {item.food?.name} × {item.quantity} (₹{item.food?.price})
                </li>
              ))}
            </ul>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleAccept(req._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(req._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}

      {/* Assigned Orders */}
      <h3 className="text-lg font-semibold mb-2 mt-6">🚚 Assigned Orders</h3>
      {assignedOrders.length === 0 ? (
        <p>No assigned orders</p>
      ) : (
        assignedOrders.map((request) => (
          <div key={request._id} className="border rounded p-4 mb-4 shadow">
            <p><b>Order ID:</b> {request.order?._id}</p>
            <p><b>Customer:</b> {request.order?.user?.name || "N/A"}</p>
            <p><b>Phone:</b> {request.order?.user?.phone || "N/A"}</p>
            <p><b>Address:</b> {request.order?.shippingAddress || "N/A"}</p>
            <p><b>Restaurant:</b> {request.order?.restaurant?.name || "N/A"}</p>

            <h4 className="font-semibold mt-2">Items:</h4>
            <ul className="list-disc ml-6">
              {request.order?.items?.map((item, i) => (
                <li key={i}>
                  {item.food?.name} × {item.quantity} (₹{item.food?.price})
                </li>
              ))}
            </ul>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleDelivered(request._id)}
                className="bg-purple-500 text-white px-3 py-1 rounded"
              >
                Mark as Delivered
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderAssigned;
