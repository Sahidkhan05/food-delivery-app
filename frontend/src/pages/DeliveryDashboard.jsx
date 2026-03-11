import React, { useState, useEffect } from "react";
import DeliverySidebar from "../components/DeliverySidebar";
import axios from "axios";
import OrderAssigned from "../components/OrderAssigned";
import OrderHistory from "../components/OrderHistory";
import DeliveryEarnings from "../components/DeliveryEarnings";

const API = "http://localhost:5000/api/deliveryboy";

/* ================= INFO CARD ================= */

const InfoCard = ({ title, value }) => {
  return (
    <div
      className="bg-white/80 dark:bg-gray-900/80
      backdrop-blur-lg border dark:border-gray-700
      shadow-md rounded-2xl p-5
      hover:shadow-xl transition"
    >
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>

      <p className="text-xl font-semibold mt-1 text-[#6366F1]">
        {value}
      </p>
    </div>
  );
};

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

  const fetchProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);

      setFormData({
        name: res.data.user?.name || "",
        phone: res.data.user?.phone || "",
        vehicleType: res.data.vehicleType || "",
        vehicleNumber: res.data.vehicleNumber || "",
      });

      setStatusToggle(res.data.isActive);

    } catch (err) {

      console.error(err);

    }

  };

  const fetchOrders = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.assignedOrders || []);

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    if (activeTab === "Profile") fetchProfile();
    if (activeTab === "Orders") fetchOrders();

  }, [activeTab]);

  const handleInputChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleUpdateProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.put(`${API}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
      setIsEditing(false);

    } catch (err) {

      console.error(err);

    }

  };

  const handleStatusToggle = async () => {

    const newStatus = !statusToggle;
    setStatusToggle(newStatus);

    try {

      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API}/profile`,
        { isActive: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);

    } catch (err) {

      console.error(err);
      setStatusToggle(!newStatus);

    }

  };

  const renderContent = () => {

    switch (activeTab) {

      case "Profile":

        return (

          <div className="max-w-6xl mx-auto">

            {/* PROFILE HEADER */}

            <div
              className="bg-white/90 dark:bg-gray-900/90
              backdrop-blur-lg
              shadow-xl rounded-2xl p-8 mb-8 flex items-center gap-6
              border dark:border-gray-700"
            >

              <img
                src={
                  user?.user?.profileImage
                    ? `http://localhost:5000/uploads/${user.user.profileImage}`
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                className="w-24 h-24 rounded-full border object-cover"
              />

              <div>

                <h2 className="text-2xl font-bold dark:text-white">
                  {user?.user?.name || "Delivery Partner"}
                </h2>

                <p className="text-gray-500 dark:text-gray-400">
                  {user?.user?.email}
                </p>

                <p className="text-gray-400 text-sm">
                  Joined: {new Date(user?.joiningDate).toLocaleDateString()}
                </p>

              </div>

            </div>

            {isEditing ? (

              <div
                className="bg-white/90 dark:bg-gray-900/90
                p-6 rounded-2xl shadow
                border dark:border-gray-700
                grid grid-cols-1 md:grid-cols-2 gap-4"
              >

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border dark:border-gray-700
                  dark:bg-gray-800 p-3 rounded-lg"
                  placeholder="Name"
                />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border dark:border-gray-700
                  dark:bg-gray-800 p-3 rounded-lg"
                  placeholder="Phone"
                />

                <input
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="border dark:border-gray-700
                  dark:bg-gray-800 p-3 rounded-lg"
                  placeholder="Vehicle Type"
                />

                <input
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  className="border dark:border-gray-700
                  dark:bg-gray-800 p-3 rounded-lg"
                  placeholder="Vehicle Number"
                />

                <div className="col-span-2 flex gap-3">

                  <button
                    onClick={handleUpdateProfile}
                    className="bg-gradient-to-r
                    from-[#6366F1] to-[#8B5CF6]
                    text-white px-6 py-2 rounded-lg"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            ) : (

              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  <InfoCard title="Phone" value={user?.user?.phone || "N/A"} />
                  <InfoCard title="Vehicle Type" value={user?.vehicleType || "N/A"} />
                  <InfoCard title="Vehicle Number" value={user?.vehicleNumber || "N/A"} />
                  <InfoCard title="Total Deliveries" value={user?.totalDeliveries || 0} />
                  <InfoCard title="Total Earnings" value={`₹${user?.totalEarnings || 0}`} />
                  <InfoCard title="Status" value={statusToggle ? "Active" : "Inactive"} />

                </div>

                <div className="mt-6 flex gap-4">

                  <button
                    onClick={handleStatusToggle}
                    className={`px-6 py-2 rounded-lg text-white ${
                      statusToggle
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {statusToggle ? "Active" : "Inactive"}
                  </button>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r
                    from-[#6366F1] to-[#8B5CF6]
                    text-white px-6 py-2 rounded-lg"
                  >
                    Edit Profile
                  </button>

                </div>

              </>

            )}

          </div>

        );

      case "Orders":
        return <OrderAssigned orders={orders} />;

      case "Order History":
        return <OrderHistory />;

      case "Earnings":
        return <DeliveryEarnings />;

      case "Logout":
        localStorage.clear();
        window.location.href = "/login";
        return null;

      default:
        return null;

    }

  };

  return (

    <div className="flex min-h-screen
    bg-gradient-to-br
    from-[#EEF2FF] to-[#F5F3FF]
    dark:from-gray-900 dark:to-gray-800
    transition-colors duration-300">

      <DeliverySidebar
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />

      <main className="flex-1 ml-64 p-8">
        {renderContent()}
      </main>

    </div>

  );

};

export default DeliveryDashboard;