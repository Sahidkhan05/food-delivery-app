import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const UserSignupPage = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
    setLoading(true);
    setError("");
    setSuccess("");

    try {

      await axios.post(
        "http://localhost:5000/api/auth/signup/user",
        formData
      );

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {

      setError(
        err.response?.data?.error || "Signup failed. Please try again."
      );

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
            src="/UserSignup.jpg"
            alt="signup"
            className="h-full w-full object-cover"
          />

          {/* Overlay */}

          <div className="
          absolute inset-0
          bg-gradient-to-t from-black/70 via-black/30 to-transparent
          flex items-end
          p-8 text-white
          ">

            <div>

              <h2 className="text-2xl font-bold">
                Discover Amazing Food
              </h2>

              <p className="text-sm opacity-90">
                Join our platform and order from the best restaurants near you.
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT FORM */}

        <div className="w-full md:w-1/2 p-10 text-gray-900 dark:text-gray-100">

          <h2 className="text-3xl font-bold mb-2">
            Create Account
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Start ordering your favorite food today 🍔
          </p>

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="
              w-full p-3 rounded-lg border
              focus:outline-none
              focus:ring-2 focus:ring-[#6366F1]
              transition
              "
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="
              w-full p-3 rounded-lg border
              focus:outline-none
              focus:ring-2 focus:ring-[#6366F1]
              transition
              "
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="
              w-full p-3 rounded-lg border
              focus:outline-none
              focus:ring-2 focus:ring-[#6366F1]
              transition
              "
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="
              w-full p-3 rounded-lg border
              focus:outline-none
              focus:ring-2 focus:ring-[#6366F1]
              transition
              "
              pattern="[0-9]{10}"
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <p className="text-center text-sm mt-6">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-[#6366F1] font-semibold hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>

  );

};

export default UserSignupPage;