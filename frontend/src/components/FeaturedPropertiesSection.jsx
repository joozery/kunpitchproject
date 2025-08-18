import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye as EyeIcon } from 'lucide-react'
import { TbViewportWide, TbStairsUp } from 'react-icons/tb'
import { SlLocationPin } from 'react-icons/sl'
import { LuBath } from 'react-icons/lu'
import { IoBedOutline } from 'react-icons/io5'
import { propertyAPI } from '../lib/api'

const FeaturedPropertiesSection = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  // Click tracking state
  const [clickCounts, setClickCounts] = useState({})

  // Handle card click
  const handleCardClick = (propertyId, propertyType) => {
    setClickCounts(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] || 0) + 1
    }))
    
    // Log click for analytics
    console.log(`Featured card clicked: ${propertyType} - ID: ${propertyId}, Clicks: ${(clickCounts[propertyId] || 0) + 1}`)
    
    // Here you can add API call to save click data to database
    // saveClickData(propertyId, propertyType)
  }

  // Fetch featured properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const result = await propertyAPI.getAll()
        if (result && result.success && result.data) {
          // Get first 6 properties for featured section
          setProperties(result.data.slice(0, 6))
        } else {
          // Fallback data if API fails
          setProperties([
            {
              id: 1,
              title: 'บ้านเดี่ยว 3 ห้องนอน',
              address: 'สุขุมวิท, กรุงเทพฯ',
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
              address: 'สีลม, กรุงเทพฯ',
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
              address: 'บางนา, กรุงเทพฯ',
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
            address: 'สุขุมวิท, กรุงเทพฯ',
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
            address: 'สีลม, กรุงเทพฯ',
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
            address: 'บางนา, กรุงเทพฯ',
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

  const getTypeLabel = (type) => {
    switch (type) {
      case 'residential':
        return 'บ้านเดี่ยว';
      case 'condo':
        return 'คอนโด';
      case 'land':
        return 'ที่ดิน';
      default:
        return 'ประเภทอื่น';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'for_sale':
        return 'ขาย';
      case 'for_rent':
        return 'เช่า';
      default:
        return 'สถานะอื่น';
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'for_sale' || status === 'sale') {
      return { background: '#00bf63', color: '#ffffff' }
    }
    if (status === 'for_rent' || status === 'rent') {
      return { background: '#0cc0df', color: '#ffffff' }
    }
    // default mixed or unknown -> gradient
    return { background: 'linear-gradient(90deg, #00bf63 0%, #0cc0df 100%)', color: '#ffffff' }
  };

  const formatPrice = (price) => {
    if (!price) return '0'
    // Convert to number and remove decimals
    const numPrice = parseFloat(price) || 0
    return Math.floor(numPrice).toLocaleString('th-TH')
  }

  const formatRentPrice = (rentPrice) => {
    if (!rentPrice) return null
    // Convert to number and remove decimals
    const numRentPrice = parseFloat(rentPrice) || 0
    return Math.floor(numRentPrice).toLocaleString('th-TH')
  }

  const featuredProperties = properties;

  return (
    <section className="py-16 bg-white relative overflow-hidden">

      
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
            <span className="text-blue-600 font-oswald text-base md:text-lg lg:text-xl uppercase tracking-wider">Hot Deal</span>
            <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-oswald text-center text-blue-600 flex items-center justify-center"
          >
            <img 
              src="https://img.icons8.com/external-kosonicon-outline-kosonicon/64/external-hot-deal-black-friday-kosonicon-outline-kosonicon-2.png" 
              alt="Hot Deal Icon" 
              className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
            />
          </motion.h2>
        </div>

        {/* Properties Slider */}
        <div className="relative">
          <div 
            id="featured-scroll"
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Navigation Arrows */}
            <button 
              onClick={() => document.getElementById('featured-scroll').scrollLeft -= 400}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
            >
              <ArrowRight className="h-6 w-6 text-slate-700 rotate-180" />
            </button>
            <button 
              onClick={() => document.getElementById('featured-scroll').scrollLeft += 400}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
            >
              <ArrowRight className="h-6 w-6 text-slate-700" />
            </button>
          {loading ? (
            <div className="flex space-x-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-96 h-96 bg-gray-200 rounded-2xl animate-pulse flex-shrink-0"></div>
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            featuredProperties.map((property, index) => (
              <div key={property.id} className="flex-shrink-0 w-96">
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative bg-white rounded-2xl overflow-hidden transition-all duration-700 transform hover:-translate-y-4 h-full flex flex-col group cursor-pointer font-prompt"
                  style={{
                    background: '#ffffff',
                    border: '3px solid transparent',
                    borderRadius: '16px',
                    backgroundImage: 'linear-gradient(#ffffff, #ffffff), linear-gradient(135deg, #3b82f6, #6b7280, #f59e0b)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'content-box, border-box',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59,130,246,0.2)'
                  }}
                >
                  {/* Gradient Border Overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-gray-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                  
                  <div className="relative">
                    <img
                      src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="absolute top-4 left-4">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
                        {getTypeLabel(property.type)}
                      </div>
                    </div>
                    <div
                      className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm border border-white/20"
                      style={getStatusStyle(property.status)}
                    >
                      {getStatusLabel(property.status)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-2 font-prompt group-hover:text-blue-600 transition-colors duration-300 leading-snug">{property.title}</h3>
                    {/* Feature Rows */}
                    <div className="space-y-3 mb-4">
                      {/* Row 1: Bed, Bath, Floor */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoBedOutline className="h-4 w-4 text-blue-500" />
                          <span>{property.bedrooms ? `${property.bedrooms} ห้องนอน` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <LuBath className="h-4 w-4 text-blue-500" />
                          <span>{property.bathrooms ? `${property.bathrooms} ห้องน้ำ` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TbStairsUp className="h-4 w-4 text-blue-500" />
                          <span>{property.floor ? `ชั้นที่ ${property.floor}` : 'N/A'}</span>
                        </div>
                      </div>
                      {/* Row 2: Area and Location */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <TbViewportWide className="h-4 w-4 text-blue-500" />
                          <span>{property.area ? `${property.area} ตร.ม.` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SlLocationPin className="h-4 w-4 text-blue-500" />
                          <span>{property.location || property.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price and Views */}
                    <div className="flex items-center justify-end">
                      <div className="text-right">
                        {property.rent_price > 0 && (
                          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">฿{formatRentPrice(property.rent_price)}/เดือน</div>
                        )}
                        <div className="text-sm text-gray-600">฿{formatPrice(property.price)}</div>
                        <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
                          <EyeIcon className="h-4 w-4 mr-1 text-green-500" />
                          <span>{clickCounts[property.id] || 0} ครั้ง</span>
                        </div>
                      </div>
                    </div>
                  </div>
                    <button className="mx-auto inline-flex items-center justify-center gap-2 text-white py-3 px-8 rounded-full font-bold text-sm transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
                       style={{ background: 'linear-gradient(to right, #1c4d85, #051d40)' }}
                       onClick={() => {
                         handleCardClick(property.id, property.type)
                         navigate(`/property/${property.id}`)
                       }}
                    >
                      <span className="relative z-10">Details</span>
                      <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                      
                      {/* Button Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                </motion.div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 w-full">
              <div className="text-gray-500 text-lg">No properties found</div>
            </div>
          )}
        </div>
        </div>

        {/* View All Button */}
        {featuredProperties.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30">
              View More Properties
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default FeaturedPropertiesSection 