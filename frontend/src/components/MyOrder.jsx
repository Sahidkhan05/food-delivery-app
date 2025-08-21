import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/order/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center text-black dark:text-white">Loading orders...</p>;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">My Orders</h2>
      
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg shadow bg-white dark:bg-gray-800 p-4 transition-colors"
            >
              <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Restaurant:</strong> {order.restaurant?.name || "N/A"}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex border rounded p-3 items-center shadow-sm bg-gray-50 dark:bg-gray-700 transition-colors"
                  >
                    <img
                      src={
                        item.food?.image
                          ? `http://localhost:5000/uploads/${item.food.image}`
                          : '/images/no-preview.png'
                      }
                      alt={item.food?.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => { e.target.src = '/images/no-preview.png'; }}
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-black dark:text-white">{item.food?.name || "Item"}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Price: ₹{item.food?.price || 0}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total: ₹{(item.food?.price || 0) * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
                <p><strong>Status:</strong> <span className="text-blue-600 dark:text-blue-400 font-semibold">{order.orderStatus}</span></p>
                <p><strong>Payment:</strong> {order.paymentMethod}</p>
                <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrder;
