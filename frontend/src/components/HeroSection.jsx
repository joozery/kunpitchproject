import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import bannerHero from '@/assets/bannerhero.png'
import bannerHeroMobile from '@/assets/herobannermobile.png'

const HeroSection = () => {
  const [typingDone, setTypingDone] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTypingDone(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Preload hero images
  useEffect(() => {
    ;[bannerHero, bannerHeroMobile].forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  return (
    <section className="relative h-[65vh] overflow-hidden">
      {/* Background Image (responsive) */}
      <div className="absolute inset-0">
        {/* Desktop/Tablet background */}
        <div
          className="hidden md:block w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerHero})` }}
        />
        {/* Mobile background */}
        <div
          className="block md:hidden w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerHeroMobile})` }}
        />
        {/* Gradient Overlay for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20" />
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
      </div>
    </section>
  )
}

export default HeroSection