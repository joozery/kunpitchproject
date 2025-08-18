import React from 'react'
import { motion } from 'framer-motion'

import whyImg from '../assets/why.jpg'

const WhyChooseSection = () => {

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={whyImg}
          alt="Why choose Whalespace"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-blue-900/60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Main Content */}
        <div className="text-center text-white">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 font-oswald"
            style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.6)' }}
          >
            Why choose Whalespace?
          </motion.h2>

          {/* Main Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl mx-auto space-y-6 text-lg md:text-xl leading-relaxed mb-12"
          >
            <p style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.7)' }}>
              Finding the perfect property in Thailand can be challenging — whether it's your first home, a vacation retreat, or a high-value 
              investment. That's where we come in. Our team combines deep local market knowledge, expert property sourcing, and 
              personalized service to guide you through every step of the process.
            </p>
            
            <p style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.7)' }}>
              From understanding your unique needs to negotiating the best deals, we ensure a smooth, transparent, and rewarding 
              experience. We don't just help you buy, sell, rent, or invest — we help you make the right decision with confidence.
            </p>
            
            <p className="font-semibold text-xl md:text-2xl" style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.8)' }}>
              Choose us, and let us help you turn your property dreams into reality — with professionalism, integrity, and care.
            </p>
          </motion.div>


        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection