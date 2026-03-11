import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setMessage(res.data.message);

    } catch (err) {

      setError(err.response?.data?.error || "Something went wrong");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] p-4">

      <div className="bg-white/90 backdrop-blur-lg 
      p-8 rounded-3xl shadow-2xl w-full max-w-md">

        <h2 className="text-2xl font-bold mb-5 text-center text-[#111827]">
          Forgot Password
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
            type="email"
            placeholder="Enter your email"
            required
            className="w-full p-3 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Send Reset Link
          </button>

        </form>

        <p className="text-center mt-5 text-sm">

          <Link
            to="/login"
            className="text-[#6366F1] font-semibold hover:underline"
          >
            Back to Login
          </Link>

        </p>

      </div>

    </div>

  );

};

export default ForgotPasswordPage;