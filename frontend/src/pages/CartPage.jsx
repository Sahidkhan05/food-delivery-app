import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartPage = () => {

  const navigate = useNavigate();

  const {
    cartItems,
    setCartItems,
    userAddress,
    setUserAddress,
    paymentMode,
    setPaymentMode,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState("");

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleConfirmOrder = async () => {

    try {

      const token = localStorage.getItem("token");

      const formattedItems = cartItems.map((item) => ({
        food: item._id,
        quantity: item.quantity,
      }));

      const orderData = {
        items: formattedItems,
        totalPrice,
        shippingAddress: userAddress,
        paymentMethod:
          paymentMode === "COD"
            ? "Cash on Delivery"
            : paymentMode === "UPI"
            ? "UPI"
            : "Card",
      };

      const response = await axios.post(
        "http://localhost:5000/api/order/place",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {

        alert("Order placed successfully!");

        setCartItems([]);
        setUserAddress("");
        setUpiId("");
        setCardDetails("");

        navigate("/order-confirmation");

      }

    } catch (err) {

      console.error("Order error:", err.response?.data || err.message);
      alert("Order failed");

    }

  };

  return (

    <div className="min-h-screen py-10 px-6
    bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF]
    dark:from-gray-900 dark:to-gray-800
    transition-colors">

      <div className="max-w-6xl mx-auto">

        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() => navigate(-1)}
            className="bg-white dark:bg-gray-800
            dark:text-gray-200
            shadow px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ← Back
          </button>

          <h2
            className="text-3xl font-bold
            bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
            bg-clip-text text-transparent"
          >
            🛒 Your Cart
          </h2>

        </div>

        {cartItems.length === 0 ? (

          <div className="bg-white/90 dark:bg-gray-900/90
          backdrop-blur-lg
          p-10 rounded-2xl shadow text-center
          border dark:border-gray-700">

            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Your cart is empty
            </p>

            <button
              onClick={() => navigate("/user-dashboard")}
              className="mt-6
              bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
              text-white px-6 py-2 rounded-lg"
            >
              Browse Restaurants
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* CART ITEMS */}

            <div className="space-y-5">

              {cartItems.map((item) => (

                <div
                  key={item._id}
                  className="flex items-center justify-between
                  bg-white/90 dark:bg-gray-900
                  backdrop-blur-lg
                  border dark:border-gray-700
                  p-4 rounded-2xl shadow hover:shadow-xl transition"
                >

                  <div className="flex gap-4 items-center">

                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    <div>

                      <h3 className="font-semibold dark:text-gray-200">
                        {item.name}
                      </h3>

                      <p className="text-gray-500 dark:text-gray-400">
                        ₹{item.price}
                      </p>

                      <div className="flex items-center gap-2 mt-2">

                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          className="bg-gray-200 dark:bg-gray-700
                          px-3 py-1 rounded-lg"
                        >
                          -
                        </button>

                        <span className="dark:text-gray-200">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item._id)}
                          className="bg-gray-200 dark:bg-gray-700
                          px-3 py-1 rounded-lg"
                        >
                          +
                        </button>

                      </div>

                    </div>

                  </div>

                  <div className="flex flex-col items-end">

                    <p className="font-semibold text-[#6366F1]">
                      ₹{item.price * item.quantity}
                    </p>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 mt-2"
                    >
                      <MdDelete size={22} />
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* ORDER SUMMARY */}

            <div
              className="bg-white/90 dark:bg-gray-900
              backdrop-blur-lg
              border dark:border-gray-700
              p-6 rounded-2xl shadow space-y-5"
            >

              <h3 className="text-xl font-bold dark:text-gray-200">
                Order Summary
              </h3>

              <div className="flex justify-between dark:text-gray-300">
                <span>Items</span>
                <span>{cartItems.length}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg">

                <span className="dark:text-gray-200">
                  Total
                </span>

                <span className="text-[#6366F1]">
                  ₹{totalPrice}
                </span>

              </div>

              {/* Address */}

              <div>

                <label className="font-semibold dark:text-gray-300">
                  Address
                </label>

                <textarea
                  className="w-full border rounded-lg p-2 mt-1
                  dark:bg-gray-800 dark:border-gray-700
                  focus:ring-2 focus:ring-[#6366F1]"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                />

              </div>

              {/* Payment */}

              <div>

                <label className="font-semibold dark:text-gray-300">
                  Payment Mode
                </label>

                <select
                  className="w-full border rounded-lg p-2 mt-1
                  dark:bg-gray-800 dark:border-gray-700
                  focus:ring-2 focus:ring-[#6366F1]"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >

                  <option value="COD">Cash on Delivery</option>
                  <option value="UPI">UPI</option>
                  <option value="CARD">Card</option>

                </select>

              </div>

              {paymentMode === "UPI" && (

                <input
                  type="text"
                  placeholder="Enter UPI ID"
                  className="w-full border rounded-lg p-2
                  dark:bg-gray-800 dark:border-gray-700"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />

              )}

              {paymentMode === "CARD" && (

                <input
                  type="text"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="w-full border rounded-lg p-2
                  dark:bg-gray-800 dark:border-gray-700"
                  value={cardDetails}
                  onChange={(e) => setCardDetails(e.target.value)}
                />

              )}

              <button
                onClick={handleConfirmOrder}
                className="w-full py-3 rounded-xl
                bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                text-white font-semibold
                hover:scale-105 transition"
              >
                Confirm Order
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};

export default CartPage;