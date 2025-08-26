import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { bannerApi } from '../lib/bannerApi'

const BannerSlide = () => {
  const [slides, setSlides] = useState([])
  const [settings, setSettings] = useState({
    auto_slide: true,
    slide_interval: 5000,
    slide_height: 300,
    show_navigation: true,
    show_dots: true
  })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      console.log('🔄 Loading banner data...');
      const [slidesData, settingsData] = await Promise.all([
        bannerApi.getSlides(),
        bannerApi.getSettings()
      ])
      
      console.log('📊 Raw slides data:', slidesData);
      console.log('⚙️  Raw settings data:', settingsData);
      
      // Filter only active slides
      const activeSlides = slidesData.filter(slide => slide.is_active)
      console.log('🎯 Active slides:', activeSlides);
      
      setSlides(activeSlides)
      setSettings(settingsData)
    } catch (error) {
      console.error('❌ Error loading banner data:', error)
      console.log('🔄 Using fallback banner data due to API error');
      
      // Fallback data when API fails
      const fallbackSlides = [
        {
          id: 1,
          title: 'Welcome to Whale Space',
          alt_text: 'Welcome Banner',
          image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
          link: '/',
          is_active: true
        },
        {
          id: 2,
          title: 'Find Your Perfect Property',
          alt_text: 'Property Search Banner',
          image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
          link: '/properties',
          is_active: true
        },
        {
          id: 3,
          title: 'Premium Real Estate Solutions',
          alt_text: 'Premium Services Banner',
          image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
          link: '/contact',
          is_active: true
        }
      ];
      
      const fallbackSettings = {
        auto_slide: true,
        slide_interval: 5000,
        slide_height: 300,
        show_navigation: true,
        show_dots: true
      };
      
      setSlides(fallbackSlides);
      setSettings(fallbackSettings);
      setError(null); // Clear error since we have fallback data
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!settings.auto_slide || slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, settings.slide_interval)

    return () => clearInterval(interval)
  }, [slides.length, settings.auto_slide, settings.slide_interval])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  // Fallback image when no image is provided
  const getImageUrl = (slide) => {
    if (slide?.image_url && slide.image_url.trim() !== '') {
      return slide.image_url
    }
    // Return a placeholder gradient background with 4.67:1 aspect ratio
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwMCIgaGVpZ2h0PSIzMDAiIHZpZXdCb3g9IjAgMCAxNDAwIDMwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzY2ZmYxO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxZTRhNzE7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+'
  }

  if (isLoading) {
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div 
            className="w-full bg-gray-200 animate-pulse rounded-xl md:rounded-2xl"
            style={{ 
              height: '300px'
            }}
          />
        </div>
      </section>
    )
  }

  if (error && slides.length === 0) {
    console.error('BannerSlide error:', error)
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-4">Banner Section</h3>
            <p className="text-gray-500">Unable to load banner slides.</p>
            <p className="text-sm text-gray-400 mt-2">Please check your connection or try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  if (slides.length === 0) {
    console.log('⚠️  No banner slides found, showing fallback UI');
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-4">Banner Section</h3>
            <p className="text-gray-500">No banner slides configured yet.</p>
            <p className="text-sm text-gray-400 mt-2">Check the admin panel to add banner slides.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div 
          className="relative w-full overflow-hidden rounded-xl md:rounded-2xl shadow-lg md:shadow-xl"
          style={{ 
            height: '300px', // Fixed height for all screen sizes
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <a href={slides[currentSlide]?.link || '#'} className="block w-full h-full">
                <img
                  src={getImageUrl(slides[currentSlide])}
                  alt={slides[currentSlide]?.alt_text || 'Banner'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = getImageUrl(null) // Use fallback on error
                  }}
                />
              </a>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {settings.show_navigation && slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 md:p-3 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 md:p-3 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
              </button>
            </>
          )}

          {/* Dots */}
          {settings.show_dots && slides.length > 1 && (
            <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-200 shadow-lg ${
                    index === currentSlide
                      ? 'bg-white scale-125'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default BannerSlide