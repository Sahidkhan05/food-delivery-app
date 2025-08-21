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

  const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem('token');

      const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const formattedItems = cartItems.map(item => ({
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Order placed successfully!");
        setCartItems([]);
        setUserAddress("");
        setUpiId("");
        setCardDetails("");
        navigate("/order-confirmation");
      } else {
        alert("Something went wrong.");
      }
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
      alert("Order failed.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-black dark:text-white">No items in cart.</p>
      ) : (
        cartItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center border p-2 rounded mb-2 bg-white dark:bg-gray-800 transition-colors"
          >
            <div>
              <p className="font-semibold text-black dark:text-white">{item.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => decreaseQuantity(item._id)}
                  className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-black dark:text-white"
                >
                  -
                </button>
                <span className="text-black dark:text-white">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item._id)}
                  className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-black dark:text-white"
                >
                  +
                </button>
              </div>
              <p className="mt-1 text-black dark:text-gray-200">Price: ₹{item.price * item.quantity}</p>
            </div>
            <button onClick={() => removeFromCart(item._id)} className="text-black dark:text-white">
              <MdDelete size={20} />
            </button>
          </div>
        ))
      )}

      {/* Address */}
      <div className="mt-4">
        <label className="block font-semibold text-black dark:text-white">Address:</label>
        <textarea
          className="w-full border rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
      </div>

      {/* Payment Mode */}
      <div className="mt-4">
        <label className="block font-semibold text-black dark:text-white">Payment Mode:</label>
        <select
          className="w-full border rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
        >
          <option value="COD">Cash on Delivery</option>
          <option value="UPI">UPI</option>
          <option value="CARD">Card</option>
        </select>
      </div>

      {/* UPI Input */}
      {paymentMode === "UPI" && (
        <div className="mt-4">
          <label className="block font-semibold text-black dark:text-white">Enter UPI ID:</label>
          <input
            type="text"
            className="w-full border rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
        </div>
      )}

      {/* Card Input */}
      {paymentMode === "CARD" && (
        <div className="mt-4">
          <label className="block font-semibold text-black dark:text-white">Card Details:</label>
          <input
            type="text"
            className="w-full border rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            value={cardDetails}
            onChange={(e) => setCardDetails(e.target.value)}
          />
        </div>
      )}

      {/* Confirm Order Button */}
      <button
        onClick={handleConfirmOrder}
        className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded mt-6 hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
      >
        Confirm Order
      </button>
    </div>
  );
};

export default CartPage;
