import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    cuisineType: "",
    image: null,
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("address", formData.address);
      form.append("cuisineType", formData.cuisineType);
      if (image) form.append("image", image);

      const response = await fetch("http://localhost:5000/api/auth/signup/restaurant", {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Restaurant signed up successfully!");
        navigate("/login");
      } else {
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
   <div className="bg-white dark:bg-gray-500 min-h-screen flex items-center justify-center">
  <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow text-gray-900 dark:text-gray-100 w-full">
    <h2 className="text-2xl font-semibold mb-6 text-center">Restaurant Signup</h2>
    {error && <p className="text-red-600 mb-4">{error}</p>}
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Restaurant Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        required
      />
      <input
        type="text"
        name="cuisineType"
        placeholder="Cuisine Type"
        value={formData.cuisineType}
        onChange={handleChange}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        required
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Sign Up
      </button>
    </form>
  </div>
</div>
  );
};

export default RestaurantSignup;
