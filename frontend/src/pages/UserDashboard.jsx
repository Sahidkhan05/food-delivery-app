import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserSidebar from "../components/UserSidebar";
import Footer from "../components/Footer";
import MyOrder from "../components/MyOrder";
import FeaturedRestaurants from "../components/FeaturedRestaurants";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    currentLocation: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({ name: storedUser.name || "",
       phone: storedUser.phone || "" 
       });
    }
  }, []);

  useEffect(() => {
    if (activeTab === "Logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [activeTab, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleUpdateProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "http://localhost:5000/api/auth/profile",
      { name: formData.name, phone: formData.phone }, // ✅ formData.phone use karo
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUser(res.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setIsEditing(false);
    alert("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Error updating profile: " + (err.response?.data?.error || err.message));
  }
};

  const handleFetchLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const token = localStorage.getItem("token");
          const res = await axios.put(
            "http://localhost:5000/api/auth/location",
            {
              currentLocation: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          alert("📍 Location updated successfully!");
        } catch (err) {
          console.error(err);
          alert(
            "Failed to update location: " +
              (err.response?.data?.error || err.message)
          );
        }
      },
      (err) => {
        console.error(err);
        alert("Could not fetch location");
      }
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-gray-900 dark:text-gray-100">
            <h2 className="text-2xl font-bold mb-4">👤 Welcome {user.name}</h2>
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-300">Name</p>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300">Email</p>
                  <input
                    value={user.email || ""}
                    disabled
                    className="border p-2 w-full rounded bg-gray-200 dark:bg-gray-600 cursor-not-allowed text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300">Mobile</p>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
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
                    <p className="text-gray-600 dark:text-gray-300">Mobile</p>
                    <p className="font-semibold">
                      {user.phone || "Not Provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Current Location
                    </p>
                    <p className="font-semibold">
                      {user.currentLocation?.coordinates
                        ? `Lat: ${user.currentLocation.coordinates[1]}, Lng: ${user.currentLocation.coordinates[0]}`
                        : "Not Set"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleFetchLocation}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    📍 Update Location
                  </button>
                </div>
              </>
            )}
          </div>
        );
      case "Order Now":
        return <FeaturedRestaurants />;
      case "My Orders":
        return <MyOrder />;
      case "Favorites":
        return (
          <div className="text-black dark:text-white">
            ❤️ Your Favorite Items.
          </div>
        );
      case "Settings":
        return (
          <div className="text-black dark:text-white">
            ⚙️ Your Settings here.
          </div>
        );
      case "Logout":
        return (
          <div className="text-black dark:text-white">🔒 Logging out...</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-500 transition-colors">
      <div className="flex flex-1">
        <UserSidebar activeTab={activeTab} onTabClick={setActiveTab} />
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
