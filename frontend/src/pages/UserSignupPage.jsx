import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserSignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup/user",
        formData
      );
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      console.error("Signup failed", err.response?.data || err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-500">
      <form
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md text-gray-900 dark:text-gray-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">User Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          pattern="[0-9]{10}"
          title="Please enter a valid 10-digit phone number"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default UserSignupPage;
