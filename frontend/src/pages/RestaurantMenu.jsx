import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/food/restaurant/${restaurantId}`);
        setFoods(res.data.foods);
      } catch (err) {
        console.error("Error fetching restaurant foods:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [restaurantId]);

  const handleAddToCart = (food) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    addToCart({
      _id: food._id,
      name: food.name,
      price: food.price,
      image: food.image,
    });

    navigate("/cart");
  };

  const getQuantityInCart = (foodId) => {
    const item = cartItems.find((item) => item._id === foodId);
    return item?.quantity || 0;
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-600 min-h-screen transition-colors">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Restaurant Menu</h1>

      {loading ? (
        <p className="text-black dark:text-white">Loading...</p>
      ) : foods.length === 0 ? (
        <p className="text-black dark:text-white">No foods found for this restaurant.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition"
            >
              <img
                src={`http://localhost:5000/uploads/${food.image}`}
                alt={food.name}
                className="h-40 w-full object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold text-black dark:text-white">{food.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-1">₹{food.price}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Cart: {getQuantityInCart(food._id)}</p>
              <button
                onClick={() => handleAddToCart(food)}
                className="mt-2 bg-orange-500 dark:bg-orange-600 text-white rounded px-4 py-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
