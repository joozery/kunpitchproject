import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'

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
      <iframe
        className="absolute inset-0 w-full h-full object-cover scale-[2.5]"
        src="https://www.youtube.com/embed/ecsPQknpaGU?autoplay=1&mute=1&loop=1&playlist=ecsPQknpaGU&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=https://whalespace.netlify.app"
        title="Background Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-16">
        {/* Centered Title */}
        <div className="text-center mb-8 text-white">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl font-bold text-white mb-3 font-oswald mt-8 md:mt-12"
            style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)'
            }}
          >
            <h1 className={`typewriter-loop font-oswald ${typingDone ? 'typing-done' : ''}`}>
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


      </div>
    </section>
  )
}

export default HeroSection