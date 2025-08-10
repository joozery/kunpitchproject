import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Eye, MessageCircle, Tag } from 'lucide-react'

const BlogSection = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock blog data - ในอนาคตสามารถเชื่อมต่อกับ API ได้
  useEffect(() => {
    const mockBlogs = [
      {
        id: 1,
        title: "10 เทคนิคการเลือกซื้อคอนโดในกรุงเทพฯ ให้ได้ผลตอบแทนดี",
        excerpt: "การลงทุนซื้อคอนโดในกรุงเทพฯ ต้องมีเทคนิคและความรู้เพื่อให้ได้ผลตอบแทนที่คุ้มค่า มาดูกันว่ามีเทคนิคอะไรบ้าง...",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        author: "Whale Space Team",
        date: "2024-01-15",
        category: "การลงทุน",
        readTime: "5 นาที",
        views: 1250,
        comments: 23
      },
      {
        id: 2,
        title: "แนวโน้มตลาดอสังหาริมทรัพย์ไทย 2024",
        excerpt: "วิเคราะห์แนวโน้มตลาดอสังหาริมทรัพย์ไทยในปี 2024 พร้อมคำแนะนำสำหรับนักลงทุนและผู้ซื้อบ้าน...",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        author: "Market Analyst",
        date: "2024-01-12",
        category: "ตลาดอสังหาฯ",
        readTime: "8 นาที",
        views: 2100,
        comments: 45
      },
      {
        id: 3,
        title: "วิธีการประเมินราคาบ้านให้ถูกต้อง",
        excerpt: "เทคนิคการประเมินราคาบ้านอย่างถูกต้อง เพื่อให้คุณซื้อขายได้ในราคาที่เป็นธรรม และไม่เสียเปรียบ...",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        author: "Property Expert",
        date: "2024-01-10",
        category: "คำแนะนำ",
        readTime: "6 นาที",
        views: 1800,
        comments: 31
      },
      {
        id: 4,
        title: "กฎหมายใหม่ที่นักลงทุนอสังหาฯ ต้องรู้",
        excerpt: "อัพเดทกฎหมายใหม่ๆ ที่เกี่ยวข้องกับการลงทุนอสังหาริมทรัพย์ เพื่อให้การลงทุนของคุณถูกต้องตามกฎหมาย...",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        author: "Legal Team",
        date: "2024-01-08",
        category: "กฎหมาย",
        readTime: "7 นาที",
        views: 950,
        comments: 12
      },
      {
        id: 5,
        title: "เทคนิคการตกแต่งบ้านเพื่อเพิ่มมูลค่า",
        excerpt: "การตกแต่งและปรับปรุงบ้านอย่างชาญฉลาด สามารถเพิ่มมูลค่าของทรัพย์สินได้อย่างมีนัยสำคัญ...",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        author: "Design Team",
        date: "2024-01-05",
        category: "การตกแต่ง",
        readTime: "4 นาที",
        views: 1650,
        comments: 28
      },
      {
        id: 6,
        title: "การวางแผนการเงินสำหรับการซื้อบ้านหลังแรก",
        excerpt: "คำแนะนำในการวางแผนการเงินสำหรับการซื้อบ้านหลังแรก ตั้งแต่การเก็บเงินดาวน์ ไปจนถึงการเลือกสินเชื่อ...",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        author: "Financial Advisor",
        date: "2024-01-03",
        category: "การเงิน",
        readTime: "9 นาที",
        views: 2300,
        comments: 56
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
      'การลงทุน': 'bg-blue-100 text-blue-800',
      'ตลาดอสังหาฯ': 'bg-green-100 text-green-800',
      'คำแนะนำ': 'bg-purple-100 text-purple-800',
      'กฎหมาย': 'bg-red-100 text-red-800',
      'การตกแต่ง': 'bg-yellow-100 text-yellow-800',
      'การเงิน': 'bg-indigo-100 text-indigo-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <section className="py-20" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'}}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
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
    <section className="py-20" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'}}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-prompt"
            style={{
              background: 'linear-gradient(135deg, #1d5e9d 0%, #2563eb 50%, #3b82f6 100%)',
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
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-700 text-lg lg:text-xl font-prompt max-w-3xl mx-auto"
          >
            อัพเดทข้อมูลข่าวสาร เทคนิค และคำแนะนำเกี่ยวกับอสังหาริมทรัพย์
          </motion.p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
              style={{border: '2px solid #e5e7eb'}}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(blog.category)}`}>
                    <Tag className="h-3 w-3 inline mr-1" />
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" style={{color: '#1d5e9d'}} />
                    {formatDate(blog.date)}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" style={{color: '#1d5e9d'}} />
                    {blog.author}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 font-prompt line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" style={{color: '#1d5e9d'}} />
                      {blog.views.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" style={{color: '#1d5e9d'}} />
                      {blog.comments}
                    </span>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {blog.readTime}
                  </span>
                </div>

                {/* Read More Button */}
                <button 
                  className="w-full text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg flex items-center justify-center group"
                  style={{
                    background: 'linear-gradient(135deg, #1d5e9d 0%, #2563eb 50%, #3b82f6 100%)'
                  }}
                >
                  อ่านต่อ
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <button 
            className="text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl inline-flex items-center"
            style={{
              background: 'linear-gradient(135deg, #1d5e9d 0%, #2563eb 50%, #3b82f6 100%)'
            }}
          >
            ดูบทความทั้งหมด
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default BlogSection