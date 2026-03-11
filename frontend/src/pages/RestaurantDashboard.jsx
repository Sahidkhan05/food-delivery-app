import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantSidebar from "../components/RestaurantSidebar";
import AddFoodList from "../components/AddFoodList";
import RestaurantOrders from "../components/RestaurantOrders";
import axios from "axios";

/* ================= DASHBOARD STATS ================= */

const statsData = [
  { title: "Today's Orders", value: 24 },
  { title: "Today's Revenue", value: "₹12,450" },
  { title: "Total Menu Items", value: 18 },
  { title: "Top Selling Food", value: "Chicken Burger" }
];

const recentOrders = [
  { id: "ORD1023", item: "Chicken Burger", price: "₹250", status: "Delivered" },
  { id: "ORD1024", item: "Veg Pizza", price: "₹320", status: "Preparing" },
  { id: "ORD1025", item: "Paneer Roll", price: "₹180", status: "Pending" }
];

const RestaurantDashboard = () => {

  const [activeTab, setActiveTab] = useState("Profile");
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/restaurant/profile",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const restaurant = res.data.restaurant;

      setUser(restaurant);

      setFormData({
        name: restaurant.restaurantName || "",
        phone: restaurant.owner?.phone || "",
        address: restaurant.address?.street || ""
      });

      localStorage.setItem("user", JSON.stringify(restaurant));

    } catch (err) {
      console.error("Profile load failed", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {

    if (activeTab === "Logout") {

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");

    }

  }, [activeTab, navigate]);

  const handleInputChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleUpdateProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/restaurant/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data.restaurant);

      localStorage.setItem("user", JSON.stringify(res.data.restaurant));

      setIsEditing(false);

      alert("Profile updated successfully");

    } catch {

      alert("Profile update failed");

    }

  };

  const handleFetchLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {

        const { latitude, longitude } = pos.coords;

        try {

          const token = localStorage.getItem("token");

          const res = await axios.put(
            "http://localhost:5000/api/restaurant/location",
            { latitude, longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setUser(res.data.restaurant);

          localStorage.setItem("user", JSON.stringify(res.data.restaurant));

          alert("Location updated");

        } catch {

          alert("Location update failed");

        }

      }
    );

  };

  const renderContent = () => {

    switch (activeTab) {

      case "Profile":

        const address = user.address
          ? `${user.address.street || ""}, ${user.address.city || ""}, ${user.address.state || ""}`
          : "Not provided";

        const cuisine = Array.isArray(user.cuisineType)
          ? user.cuisineType.join(", ")
          : user.cuisineType || "Not specified";

        return (

          <div className="max-w-6xl mx-auto">

            {/* ================= STATS ================= */}

            <div className="grid md:grid-cols-4 gap-6 mb-10">

              {statsData.map((stat, index) => (

                <div
                  key={index}
                  className="bg-white/90 dark:bg-gray-900/90
                  backdrop-blur-lg
                  border dark:border-gray-700
                  shadow-lg rounded-2xl p-6"
                >

                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {stat.title}
                  </p>

                  <p className="text-3xl font-bold mt-2 text-[#6366F1]">
                    {stat.value}
                  </p>

                </div>

              ))}

            </div>

            {/* ================= QUICK ACTIONS ================= */}

            <div className="grid md:grid-cols-4 gap-6 mb-10">

              <button
                onClick={() => setActiveTab("Add Food")}
                className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                text-white p-5 rounded-xl shadow-lg hover:scale-105 transition"
              >
                ➕ Add New Food
              </button>

              <button
                onClick={() => setActiveTab("Orders")}
                className="bg-indigo-500 text-white p-5 rounded-xl shadow-lg hover:scale-105 transition"
              >
                📦 View Orders
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                text-white p-5 rounded-xl shadow-lg hover:scale-105 transition"
              >
                ✏ Edit Profile
              </button>

              <button
    onClick={handleFetchLocation}
    className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                text-white p-5 rounded-xl shadow-lg hover:scale-105 transition"
  >
    ➤ Update Location
  </button>

            </div>

            {/* ================= PROFILE CARD ================= */}

            <div className="bg-white/90 dark:bg-gray-900/90
            backdrop-blur-lg
            shadow-xl rounded-2xl p-8
            border dark:border-gray-700">

              <div className="flex items-center gap-6 mb-8">

                <img
                  src={
                    user.image
                      ? `http://localhost:5000/uploads/${user.image}`
                      : "https://via.placeholder.com/120"
                  }
                  className="w-28 h-28 rounded-xl object-cover border"
                  alt="Restaurant"
                />

                <div>

                  <h2 className="text-3xl font-bold
                  bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                  bg-clip-text text-transparent">
                    {user.restaurantName}
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400">
                    {user.owner?.email}
                  </p>

                  <p className="text-gray-500 dark:text-gray-400">
                    📞 {user.owner?.phone}
                  </p>

                </div>

              </div>

              {/* EXISTING PROFILE UI (UNCHANGED) */}

              {isEditing ? (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="p-3 border rounded-lg"
                    placeholder="Restaurant Name"
                  />

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="p-3 border rounded-lg"
                    placeholder="Phone"
                  />

                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="p-3 border rounded-lg col-span-2"
                    placeholder="Address"
                  />

                  <button
                    onClick={handleUpdateProfile}
                    className="bg-indigo-600 text-white py-3 rounded-lg"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white py-3 rounded-lg"
                  >
                    Cancel
                  </button>

                </div>

              ) : null}

            </div>

            {/* ================= RECENT ORDERS ================= */}

            <div className="mt-10">

              <h3 className="text-xl font-semibold mb-4">
                Recent Orders
              </h3>

              <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6">

                {recentOrders.map(order => (

                  <div
                    key={order.id}
                    className="flex justify-between border-b py-3"
                  >

                    <span>{order.id}</span>
                    <span>{order.item}</span>
                    <span>{order.price}</span>
                    <span className="text-indigo-500">{order.status}</span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        );

      case "Orders":
        return <RestaurantOrders />;

      case "Add Food":
        return <AddFoodList />;

      default:
        return null;

    }

  };

  return (

    <div className="bg-gradient-to-br
    from-[#EEF2FF] to-[#F5F3FF]
    dark:from-gray-900 dark:to-gray-800
    min-h-screen transition-colors">

      <RestaurantSidebar
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />

      <div className="ml-64 p-8">
        {renderContent()}
      </div>

    </div>

  );

};

export default RestaurantDashboard;