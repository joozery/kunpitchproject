import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Eye, ThumbsUp, ChevronLeft, ChevronRight, Youtube } from 'lucide-react'
import { youtubeApi } from '../lib/youtubeApi'

const YoutubeSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [youtubeVideos, setYoutubeVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const sliderRef = useRef(null)

  // Fetch YouTube videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const data = await youtubeApi.getAllVideos()
        setYoutubeVideos(data)
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล YouTube videos:', error)
        // Fallback to empty array if API fails
        setYoutubeVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  // Show loading state if no videos yet
  if (loading) {
    return (
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
              <span className="text-blue-600 font-semibold text-xs uppercase tracking-wider">Video Content</span>
              <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            </div>
            
            <h2 style={{ fontWeight: "bold", color: "#545454" }} className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-oswald">
              Recommended Youtube
            </h2>
          </div>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    )
  }

  // Don't render if no videos
  if (youtubeVideos.length === 0) {
    return null
  }

  const cardsPerView = 3
  const maxSlides = Math.max(0, youtubeVideos.length - cardsPerView)

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlides))
  }

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0))
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const handleVideoClick = (videoId) => {
    // Open YouTube video in new tab
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
  }

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            <span className="text-blue-600 font-semibold text-xs uppercase tracking-wider">Video Content</span>
            <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-oswald text-slate-800"
          >
            Recommended Youtube
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-slate-600 text-base lg:text-lg font-medium max-w-2xl mx-auto leading-relaxed"
          >
          
          </motion.p>

          {/* YouTube Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center mt-6"
          >
            <Youtube className="h-8 w-8 text-blue-500" />
          </motion.div>
        </div>

        {/* Slider Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative"
        >
          {/* Navigation Arrows */}
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-slate-700" />
            </button>
          )}
          
          {currentSlide < maxSlides && (
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-slate-700" />
            </button>
          )}

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div 
              ref={sliderRef}
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * (100 / cardsPerView)}%)`
              }}
            >
              {youtubeVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer flex-shrink-0 w-80"
                  onClick={() => handleVideoClick(video.videoId)}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                    {/* Video Thumbnail */}
                    <div className="relative overflow-hidden h-48 flex-shrink-0">
                      <img 
                        src={video.thumbnail_url || youtubeApi.getThumbnailUrl(video.video_id, 'medium')} 
                        alt={video.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
                        </div>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold">
                          {video.duration}
                        </span>
                      </div>

                      {/* YouTube Logo */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center">
                          <Youtube className="h-3 w-3 mr-1" />
                          YOUTUBE
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Channel & Date - removed as requested */}

                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 mb-3 font-oswald leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {video.title}
                      </h3>

                      {/* Description removed */}

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1 text-blue-600" />
                            {video.views_count || '0'}
                          </span>
                          <span className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1 text-blue-600" />
                            {video.likes_count || '0'}
                          </span>
                        </div>
                      </div>

                      {/* Watch Button */}
                      <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center mt-auto">
                        <Play className="h-4 w-4 mr-2" fill="currentColor" />
                        Watch Video
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {maxSlides > 0 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: maxSlides + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? 'bg-blue-600 scale-125'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30">
            <Youtube className="h-4 w-4" />
            Visit Our Channel
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default YoutubeSection