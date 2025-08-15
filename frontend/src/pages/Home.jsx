import React from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import FeaturedPropertiesSection from '../components/FeaturedPropertiesSection'
import PropertyTypeSections from '../components/PropertyTypeSections'
import BannerSlide from '../components/BannerSlide'
import PopularArea from '../components/PopularArea'
import BlogSection from '../components/BlogSection'
import YoutubeSection from '../components/YoutubeSection'
import WhyChooseSection from '../components/WhyChooseSection'
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

      {/* Property Type Sections */}
      <PropertyTypeSections />

      {/* Banner Slide Section */}
      <BannerSlide />

      {/* Popular Area Section */}
      <PopularArea />

      {/* Blog Section */}
      <BlogSection />

      {/* YouTube Section */}
      <YoutubeSection />

      {/* Why Choose Section */}
      <WhyChooseSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home 