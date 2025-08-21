import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 ">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1 */}
        <div>
         <Link to="/">
          <h2 className="text-xl font-bold mb-2">FoodExpress</h2>
          </Link>
          <p className="text-sm text-gray-300">Your favorite food delivered hot & fresh!</p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/restaurants" className="hover:underline">Restaurants</a></li>
            
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-gray-400 text-sm mt-6">
        © {new Date().getFullYear()} Foodie. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
