import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantSidebar from '../components/RestaurantSidebar';
import Footer from '../components/Footer';
import AddFoodList from '../components/AddFoodList';
import RestaurantOrders from '../components/RestaurantOrders';
import axios from 'axios';

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentLocation: { coordinates: [0, 0] },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser({
        ...storedUser,
        currentLocation: storedUser.currentLocation || { coordinates: [0, 0] },
      });
      setFormData({
        name: storedUser.name || '',
        phone: storedUser.phone || '',
        address: storedUser.address || '',
      });
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'Logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [activeTab, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5000/api/restaurant/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...res.data.restaurant });
      localStorage.setItem('user', JSON.stringify(res.data.restaurant));
      setIsEditing(false);
      alert('✅ Profile updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  const handleFetchLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.put(
          'http://localhost:5000/api/restaurant/location',
          { latitude, longitude },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser({ ...res.data.restaurant });
        localStorage.setItem('user', JSON.stringify(res.data.restaurant));
        alert('📍 Location updated successfully!');
      } catch (err) {
        console.error(err);
        alert('Failed to update location');
      }
    }, (err) => {
      console.error(err);
      alert('Could not fetch location');
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Profile':
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
                    value={user.email || ''} 
                    disabled 
                    className="border p-2 w-full rounded bg-gray-200 dark:bg-gray-600 cursor-not-allowed text-gray-900 dark:text-gray-100" 
                  />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300">Address</p>
                  <input 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    className="border p-2 w-full rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                  />
                </div>
                <div className="col-span-2 flex gap-2">
                  <button onClick={handleUpdateProfile} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
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
                    <p className="text-gray-600 dark:text-gray-300">Address</p>
                    <p className="font-semibold">{user.address || 'Not Provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Current Location</p>
                    <p className="font-semibold">
                      {user.currentLocation?.coordinates
                        ? `Lat: ${user.currentLocation.coordinates[1]}, Lng: ${user.currentLocation.coordinates[0]}`
                        : 'Not Set'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
                  <button onClick={handleFetchLocation} className="bg-green-500 text-white px-4 py-2 rounded">📍 Update Location</button>
                </div>
              </>
            )}
          </div>
        );
      case 'Orders':
        return <RestaurantOrders />;
      case 'Add Food':
        return <AddFoodList />;
      case 'Logout':
        return <div>🔒 Logging out...</div>;
      default:
        return <div>No content available</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-500">
      <div className="flex flex-1">
        <RestaurantSidebar activeTab={activeTab} onTabClick={setActiveTab} />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100"></h1>
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RestaurantDashboard;
