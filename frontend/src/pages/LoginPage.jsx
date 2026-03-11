import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setLoading(true);

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

      setError(err.response?.data?.error || "Invalid email or password");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="
    min-h-screen flex items-center justify-center
    bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
    p-6
    ">

      <div className="
      bg-white dark:bg-gray-900
      rounded-3xl
      shadow-[0_20px_60px_rgba(0,0,0,0.25)]
      flex overflow-hidden
      max-w-5xl w-full
      ">

        {/* LEFT IMAGE */}

        <div className="relative hidden md:block w-1/2">

          <img
  src="/login.jpg"
  alt="food delivery"
  className="h-full w-full object-cover"
/>

          <div className="
          absolute inset-0
          bg-gradient-to-t from-black/70 via-black/30 to-transparent
          flex items-end p-8 text-white
          ">

            <div>

              <h2 className="text-2xl font-bold">
                Delicious Food Delivered
              </h2>

              <p className="text-sm opacity-90">
                Order from your favorite restaurants anytime.
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT FORM */}

        <div className="w-full md:w-1/2 p-10">

          <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
            Welcome Back 👋
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Login to continue ordering delicious food
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Email Address"
              className="
              w-full p-3 border rounded-lg
              focus:outline-none
              focus:ring-2 focus:ring-[#6366F1]
              "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="
              w-full p-3 border rounded-lg
              focus:outline-none
              focus:ring-2 focus:ring-[#6366F1]
              "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="
              w-full py-3
              bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
              text-white font-semibold
              rounded-lg
              hover:shadow-[0_10px_30px_rgba(99,102,241,0.5)]
              transition duration-300
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="flex justify-between mt-4 text-sm">

            <Link
              to="/forgot-password"
              className="text-[#6366F1] hover:underline"
            >
              Forgot Password
            </Link>

            <Link
              to="/signup/user"
              className="text-[#6366F1] hover:underline"
            >
              Sign Up
            </Link>

          </div>

        </div>

      </div>

    </div>

  );

};

export default LoginPage;