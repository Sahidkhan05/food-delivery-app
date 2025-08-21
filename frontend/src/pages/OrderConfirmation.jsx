import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();

  const handleBackToProfile = () => {
    navigate('/user-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Thank You!</h2>
        <p className="text-lg mb-6">Your order has been placed successfully.</p>
        <button
          onClick={handleBackToProfile}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
