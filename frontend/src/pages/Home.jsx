import React from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import FeaturedPropertiesSection from '../components/FeaturedPropertiesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import BlogSection from '../components/BlogSection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Properties Section */}
      <FeaturedPropertiesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Blog Section */}
      <BlogSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home 