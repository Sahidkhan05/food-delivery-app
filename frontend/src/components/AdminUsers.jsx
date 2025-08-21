import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Admin ka JWT token
        console.log("Token:", token); // Debug: check if token is present

        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td className="border p-2">{user.name || user.fullName}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
