import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Home as HomeIcon, Building2, Eye, Heart, ArrowRight, Bed, Bath, Search, Grid, List, Eye as EyeIcon, Filter, SlidersHorizontal, Star, Ruler, Car, ChevronLeft, ChevronRight } from 'lucide-react'
import LatestStyleCard from '../components/cards/LatestStyleCard'
import { condoAPI, houseAPI, landAPI, commercialAPI } from '../lib/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCurrency } from '../lib/CurrencyContext'
import { Link } from 'react-router-dom'
import bgBuy from '../assets/bgbuy.jpg'
import sectionBg from '../assets/bg .png'

const Buy = () => {
  const { convert, format } = useCurrency()
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterPrice, setFilterPrice] = useState('all')
  const [filterBedrooms, setFilterBedrooms] = useState('all')
  const [filterArea, setFilterArea] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)

  // Click tracking state
  const [clickCounts, setClickCounts] = useState({})

  // Handle card click
  const handleCardClick = (propertyId, propertyType) => {
    setClickCounts(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] || 0) + 1
    }))
    
    console.log(`Buy page card clicked: ${propertyType} - ID: ${propertyId}, Clicks: ${(clickCounts[propertyId] || 0) + 1}`)
  }

  // Fetch properties for sale (from all types)
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const [c, h, l, cm] = await Promise.all([
          condoAPI.getAll({ limit: 50 }),
          houseAPI.getAll({ limit: 50 }),
          landAPI.getAll({ limit: 50 }),
          commercialAPI.getAll({ limit: 50 })
        ])

        const normalize = (res, type) => (res && res.success ? res.data || [] : []).map(p => ({ ...p, type: p.type || type }))
        const all = [
          ...normalize(c, 'condo'),
          ...normalize(h, 'residential'),
          ...normalize(l, 'land'),
          ...normalize(cm, 'commercial')
        ]

        // Filter properties that can be sold (status or has price)
        let saleProperties = all.filter(property => {
          const statusSale = property.status === 'for_sale' || property.listingType === 'sale' || property.status === 'sale'
          const hasSalePrice = Number(property.price) > 0
          return statusSale || hasSalePrice
        })

          // Top-up with mocks to ensure multiple rows
          const saleMocks = [
            { id: 101, title: 'คอนโดหรู 1 ห้องนอน ใกล้ BTS พร้อมเข้าอยู่', address: 'สุขุมวิท, กรุงเทพฯ', location: 'สุขุมวิท, กรุงเทพฯ', price: 4200000, bedrooms: 1, bathrooms: 1, floor: 15, area: 32, parking: 1, type: 'condo', status: 'for_sale', images: ['https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop'] },
            { id: 102, title: 'บ้านเดี่ยวสไตล์โมเดิร์น โครงการใหม่', address: 'รามอินทรา, กรุงเทพฯ', location: 'รามอินทรา, กรุงเทพฯ', price: 6900000, bedrooms: 3, bathrooms: 2, floor: 2, area: 180, parking: 2, type: 'residential', status: 'for_sale', images: ['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1200&auto=format&fit=crop'] },
            { id: 103, title: 'ตึกพาณิชย์ 3 ชั้น ทำเลค้าขาย', address: 'ลาดพร้าว, กรุงเทพฯ', location: 'ลาดพร้าว, กรุงเทพฯ', price: 8500000, bedrooms: 0, bathrooms: 2, floor: 3, area: 150, parking: 1, type: 'commercial', status: 'for_sale', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'] },
            { id: 104, title: 'คอนโดวิวเมือง ห้องมุม', address: 'อโศก, กรุงเทพฯ', location: 'อโศก, กรุงเทพฯ', price: 5200000, bedrooms: 2, bathrooms: 2, floor: 22, area: 60, parking: 1, type: 'condo', status: 'for_sale', images: ['https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop'] },
            { id: 105, title: 'บ้านเดี่ยวพื้นที่กว้าง ทำเลเงียบสงบ', address: 'พระราม 2, กรุงเทพฯ', location: 'พระราม 2, กรุงเทพฯ', price: 7800000, bedrooms: 4, bathrooms: 3, floor: 2, area: 220, parking: 2, type: 'residential', status: 'for_sale', images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop'] },
            { id: 106, title: 'คอนโดหรูติดแม่น้ำ', address: 'เจริญนคร, กรุงเทพฯ', location: 'เจริญนคร, กรุงเทพฯ', price: 9800000, bedrooms: 2, bathrooms: 2, floor: 28, area: 72, parking: 1, type: 'condo', status: 'for_sale', images: ['https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=1200&auto=format&fit=crop'] },
            { id: 107, title: 'ที่ดินเปล่าถมแล้ว เหมาะลงทุน', address: 'บางบ่อ, สมุทรปราการ', location: 'บางบ่อ, สมุทรปราการ', price: 3500000, bedrooms: 0, bathrooms: 0, floor: 0, area: 400, parking: 0, type: 'land', status: 'for_sale', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop'] },
            { id: 108, title: 'คอนโดโลว์ไรส์ เงียบสงบ', address: 'Ari, กรุงเทพฯ', location: 'อารีย์, กรุงเทพฯ', price: 3100000, bedrooms: 1, bathrooms: 1, floor: 6, area: 35, parking: 1, type: 'condo', status: 'for_sale', images: ['https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop'] }
          ]

          if (!saleProperties || saleProperties.length < 8) {
            const need = 8 - (saleProperties?.length || 0)
            saleProperties = [ ...(saleProperties || []), ...saleMocks.slice(0, Math.max(0, need)) ]
          }

          setProperties(saleProperties)
          setFilteredProperties(saleProperties)
      } catch (error) {
        console.error('Failed to fetch properties:', error)
        // Fallback data - richer mock list (at least 8 for multiple rows)
        const initial = [
          {
            id: 1,
            title: 'คอนโดหรู 2 ห้องนอน พร้อมเฟอร์นิเจอร์',
            address: 'สีลม, กรุงเทพฯ',
            location: 'สีลม, กรุงเทพฯ',
            price: 3500000,
            bedrooms: 2,
            bathrooms: 1,
            floor: 15,
            area: 45,
            parking: 1,
            type: 'condo',
            status: 'for_sale',
            images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
            amenities: ['สระว่ายน้ำ', 'ฟิตเนส', 'ที่จอดรถ'],
            projectCode: 'WS001',
            announcerStatus: 'agent'
          },
          {
            id: 2,
            title: 'บ้านเดี่ยว 3 ห้องนอน สวนสวย',
            address: 'สุขุมวิท, กรุงเทพฯ',
            location: 'สุขุมวิท, กรุงเทพฯ',
            price: 8500000,
            bedrooms: 3,
            bathrooms: 2,
            floor: 1,
            area: 120,
            parking: 2,
            type: 'residential',
            status: 'for_sale',
            images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
            amenities: ['สวนส่วนตัว', 'ที่จอดรถ', 'ระบบรักษาความปลอดภัย'],
            projectCode: 'WS002',
            announcerStatus: 'owner'
          }
        ]

        const topup = [
          {
            id: 3,
            title: 'คอนโดวิวเมือง ใกล้รถไฟฟ้า',
            address: 'อโศก, กรุงเทพฯ',
            location: 'อโศก, กรุงเทพฯ',
            price: 4910000,
            bedrooms: 1,
            bathrooms: 1,
            floor: 20,
            area: 29.65,
            parking: 1,
            type: 'condo',
            status: 'for_sale',
            images: ['https://images.unsplash.com/photo-1505691723518-36a5ac3b2d35?q=80&w=1200&auto=format&fit=crop']
          },
          {
            id: 4,
            title: 'ตึกพาณิชย์ 3 ชั้น ทำเลค้าขาย',
            address: 'ลาดพร้าว, กรุงเทพฯ',
            location: 'ลาดพร้าว, กรุงเทพฯ',
            price: 8500000,
            bedrooms: 0,
            bathrooms: 2,
            floor: 3,
            area: 150,
            parking: 1,
            type: 'commercial',
            status: 'for_sale',
            images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop']
          }
        ,
          { id: 5, title: 'บ้านเดี่ยวพื้นที่กว้าง ทำเลเงียบสงบ', address: 'พระราม 2, กรุงเทพฯ', location: 'พระราม 2, กรุงเทพฯ', price: 7800000, bedrooms: 4, bathrooms: 3, floor: 2, area: 220, parking: 2, type: 'residential', status: 'for_sale', images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop'] },
          { id: 6, title: 'คอนโดหรูติดแม่น้ำ', address: 'เจริญนคร, กรุงเทพฯ', location: 'เจริญนคร, กรุงเทพฯ', price: 9800000, bedrooms: 2, bathrooms: 2, floor: 28, area: 72, parking: 1, type: 'condo', status: 'for_sale', images: ['https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=1200&auto=format&fit=crop'] },
          { id: 7, title: 'ที่ดินเปล่าถมแล้ว เหมาะลงทุน', address: 'บางบ่อ, สมุทรปราการ', location: 'บางบ่อ, สมุทรปราการ', price: 3500000, bedrooms: 0, bathrooms: 0, floor: 0, area: 400, parking: 0, type: 'land', status: 'for_sale', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop'] },
          { id: 8, title: 'คอนโดโลว์ไรส์ เงียบสงบ', address: 'อารีย์, กรุงเทพฯ', location: 'อารีย์, กรุงเทพฯ', price: 3100000, bedrooms: 1, bathrooms: 1, floor: 6, area: 35, parking: 1, type: 'condo', status: 'for_sale', images: ['https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop'] }
        ]

        const targetCount = 8
        const merged = initial.length >= targetCount ? initial : [...initial, ...topup.slice(0, targetCount - initial.length)]
        setProperties(merged)
        setFilteredProperties(merged)
      }
      finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Filter properties
  useEffect(() => {
    let filtered = properties.filter(property => {
      const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || property.type === filterType
      
      let matchesPrice = true
      if (filterPrice !== 'all') {
        const price = property.price || 0
        switch (filterPrice) {
          case '0-2000000':
            matchesPrice = price >= 0 && price <= 2000000
            break
          case '2000000-5000000':
            matchesPrice = price > 2000000 && price <= 5000000
            break
          case '5000000-10000000':
            matchesPrice = price > 5000000 && price <= 10000000
            break
          case '10000000+':
            matchesPrice = price > 10000000
            break
        }
      }

      let matchesBedrooms = true
      if (filterBedrooms !== 'all') {
        const bedrooms = property.bedrooms || 0
        switch (filterBedrooms) {
          case '1':
            matchesBedrooms = bedrooms === 1
            break
          case '2':
            matchesBedrooms = bedrooms === 2
            break
          case '3+':
            matchesBedrooms = bedrooms >= 3
            break
        }
      }

      let matchesArea = true
      if (filterArea !== 'all') {
        const area = property.area || 0
        switch (filterArea) {
          case '0-50':
            matchesArea = area >= 0 && area <= 50
            break
          case '50-100':
            matchesArea = area > 50 && area <= 100
            break
          case '100+':
            matchesArea = area > 100
            break
        }
      }
      
      return matchesSearch && matchesType && matchesPrice && matchesBedrooms && matchesArea
    })

    setFilteredProperties(filtered)
    setCurrentPage(1)
  }, [properties, searchTerm, filterType, filterPrice, filterBedrooms, filterArea])

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / pageSize))
  const pageItems = filteredProperties.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const getPagination = () => {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages - 1, totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'residential':
        return 'บ้านเดี่ยว'
      case 'condo':
        return 'คอนโด'
      case 'commercial':
        return 'พาณิชย์'
      case 'land':
        return 'ที่ดิน'
      default:
        return type
    }
  }

  const getAnnouncerStatusLabel = (status) => {
    switch (status) {
      case 'owner':
        return 'เจ้าของ'
      case 'agent':
        return 'นายหน้า'
      default:
        return 'ไม่ระบุ'
    }
  }

  const getAnnouncerStatusColor = (status) => {
    switch (status) {
      case 'owner':
        return 'bg-purple-500 text-white'
      case 'agent':
        return 'bg-orange-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const formatPrice = (price) => {
    if (!price) return '0'
    const numPrice = parseFloat(price) || 0
    return Math.floor(numPrice).toLocaleString('th-TH')
  }

  const PropertyCard = ({ property }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={() => handleCardClick(property.id, property.type)}
    >
      <Link to={`/property/${property.id}`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAnnouncerStatusColor(property.announcerStatus)}`}>
              {getAnnouncerStatusLabel(property.announcerStatus)}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold">
              {getTypeLabel(property.type)}
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
              ขาย
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
            <div className="text-right">
              <div className="text-xl font-bold text-blue-600">{format(convert(property.price))}</div>
              <div className="text-sm text-gray-500">บาท</div>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-blue-500" />
            {property.location || property.address}
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <Bed className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <div className="text-xs text-gray-600">ห้องนอน</div>
              <div className="font-semibold text-gray-900">{property.bedrooms || 'N/A'}</div>
            </div>
            <div className="text-center">
              <Bath className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <div className="text-xs text-gray-600">ห้องน้ำ</div>
              <div className="font-semibold text-gray-900">{property.bathrooms || 'N/A'}</div>
            </div>
            <div className="text-center">
              <Ruler className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <div className="text-xs text-gray-600">ขนาด</div>
              <div className="font-semibold text-gray-900">{property.area ? `${property.area} ตร.ม.` : 'N/A'}</div>
            </div>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{property.amenities.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <Eye className="h-4 w-4 mr-1" />
              {clickCounts[property.id] || 0}
            </div>
            <div className="flex items-center text-blue-600 text-sm font-semibold">
              ดูรายละเอียด
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-prompt">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="relative text-white py-20">
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden">
          <img src={bgBuy} alt="background" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ backgroundColor: '#051d40', opacity: 0.85 }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-prompt">
              ซื้ออสังหาริมทรัพย์
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl font-prompt">
              ค้นพบทรัพย์สินที่ใช่สำหรับคุณ ตั้งแต่คอนโดหรู บ้านเดี่ยว ไปจนถึงที่ดินเชิงพาณิชย์
            </p>
            <div className="flex flex-wrap justify-start gap-4 text-sm">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-prompt">
                <span className="font-semibold">{filteredProperties.length}</span> ทรัพย์สิน
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-prompt">
                <span className="font-semibold">100%</span> ตรวจสอบแล้ว
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-prompt">
                <span className="font-semibold">24/7</span> บริการ
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="ค้นหาตามชื่อ, ที่อยู่ หรือทำเล..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Filter className="h-5 w-5" />
              ตัวกรอง
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">ประเภททั้งหมด</option>
                  <option value="condo">คอนโด</option>
                  <option value="residential">บ้านเดี่ยว</option>
                  <option value="commercial">พาณิชย์</option>
                  <option value="land">ที่ดิน</option>
                </select>

                <select
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">ราคาทั้งหมด</option>
                  <option value="0-2000000">0 - 2 ล้าน</option>
                  <option value="2000000-5000000">2 - 5 ล้าน</option>
                  <option value="5000000-10000000">5 - 10 ล้าน</option>
                  <option value="10000000+">10 ล้านขึ้นไป</option>
                </select>

                <select
                  value={filterBedrooms}
                  onChange={(e) => setFilterBedrooms(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">ห้องนอนทั้งหมด</option>
                  <option value="1">1 ห้องนอน</option>
                  <option value="2">2 ห้องนอน</option>
                  <option value="3+">3+ ห้องนอน</option>
                </select>

                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">ขนาดทั้งหมด</option>
                  <option value="0-50">0 - 50 ตร.ม.</option>
                  <option value="50-100">50 - 100 ตร.ม.</option>
                  <option value="100+">100+ ตร.ม.</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Properties Grid / Hot deals mock */}
      <section className="py-8 sm:py-12 relative">
        {/* Section background with overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img src={sectionBg} alt="section-bg" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-prompt">
                ทรัพย์สินสำหรับขาย
              </h2>
              <p className="text-gray-600">
                พบ {filteredProperties.length} รายการ
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-prompt">
                <option value="newest">ใหม่ล่าสุด</option>
                <option value="price-low">ราคาต่ำ-สูง</option>
                <option value="price-high">ราคาสูง-ต่ำ</option>
                <option value="area-low">ขนาดเล็ก-ใหญ่</option>
                <option value="area-high">ขนาดใหญ่-เล็ก</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {pageItems.length > 0 ? (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {pageItems.map((property) => (
                <LatestStyleCard key={property.id} property={property} type={property.type || 'condo'} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-prompt">
                ไม่พบทรัพย์สินที่ตรงกับเงื่อนไข
              </h3>
              <p className="text-gray-600 mb-6">
                ลองปรับเปลี่ยนเงื่อนไขการค้นหาหรือตัวกรอง
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterType('all')
                  setFilterPrice('all')
                  setFilterBedrooms('all')
                  setFilterArea('all')
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-prompt"
              >
                ล้างตัวกรอง
              </button>
            </div>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-10 gap-2 select-none overflow-x-auto px-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {getPagination().map((p, idx) => p === '...'
                ? (
                  <span key={`dots-${idx}`} className="px-3 text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-2 rounded-lg border ${currentPage === p ? 'bg-white text-blue-900 border-blue-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 border-transparent'}`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>


      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Buy
