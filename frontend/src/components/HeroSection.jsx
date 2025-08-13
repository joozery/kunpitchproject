import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import whaleLogo from '../assets/WHLE-03.png'
import bannerVideo from '../assets/banner.mp4'

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('rent')
  const [propertyType, setPropertyType] = useState('Choose Property Type')
  const [priceRange, setPriceRange] = useState('All Price Range')
  const [typingDone, setTypingDone] = useState(false)

  useEffect(() => {
    // Stop cursor blinking after typing animation is done
    const timer = setTimeout(() => {
      setTypingDone(true)
    }, 5200) // 1.2s delay + 4s typing

    return () => clearTimeout(timer)
  }, [])

  const propertyTypes = [
    'Condo', 'House', 'Townhouse', 'Villa', 'Land', 'Commercial'
  ]

  const priceRanges = [
    'Under 5M', '5M - 10M', '10M - 20M', '20M - 50M', 'Above 50M'
  ]

  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={bannerVideo}
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Overlay removed as requested */}

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-24">
        {/* Centered Logo and Title */}
        <div className="text-center mb-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            {/* Logo horizontal layout like the image */}
            <div className="inline-flex items-center px-6 py-3 mb-4">
              <img 
                src={whaleLogo} 
                alt="Whale Space Logo" 
                className="h-16 w-16 object-contain mr-5"
              />
              <div className="flex flex-col">
                <h1 className="text-3xl md:text-4xl font-bold font-prompt uppercase leading-tight bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                  WHALE SPACE
                </h1>
                <p className="text-sm font-prompt uppercase tracking-wider mt-1 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
                  INTERNATIONAL REAL ESTATE
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold text-white mb-3 font-prompt"
          >
            <h1 className={`typewriter-loop`} style={{ fontFamily: 'Oswald, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.5)', width: 'ch' }}>
              Your Perfect Space Awaits
            </h1>
          </motion.div>
        </div>



        {/* Search Form - Simplified like PropertyHub */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-xl p-6">
            {/* Tabs */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1 max-w-fit">
              <button
                onClick={() => setActiveTab('rent')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 font-prompt ${
                  activeTab === 'rent'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Rent
              </button>
              <button
                onClick={() => setActiveTab('sale')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 font-prompt ${
                  activeTab === 'sale'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sale
              </button>
            </div>

            {/* Search Row */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Property Type */}
              <div className="flex-1 relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg font-prompt text-gray-600 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Choose Property Type">Choose PropertyType</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Price Range */}
              <div className="flex-1 relative">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg font-prompt text-gray-600 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All Price Range">All Price Range</option>
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search Zone, Projects, BTS, Province, School"
                  className="w-full p-3 border border-gray-200 rounded-lg font-prompt text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              {/* Search Button */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium font-prompt transition-all duration-300">
                Search
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tagline below search form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-4 md:mt-6 text-center"
        >
          <p className="text-white/90 text-lg md:text-xl font-prompt tracking-wide" style={{ fontFamily: 'Oswald, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>Conecting You To The Right Space!</p>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection