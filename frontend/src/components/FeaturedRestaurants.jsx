import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Search from "./Search";
import { Star } from "lucide-react";

const FeaturedRestaurants = () => {

  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {

    const fetchRestaurants = async () => {

      try {

        const res = await axios.get(
          `http://localhost:5000/api/restaurant?page=${page}`
        );

        setRestaurants(res.data.restaurants || []);
        setTotalPages(res.data.totalPages || 1);

      } catch (error) {

        console.error("Error fetching restaurants:", error);

      }

    };

    fetchRestaurants();

  }, [page]);

  const handleOrderClick = (restaurantId) => {

    const token = localStorage.getItem("token");

    if (!token) {

      navigate("/login");

    } else {

      navigate(`/restaurant/${restaurantId}`);

    }

  };

  // Performance optimization
  const filteredRestaurants = useMemo(() => {

    return restaurants.filter((rest) =>
      rest.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  }, [restaurants, searchQuery]);

  return (

    <section className="pt-10 pb-20
    bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF]
    dark:from-gray-900 dark:to-gray-800
    transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold mb-10 text-center
        bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
        bg-clip-text text-transparent">

          🍽 Featured Restaurants

        </h2>

        <div className="mb-10">
          <Search
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Restaurant Cards */}

        <div className="grid gap-10 md:grid-cols-3">

          {filteredRestaurants.map((rest) => (

            <div
              key={rest._id}
              className="group
              bg-white/90 dark:bg-gray-900/90
              backdrop-blur-lg
              rounded-3xl overflow-hidden
              shadow-lg hover:shadow-[0_20px_40px_rgba(99,102,241,0.25)]
              transition duration-300 hover:-translate-y-2"
            >

              {/* Image */}

              <div className="relative overflow-hidden">

                <img
                  loading="lazy"
                  src={
                    rest.image
                      ? `http://localhost:5000/uploads/${rest.image}`
                      : "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                  }
                  alt={rest.owner?.name}
                  className="w-full h-48 object-cover
                  group-hover:scale-110 transition duration-500"
                />

                {/* Rating */}

                <div className="absolute top-3 right-3
                flex items-center gap-1
                bg-white dark:bg-gray-800
                px-3 py-1 rounded-full shadow">

                  <Star size={16} className="text-yellow-500 fill-yellow-500" />

                  <span className="text-sm font-semibold
                  text-gray-900 dark:text-gray-100">

                    {rest.rating || "4.5"}

                  </span>

                </div>

              </div>

              <div className="p-6">

                <h3 className="text-xl font-semibold mb-1
                text-gray-900 dark:text-white">

                  {rest.owner?.name}

                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm">

                  {rest.cuisineType?.join(", ") || "Multi Cuisine"}

                </p>

                <button
                  onClick={() =>
                    handleOrderClick(rest.owner?._id || rest._id)
                  }
                  className="mt-6 w-full py-3 rounded-full
                  bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                  text-white font-semibold
                  hover:scale-105
                  hover:shadow-[0_10px_25px_rgba(99,102,241,0.5)]
                  transition duration-300"
                >
                  🚀 Order Now
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* Pagination */}

        <div className="flex justify-center items-center gap-6 mt-14">

          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-5 py-2 rounded-lg
            bg-gray-300 dark:bg-gray-700
            text-gray-900 dark:text-white
            hover:bg-gray-400 dark:hover:bg-gray-600
            transition"
          >
            Prev
          </button>

          <span className="font-semibold
          text-gray-800 dark:text-gray-200">

            Page {page} of {totalPages}

          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-5 py-2 rounded-lg
            bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
            text-white hover:scale-105 transition"
          >
            Next
          </button>

        </div>

      </div>

    </section>

  );

};

export default FeaturedRestaurants;