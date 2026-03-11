import React, { memo } from "react";

const categories = [
  { name: "Biryani", image: "/briyani.jpg" },
  { name: "Pizza", image: "/pizza.jpg" },
  { name: "Burger", image: "/burger.jpg" },
  { name: "Dessert", image: "/dessert.jpg" },
  { name: "Veg-Curry", image: "/vegcurry.jpg" },
];

const FoodCategories = () => {
  return (
    <section className="pt-10 pb-20 bg-[#F9FAFB] dark:bg-gray-900 transition-colors">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold mb-12 text-center text-[#111827] dark:text-white">
          🍴 Explore Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">

          {categories.map((category) => (

            <div
              key={category.name}
              className="group relative rounded-3xl overflow-hidden
              shadow-md hover:shadow-[0_20px_40px_rgba(99,102,241,0.25)]
              transition duration-300 cursor-pointer hover:-translate-y-2"
            >

              {/* Image */}

              <div className="overflow-hidden">

                <img
                  loading="lazy"
                  decoding="async"
                  src={category.image}
                  alt={category.name}
                  className="w-full h-40 object-cover
                  group-hover:scale-110 transition duration-500"
                />

              </div>

              {/* Hover Overlay */}

              <div
                className="absolute inset-0 bg-gradient-to-t 
                from-[#6366F1]/80 to-transparent
                opacity-0 group-hover:opacity-100 transition duration-300"
              ></div>

              {/* Hover Text */}

              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2
                text-white font-semibold text-lg
                opacity-0 group-hover:opacity-100
                transition duration-300"
              >
                {category.name}
              </div>

              {/* Default Name */}

              <div
                className="py-3 text-center font-semibold text-[#111827]
                bg-white dark:bg-gray-800 dark:text-white
                group-hover:opacity-0 transition duration-300"
              >
                {category.name}
              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default memo(FoodCategories);