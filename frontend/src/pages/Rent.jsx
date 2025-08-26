import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Home as HomeIcon, Building2, Eye, Heart, ArrowRight, Bed, Bath, Search, Grid, List, Eye as EyeIcon, Filter, SlidersHorizontal, Star, Ruler, Car, Calendar, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import LatestStyleCard from '../components/cards/LatestStyleCard'
 
import { condoAPI, houseAPI, landAPI, commercialAPI } from '../lib/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCurrency } from '../lib/CurrencyContext'
import { Link } from 'react-router-dom'
import bgBuy from '../assets/bgbuy.jpg'
import sectionBg from '../assets/bg .png'

const Rent = () => {
  const { convert, format } = useCurrency()
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterRentPrice, setFilterRentPrice] = useState('all')
  const [filterBedrooms, setFilterBedrooms] = useState('all')
  const [filterArea, setFilterArea] = useState('all')
  const [filterDuration, setFilterDuration] = useState('all')
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
    
    console.log(`Rent page card clicked: ${propertyType} - ID: ${propertyId}, Clicks: ${(clickCounts[propertyId] || 0) + 1}`)
  }

  // Fetch properties for rent (from all types)
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

        // Filter properties that can be rented (status or has rent_price)
        let rentProperties = all.filter(property => {
          const statusRent = property.status === 'for_rent' || property.listingType === 'rent' || property.status === 'rent'
          const hasRent = Number(property.rent_price) > 0
          return statusRent || hasRent
        })

          // Top-up with mocks to ensure multiple rows
          const rentMocks = [
            { id: 201, title: 'คอนโดให้เช่า เฟอร์ครบ วิวสวย', address: 'เอกมัย, กรุงเทพฯ', location: 'เอกมัย, กรุงเทพฯ', price: 3500000, rent_price: 22000, bedrooms: 1, bathrooms: 1, floor: 18, area: 30, parking: 1, type: 'condo', status: 'for_rent', images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop'] },
            { id: 202, title: 'บ้านเดี่ยวให้เช่า พร้อมอยู่', address: 'บางนา, กรุงเทพฯ', location: 'บางนา, กรุงเทพฯ', price: 8000000, rent_price: 45000, bedrooms: 3, bathrooms: 2, floor: 2, area: 160, parking: 2, type: 'residential', status: 'for_rent', images: ['https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=1200&auto=format&fit=crop'] },
            { id: 203, title: 'ออฟฟิศให้เช่า ใจกลางเมือง', address: 'สาทร, กรุงเทพฯ', location: 'สาทร, กรุงเทพฯ', price: 5000000, rent_price: 38000, bedrooms: 0, bathrooms: 1, floor: 12, area: 60, parking: 1, type: 'commercial', status: 'for_rent', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'] },
            { id: 204, title: 'คอนโดสตูดิโอ ติด BTS', address: 'อ่อนนุช, กรุงเทพฯ', location: 'อ่อนนุช, กรุงเทพฯ', price: 2200000, rent_price: 18000, bedrooms: 0, bathrooms: 1, floor: 10, area: 28, parking: 1, type: 'condo', status: 'for_rent', images: ['https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=1200&auto=format&fit=crop'] },
            { id: 205, title: 'บ้านเดี่ยวพร้อมอยู่ ใกล้ห้าง', address: 'บางนา, กรุงเทพฯ', location: 'บางนา, กรุงเทพฯ', price: 9500000, rent_price: 55000, bedrooms: 3, bathrooms: 2, floor: 2, area: 160, parking: 2, type: 'residential', status: 'for_rent', images: ['https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1200&auto=format&fit=crop'] },
            { id: 206, title: 'โฮมออฟฟิศให้เช่า 4 ชั้น', address: 'ลาดพร้าว, กรุงเทพฯ', location: 'ลาดพร้าว, กรุงเทพฯ', price: 12000000, rent_price: 65000, bedrooms: 3, bathrooms: 3, floor: 4, area: 220, parking: 2, type: 'commercial', status: 'for_rent', images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop'] },
            { id: 207, title: 'เพนท์เฮาส์ วิวพาโนรามา', address: 'ทองหล่อ, กรุงเทพฯ', location: 'ทองหล่อ, กรุงเทพฯ', price: 19000000, rent_price: 95000, bedrooms: 3, bathrooms: 3, floor: 35, area: 180, parking: 2, type: 'condo', status: 'for_rent', images: ['https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1200&auto=format&fit=crop'] },
            { id: 208, title: 'ทาวน์โฮม 3 ชั้น ให้เช่า', address: 'รัชดา, กรุงเทพฯ', location: 'รัชดา, กรุงเทพฯ', price: 6500000, rent_price: 30000, bedrooms: 3, bathrooms: 3, floor: 3, area: 140, parking: 1, type: 'residential', status: 'for_rent', images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop'] }
          ]

          if (!rentProperties || rentProperties.length < 8) {
            const need = 8 - (rentProperties?.length || 0)
            rentProperties = [ ...(rentProperties || []), ...rentMocks.slice(0, Math.max(0, need)) ]
          }

          setProperties(rentProperties)
          setFilteredProperties(rentProperties)
        } catch (error) {
          console.error('Failed to fetch properties:', error)
          // Fallback data - richer mock list (at least 8 for multiple rows)
          const initialFallback = [
            {
              id: 1,
              title: 'คอนโดหรู 1 ห้องนอน พร้อมเฟอร์นิเจอร์',
              address: 'สีลม, กรุงเทพฯ',
              location: 'สีลม, กรุงเทพฯ',
              price: 3500000,
              rent_price: 25000,
              bedrooms: 1,
              bathrooms: 1,
              floor: 12,
              area: 35,
              parking: 1,
              type: 'condo',
              status: 'for_rent',
              images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
              amenities: ['สระว่ายน้ำ', 'ฟิตเนส', 'ที่จอดรถ', 'อินเทอร์เน็ต'],
              projectCode: 'WS001',
              announcerStatus: 'agent',
              specialFeatures: {
                shortTerm: true,
                allowPet: false,
                allowCompanyRegistration: true
              }
            },
            {
              id: 2,
              title: 'บ้านเดี่ยว 2 ห้องนอน สวนสวย',
              address: 'สุขุมวิท, กรุงเทพฯ',
              location: 'สุขุมวิท, กรุงเทพฯ',
              price: 8500000,
              rent_price: 45000,
              bedrooms: 2,
              bathrooms: 2,
              floor: 1,
              area: 80,
              parking: 2,
              type: 'residential',
              status: 'for_rent',
              images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
              amenities: ['สวนส่วนตัว', 'ที่จอดรถ', 'ระบบรักษาความปลอดภัย', 'อินเทอร์เน็ต'],
              projectCode: 'WS002',
              announcerStatus: 'owner',
              specialFeatures: {
                shortTerm: false,
                allowPet: true,
                allowCompanyRegistration: false
              }
            },
            {
              id: 3,
              title: 'ออฟฟิศ 1 ห้อง พร้อมเฟอร์นิเจอร์',
              address: 'สาทร, กรุงเทพฯ',
              location: 'สาทร, กรุงเทพฯ',
              price: 5000000,
              rent_price: 35000,
              bedrooms: 0,
              bathrooms: 1,
              floor: 8,
              area: 50,
              parking: 1,
              type: 'commercial',
              status: 'for_rent',
              images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
              amenities: ['ที่จอดรถ', 'ระบบรักษาความปลอดภัย', 'อินเทอร์เน็ต', 'เครื่องปรับอากาศ'],
              projectCode: 'WS003',
              announcerStatus: 'agent',
              specialFeatures: {
                shortTerm: true,
                allowPet: false,
                allowCompanyRegistration: true
              }
            },
            { id: 4, title: 'คอนโดสตูดิโอ เฟอร์ครบ ติด BTS', address: 'อ่อนนุช, กรุงเทพฯ', location: 'อ่อนนุช, กรุงเทพฯ', price: 2200000, rent_price: 18000, bedrooms: 0, bathrooms: 1, floor: 10, area: 28, parking: 1, type: 'condo', status: 'for_rent', images: ['https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=1200&auto=format&fit=crop'] },
            { id: 5, title: 'บ้านเดี่ยวพร้อมอยู่ ใกล้ห้าง', address: 'บางนา, กรุงเทพฯ', location: 'บางนา, กรุงเทพฯ', price: 9500000, rent_price: 55000, bedrooms: 3, bathrooms: 2, floor: 2, area: 160, parking: 2, type: 'residential', status: 'for_rent', images: ['https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1200&auto=format&fit=crop'] },
            { id: 6, title: 'โฮมออฟฟิศให้เช่า 4 ชั้น', address: 'ลาดพร้าว, กรุงเทพฯ', location: 'ลาดพร้าว, กรุงเทพฯ', price: 12000000, rent_price: 65000, bedrooms: 3, bathrooms: 3, floor: 4, area: 220, parking: 2, type: 'commercial', status: 'for_rent', images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop'] },
            { id: 7, title: 'เพนท์เฮาส์ วิวพาโนรามา', address: 'ทองหล่อ, กรุงเทพฯ', location: 'ทองหล่อ, กรุงเทพฯ', price: 19000000, rent_price: 95000, bedrooms: 3, bathrooms: 3, floor: 35, area: 180, parking: 2, type: 'condo', status: 'for_rent', images: ['https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1200&auto=format&fit=crop'] },
            { id: 8, title: 'ทาวน์โฮม 3 ชั้น ให้เช่า', address: 'รัชดา, กรุงเทพฯ', location: 'รัชดา, กรุงเทพฯ', price: 6500000, rent_price: 30000, bedrooms: 3, bathrooms: 3, floor: 3, area: 140, parking: 1, type: 'residential', status: 'for_rent', images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop'] }
          ]
          const targetCount = 8
          const mergedFallback = initialFallback.length >= targetCount ? initialFallback : [...initialFallback, ...initialFallback.slice(0, targetCount - initialFallback.length)]
          setProperties(mergedFallback)
          setFilteredProperties(mergedFallback)
        } finally {
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
      
      let matchesRentPrice = true
      if (filterRentPrice !== 'all') {
        const rentPrice = property.rent_price || 0
        switch (filterRentPrice) {
          case '0-15000':
            matchesRentPrice = rentPrice >= 0 && rentPrice <= 15000
            break
          case '15000-30000':
            matchesRentPrice = rentPrice > 15000 && rentPrice <= 30000
            break
          case '30000-50000':
            matchesRentPrice = rentPrice > 30000 && rentPrice <= 50000
            break
          case '50000+':
            matchesRentPrice = rentPrice > 50000
            break
        }
      }

      let matchesBedrooms = true
      if (filterBedrooms !== 'all') {
        const bedrooms = property.bedrooms || 0
        switch (filterBedrooms) {
          case '0':
            matchesBedrooms = bedrooms === 0
            break
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
          case '0-30':
            matchesArea = area >= 0 && area <= 30
            break
          case '30-60':
            matchesArea = area > 30 && area <= 60
            break
          case '60+':
            matchesArea = area > 60
            break
        }
      }

      let matchesDuration = true
      if (filterDuration !== 'all') {
        const shortTerm = property.specialFeatures?.shortTerm || false
        switch (filterDuration) {
          case 'short':
            matchesDuration = shortTerm === true
            break
          case 'long':
            matchesDuration = shortTerm === false
            break
        }
      }
      
      return matchesSearch && matchesType && matchesRentPrice && matchesBedrooms && matchesArea && matchesDuration
    })

    setFilteredProperties(filtered)
    setCurrentPage(1)
  }, [properties, searchTerm, filterType, filterRentPrice, filterBedrooms, filterArea, filterDuration])

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

  const formatRentPrice = (rentPrice) => {
    if (!rentPrice) return '0'
    const numRentPrice = parseFloat(rentPrice) || 0
    return Math.floor(numRentPrice).toLocaleString('th-TH')
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
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold">
              เช่า
            </span>
          </div>
          {property.specialFeatures?.shortTerm && (
            <div className="absolute bottom-3 right-3">
              <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold">
                เช่าช่วงสั้น
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
            <div className="text-right">
              <div className="text-xl font-bold text-blue-600">{format(convert(property.rent_price))}</div>
              <div className="text-sm text-gray-500">บาท/เดือน</div>
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

          {/* Special Features */}
          {property.specialFeatures && (
            <div className="flex flex-wrap gap-1 mb-4">
              {property.specialFeatures.shortTerm && (
                <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                  เช่าช่วงสั้น
                </span>
              )}
              {property.specialFeatures.allowPet && (
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                  อนุญาตสัตว์เลี้ยง
                </span>
              )}
              {property.specialFeatures.allowCompanyRegistration && (
                <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                  ลงทะเบียนบริษัทได้
                </span>
              )}
            </div>
          )}

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
              เช่าอสังหาริมทรัพย์
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl font-prompt">
              ค้นพบที่พักที่ใช่สำหรับคุณ ตั้งแต่คอนโดหรู บ้านเดี่ยว ไปจนถึงออฟฟิศเชิงพาณิชย์
            </p>
            <div className="flex flex-wrap justify-start gap-4 text-sm">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-prompt">
                <span className="font-semibold">{filteredProperties.length}</span> ทรัพย์สิน
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-prompt">
                <span className="font-semibold">100%</span> ตรวจสอบแล้ว
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-prompt">
                <span className="font-semibold">เช่าช่วงสั้น</span> ได้
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
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">ประเภททั้งหมด</option>
                  <option value="condo">คอนโด</option>
                  <option value="residential">บ้านเดี่ยว</option>
                  <option value="commercial">พาณิชย์</option>
                </select>

                <select
                  value={filterRentPrice}
                  onChange={(e) => setFilterRentPrice(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">ราคาเช่าทั้งหมด</option>
                  <option value="0-15000">0 - 15,000 บาท</option>
                  <option value="15000-30000">15,000 - 30,000 บาท</option>
                  <option value="30000-50000">30,000 - 50,000 บาท</option>
                  <option value="50000+">50,000+ บาท</option>
                </select>

                <select
                  value={filterBedrooms}
                  onChange={(e) => setFilterBedrooms(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">ห้องนอนทั้งหมด</option>
                  <option value="0">สตูดิโอ</option>
                  <option value="1">1 ห้องนอน</option>
                  <option value="2">2 ห้องนอน</option>
                  <option value="3+">3+ ห้องนอน</option>
                </select>

                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">ขนาดทั้งหมด</option>
                  <option value="0-30">0 - 30 ตร.ม.</option>
                  <option value="30-60">30 - 60 ตร.ม.</option>
                  <option value="60+">60+ ตร.ม.</option>
                </select>

                <select
                  value={filterDuration}
                  onChange={(e) => setFilterDuration(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">ระยะเวลาทั้งหมด</option>
                  <option value="short">เช่าช่วงสั้น</option>
                  <option value="long">เช่าระยะยาว</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Properties Grid */}
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
                ทรัพย์สินสำหรับเช่า
              </h2>
              <p className="text-gray-600">
                พบ {filteredProperties.length} รายการ
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-prompt">
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
                  setFilterRentPrice('all')
                  setFilterBedrooms('all')
                  setFilterArea('all')
                  setFilterDuration('all')
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-prompt"
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

export default Rent
