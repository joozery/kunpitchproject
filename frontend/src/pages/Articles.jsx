import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { 
  Eye, 
  MessageCircle, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Star,
  TrendingUp,
  Lightbulb,
  Scale,
  Palette,
  DollarSign,
  Building2
} from 'lucide-react'

const mockArticles = [
  {
    id: 'investment-tips',
    title: '10 Tips for Buying Condos in Bangkok for Better Returns',
    excerpt: 'เคล็ดลับการลงทุนคอนโดในกรุงเทพฯ เพื่อผลตอบแทนที่ดีกว่า พร้อมเทคนิคการเลือกทำเลและโครงการที่เหมาะสม',
    cover: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2025-01-15',
    category: 'Investment',
    readTime: '5 min',
    views: 1250,
    comments: 23,
    author: 'Whale Space Team',
    featured: true
  },
  {
    id: 'market-trends-2025',
    title: 'Thai Real Estate Market Trends 2024',
    excerpt: 'วิเคราะห์แนวโน้มตลาดอสังหาริมทรัพย์ไทยปี 2024 และการคาดการณ์สำหรับปี 2025',
    cover: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2025-01-12',
    category: 'Market Trends',
    readTime: '8 min',
    views: 2100,
    comments: 45,
    author: 'Market Analyst',
    featured: false
  },
  {
    id: 'staging-tips',
    title: 'How to Properly Evaluate House Prices',
    excerpt: 'วิธีการประเมินราคาบ้านอย่างถูกต้อง พร้อมปัจจัยที่ต้องพิจารณาในการตัดสินใจซื้อ',
    cover: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2025-01-10',
    category: 'Tips',
    readTime: '6 min',
    views: 1800,
    comments: 31,
    author: 'Property Expert',
    featured: false
  },
  {
    id: 'legal-guide',
    title: 'New Laws Real Estate Investors Need to Know',
    excerpt: 'กฎหมายใหม่ที่นักลงทุนอสังหาริมทรัพย์ต้องรู้ พร้อมผลกระทบต่อการลงทุน',
    cover: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2025-01-08',
    category: 'Legal',
    readTime: '7 min',
    views: 950,
    comments: 12,
    author: 'Legal Expert',
    featured: false
  },
  {
    id: 'design-inspiration',
    title: 'Modern Interior Design Trends for 2025',
    excerpt: 'เทรนด์การออกแบบภายในที่ทันสมัยสำหรับปี 2025 พร้อมไอเดียการตกแต่งบ้าน',
    cover: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2025-01-05',
    category: 'Design',
    readTime: '4 min',
    views: 1650,
    comments: 28,
    author: 'Design Specialist',
    featured: false
  },
  {
    id: 'finance-guide',
    title: 'Mortgage Guide: How to Get the Best Home Loan',
    excerpt: 'คู่มือการกู้บ้าน: วิธีได้เงินกู้ที่ดีที่สุด พร้อมเทคนิคการต่อรองดอกเบี้ย',
    cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
    publishedAt: '2025-01-03',
    category: 'Finance',
    readTime: '9 min',
    views: 2200,
    comments: 56,
    author: 'Financial Advisor',
    featured: false
  }
]

const Articles = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  
  const categories = ['All', 'Investment', 'Market Trends', 'Tips', 'Legal', 'Design', 'Finance']
  
  const filteredArticles = activeFilter === 'All' 
    ? mockArticles 
    : mockArticles.filter(article => article.category === activeFilter)
  
  const getCategoryColor = (category) => {
    const colors = {
      'Investment': 'bg-blue-500',
      'Market Trends': 'bg-green-500',
      'Tips': 'bg-purple-500',
      'Legal': 'bg-red-500',
      'Design': 'bg-pink-500',
      'Finance': 'bg-orange-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Investment': Building2,
      'Market Trends': TrendingUp,
      'Tips': Lightbulb,
      'Legal': Scale,
      'Design': Palette,
      'Finance': DollarSign
    }
    return icons[category] || Building2
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace('/', '/')
  }

  // Get featured article for hero section
  const featuredArticle = mockArticles.find(article => article.featured)
  const regularArticles = mockArticles.filter(article => !article.featured)

  return (
    <div className="min-h-screen bg-gray-50 font-prompt">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Page Header */}
        <div className="mb-12">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                  activeFilter === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article Hero Section */}
        {featuredArticle && activeFilter === 'All' && (
          <div className="mb-12">
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
              <img 
                src={featuredArticle.cover} 
                alt={featuredArticle.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Article Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 text-sm font-medium">บทความแนะนำ</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 leading-tight max-w-3xl">
                  {featuredArticle.title}
                </h2>
                <p className="text-gray-200 text-base mb-4 max-w-2xl line-clamp-2">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-4 text-gray-300 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(featuredArticle.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{featuredArticle.views.toLocaleString()}</span>
                  </div>
                </div>
                <Link 
                  to={`/articles/${featuredArticle.id}`}
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors duration-200 text-sm"
                >
                  อ่านบทความ
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
        

        
        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article key={article.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Image with Category Tag */}
              <div className="relative">
                <img 
                  src={article.cover} 
                  alt={article.title} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute top-3 left-3 ${getCategoryColor(article.category)} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                  {React.createElement(getCategoryIcon(article.category), { className: 'w-3 h-3' })}
                  {article.category}
                </div>
              </div>
              
              <div className="p-6">
                {/* Date and Read Time */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
                
                {/* Title */}
                <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {article.title}
                </h2>
                
                {/* Excerpt */}
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {article.excerpt}
                </p>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {article.comments}
                    </span>
                  </div>
                  <span className="text-blue-600 font-medium">{article.author}</span>
                </div>
                
                {/* Read More Button */}
                <Link 
                  to={`/articles/${article.id}`} 
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 group-hover:gap-3"
                >
                  อ่านเพิ่มเติม
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building2 className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">ไม่พบบทความในหมวดนี้</h3>
            <p className="text-gray-500">ลองเปลี่ยนตัวกรองหรือกลับไปดูบทความทั้งหมด</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

export default Articles



