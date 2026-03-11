import React from "react";

const testimonials = [
  {
    name: "Aman Verma",
    message: "Foodie is amazing! Delivery is always on time and food is fresh.",
    location: "Jaipur, Rajasthan",
  },
  {
    name: "Priya Sharma",
    message:
      "I love the interface. So smooth and easy to order my favorite meals!",
    location: "Delhi",
  },
  {
    name: "Rahul Singh",
    message: "Best food delivery app! Highly recommend it to everyone.",
    location: "Mumbai, Maharashtra",
  },
];

const Testimonial = () => {
  return (
    <section className="pt-10 pb-20 bg-[#F9FAFB] dark:bg-gray-950 transition-colors">

      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-bold mb-14 text-[#111827] dark:text-white">
          💬 What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {testimonials.map((item, index) => (

            <div
              key={index}
              className="relative bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-800
              p-8 rounded-3xl
              shadow-md hover:shadow-[0_20px_40px_rgba(99,102,241,0.25)]
              transition duration-300 hover:-translate-y-2"
            >

              {/* Quote Symbol */}

              <div
                className="absolute -top-6 left-6 text-6xl
                text-[#6366F1] opacity-20"
              >
                “
              </div>

              {/* Message */}

              <p className="text-gray-600 dark:text-gray-300 italic mb-6 relative z-10 leading-relaxed">
                {item.message}
              </p>

              {/* User Info */}

              <div className="mt-6">

                <h4 className="font-semibold text-lg text-[#111827] dark:text-white">
                  {item.name}
                </h4>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.location}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default Testimonial;