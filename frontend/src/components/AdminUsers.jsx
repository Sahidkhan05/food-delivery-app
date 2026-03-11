import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaTrash } from "react-icons/fa";

const AdminUsers = () => {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data);

    } catch (error) {

      console.error("Error fetching users:", error);

    } finally {

      setLoading(false);

    }

  };

  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();

    } catch (error) {

      console.error("Delete failed", error);

    }

  };

  const filteredUsers = users.filter((user) => {

    const name = user.name || user.fullName || "";

    const matchSearch = name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchRole =
      roleFilter === "all" || user.role === roleFilter;

    return matchSearch && matchRole;

  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500">
        Loading users...
      </p>
    );

  return (
    <div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Users Management
      </h2>

      {/* Filters */}

      <div className="bg-white/80 backdrop-blur-lg shadow rounded-xl p-4 mb-6 flex gap-4 flex-wrap">

        <input
          type="text"
          placeholder="Search user..."
          className="px-4 py-2 rounded-lg border
          focus:ring-2 focus:ring-[#6366F1]"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          className="px-4 py-2 rounded-lg border
          focus:ring-2 focus:ring-[#6366F1]"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="restaurant">Restaurant</option>
          <option value="deliveryBoy">Delivery</option>
          <option value="admin">Admin</option>
        </select>

      </div>

      {/* Table */}

      <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white uppercase text-xs">

            <tr>

              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-center">Action</th>

            </tr>

          </thead>

          <tbody>

            {currentUsers.map((user) => (

              <tr key={user._id} className="border-t hover:bg-indigo-50 transition">

                <td className="px-6 py-4 flex items-center gap-3">

                  <div className="w-9 h-9
                  bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                  text-white rounded-full flex items-center justify-center">
                    <FaUser />
                  </div>

                  {user.name || user.fullName}

                </td>

                <td className="px-6 py-4">
                  {user.email}
                </td>

                <td className="px-6 py-4 capitalize">
                  {user.role}
                </td>

                <td className="px-6 py-4 text-center">

                  <button
                    onClick={() => deleteUser(user._id)}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex justify-center mt-6 gap-3 flex-wrap">

        {[...Array(totalPages)].map((_, index) => (

          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-1 rounded-lg border transition ${
              currentPage === index + 1
                ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white"
                : "bg-white hover:bg-indigo-50"
            }`}
          >
            {index + 1}
          </button>

        ))}

      </div>

    </div>
  );
};

export default AdminUsers;