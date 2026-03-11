import React from "react";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import FeaturedRestaurants from "../components/FeaturedRestaurants";
import FoodCategories from "../components/FoodCategories";
import Footer from "../components/Footer";
import Testimonial from "../components/Testimonial";

const HomaPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 overflow-hidden">

      {/* Hero Section */}
      <section className="relative">
        <HeroSection />
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <HowItWorks />
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-gray-100 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <FeaturedRestaurants />
        </div>
      </section>

      {/* Food Categories */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <FoodCategories />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-gray-100 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <Testimonial />
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default HomaPage;