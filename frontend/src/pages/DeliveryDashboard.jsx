import React, { useState, useEffect } from "react";
import DeliverySidebar from "../components/DeliverySidebar";
import axios from "axios";
import OrderAssigned from "../components/OrderAssigned";
import OrderHistory from "../components/OrderHistory";
import DeliveryEarnings from "../components/DeliveryEarnings";

const DeliveryDashboard = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [statusToggle, setStatusToggle] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleType: "",
    vehicleNumber: "",
  });

  // Fetch delivery boy profile from backend
  const fetchProfile = () => {
    axios
      .get("http://localhost:5000/api/deliveryboy/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setUser(res.data);
        setFormData({
          name: res.data.name || "",
          phone: res.data.phone || "",
          vehicleType: res.data.vehicleType || "",
          vehicleNumber: res.data.vehicleNumber || "",
        });

        // Set toggle based on status (approved = active)
        setStatusToggle(res.data.status === "approved");
      })
      .catch((err) => console.error(err));
  };

  // Fetch assigned orders
  const fetchOrders = () => {
    axios
      .get("http://localhost:5000/api/delivery/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  };

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === "Profile") {
      fetchProfile();
    } else if (activeTab === "Orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = () => {
    axios
      .put("http://localhost:5000/api/deliveryboy/profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setUser(res.data.user);
        setIsEditing(false);
      })
      .catch((err) => console.error(err));
  };

  // Toggle status handler
  const handleStatusToggle = () => {
    const newStatus = !statusToggle; // toggle status
    setStatusToggle(newStatus);

    axios
      .put(
        "http://localhost:5000/api/deliveryboy/profile",
        { isActive: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error(err);
        // revert toggle in case of error
        setStatusToggle(!newStatus);
      });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-gray-900 dark:text-gray-100">
            <h2 className="text-2xl font-bold mb-4">👤 Welcome {user.name}</h2>

            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Name"
                />
                <input
                  value={user.email || ""}
                  disabled
                  className="border p-2 w-full rounded bg-gray-200 dark:bg-gray-600 dark:text-gray-100 cursor-not-allowed"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Phone"
                />
                <input
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Vehicle Type"
                />
                <input
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Vehicle Number"
                />
                <div className="col-span-2 flex gap-2">
                  <button
                    onClick={handleUpdateProfile}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Name</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Phone</p>
                    <p className="font-semibold">
                      {user.phone || "Not Provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Vehicle Type</p>
                    <p className="font-semibold">
                      {user.vehicleType || "Not Provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Vehicle Number</p>
                    <p className="font-semibold">
                      {user.vehicleNumber || "Not Provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Total Deliveries</p>
                    <p className="font-semibold">{user.totalDeliveries || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Total Earnings</p>
                    <p className="font-semibold">₹{user.totalEarnings || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Joining Date</p>
                    <p className="font-semibold">{user.joiningDate || "N/A"}</p>
                  </div>

                  {/* Status toggle button */}
                  <div className="flex items-center space-x-4 mt-4">
                    <p className="text-gray-600 dark:text-gray-300 font-semibold">Status:</p>
                    <button
                      onClick={handleStatusToggle}
                      className={`px-4 py-1 rounded font-semibold ${
                        statusToggle
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {statusToggle ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        );

      case "Orders":
        return (
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-gray-900 dark:text-gray-100">
            <h2 className="text-xl font-semibold mb-4"></h2>
            <OrderAssigned orders={orders} />
          </div>
        );

        case "Order History":
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-gray-900 dark:text-gray-100">
      <OrderHistory/>
    </div>
  );

  case "Earnings":
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-gray-900 dark:text-gray-100">
      <DeliveryEarnings/>
    </div>
  );



      case "Logout":
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return null;

      default:
        return <div>No content available</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-500">
      <DeliverySidebar activeTab={activeTab} onTabClick={setActiveTab} />
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default DeliveryDashboard;
