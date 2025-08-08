import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Home as HomeIcon, 
  Building2, 
  Landmark,
  DollarSign,
  Users,
  Star,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  ChevronLeft,
  Heart,
  Eye,
  Calendar,
  Award,
  Shield,
  CheckCircle
} from 'lucide-react'
import { propertyAPI } from '../lib/api'
import Header from '../components/Header'

const Home = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')

  // Fetch featured properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const result = await propertyAPI.getAll()
        if (result && result.success) {
          // Get first 6 properties for featured section
          setProperties(result.data ? result.data.slice(0, 6) : [])
        } else {
          // Fallback data if API fails
          setProperties([
            {
              id: 1,
              title: 'บ้านเดี่ยว 3 ห้องนอน',
              location: 'สุขุมวิท, กรุงเทพฯ',
              price: 8500000,
              rent_price: 0,
              bedrooms: 3,
              bathrooms: 2,
              type: 'residential',
              images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80']
            },
            {
              id: 2,
              title: 'คอนโด 2 ห้องนอน',
              location: 'สีลม, กรุงเทพฯ',
              price: 3500000,
              rent_price: 25000,
              bedrooms: 2,
              bathrooms: 1,
              type: 'residential',
              images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80']
            },
            {
              id: 3,
              title: 'ที่ดินเปล่า 100 ตร.ว.',
              location: 'บางนา, กรุงเทพฯ',
              price: 15000000,
              rent_price: 0,
              bedrooms: 0,
              bathrooms: 0,
              type: 'land',
              images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80']
            }
          ])
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error)
        // Fallback data if API fails
        setProperties([
          {
            id: 1,
            title: 'บ้านเดี่ยว 3 ห้องนอน',
            location: 'สุขุมวิท, กรุงเทพฯ',
            price: 8500000,
            rent_price: 0,
            bedrooms: 3,
            bathrooms: 2,
            type: 'residential',
            images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80']
          },
          {
            id: 2,
            title: 'คอนโด 2 ห้องนอน',
            location: 'สีลม, กรุงเทพฯ',
            price: 3500000,
            rent_price: 25000,
            bedrooms: 2,
            bathrooms: 1,
            type: 'residential',
            images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80']
          },
          {
            id: 3,
            title: 'ที่ดินเปล่า 100 ตร.ว.',
            location: 'บางนา, กรุงเทพฯ',
            price: 15000000,
            rent_price: 0,
            bedrooms: 0,
            bathrooms: 0,
            type: 'land',
            images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80']
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

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

  const stats = [
    { icon: HomeIcon, value: '500+', label: 'Property' },
    { icon: Users, value: '1000+', label: 'ลูกค้าพึงพอใจ' },
    { icon: Star, value: '4.8', label: 'คะแนนความพึงพอใจ' },
    { icon: DollarSign, value: '฿2.5B+', label: 'มูลค่าการขาย' }
  ]

  const services = [
    {
      icon: HomeIcon,
      title: 'ที่อยู่อาศัย',
      description: 'บ้าน คอนโด ทาวน์เฮาส์ ในทำเลทอง พร้อมสิ่งอำนวยความสะดวกครบครัน',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      features: ['ทำเลทอง', 'สิ่งอำนวยความสะดวกครบครัน', 'ความปลอดภัยสูง']
    },
    {
      icon: Building2,
      title: 'เชิงพาณิชย์',
      description: 'สำนักงาน ร้านค้า โรงแรม ในทำเลธุรกิจชั้นนำ',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      features: ['ทำเลธุรกิจชั้นนำ', 'โอกาสการลงทุนสูง', 'ผลตอบแทนดี']
    },
    {
      icon: Landmark,
      title: 'ที่ดิน',
      description: 'ที่ดินเปล่า ไร่นา สวน พร้อมศักยภาพการพัฒนา',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      features: ['ศักยภาพการพัฒนา', 'โอกาสการลงทุน', 'มูลค่าเพิ่มสูง']
    }
  ]

  const testimonials = [
    {
      name: 'คุณสมชาย ใจดี',
      role: 'เจ้าของธุรกิจ',
      content: 'บริการดีมาก พนักงานเป็นมืออาชีพ ช่วยให้ผมได้บ้านในฝันในราคาที่เหมาะสม',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'คุณสมหญิง รักดี',
      role: 'พนักงานบริษัท',
      content: 'ได้คอนโดในทำเลที่ต้องการ พร้อมสิ่งอำนวยความสะดวกครบครัน ราคาไม่แพง',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'คุณสมศักดิ์ มั่นคง',
      role: 'นักลงทุน',
      content: 'ลงทุนในที่ดินผ่านบริษัทนี้มา 3 ปีแล้ว ผลตอบแทนดีเกินคาด',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    }
  ]

  const features = [
    {
      icon: Shield,
      title: 'ความน่าเชื่อถือ',
      description: 'ประสบการณ์มากกว่า 10 ปี ในวงการอสังหาริมทรัพย์'
    },
    {
      icon: Award,
      title: 'รางวัลการันตี',
      description: 'ได้รับรางวัลบริษัทอสังหาริมทรัพย์ยอดเยี่ยม 3 ปีซ้อน'
    },
    {
      icon: CheckCircle,
      title: 'บริการครบครัน',
      description: 'ให้คำปรึกษา ดูแลทุกขั้นตอน จนถึงการโอนกรรมสิทธิ์'
    },
    {
      icon: Users,
      title: 'ทีมงานมืออาชีพ',
      description: 'พนักงานที่มีประสบการณ์และความรู้ด้านอสังหาริมทรัพย์'
    }
  ]

  const handleSearch = () => {
    // Handle search functionality
    console.log('Search:', { searchQuery, propertyType, priceRange })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
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

      {/* Search Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-prompt"
            >
              ค้นหา Property ที่ใช่สำหรับคุณ
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-lg lg:text-xl font-prompt max-w-2xl mx-auto"
            >
              ค้นหาอสังหาริมทรัพย์ที่ตรงใจในราคาที่เหมาะสม พร้อมบริการครบครัน
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 max-w-5xl mx-auto border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหาตามชื่อหรือที่อยู่"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              <select 
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">ประเภท Property</option>
                <option value="residential">ที่อยู่อาศัย</option>
                <option value="commercial">เชิงพาณิชย์</option>
                <option value="land">ที่ดิน</option>
              </select>
              <select 
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">ราคา</option>
                <option value="0-1000000">0 - 1,000,000</option>
                <option value="1000000-5000000">1,000,000 - 5,000,000</option>
                <option value="5000000-10000000">5,000,000 - 10,000,000</option>
                <option value="10000000+">10,000,000+</option>
              </select>
              <button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                ค้นหา
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <stat.icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{stat.value}</div>
                <div className="text-blue-100 font-prompt text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-prompt"
            >
              บริการของเรา
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-lg lg:text-xl font-prompt max-w-3xl mx-auto"
            >
              เรามีบริการครบครันสำหรับทุกความต้องการ พร้อมทีมงานมืออาชีพให้คำปรึกษา
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-20 h-20 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg`}>
                  <service.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-prompt text-center">{service.title}</h3>
                <p className="text-gray-600 font-prompt text-center mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3 text-gray-700 font-prompt">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-prompt"
            >
              ทำไมต้องเลือกเรา
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-lg lg:text-xl font-prompt max-w-3xl mx-auto"
            >
              ประสบการณ์และความน่าเชื่อถือที่ลูกค้าไว้วางใจมากกว่า 10 ปี
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 font-prompt">{feature.title}</h3>
                  <p className="text-gray-600 font-prompt">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-prompt"
            >
              Property แนะนำ
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-lg lg:text-xl font-prompt max-w-3xl mx-auto"
            >
              Property ยอดนิยมที่ลูกค้าให้ความสนใจ พร้อมทำเลและราคาที่เหมาะสม
            </motion.p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                      alt={property.title}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {property.type === 'residential' ? 'ที่อยู่อาศัย' : 
                       property.type === 'commercial' ? 'เชิงพาณิชย์' : 'ที่ดิน'}
                    </div>
                    <button className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full transition-all duration-300">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-prompt">{property.title}</h3>
                    <div className="flex items-center text-gray-600 mb-4 font-prompt">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{property.location || property.address}</span>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <HomeIcon className="h-4 w-4" />
                          <span>{property.bedrooms || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-4 w-4" />
                          <span>{property.bathrooms || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>120</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">฿{property.price?.toLocaleString()}</div>
                        {property.rent_price > 0 && (
                          <div className="text-sm text-gray-500">฿{property.rent_price?.toLocaleString()}/เดือน</div>
                        )}
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                      <span>ดูรายละเอียด</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-prompt"
            >
              ความประทับใจจากลูกค้า
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-lg lg:text-xl font-prompt max-w-3xl mx-auto"
            >
              ฟังเสียงจากลูกค้าที่ไว้วางใจเราในการหาบ้านในฝัน
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 font-prompt">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm font-prompt">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 font-prompt leading-relaxed">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-white mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-prompt"
            >
              ติดต่อเรา
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-blue-100 text-lg lg:text-xl font-prompt max-w-3xl mx-auto"
            >
              พร้อมให้คำปรึกษาและบริการคุณตลอด 24 ชั่วโมง
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center text-white"
            >
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-prompt">โทรศัพท์</h3>
              <p className="text-blue-100 font-prompt text-lg">02-123-4567</p>
              <p className="text-blue-200 font-prompt text-sm">จันทร์-ศุกร์ 9:00-18:00</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center text-white"
            >
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-prompt">อีเมล</h3>
              <p className="text-blue-100 font-prompt text-lg">info@kunpitch.com</p>
              <p className="text-blue-200 font-prompt text-sm">ตอบกลับภายใน 24 ชั่วโมง</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center text-white"
            >
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-prompt">เวลาทำการ</h3>
              <p className="text-blue-100 font-prompt text-lg">จันทร์-ศุกร์ 9:00-18:00</p>
              <p className="text-blue-200 font-prompt text-sm">เสาร์ 9:00-15:00</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              ติดต่อเราเลย
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-600 rounded-lg p-2">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-prompt">Kunpitch</h3>
                  <p className="text-xs text-gray-400 font-prompt">Real Estate</p>
                </div>
              </div>
              <p className="text-gray-400 font-prompt leading-relaxed">
                บริษัทอสังหาริมทรัพย์ชั้นนำที่มุ่งมั่นให้บริการลูกค้าด้วยความซื่อสัตย์และเป็นมืออาชีพ
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 font-prompt">บริการ</h4>
              <ul className="space-y-3 text-gray-400 font-prompt">
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">ที่อยู่อาศัย</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">เชิงพาณิชย์</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">ที่ดิน</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">ให้คำปรึกษา</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 font-prompt">บริษัท</h4>
              <ul className="space-y-3 text-gray-400 font-prompt">
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">เกี่ยวกับเรา</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">ทีมงาน</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">ข่าวสาร</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">ติดต่อ</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 font-prompt">ติดต่อ</h4>
              <ul className="space-y-3 text-gray-400 font-prompt">
                <li>123 ถนนสุขุมวิท, กรุงเทพฯ</li>
                <li>02-123-4567</li>
                <li>info@kunpitch.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 font-prompt">
            <p>&copy; 2024 Kunpitch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home 