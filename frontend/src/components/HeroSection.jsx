import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-slide for hero section
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: 'ค้นหาบ้านในฝันของคุณ',
      subtitle: 'อสังหาริมทรัพย์คุณภาพสูงในทำเลทอง พร้อมบริการครบครัน'
    },
    {
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: 'คอนโดมิเนียมหรูใจกลางเมือง',
      subtitle: 'ชีวิตที่สะดวกสบายในเมืองหลวง พร้อมสิ่งอำนวยความสะดวกครบครัน'
    },
    {
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: 'ที่ดินเปล่ามูลค่าสูง',
      subtitle: 'โอกาสการลงทุนที่คุ้มค่า พร้อมศักยภาพการเติบโตในอนาคต'
    }
  ]

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Hero Slides */}
      <div className="relative h-full">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white z-10 max-w-5xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-prompt leading-tight"
          >
            {heroSlides[currentSlide].title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl mb-8 font-prompt max-w-3xl mx-auto"
          >
            {heroSlides[currentSlide].subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <Search className="h-5 w-5" />
              <span>ค้นหา Property</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30">
              ติดต่อเรา
            </button>
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white shadow-lg' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  )
}

export default HeroSection 