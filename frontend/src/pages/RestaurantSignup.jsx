import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RestaurantSignup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    cuisineType: "",
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      const form = new FormData();

      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("phone", formData.phone);
      form.append("address", formData.address);
      form.append("cuisineType", formData.cuisineType);

      if (image) form.append("image", image);

      const response = await fetch(
        "http://localhost:5000/api/auth/signup/restaurant",
        {
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();

      if (response.ok) {

        setSuccess(
          "Restaurant registered successfully! Pending admin approval."
        );

        setTimeout(() => {
          navigate("/login");
        }, 2500);

      } else {

        setError(data.error || "Signup failed. Please try again.");

      }

    } catch (err) {

      setError("Server error. Please try again later.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center
    bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] p-6">

      <div className="
      bg-white dark:bg-gray-900
      rounded-3xl shadow-2xl
      flex overflow-hidden
      max-w-5xl w-full
      ">

        {/* LEFT IMAGE */}

        <div className="hidden md:flex w-1/2 items-center justify-center bg-indigo-50">

          <img
  src="/RestruSignup.jpg"
  alt="Restaurant Signup"
  className="h-full w-full object-cover"
/>

        </div>

        {/* RIGHT FORM */}

        <div className="w-full md:w-1/2 p-10 text-gray-900 dark:text-gray-100">

          <h2 className="text-3xl font-bold mb-2">
            Register Your Restaurant 🏪
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Start receiving food orders today
          </p>

          {error && (
            <p className="text-red-600 bg-red-100 p-2 rounded mb-4 text-sm">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-700 bg-green-100 p-2 rounded mb-4 text-sm">
              {success}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-4"
          >

            <input
              type="text"
              name="name"
              placeholder="Restaurant Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border
              focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border
              focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border
              focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Restaurant Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border
              focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Restaurant Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border
              focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              required
            />

            <input
              type="text"
              name="cuisineType"
              placeholder="Cuisine Type (Indian, Italian...)"
              value={formData.cuisineType}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border
              focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-3 rounded-lg border"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3
              bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
              text-white font-semibold rounded-lg
              hover:opacity-90 transition"
            >
              {loading ? "Creating Account..." : "Register Restaurant"}
            </button>

          </form>

          <p className="text-center text-sm mt-6">

            Already registered?{" "}

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

export default RestaurantSignup;