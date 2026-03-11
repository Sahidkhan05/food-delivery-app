import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const RestaurantMenu = () => {

  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedSize, setSelectedSize] = useState({});

  const { addToCart, cartItems } = useCart();

  useEffect(() => {

    const fetchFoods = async () => {

      try {

        const res = await axios.get(
          `http://localhost:5000/api/food/restaurant/${restaurantId}`
        );

        setFoods(res.data.foods || []);

      } catch (err) {

        console.error("Error fetching foods:", err);

      } finally {

        setLoading(false);

      }

    };

    if (restaurantId) fetchFoods();

  }, [restaurantId]);


  const filteredFoods = useMemo(() => {

    return foods.filter((food) =>
      food.name.toLowerCase().includes(search.toLowerCase())
    );

  }, [foods, search]);


  const handleSizeChange = (foodId, size) => {

    setSelectedSize((prev) => ({
      ...prev,
      [foodId]: size
    }));

  };


  const handleAddToCart = (food) => {

    if (!food.isAvailable) return;

    const token = localStorage.getItem("token");

    if (!token) {

      navigate("/login");
      return;

    }

    const size = selectedSize[food._id] || "full";

    const price =
      size === "half" ? food.halfPrice : food.fullPrice;

    addToCart({
      _id: food._id,
      name: food.name,
      price,
      size,
      image: food.image,
      quantity: 1
    });

  };


  return (

    <div
      className="min-h-screen py-10 px-6
      bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF]
      dark:from-gray-900 dark:to-gray-800"
    >

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">

          <button
            onClick={() => navigate(-1)}
            className="bg-white dark:bg-gray-800
            shadow px-4 py-2 rounded-lg"
          >
            ← Back
          </button>

          <h1
            className="text-3xl font-bold
            bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
            bg-clip-text text-transparent"
          >
            🍽 Restaurant Menu
          </h1>

        </div>


        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
          border px-4 py-3 rounded-xl mb-10 w-full
          dark:bg-gray-800 dark:border-gray-700
          dark:text-white
          focus:ring-2 focus:ring-[#6366F1]"
        />


        {/* FOOD LIST */}

        {loading ? (

          <p className="text-center">
            Loading foods...
          </p>

        ) : filteredFoods.length === 0 ? (

          <p className="text-center text-gray-500">
            No foods available
          </p>

        ) : (

          <div
            className="
            grid grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-8"
          >

            {filteredFoods.map((food) => (

              <div
                key={food._id}
                className="
                bg-white/90 dark:bg-gray-900
                border dark:border-gray-700
                backdrop-blur-lg
                rounded-2xl shadow-lg
                hover:shadow-2xl
                transition overflow-hidden"
              >

                {/* IMAGE */}

                <div className="relative">

                  <img
                    src={`http://localhost:5000/uploads/${food.image}`}
                    alt={food.name}
                    className="h-48 w-full object-cover"
                  />

                  <span
                    className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full font-semibold
                    ${
                      food.isAvailable
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {food.isAvailable ? "Available" : "Out of Stock"}
                  </span>

                </div>


                <div className="p-5">

                  <h3 className="text-lg font-semibold dark:text-gray-200">
                    {food.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {food.description}
                  </p>


                  <span className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {food.category}
                  </span>


                  <p className="text-xs text-gray-400 mt-2">
                    ⏱ {food.prepTime} min
                  </p>


                  {/* SIZE SELECT */}

                  <div className="mt-3 text-sm">

                    <label className="mr-4">

                      <input
                        type="radio"
                        name={`size-${food._id}`}
                        value="half"
                        onChange={() =>
                          handleSizeChange(food._id, "half")
                        }
                      />{" "}
                      Half ₹{food.halfPrice}

                    </label>

                    <label>

                      <input
                        type="radio"
                        name={`size-${food._id}`}
                        value="full"
                        defaultChecked
                        onChange={() =>
                          handleSizeChange(food._id, "full")
                        }
                      />{" "}
                      Full ₹{food.fullPrice}

                    </label>

                  </div>


                  {/* ADD BUTTON */}

                  <div className="flex justify-end mt-4">

                    <button
                      onClick={() => handleAddToCart(food)}
                      disabled={!food.isAvailable}
                      className={`
                      px-4 py-2 rounded-lg
                      text-white font-semibold
                      transition
                      ${
                        food.isAvailable
                          ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:scale-105"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {food.isAvailable ? "Add" : "Unavailable"}
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* CART BUTTON */}

      {cartItems.length > 0 && (

        <div className="fixed bottom-6 right-6">

          <button
            onClick={() => navigate("/cart")}
            className="
            px-6 py-3 rounded-full
            bg-gradient-to-r
            from-[#6366F1] to-[#8B5CF6]
            text-white font-semibold
            shadow-xl
            hover:scale-105 transition"
          >
            🛒 View Cart ({cartItems.length})
          </button>

        </div>

      )}

    </div>

  );

};

export default RestaurantMenu;