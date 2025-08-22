import React, { useState } from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
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
  const [activeTab, setActiveTab] = useState('buy')
  const [searchLocation, setSearchLocation] = useState('')
  const [searchPropertyType, setSearchPropertyType] = useState('')

  const handleSearch = () => {
    // Handle search logic here
    console.log('Search:', { activeTab, searchLocation, searchPropertyType })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Search Form Section - Replacing CategoryBar */}
      <div className="relative z-20 -mt-24 mb-0">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-4 md:p-6 border border-white/20">
            {/* Tabs - Segmented */}
            <div className="mb-5">
              <div className="flex rounded-xl bg-gray-100 p-1.5">
                {['buy','rent','sell'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`${activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white'} flex-1 py-2.5 md:py-3 rounded-lg font-medium text-sm transition-colors`}
                  >
                    {tab === 'buy' ? 'Buy' : tab === 'rent' ? 'Rent' : 'Sell'}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <select 
                  value={searchPropertyType}
                  onChange={(e) => setSearchPropertyType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Property Type</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Search
              </button>
            </div>
          </div>
        </div>
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