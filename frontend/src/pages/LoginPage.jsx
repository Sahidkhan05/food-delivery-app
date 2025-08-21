import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role || "user");

      switch (user.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "restaurant":
          navigate("/restaurant-dashboard");
          break;
        case "deliveryBoy":
          navigate("/delivery-dashboard");
          break;
        default:
          navigate("/user-dashboard");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email or password");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96 text-gray-900 dark:text-gray-100"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
