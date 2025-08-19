import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import b1 from '@/assets/banner/1.png'
import b2 from '@/assets/banner/2.png'
import b3 from '@/assets/banner/3.png'
import b4 from '@/assets/banner/4.png'
import b5 from '@/assets/banner/5.png'
import b6 from '@/assets/banner/6.png'
import b7 from '@/assets/banner/7.png'

const HeroSection = () => {
  const [typingDone, setTypingDone] = useState(false)
  const [current, setCurrent] = useState(0)
  const [activeTab, setActiveTab] = useState('buy')
  const images = [b1, b2, b3, b4, b5, b6, b7]

  useEffect(() => {
    const timer = setTimeout(() => {
      setTypingDone(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Auto slide background images
  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(id)
  }, [images.length])

  // Preload images
  useEffect(() => {
    images.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  return (
    <section className="relative h-[55vh] overflow-hidden">
      {/* Background Continuous Strip */}
      <div className="absolute inset-0 overflow-hidden">
        <style>{`
          @keyframes hero-scroll-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .hero-marquee { display: flex; width: 200%; height: 100%; animation: hero-scroll-left 40s linear infinite; }
          .hero-track { display: flex; width: 50%; height: 100%; }
          .hero-img { height: 100%; width: auto; object-fit: cover; flex: 0 0 auto; }
        `}</style>
        <div className="hero-marquee">
          <div className="hero-track">
            {images.map((src, idx) => (
              <img key={`hero-a-${idx}`} src={src} alt="Hero banner" className="hero-img" />
            ))}
          </div>
          <div className="hero-track" aria-hidden>
            {images.map((src, idx) => (
              <img key={`hero-b-${idx}`} src={src} alt="" className="hero-img" />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-20 pb-12">
        {/* Centered Title */}
        <div className="text-center mb-8 text-white">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl font-bold text-white mb-3 font-oswald mt-0 md:mt-2"
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
          <div className="bg-white/90 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-4 md:p-6 ring-1 ring-gray-100">
            {/* Tabs - Segmented */}
            <div className="mb-5">
              <div className="flex rounded-xl bg-gray-100 p-1.5">
                {['buy','rent','sell'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`${activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white'} flex-1 py-2.5 md:py-3 rounded-lg font-medium text-sm transition-colors`}
                    aria-pressed={activeTab === tab}
                  >
                    {tab === 'buy' ? 'Buy' : tab === 'rent' ? 'Rent' : 'Sell'}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                  <option value="">Property Type</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <button
                type="button"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
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