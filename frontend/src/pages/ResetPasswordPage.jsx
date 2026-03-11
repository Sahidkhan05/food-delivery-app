import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {

      setError(err.response?.data?.error || "Invalid or expired link");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center
    bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
    dark:from-gray-900 dark:to-gray-800
    p-4 transition-colors">

      <div className="bg-white/90 dark:bg-gray-900/90
      backdrop-blur-lg
      p-8 rounded-3xl shadow-2xl
      w-full max-w-md
      border dark:border-gray-700">

        <h2 className="text-2xl font-bold mb-5 text-center
        bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
        bg-clip-text text-transparent">
          Reset Password
        </h2>

        {message && (
          <p className="text-green-600 text-sm mb-4 text-center">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            placeholder="Enter new password"
            required
            className="w-full p-3 border rounded-lg
            dark:bg-gray-800 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 rounded-full
            bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
            text-white font-semibold
            hover:scale-105
            hover:shadow-[0_10px_25px_rgba(99,102,241,0.5)]
            transition duration-300"
          >
            Reset Password
          </button>

        </form>

      </div>

    </div>

  );

};

export default ResetPasswordPage;