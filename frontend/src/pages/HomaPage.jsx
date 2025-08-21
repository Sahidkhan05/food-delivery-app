import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import HowItWorks from '../components/HowItWorks'
import FeaturedRestaurants from '../components/FeaturedRestaurants'
import FoodCategories from '../components/FoodCategories'
import Footer from '../components/Footer'
import Testimonial from '../components/Testimonial'

const HomaPage = () => {
  return (
  
    <div>
      <HeroSection/>
      <HowItWorks/>
      <FeaturedRestaurants/>
      <FoodCategories/>
      <Testimonial/>
      <Footer/>
    </div>
  )
}

export default HomaPage