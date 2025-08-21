import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; 
import { useParams } from "react-router-dom";

const FoodFeatured = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const { restaurantId } = useParams();

  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart(); // 🟢 Use context functions

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/food/getall");
         console.log("📦 Foods from backend:", response.data.foods);
        setFoods(response.data.foods);
      } catch (err) {
        console.error("Error fetching foods:", err);
        setError("Failed to load foods.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const handleAddToCart = (food) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // 🟢 Add to cart via context
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

  if (loading) {
    return <p className="text-center text-gray-600">Loading foods...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Featured Foods</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div
            key={food._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={
                food.image
                  ? `http://localhost:5000/uploads/${food.image}`
                  : "/images/no-preview.png"
              }
              alt={food.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = "/images/no-preview.png";
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
              <p className="text-sm text-gray-500">Restaurant: {food.restaurant?.restaurantName || "Unknown"}</p>
              <p className="text-gray-600 mt-1">Price: ₹{food.price}</p>
              <p className="text-sm text-gray-500">In Cart: {getQuantityInCart(food._id)}</p>
              <button
                onClick={() => handleAddToCart(food)}
                className="mt-3 bg-orange-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodFeatured;
