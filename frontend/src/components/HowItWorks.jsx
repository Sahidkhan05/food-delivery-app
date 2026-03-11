import { memo } from "react";

const steps = [
  {
    title: "Choose Your Favorite Food",
    description:
      "Browse through a wide variety of dishes and pick what you love.",
    icon: "🍔",
  },
  {
    title: "Place Your Order",
    description:
      "Easily place your order and pay online or on delivery.",
    icon: "🛒",
  },
  {
    title: "Get It Delivered",
    description:
      "Sit back and relax while your food is delivered to your doorstep.",
    icon: "🚚",
  },
];

const HowItWorks = () => {
  return (
    <section className="pt-16 pb-16 bg-[#F9FAFB] dark:bg-gray-900 transition-colors">

      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-bold text-[#111827] dark:text-white mb-12">
          🚀 How It Works
        </h2>

        <div className="grid gap-10 md:grid-cols-3">

          {steps.map((step, index) => (

            <div
              key={step.title}
              className="group relative bg-white dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700 
              rounded-3xl p-8 
              shadow-md hover:shadow-[0_15px_35px_rgba(99,102,241,0.25)] 
              transition duration-300 
              hover:-translate-y-3"
            >

              {/* Step Number */}

              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2
                bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]
                text-white w-10 h-10 flex items-center justify-center
                rounded-full font-bold shadow-lg"
              >
                {index + 1}
              </div>

              {/* Icon */}

              <div
                className="text-5xl mb-5 
                group-hover:scale-125 
                transition duration-300"
              >
                {step.icon}
              </div>

              {/* Title */}

              <h3 className="text-lg font-semibold mb-3 text-[#111827] dark:text-white">
                {step.title}
              </h3>

              {/* Description */}

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default memo(HowItWorks);