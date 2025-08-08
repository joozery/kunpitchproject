import React from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import SearchSection from '../components/SearchSection'
import StatsSection from '../components/StatsSection'
import ServicesSection from '../components/ServicesSection'
import FeaturesSection from '../components/FeaturesSection'
import FeaturedPropertiesSection from '../components/FeaturedPropertiesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Search Section */}
      <SearchSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Properties Section */}
      <FeaturedPropertiesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home 