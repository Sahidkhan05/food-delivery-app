import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const OrderConfirmation = () => {

  const navigate = useNavigate();

  const handleBackToProfile = () => {
    navigate("/user-dashboard");
  };

  return (

    <div
      className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF]
      dark:from-gray-900 dark:to-gray-800
      transition-colors duration-300"
    >

      <div
        className="bg-white/90 dark:bg-gray-900/90
        backdrop-blur-lg
        shadow-2xl rounded-3xl p-10 text-center
        max-w-md w-full
        border dark:border-gray-700"
      >

        {/* ICON */}

        <div className="flex justify-center mb-6">

          <FaCheckCircle
            className="text-green-500 text-6xl"
          />

        </div>

        {/* TITLE */}

        <h2
          className="text-3xl font-bold mb-4
          bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
          bg-clip-text text-transparent"
        >
          Order Confirmed!
        </h2>

        {/* MESSAGE */}

        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          🎉 Your order has been placed successfully.
          Our delivery partner will reach you soon.
        </p>

        {/* BUTTON */}

        <button
          onClick={handleBackToProfile}
          className="
          w-full py-3 rounded-xl
          bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
          text-white font-semibold
          hover:scale-105
          hover:shadow-xl
          transition duration-300"
        >
          Back to Dashboard
        </button>

      </div>

    </div>

  );

};

export default OrderConfirmation;