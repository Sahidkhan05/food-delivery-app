import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaMotorcycle, FaTrash } from "react-icons/fa";

const DeliveryBoyApproval = () => {

  const [pendingBoys, setPendingBoys] = useState([]);
  const [approvedBoys, setApprovedBoys] = useState([]);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const boysPerPage = 5;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const token = localStorage.getItem("token");

      const [pendingRes, approvedRes] = await Promise.all([
        axios.get(
          "http://localhost:5000/api/admin/delivery-boys/pending",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          "http://localhost:5000/api/admin/delivery-boys/approved",
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ]);

      setPendingBoys(Array.isArray(pendingRes.data) ? pendingRes.data : []);
      setApprovedBoys(
        Array.isArray(approvedRes.data)
          ? approvedRes.data
          : approvedRes.data.deliveryBoys || []
      );

    } catch {

      setError("Failed to load delivery boys");

    } finally {

      setLoading(false);

    }

  };

  const approve = async (id) => {

    const token = localStorage.getItem("token");

    await axios.patch(
      `http://localhost:5000/api/admin/delivery-boys/${id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchData();
  };

  const reject = async (id) => {

    const token = localStorage.getItem("token");

    await axios.patch(
      `http://localhost:5000/api/admin/delivery-boys/${id}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchData();
  };

  const deleteBoy = async (id) => {

    if (!window.confirm("Delete this delivery boy?")) return;

    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/admin/delivery-boys/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchData();
  };

  const filterData = (data = []) => {
    return data.filter((boy) =>
      boy.name?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredPending = filterData(pendingBoys);
  const filteredApproved = filterData(approvedBoys);

  const indexOfLast = currentPage * boysPerPage;
  const indexOfFirst = indexOfLast - boysPerPage;

  const currentApproved = filteredApproved.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredApproved.length / boysPerPage);

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500">
        Loading delivery boys...
      </p>
    );

  if (error)
    return (
      <p className="text-center py-10 text-red-500">
        {error}
      </p>
    );

  return (

    <div>

      {/* SEARCH */}

      <div className="bg-white/80 backdrop-blur-lg shadow rounded-xl p-4 mb-8">

        <input
          type="text"
          placeholder="Search delivery boy..."
          className="border rounded-lg px-4 py-2 w-64
          focus:ring-2 focus:ring-[#6366F1]"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

      </div>

      {/* PENDING REQUESTS */}

      <div className="mb-10">

        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Pending Requests
        </h3>

        {filteredPending.length === 0 ? (
          <p className="text-gray-500">No pending requests</p>
        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredPending.map((boy) => (

              <div
                key={boy._id}
                className="bg-white/80 backdrop-blur-lg
                rounded-2xl shadow-md p-5
                hover:shadow-xl hover:scale-[1.02]
                transition-all duration-300"
              >

                <div className="flex items-center gap-3 mb-3">

                  <img
                    src={
                      boy.profileImage
                        ? `http://localhost:5000/uploads/${boy.profileImage}`
                        : "https://via.placeholder.com/40"
                    }
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div>

                    <h4 className="font-semibold text-gray-800">
                      {boy.name}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {boy.email}
                    </p>

                  </div>

                </div>

                <p className="text-sm text-gray-600">
                  Phone: {boy.phone}
                </p>

                <p className="text-sm text-gray-600 mb-4">
                  Vehicle: {boy.vehicleType} ({boy.vehicleNumber})
                </p>

                <div className="flex gap-2">

                  <button
                    onClick={() => approve(boy._id)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-white
                    bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                    hover:scale-105 transition"
                  >
                    <FaCheck /> Approve
                  </button>

                  <button
                    onClick={() => reject(boy._id)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-white bg-red-500 hover:bg-red-600"
                  >
                    <FaTimes /> Reject
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* APPROVED DELIVERY BOYS */}

      <div>

        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Approved Delivery Boys
        </h3>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs uppercase">

              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Vehicle</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>

            </thead>

            <tbody>

              {currentApproved.map((boy) => (

                <tr key={boy._id} className="border-t hover:bg-indigo-50 transition">

                  <td className="px-4 py-3">
                    <img
                      src={
                        boy.profileImage
                          ? `http://localhost:5000/uploads/${boy.profileImage}`
                          : "https://via.placeholder.com/40"
                      }
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {boy.name}
                  </td>

                  <td className="px-4 py-3">
                    {boy.email}
                  </td>

                  <td className="px-4 py-3">
                    {boy.phone}
                  </td>

                  <td className="px-4 py-3">
                    {boy.vehicleType} ({boy.vehicleNumber})
                  </td>

                  <td className="px-4 py-3">

                    <button
                      onClick={() => deleteBoy(boy._id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg
                      bg-red-500 text-white hover:bg-red-600"
                    >
                      <FaTrash /> Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* PAGINATION */}

          <div className="flex justify-center gap-3 py-4">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-1 border rounded-lg hover:bg-indigo-50"
            >
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-1 border rounded-lg hover:bg-indigo-50"
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>

  );

};

export default DeliveryBoyApproval;