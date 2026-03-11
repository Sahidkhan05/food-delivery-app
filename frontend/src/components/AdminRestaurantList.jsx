import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const AdminRestaurantList = () => {

  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [approvedRestaurants, setApprovedRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 5;

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, approvedRestaurants]);

  const fetchData = async () => {
    try {

      const [pendingRes, approvedRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/restaurants/pending", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/admin/restaurants/approved", {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);

      setPendingRestaurants(pendingRes.data);
      setApprovedRestaurants(approvedRes.data);
      setFilteredRestaurants(approvedRes.data);

    } catch (err) {
      setError("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {

    const filtered = approvedRestaurants.filter((rest) =>
      rest.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  };

  const approve = async (id) => {
    await axios.patch(
      `http://localhost:5000/api/admin/restaurants/${id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchData();
  };

  const reject = async (id) => {
    await axios.patch(
      `http://localhost:5000/api/admin/restaurants/${id}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchData();
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this restaurant?")) return;

    await axios.delete(
      `http://localhost:5000/api/admin/restaurants/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchData();
  };

  const indexOfLast = currentPage * restaurantsPerPage;
  const indexOfFirst = indexOfLast - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading restaurants...</p>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 py-10 text-lg">
        {error}
      </p>
    );

  return (

    <div className="p-6">

      {/* Pending Restaurants */}

      <section className="mb-12">

        <h3 className="text-xl font-semibold mb-6 text-gray-700">
          Pending Restaurants
        </h3>

        {pendingRestaurants.length === 0 ? (

          <p className="text-gray-500">No pending restaurants</p>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {pendingRestaurants.map((rest) => {

              const address = rest.addresses?.[0]
                ? `${rest.addresses[0].street || ""}, ${rest.addresses[0].city || ""}`
                : "Address not provided";

              return (

                <div
                  key={rest._id}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md p-5
                  hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >

                  <img
                    src={
                      rest.profileImage
                        ? `http://localhost:5000/uploads/${rest.profileImage}`
                        : "https://via.placeholder.com/300x150"
                    }
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />

                  <h4 className="font-semibold text-lg text-gray-800">
                    {rest.name}
                  </h4>

                  <p className="text-gray-600 text-sm">
                    📞 {rest.phone || "N/A"}
                  </p>

                  <p className="text-gray-600 text-sm">
                    📍 {address}
                  </p>

                  <div className="flex gap-2 mt-4">

                    <button
                      onClick={() => approve(rest._id)}
                      className="flex-1 py-2 rounded-lg text-white
                      bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                      hover:scale-105 transition"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => reject(rest._id)}
                      className="flex-1 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
                    >
                      Reject
                    </button>

                  </div>

                </div>
              );
            })}
          </div>

        )}

      </section>

      {/* Approved Restaurants */}

      <section>

        <div className="flex justify-between items-center mb-4">

          <h3 className="text-xl font-semibold text-gray-700">
            Approved Restaurants
          </h3>

          <input
            type="text"
            placeholder="Search restaurant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border
            focus:ring-2 focus:ring-[#6366F1]"
          />

        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs uppercase">

              <tr>
                <th className="px-5 py-3 text-left">Image</th>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Phone</th>
                <th className="px-5 py-3 text-left">Address</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>

            </thead>

            <tbody>

              {currentRestaurants.map((rest) => {

                const address = rest.addresses?.[0]
                  ? `${rest.addresses[0].street || ""}, ${rest.addresses[0].city || ""}`
                  : "Address not provided";

                return (

                  <tr key={rest._id} className="border-t hover:bg-indigo-50 transition">

                    <td className="px-5 py-4">
                      <img
                        src={
                          rest.profileImage
                            ? `http://localhost:5000/uploads/${rest.profileImage}`
                            : "https://via.placeholder.com/100"
                        }
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {rest.name}
                    </td>

                    <td className="px-5 py-4">
                      {rest.phone || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      {address}
                    </td>

                    <td className="px-5 py-4 flex justify-center">

                      <button
                        onClick={() => handleDelete(rest._id)}
                        className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

          {/* Pagination */}

          <div className="flex justify-center gap-4 py-4">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-1 rounded-lg border hover:bg-indigo-50"
            >
              Prev
            </button>

            <span className="font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-1 rounded-lg border hover:bg-indigo-50"
            >
              Next
            </button>

          </div>

        </div>

      </section>

    </div>
  );
};

export default AdminRestaurantList;