import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Search from './Search';

const FeaturedRestaurants = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/approved-restaurants"
        );
        setRestaurants(res.data);
      } catch (error) {
        console.error("Error fetching approved restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleOrderClick = (restaurantId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate(`/restaurant/${restaurantId}`);
    }
  };

  const filteredRestaurants = restaurants.filter((rest) =>
    rest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="px-4 py-10 bg-gray-200 dark:bg-gray-900 transition-colors">
      <h2 className="text-3xl font-bold mb-4 text-center text-black dark:text-white">
        Featured Restaurants
      </h2>

      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredRestaurants.map((rest) => (
          <div
            key={rest._id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <img
              src={`http://localhost:5000/uploads/${rest.image}`}
              alt={rest.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="text-xl font-semibold mt-2 text-black dark:text-white">{rest.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{rest.description}</p>
            <p className="text-yellow-500 font-bold mt-1">
              ⭐⭐⭐⭐ {rest.rating}
            </p>
            <button
              onClick={() => handleOrderClick(rest._id)}
              className="mt-3 px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded hover:bg-orange-600 dark:hover:bg-orange-700 transition"
            >
              Order Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
