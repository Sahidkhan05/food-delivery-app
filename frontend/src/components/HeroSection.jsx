import { useNavigate } from "react-router-dom";
import { memo } from "react";

const HeroSection = () => {

  const navigate = useNavigate();

  const handleOrderClick = () => {

    const token = localStorage.getItem("token");

    if (!token) {

      navigate("/login");

    } else {

      navigate("/restaurant");

    }

  };

  return (

    <section className="min-h-[90vh] flex items-center bg-[#F9FAFB] dark:bg-gray-950 transition-colors">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">

        {/* LEFT */}

        <div className="space-y-7">

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#111827] dark:text-white">

            Delicious Food

            <span className="block bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
              Delivered Fast
            </span>

          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg">

            Order your favorite meals from top restaurants near you.
            Fast delivery, fresh food and amazing taste at your doorstep.

          </p>

          <button
            onClick={handleOrderClick}
            className="px-9 py-4 rounded-full text-white font-semibold text-lg
            bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
            hover:scale-105
            hover:shadow-[0_15px_35px_rgba(99,102,241,0.5)]
            transition duration-300"
          >

            🚀 Order Now

          </button>

        </div>

        {/* RIGHT IMAGE */}

        <div className="flex justify-center">

          <img
            loading="lazy"
            decoding="async"
            src="/hero-food.jpg"
            alt="Food Delivery"
            className="w-[440px] rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.25)]
            hover:scale-105 transition duration-500"
          />

        </div>

      </div>

    </section>

  );

};

export default memo(HeroSection);