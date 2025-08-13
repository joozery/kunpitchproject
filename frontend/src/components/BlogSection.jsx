import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Eye, MessageCircle, Tag, Clock, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'

const BlogSection = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด')
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef(null)

  // Mock blog data - ในอนาคตสามารถเชื่อมต่อกับ API ได้
  useEffect(() => {
    const mockBlogs = [
      {
        id: 1,
        title: "10 เทคนิคการเลือกซื้อคอนโดในกรุงเทพฯ ให้ได้ผลตอบแทนดี",
        excerpt: "การลงทุนซื้อคอนโดในกรุงเทพฯ ต้องมีเทคนิคและความรู้เพื่อให้ได้ผลตอบแทนที่คุ้มค่า มาดูกันว่ามีเทคนิคอะไรบ้างที่นักลงทุนควรรู้...",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        author: "Whale Space Team",
        date: "2024-01-15",
        category: "การลงทุน",
        readTime: "5 นาที",
        views: 1250,
        comments: 23,
        featured: true
      },
      {
        id: 2,
        title: "แนวโน้มตลาดอสังหาริมทรัพย์ไทย 2024",
        excerpt: "วิเคราะห์แนวโน้มตลาดอสังหาริมทรัพย์ไทยในปี 2024 พร้อมคำแนะนำสำหรับนักลงทุนและผู้ซื้อบ้านที่ต้องการข้อมูลเชิงลึก...",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        author: "Market Analyst",
        date: "2024-01-12",
        category: "ตลาดอสังหาฯ",
        readTime: "8 นาที",
        views: 2100,
        comments: 45,
        featured: true
      },
      {
        id: 3,
        title: "วิธีการประเมินราคาบ้านให้ถูกต้อง",
        excerpt: "เทคนิคการประเมินราคาบ้านอย่างถูกต้อง เพื่อให้คุณซื้อขายได้ในราคาที่เป็นธรรม และไม่เสียเปรียบในการเจรจา...",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        author: "Property Expert",
        date: "2024-01-10",
        category: "คำแนะนำ",
        readTime: "6 นาที",
        views: 1800,
        comments: 31,
        featured: false
      },
      {
        id: 4,
        title: "กฎหมายใหม่ที่นักลงทุนอสังหาฯ ต้องรู้",
        excerpt: "อัพเดทกฎหมายใหม่ๆ ที่เกี่ยวข้องกับการลงทุนอสังหาริมทรัพย์ เพื่อให้การลงทุนของคุณถูกต้องตามกฎหมายและปลอดภัย...",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        author: "Legal Team",
        date: "2024-01-08",
        category: "กฎหมาย",
        readTime: "7 นาที",
        views: 950,
        comments: 12,
        featured: false
      },
      {
        id: 5,
        title: "เทคนิคการตกแต่งบ้านเพื่อเพิ่มมูลค่า",
        excerpt: "การตกแต่งและปรับปรุงบ้านอย่างชาญฉลาด สามารถเพิ่มมูลค่าของทรัพย์สินได้อย่างมีนัยสำคัญ มาดูเทคนิคที่ได้ผล...",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        author: "Design Team",
        date: "2024-01-05",
        category: "การตกแต่ง",
        readTime: "4 นาที",
        views: 1650,
        comments: 28,
        featured: false
      },
      {
        id: 6,
        title: "การวางแผนการเงินสำหรับการซื้อบ้านหลังแรก",
        excerpt: "คำแนะนำในการวางแผนการเงินสำหรับการซื้อบ้านหลังแรก ตั้งแต่การเก็บเงินดาวน์ ไปจนถึงการเลือกสินเชื่อที่เหมาะสม...",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        author: "Financial Advisor",
        date: "2024-01-03",
        category: "การเงิน",
        readTime: "9 นาที",
        views: 2300,
        comments: 56,
        featured: true
      }
    ]

    // Simulate loading
    setTimeout(() => {
      setBlogs(mockBlogs)
      setLoading(false)
    }, 1000)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      'การลงทุน': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      'ตลาดอสังหาฯ': 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white',
      'คำแนะนำ': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
      'กฎหมาย': 'bg-gradient-to-r from-red-500 to-red-600 text-white',
      'การตกแต่ง': 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
      'การเงิน': 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
    }
    return colors[category] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
  }

  const categories = ['ทั้งหมด', 'การลงทุน', 'ตลาดอสังหาฯ', 'คำแนะนำ', 'กฎหมาย', 'การตกแต่ง', 'การเงิน']

  const filteredBlogs = selectedCategory === 'ทั้งหมด' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory)

  const cardsPerView = 3
  const maxSlides = Math.max(0, filteredBlogs.length - cardsPerView)

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlides))
  }

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0))
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="h-12 bg-gradient-to-r from-slate-200 to-blue-200 rounded-xl w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gradient-to-r from-slate-200 to-blue-200 rounded-lg w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg animate-pulse flex-shrink-0 w-80">
                <div className="h-48 bg-gradient-to-r from-slate-200 to-blue-200"></div>
                <div className="p-5">
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-blue-200 rounded w-20 mb-3"></div>
                  <div className="h-6 bg-gradient-to-r from-slate-200 to-blue-200 rounded mb-3"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-blue-200 rounded mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-blue-200 rounded w-24"></div>
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-blue-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
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
            <span className="text-blue-600 font-semibold text-xs uppercase tracking-wider">Insights & News</span>
            <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-oswald"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 50%, #64748b 75%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            บทความและข่าวสาร
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-slate-600 text-base lg:text-lg font-medium max-w-2xl mx-auto leading-relaxed"
          >
            อัพเดทข้อมูลข่าวสาร เทคนิค และคำแนะนำเกี่ยวกับอสังหาริมทรัพย์จากผู้เชี่ยวชาญ
          </motion.p>
        </div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                setCurrentSlide(0)
              }}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:text-slate-900 shadow-md hover:shadow-lg'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

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
              {filteredBlogs.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer flex-shrink-0 w-80"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative overflow-hidden h-48 flex-shrink-0">
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(blog.category)}`}>
                          <Tag className="h-3 w-3 inline mr-1" />
                          {blog.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ArrowRight className="h-5 w-5 text-slate-700" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      {/* Meta Info */}
                      <div className="flex items-center justify-between mb-3 text-sm text-slate-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                          {formatDate(blog.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-blue-600" />
                          {blog.readTime}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 mb-3 font-oswald leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-1">
                        {blog.excerpt}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1 text-blue-600" />
                            {blog.views.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1 text-blue-600" />
                            {blog.comments}
                          </span>
                        </div>
                        <div className="flex items-center text-slate-500">
                          <User className="h-4 w-4 mr-1 text-blue-600" />
                          {blog.author}
                        </div>
                      </div>

                      {/* Read More Button */}
                      <button className="w-full bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-blue-600 mt-auto">
                        อ่านต่อ
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.article>
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
            <BookOpen className="h-4 w-4" />
            ดูบทความทั้งหมด
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default BlogSection