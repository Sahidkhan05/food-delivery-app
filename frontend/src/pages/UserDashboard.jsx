import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserSidebar from "../components/UserSidebar";
import MyOrder from "../components/MyOrder";
import FeaturedRestaurants from "../components/FeaturedRestaurants";
import OrderTracking from "./OrderTracking";

const UserDashboard = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Order Now");

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
    addresses: [],
    currentLocation: null
  });

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: ""
  });

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setUser(res.data);

        setFormData({
          name: res.data.name || "",
          phone: res.data.phone || "",
          street: res.data.addresses?.[0]?.street || "",
          city: res.data.addresses?.[0]?.city || "",
          pincode: res.data.addresses?.[0]?.pincode || ""
        });

      } catch (err) {
        console.log(err);
      }

    };

    fetchProfile();

  }, []);

  useEffect(() => {

    if (activeTab === "Logout") {
      localStorage.clear();
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
        {
          name: formData.name,
          phone: formData.phone,
          address: {
            type: "Home",
            street: formData.street,
            city: formData.city,
            pincode: formData.pincode
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser(res.data.user);

      setFormData({
        name: res.data.user.name || "",
        phone: res.data.user.phone || "",
        street: res.data.user.addresses?.[0]?.street || "",
        city: res.data.user.addresses?.[0]?.city || "",
        pincode: res.data.user.addresses?.[0]?.pincode || ""
      });

      setIsEditing(false);

      alert("Profile updated successfully");

    } catch {
      alert("Update failed");
    }

  };

  const handleImageUpload = async (e) => {

    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("token");

    try {

      const res = await axios.put(
        "http://localhost:5000/api/auth/profile-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setUser(res.data.user);

      alert("Profile image updated");

    } catch {
      alert("Upload failed");
    }

  };

  const handleFetchLocation = () => {

    if (!navigator.geolocation) {
      return alert("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {

      const { latitude, longitude } = pos.coords;

      try {

        const token = localStorage.getItem("token");

        const res = await axios.put(
          "http://localhost:5000/api/auth/location",
          {
            coordinates: [longitude, latitude]
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setUser(res.data.user);

        alert("Location updated");

      } catch {
        alert("Location update failed");
      }

    });

  };

  const renderContent = () => {

    switch (activeTab) {

      case "Profile":

        return (

          <div className="max-w-4xl mx-auto
          bg-white/90 dark:bg-gray-900/90
          text-gray-900 dark:text-gray-100
          backdrop-blur-lg rounded-2xl shadow-xl p-8
          transition-colors duration-300">

            <h2 className="text-3xl font-bold mb-6
            bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
            bg-clip-text text-transparent">
              Welcome, {user.name}
            </h2>

            <div className="flex items-center gap-6 mb-8">

              <img
                src={
                  user.profileImage
                    ? `http://localhost:5000/uploads/${user.profileImage}`
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                className="w-24 h-24 rounded-full object-cover border"
              />

              <label className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
              text-white px-4 py-2 rounded cursor-pointer hover:scale-105 transition">

                Upload Photo

                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                />

              </label>

            </div>

            {isEditing ? (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border p-3 rounded-lg dark:bg-gray-800"
                  placeholder="Name"
                />

                <input
                  value={user.email}
                  disabled
                  className="border p-3 rounded-lg bg-gray-200 dark:bg-gray-700"
                />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border p-3 rounded-lg dark:bg-gray-800"
                  placeholder="Phone"
                />

                <input
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="border p-3 rounded-lg dark:bg-gray-800"
                  placeholder="Street"
                />

                <input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="border p-3 rounded-lg dark:bg-gray-800"
                  placeholder="City"
                />

                <input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="border p-3 rounded-lg dark:bg-gray-800"
                  placeholder="Pincode"
                />

                <div className="flex gap-3">

                  <button
                    onClick={handleUpdateProfile}
                    className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                    text-white px-6 py-2 rounded-lg hover:scale-105 transition"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            ) : (

              <>

                <div className="grid grid-cols-2 gap-6">

                  <div className="bg-indigo-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p>Name</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>

                  <div className="bg-indigo-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p>Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>

                  <div className="bg-indigo-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p>Phone</p>
                    <p className="font-semibold">{user.phone}</p>
                  </div>

                  <div className="bg-indigo-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p>Address</p>
                    <p className="font-semibold">
                      {user.addresses?.length
                        ? `${user.addresses[0].street}, ${user.addresses[0].city} - ${user.addresses[0].pincode}`
                        : "Not Set"}
                    </p>
                  </div>

                </div>

                <div className="mt-6 flex gap-4">

                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                    text-white px-6 py-2 rounded-lg hover:scale-105 transition"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={handleFetchLocation}
                    className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                    text-white px-6 py-2 rounded-lg hover:scale-105 transition"
                  >
                    Update Location
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

      case "Track Orders":
        return <OrderTracking />;

      default:
        return null;

    }

  };

  return (

    <div className="flex min-h-screen
    bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF]
    dark:from-gray-900 dark:to-gray-800
    transition-colors duration-300">

      <UserSidebar activeTab={activeTab} onTabClick={setActiveTab} />

      <div className="flex-1 ml-64 p-8">

        {renderContent()}

      </div>

    </div>

  );

};

export default UserDashboard;