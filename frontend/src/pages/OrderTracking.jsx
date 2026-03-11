import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTruck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const OrderTracking = () => {

  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/order/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const liveOrders = res.data.filter(
        (order) => order.orderStatus !== "delivered"
      );

      setOrders(liveOrders);

    } catch (err) {

      console.error("Failed to fetch orders", err);

    }

  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  /* ===== CANCEL ORDER ===== */

  const cancelOrder = async (orderId) => {

    try {

      await axios.put(
        `http://localhost:5000/api/order/${orderId}/status`,
        {
          status: "cancelled"
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchOrders();

    } catch (error) {

      console.error("Cancel order failed", error);

    }

  };

  if (orders.length === 0) {

    return (
      <div className="text-center mt-20 text-gray-500 dark:text-gray-400 text-lg">
        🚫 No active orders
      </div>
    );

  }

  return (

    <div className="max-w-6xl mx-auto p-6
    text-gray-900 dark:text-gray-100">

      <h2 className="text-3xl font-bold mb-8
      bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
      bg-clip-text text-transparent">

        🚚 Live Order Tracking

      </h2>

      {orders.map((order) => (

        <div
          key={order._id}
          className="bg-white/90 dark:bg-gray-900
          shadow-xl rounded-3xl p-6 mb-8
          border dark:border-gray-700"
        >

          {/* HEADER */}

          <div className="flex justify-between items-center mb-6">

            <div>
              <p className="text-sm text-gray-500">
                Order ID
              </p>

              <p className="font-semibold">
                {order._id}
              </p>
            </div>

            <div className="text-right">

              <p className="text-sm text-gray-500">
                Total
              </p>

              <p className="text-xl font-bold text-[#6366F1]">
                ₹{order.totalPrice}
              </p>

            </div>

          </div>

          {/* RESTAURANT */}

          <div className="mb-4">

            <p className="text-gray-500 text-sm">
              Restaurant
            </p>

            <p className="font-semibold text-lg">
              {order.restaurant?.restaurantName || "Restaurant"}
            </p>

          </div>

          {/* DELIVERY BOY */}

          {order.deliveryBoy && (

            <div className="mb-6 bg-indigo-50 dark:bg-gray-800 p-4 rounded-xl">

              <p className="font-semibold text-[#6366F1]">
                🚚 Delivery Partner
              </p>

              <p>{order.deliveryBoy.name}</p>

              <p className="text-sm text-gray-500">
                📞 {order.deliveryBoy.phone}
              </p>

            </div>

          )}

          {/* ITEMS */}

          <div className="border-t pt-4 mb-6">

            <p className="font-semibold mb-3">
              🍔 Ordered Items
            </p>

            {order.items.map((item, index) => (

              <div
                key={index}
                className="flex justify-between
                bg-gray-50 dark:bg-gray-800
                p-3 rounded-lg mb-2"
              >

                <span>{item.food?.name}</span>

                <span>x{item.quantity}</span>

              </div>

            ))}

          </div>

          {/* CANCEL BUTTON */}

          {order.orderStatus !== "cancelled" &&
            order.orderStatus !== "out_for_delivery" && (

            <button
              onClick={() => cancelOrder(order._id)}
              className="mb-6 bg-red-500 hover:bg-red-600
              text-white px-4 py-2 rounded-lg"
            >
              Cancel Order
            </button>

          )}

          {/* TIMELINE */}

          <ProgressTimeline orderStatus={order.orderStatus} />

        </div>

      ))}

    </div>

  );

};


const ProgressTimeline = ({ orderStatus }) => {

  const steps = [
    "Placed",
    "Accepted",
    "Out for delivery",
    "Delivered"
  ];

  if (orderStatus === "cancelled") {

    return (

      <div className="flex items-center gap-3 text-red-500 font-semibold">

        <FaTimesCircle />

        Order Cancelled

      </div>

    );

  }

  const getStepIndex = () => {

    if (orderStatus === "pending") return 0;
    if (orderStatus === "accepted") return 1;
    if (orderStatus === "out_for_delivery") return 2;
    if (orderStatus === "delivered") return 3;

    return 0;

  };

  const currentStep = getStepIndex();

  return (

    <div className="relative flex justify-between items-center">

      <div className="absolute top-4 left-0 w-full h-1 bg-gray-200"></div>

      <div
        className="absolute top-4 left-0 h-1
        bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"
        style={{ width: `${(currentStep / 3) * 100}%` }}
      ></div>

      {steps.map((step, index) => (

        <div
          key={index}
          className="relative flex flex-col items-center"
        >

          {index <= currentStep ? (

            <FaCheckCircle className="text-green-500 text-xl bg-white rounded-full" />

          ) : (

            <FaTruck className="text-gray-400 text-xl bg-white rounded-full" />

          )}

          <span className="text-xs mt-1">
            {step}
          </span>

        </div>

      ))}

    </div>

  );

};

export default OrderTracking;