import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeliverySignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleType: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/signup/delivery',
        formData
      );

      if (res.data.token) {
        console.log('Delivery signup successful!', res.data);
        navigate('/login');
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(
        err.response?.data?.error || 'Something went wrong. Please try again later.'
      );
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-500 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded shadow text-gray-900 dark:text-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          Delivery Signup
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
          />

          <input
            type="text"
            name="vehicleType"
            placeholder="Vehicle Type (e.g., Bike, Scooter)"
            value={formData.vehicleType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliverySignup;
