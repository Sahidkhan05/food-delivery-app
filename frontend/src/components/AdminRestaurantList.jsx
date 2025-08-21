import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminRestaurantList = () => {
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [approvedRestaurants, setApprovedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/pending-restaurants"),
        axios.get("http://localhost:5000/api/admin/approved-restaurants"),
      ]);

      if (!Array.isArray(pendingRes.data) || !Array.isArray(approvedRes.data)) {
        setError("Unexpected data format from server");
        setLoading(false);
        return;
      }

      setPendingRestaurants(pendingRes.data);
      setApprovedRestaurants(approvedRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${id}`);
      const approvedRest = pendingRestaurants.find((r) => r._id === id);
      setPendingRestaurants((prev) => prev.filter((r) => r._id !== id));
      if (approvedRest) {
        setApprovedRestaurants((prev) => [approvedRest, ...prev]);
      }
    } catch (err) {
      alert("Approval failed");
    }
  };

  const reject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/reject/${id}`);
      setPendingRestaurants((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Rejection failed");
    }
  };

  const handleEdit = (id) => {
    alert(`Edit restaurant with id: ${id}`);
    // TODO: navigate to edit page
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/restaurants/${id}`);
        setApprovedRestaurants((prev) => prev.filter((r) => r._id !== id));
      } catch (error) {
        console.error("Error deleting restaurant:", error);
      }
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-800 dark:text-gray-100">Loading restaurants...</p>;
  if (error) return <p className="text-center text-red-600 dark:text-red-400 py-10">{error}</p>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Restaurant Management</h2>

      {/* Pending Restaurants */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Pending Restaurants</h3>
        {pendingRestaurants.length === 0 ? (
          <p className="italic text-gray-500 dark:text-gray-400">No pending restaurants.</p>
        ) : (
          <ul>
            {pendingRestaurants.map((rest) => (
              <li
                key={rest._id}
                className="mb-4 p-4 border rounded flex justify-between items-center bg-yellow-50 dark:bg-yellow-900"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{rest.name}</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Cuisine: {Array.isArray(rest.cuisineType) ? rest.cuisineType.join(", ") : rest.cuisineType || "N/A"}
                  </p>
                  <p className="text-yellow-600 dark:text-yellow-400">Rating: ⭐ {rest.rating}</p>
                </div>
                <div>
                  <button
                    onClick={() => approve(rest._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(rest._id)}
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

      {/* Approved Restaurants */}
      <section>
        <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Approved Restaurants</h3>
        {approvedRestaurants.length === 0 ? (
          <p className="italic text-gray-500 dark:text-gray-400">No approved restaurants.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase text-xs tracking-wider">
                  <th className="px-4 py-3 border">Image</th>
                  <th className="px-4 py-3 border">Name</th>
                  <th className="px-4 py-3 border">Cuisine Type</th>
                  <th className="px-4 py-3 border">Rating</th>
                  <th className="px-4 py-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedRestaurants.map((rest, index) => (
                  <tr
                    key={rest._id}
                    className={`hover:bg-slate-50 dark:hover:bg-gray-600 ${
                      index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"
                    }`}
                  >
                    <td className="px-4 py-3 border">
                      <img
                        src={`http://localhost:5000/uploads/${rest.image}`}
                        alt={rest.name}
                        className="w-16 h-16 object-cover rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-4 py-3 border font-medium text-gray-800 dark:text-gray-100">{rest.name}</td>
                    <td className="px-4 py-3 border text-gray-600 dark:text-gray-300">
                      {Array.isArray(rest.cuisineType) ? rest.cuisineType.join(", ") : rest.cuisineType || "N/A"}
                    </td>
                    <td className="px-4 py-3 border text-yellow-500 dark:text-yellow-400 font-semibold">⭐ {rest.rating}</td>
                    <td className="px-4 py-3 border flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(rest._id)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(rest._id)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminRestaurantList;
