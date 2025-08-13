import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import whaleLogo from '../assets/WHLE-03.png'
import bannerVideo from '../assets/banner.mp4'

const HeroSection = () => {
  const [typingDone, setTypingDone] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTypingDone(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative h-[75vh] overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={bannerVideo}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-16">
        {/* Centered Logo and Title */}
        <div className="text-center mb-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center px-6 py-3 mb-4">
              <img
                src={whaleLogo}
                alt="Whale Space Logo"
                className="h-16 w-16 object-contain mr-5"
              />
              <div className="flex flex-col">
                <h1 className="text-3xl md:text-4xl font-bold font-oswald uppercase bg-gradient-to-r from-blue-200 via-white to-blue-100 bg-clip-text text-transparent leading-tight drop-shadow-lg">
                  WHALE SPACE
                </h1>
                <p className="text-white/80 text-sm font-oswald uppercase tracking-wider mt-1 bg-gradient-to-r from-blue-200 via-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
                  INTERNATIONAL REAL ESTATE
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl md:text-3xl font-bold text-white mb-3 font-oswald"
            style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)'
            }}
          >
            <h1 className={`typewriter-loop ${typingDone ? 'typing-done' : ''}`}>
              Your Perfect Space Awaits
            </h1>
          </motion.div>
        </div>

        {/* Search Form - Simplified like PropertyHub */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-xl p-6">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              <button className="flex-1 py-2 px-4 rounded-md bg-blue-600 text-white font-medium text-sm transition-colors">
                Buy
              </button>
              <button className="flex-1 py-2 px-4 rounded-md text-gray-600 font-medium text-sm hover:bg-white hover:text-gray-900 transition-colors">
                Rent
              </button>
              <button className="flex-1 py-2 px-4 rounded-md text-gray-600 font-medium text-sm hover:bg-white hover:text-gray-900 transition-colors">
                Sell
              </button>
            </div>

            {/* Search Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                  <option>Property Type</option>
                  <option>House</option>
                  <option>Condo</option>
                  <option>Land</option>
                  <option>Commercial</option>
                </select>
              </div>
              <button className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        </motion.div>

        {/* New text below search form */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-4 md:mt-6 text-center text-white/90 text-lg md:text-xl font-oswald"
          style={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          Conecting You To The Right Space!
        </motion.p>
      </div>
    </section>
  )
}

export default HeroSection