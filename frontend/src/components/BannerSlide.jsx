import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import bannerImage from '../assets/braner.png'
import bannerImage2 from '../assets/braner2.png'

const BannerSlide = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Banner slides data - you can add more slides here
  const slides = [
    {
      id: 1,
      image: bannerImage,
      alt: "Banner Image 1"
    },
    {
      id: 2,
      image: bannerImage2,
      alt: "Banner Image 2"
    }
  ]

  // Auto-slide functionality
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000) // Change slide every 5 seconds

      return () => clearInterval(interval)
    }
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Slides Container */}
        <div className="relative w-full h-[200px] md:h-[250px] lg:h-[300px] overflow-hidden rounded-2xl shadow-xl">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 1 }}
            >
              {/* Image with proper cover fit */}
              <img 
                src={slide.image} 
                alt={slide.alt}
                className="w-full h-full object-cover object-center rounded-2xl"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center center'
                }}
              />
            </motion.div>
          ))}
          
          {/* Navigation Arrows - Only show if more than 1 slide */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 hover:bg-white/30"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 hover:bg-white/30"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}

          {/* Dots Indicator - Only show if more than 1 slide */}
          {slides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'bg-white scale-125 shadow-lg'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default BannerSlide