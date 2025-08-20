import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye as EyeIcon } from 'lucide-react'
import { propertyAPI } from '../lib/api'
import { useCurrency } from '../lib/CurrencyContext'
import { TbViewportWide, TbStairsUp } from 'react-icons/tb'
import { SlLocationPin } from 'react-icons/sl'
import { LuBath } from 'react-icons/lu'
import { IoBedOutline } from 'react-icons/io5'
import AutoTranslate from './AutoTranslate'

const FeaturedPropertiesSection = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const { convert, format } = useCurrency()
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'for_sale':
        return 'bg-green-500 text-white';
      case 'for_rent':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
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

  const PropertyCard = ({ property, type }) => {
    const getPropertyImage = (property) => {
      // Check for cover_image first
      if (property.cover_image) {
        // Ensure the URL is absolute and uses HTTPS
        let imageUrl = property.cover_image
        if (imageUrl.startsWith('http://')) {
          imageUrl = imageUrl.replace('http://', 'https://')
        }
        if (imageUrl.startsWith('//')) {
          imageUrl = 'https:' + imageUrl
        }
        return imageUrl
      }
      
      // Check for images array
      if (property.images) {
        let imagesArray = property.images
        
        // If images is a string, try to parse it as JSON
        if (typeof property.images === 'string') {
          try {
            imagesArray = JSON.parse(property.images)
          } catch (e) {
            // If parsing fails, treat it as a single image URL
            let imageUrl = property.images
            if (imageUrl.startsWith('http://')) {
              imageUrl = imageUrl.replace('http://', 'https://')
            }
            if (imageUrl.startsWith('//')) {
              imageUrl = 'https:' + imageUrl
            }
            return imageUrl
          }
        }
        
        // If it's an array and has items, return the first one
        if (Array.isArray(imagesArray) && imagesArray.length > 0) {
          let imageUrl = imagesArray[0]
          if (imageUrl.startsWith('http://')) {
            imageUrl = imageUrl.replace('http://', 'https://')
          }
          if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl
          }
          return imageUrl
        }
      }
      
      // Fallback images based on property type (using HTTPS)
      const fallbackImages = {
        residential: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        condo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        land: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      }
      return fallbackImages[type] || fallbackImages.residential
    }

    const getTypeLabel = (type) => {
      const labels = {
        residential: 'บ้านเดี่ยว',
        condo: 'คอนโด',
        land: 'ที่ดิน',
        commercial: 'โฮมออฟฟิศ'
      }
      return labels[type] || 'อสังหาฯ'
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white rounded-2xl overflow-hidden transition-all duration-700 transform hover:-translate-y-4 h-full flex flex-col group cursor-pointer font-prompt shadow-lg hover:shadow-xl"
      >
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
        
        {/* Image Container */}
        <div className="relative overflow-hidden h-52 flex-shrink-0">
          <img
            src={getPropertyImage(property)}
            alt={property.title || property.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              // Fallback to a default image if the current one fails
              const fallbackImages = {
                residential: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                condo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                land: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
              }
              e.target.src = fallbackImages[type] || fallbackImages.residential
            }}
            loading="lazy"
          />
          
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Top Left Badge with Blue-Gold Gradient */}
          <div className="absolute top-4 left-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
              {getTypeLabel(type)}
            </div>
          </div>
          
          {/* Top Right Status Badge (custom colors) */}
          <div className="absolute top-4 right-4">
            <div
              className="text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20"
              style={{
                background:
                  property.status === 'sale'
                    ? '#00bf63'
                    : property.status === 'rent'
                    ? '#0cc0df'
                    : 'linear-gradient(90deg, #00bf63 0%, #0cc0df 100%)'
              }}
            >
              {property.status === 'sale' ? 'ขาย' : property.status === 'rent' ? 'เช่า' : 'ขาย/เช่า'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 font-prompt group-hover:text-blue-600 transition-colors duration-300 leading-snug line-clamp-2">
            <AutoTranslate 
              thaiText={property.title || property.name} 
              targetLang="en"
              fallbackText={property.title || property.name}
            />
          </h3>

          {/* Location placed under title */}
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-2 min-w-0">
            <SlLocationPin className="h-4 w-4 text-blue-500" />
            <span className="truncate" title={property.location || property.address || 'ไม่ระบุที่อยู่'}>
              <AutoTranslate 
                thaiText={property.location || property.address || 'ไม่ระบุที่อยู่'} 
                targetLang="en" 
                fallbackText={property.location || property.address || 'Address not specified'}
              />
            </span>
          </div>

          {/* Details Rows */}
          <div className="space-y-3 mb-4 text-sm">
            {/* Row 1: Bed, Bath */}
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <IoBedOutline className="h-4 w-4 text-blue-500" />
                <span className="truncate">
                  <AutoTranslate thaiText="ห้องนอน" targetLang="en" fallbackText="Bedrooms" />: {property.bedrooms || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <LuBath className="h-4 w-4 text-blue-500" />
                <span className="truncate">
                  <AutoTranslate thaiText="ห้องน้ำ" targetLang="en" fallbackText="Bathrooms" />: {property.bathrooms || 'N/A'}
                </span>
              </div>
            </div>
            {/* Row 2: Area, Floor */}
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <TbViewportWide className="h-4 w-4 text-blue-500" />
                <span className="truncate">
                  <AutoTranslate thaiText="พื้นที่" targetLang="en" fallbackText="Area" />: {property.area ? `${property.area} ตร.ม.` : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <TbStairsUp className="h-4 w-4 text-blue-500" />
                <span className="truncate">
                  <AutoTranslate thaiText="ชั้นที่" targetLang="en" fallbackText="Floor" />: {property.floor || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-center justify-end mb-4">
              <div className="text-right">
                {property.rent_price > 0 && (
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                    {format(convert(property.rent_price))}/<AutoTranslate thaiText="เดือน" targetLang="en" fallbackText="month" />
                  </div>
                )}
                <div className="text-sm text-gray-600 font-medium">
                  {format(convert(property.price))}
                </div>
                <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
                  <EyeIcon className="h-4 w-4 mr-1 text-green-500" />
                  <span>{clickCounts[property.id] || 0} <AutoTranslate thaiText="ครั้ง" targetLang="en" fallbackText="times" /></span>
                </div>
              </div>
            </div>
            
            {/* View Details Button with Blue Gradient */}
            <div className="flex justify-center">
              <button 
                className="inline-flex items-center justify-center gap-2 text-white py-3 px-8 rounded-full font-bold text-sm transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
                style={{ background: 'linear-gradient(to right, #1c4d85, #051d40)' }}
                onClick={() => {
                  handleCardClick(property.id, type)
                  navigate(`/property/${property.id}`)
                }}
              >
                <span className="relative z-10">
                  <AutoTranslate thaiText="รายละเอียด" targetLang="en" fallbackText="Details" />
                </span>
                <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                
                {/* Button Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
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
            <span className="text-blue-600 font-oswald text-base md:text-lg lg:text-xl uppercase tracking-wider">
              <AutoTranslate thaiText="ดีลร้อน" targetLang="en" fallbackText="Hot Deal" />
            </span>
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

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))
          ) : featuredProperties.length > 0 ? (
            featuredProperties.map((property) => (
              <div key={property.id}>
                <PropertyCard property={property} type={property.type} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">
                <AutoTranslate thaiText="ไม่พบทรัพย์สิน" targetLang="en" fallbackText="No properties found" />
              </div>
            </div>
          )}
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
              <AutoTranslate thaiText="ดูทรัพย์สินเพิ่มเติม" targetLang="en" fallbackText="View More Properties" />
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default FeaturedPropertiesSection 