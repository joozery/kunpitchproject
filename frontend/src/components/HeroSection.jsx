import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import whaleLogo from '../assets/WHLE-03.png'

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
    <section className="relative h-[80vh] overflow-hidden" style={{background: 'linear-gradient(to bottom right, #203d6b, #1d5e9d, #8bb4db)'}}>
      {/* Geometric Background Shapes - exactly like PropertyHub */}
      <div className="absolute inset-0">
        {/* Large left curve */}
        <div className="absolute top-0 left-0 w-1/3 h-full">
          <svg viewBox="0 0 400 800" className="w-full h-full opacity-20">
            <path d="M0,0 Q200,400 0,800 L0,0 Z" fill="rgba(255,255,255,0.1)" />
          </svg>
        </div>
        
        {/* Right geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border-2 border-white/20 rounded-full"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-white/15 rounded-full"></div>
        
        {/* Bottom curves */}
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/3">
          <svg viewBox="0 0 600 300" className="w-full h-full opacity-15">
            <path d="M0,300 Q300,0 600,300 L600,300 L0,300 Z" fill="rgba(255,255,255,0.1)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-6">
        {/* Centered Logo and Title */}
        <div className="text-center mb-8">
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
                <h1 className="text-3xl md:text-4xl font-bold text-white font-prompt uppercase bg-gradient-to-r from-blue-200 via-white to-blue-100 bg-clip-text text-transparent leading-tight">
                  WHALE SPACE
                </h1>
                <p className="text-white/80 text-sm font-prompt uppercase tracking-wider mt-1">
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
            <h1 className={`typewriter ${typingDone ? 'typing-done' : ''}`}>
              Thailand properties for sale and rent
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
      </div>
    </section>
  )
}

export default HeroSection