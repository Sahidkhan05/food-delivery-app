import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      // Replace with your logic or a default restaurant route
      navigate('/restaurant');
    }
  };

  return (
    <section
  className="py-20 px-4 text-center relative overflow-hidden bg-cover bg-center"
  style={{
    backgroundImage: "url('/bg-herosection.jpg')",
  }}
>
  <div className="relative z-10 max-w-3xl mx-auto  p-6 rounded-xl">
    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
      Delicious Food, <span className="text-orange-500">Delivered Fast!</span>
    </h1>
    <p className="text-lg md:text-xl text-gray-600 mb-8">
      Order your favorite meals from top-rated restaurants near you.
    </p>
    <div className="flex justify-center">
      <button
        onClick={handleOrderClick}
        className="bg-orange-500 text-white px-8 py-3 rounded-full text-lg hover:bg-orange-600 transition"
      >
        Order Now
      </button>
    </div>
  </div>
</section>
  );
};

export default HeroSection;
