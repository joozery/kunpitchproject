import React from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import CategoryBar from '../components/CategoryBar'
import FeaturedPropertiesSection from '../components/FeaturedPropertiesSection'
import PropertyTypeSections from '../components/PropertyTypeSections'
import BannerSlide from '../components/BannerSlide'
import PopularArea from '../components/PopularArea'
import BlogSection from '../components/BlogSection'
import ExclusiveUnits from '../components/ExclusiveUnits'
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

      {/* Category Bar between Hero and Hot Deal */}
      <div className="relative z-20 -mt-10 mb-6">
        <CategoryBar />
      </div>

      {/* Featured Properties Section */}
      <FeaturedPropertiesSection />

      {/* Property Type Sections */}
      <PropertyTypeSections />

      {/* Banner Slide Section */}
      <BannerSlide />

      {/* Popular Area Section */}
      <PopularArea />

      {/* Exclusive Units Section */}
      <ExclusiveUnits />

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