import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
    <section className="relative h-[65vh] overflow-hidden">
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
        
        {/* Gradient Overlay for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20"></div>
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