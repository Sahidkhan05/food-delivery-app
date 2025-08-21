import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryBoyApproval = () => {
  const [pendingBoys, setPendingBoys] = useState([]);
  const [approvedBoys, setApprovedBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [pendingRes, approvedRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/delivery-boy/requests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/admin/delivery-boy/approved", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!Array.isArray(pendingRes.data) || !Array.isArray(approvedRes.data)) {
        setError("Unexpected data format from server");
        setLoading(false);
        return;
      }

      setPendingBoys(pendingRes.data);
      setApprovedBoys(approvedRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load delivery boys");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/delivery-boy/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const approvedBoy = pendingBoys.find((boy) => boy._id === id);
      setPendingBoys((prev) => prev.filter((boy) => boy._id !== id));
      if (approvedBoy) setApprovedBoys((prev) => [approvedBoy, ...prev]);
    } catch {
      alert("Approval failed");
    }
  };

  const reject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/delivery-boy/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingBoys((prev) => prev.filter((boy) => boy._id !== id));
    } catch {
      alert("Rejection failed");
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-800 dark:text-gray-100">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-600 dark:text-red-400">{error}</p>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Delivery Boys Management</h1>

      {/* Pending Delivery Boys */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Pending Delivery Boys</h2>
        {pendingBoys.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No pending delivery boys.</p>
        ) : (
          <ul>
            {pendingBoys.map((boy) => (
              <li
                key={boy._id}
                className="mb-4 p-4 border rounded flex justify-between items-center bg-yellow-50 dark:bg-yellow-900"
              >
                <div className="text-gray-900 dark:text-gray-100">
                  <p className="font-semibold">{boy.name}</p>
                  <p>Email: {boy.email}</p>
                  <p>Phone: {boy.phone}</p>
                  <p>Vehicle: {boy.vehicleType}</p>
                </div>
                <div>
                  <button
                    onClick={() => approve(boy._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(boy._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Approved Delivery Boys */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Approved Delivery Boys</h2>
        {approvedBoys.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No approved delivery boys.</p>
        ) : (
          <ul>
            {approvedBoys.map((boy) => (
              <li
                key={boy._id}
                className="mb-4 p-4 border rounded flex justify-between items-center bg-green-50 dark:bg-green-900"
              >
                <div className="text-gray-900 dark:text-gray-100">
                  <p className="font-semibold">{boy.name}</p>
                  <p>Email: {boy.email}</p>
                  <p>Phone: {boy.phone}</p>
                  <p>Vehicle: {boy.vehicleType}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DeliveryBoyApproval;
