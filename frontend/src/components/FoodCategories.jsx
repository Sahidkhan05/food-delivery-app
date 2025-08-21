import React from 'react';

const categories = [
  { name: "Biryani", image: "/briyani.jpg" },
  { name: "Pizza", image: "/pizza.jpg" },
  { name: "Burger", image: "/burger.jpg" },
  { name: "Dessert", image: "/dessert.jpg" },
  { name: "Veg-Curry", image: "/vegcurry.jpg" },
];

const FoodCategories = () => {
  return (
    <div className="px-4 md:px-10 py-10 bg-gray-50 dark:bg-gray-900 transition-colors">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-black dark:text-white">
        Explore Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden hover:scale-105 transition transform"
          >
            <img src={category.image} alt={category.name} className="w-full h-32 object-cover" />
            <div className="p-2 text-center font-semibold text-black dark:text-white">
              {category.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodCategories;
