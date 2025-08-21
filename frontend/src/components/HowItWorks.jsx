const HowItWorks = () => {
  const steps = [
    {
      title: "Choose Your Favorite Food",
      description: "Browse through a wide variety of dishes and pick what you love.",
      icon: "🍔",
    },
    {
      title: "Place Your Order",
      description: "Easily place your order and pay online or on delivery.",
      icon: "🛒",
    },
    {
      title: "Get It Delivered",
      description: "Sit back and relax while your food is delivered to your doorstep.",
      icon: "🚚",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900 text-center transition-colors">
      <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-10">
        How It Works
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-orange-300 dark:bg-orange-600 rounded-lg shadow-md p-6 transition hover:shadow-lg"
          >
            <div className="text-5xl mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">{step.title}</h3>
            <p className="text-black dark:text-gray-200">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
