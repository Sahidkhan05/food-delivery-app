import React from 'react';

const testimonials = [
  {
    name: "Aman Verma",
    message: "Foodie is amazing! Delivery is always on time and food is fresh.",
    location: "Jaipur, Rajasthan",
  },
  {
    name: "Priya Sharma",
    message: "I love the interface. So smooth and easy to order my favorite meals!",
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
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10 text-black dark:text-white">
          What Our Customers Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-orange-300 dark:bg-orange-600 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              <p className="text-black dark:text-white italic mb-4">“{item.message}”</p>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</h4>
              <p className="text-sm text-gray-900 dark:text-gray-200">{item.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
