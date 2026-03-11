import React from "react";
import FeaturedRestaurants from "../components/FeaturedRestaurants";
import Footer from "../components/Footer";

const Restaurants = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-950 transition-colors">

      {/* Page Header */}

      <div className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] py-16 text-center text-white">

        <h1 className="text-4xl md:text-5xl font-bold mb-4">

          🍽️ Discover Restaurants

        </h1>

        <p className="text-lg opacity-90 max-w-xl mx-auto">

          Explore top-rated restaurants near you and order your favorite meals.

        </p>

      </div>

      {/* Restaurants List */}

      <div className="pt-12">

        <FeaturedRestaurants />

      </div>

      <Footer />

    </div>
  );
};

export default Restaurants;