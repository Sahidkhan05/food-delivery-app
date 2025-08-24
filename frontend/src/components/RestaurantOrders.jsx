import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/order/restaurant-orders', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch restaurant orders:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/order/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update state with new orderStatus from response
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: res.data.order.orderStatus } : order
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading)
    return <p className="text-center text-gray-700 dark:text-gray-200">Loading orders...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">📦 Restaurant Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border p-4 rounded mb-4 bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-gray-100"
          >
            {/* User Info */}
            <p><strong>User:</strong> {order.user.name} </p>
            <p><strong>Phone:</strong> {order.user.phone || '-'}</p>
            <p><strong>Email:</strong> {order.user.email}</p>

            {/* Delivery Boy Info */}
            <p><strong>Delivery Boy:</strong> {order.deliveryBoy?.name || 'Not Assigned'}</p>
            <p><strong>Delivery Boy Phone:</strong> {order.deliveryBoy?.phone || '-'}</p>

            {/* Order Info */}
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Total:</strong> ₹{order.totalPrice}</p>
            <p><strong>Payment:</strong> {order.paymentMethod}</p>
            <p><strong>Address:</strong> {order.shippingAddress}</p>

            {/* Status Select */}
            <div className="mt-2">
              <strong>Status:</strong>{' '}
              <select
                value={order.orderStatus} // backend field name
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="border px-2 py-1 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="Out for delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            {/* Items List */}
            <p className="mt-2"><strong>Items:</strong></p>
            <ul className="list-disc ml-6">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.food?.name || 'Item'} × {item.quantity} — ₹{item.food?.price || 'N/A'}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default RestaurantOrders;
