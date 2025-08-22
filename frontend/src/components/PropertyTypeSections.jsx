import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye as EyeIcon } from 'lucide-react'
import { useCurrency } from '../lib/CurrencyContext'
import { TbViewportWide, TbStairsUp } from 'react-icons/tb'
import { SlLocationPin } from 'react-icons/sl'
import { LuBath } from 'react-icons/lu'
import { IoBedOutline } from 'react-icons/io5'
import { condoAPI, houseAPI, landAPI, commercialAPI } from '../lib/api'

const PropertyTypeSections = () => {
  const navigate = useNavigate()
  const { convert, format } = useCurrency()
  const [condos, setCondos] = useState([])
  const [houses, setHouses] = useState([])
  const [lands, setLands] = useState([])
  const [commercials, setCommercials] = useState([])
  const [loading, setLoading] = useState({
    condos: true,
    houses: true,
    lands: true,
    commercials: true
  })

  // Click tracking state
  const [clickCounts, setClickCounts] = useState({})

  // ฟังก์ชันสำหรับ property type
  const getTypeLabel = (type) => ({
    condo: 'คอนโด',
    house: 'บ้าน',
    land: 'ที่ดิน',
    commercial: 'โฮมออฟฟิศ'
  }[type] || 'อสังหาฯ')

  // ฟังก์ชันสำหรับสีของแต่ละ property type
  const getTypeColor = (type) => {
    const colorMap = {
      condo: '#0cc0df',      // คอนโด - สีฟ้า
      house: '#00bf63',      // บ้าน - สีเขียว
      apartment: '#5271ff',  // อพาร์ตเม้นท์ - สีน้ำเงิน
      townhouse: '#2ea36b',  // ทาวเฮาส์ - สีเขียวเข้ม
      commercial: '#8c52ff', // โฮมออฟฟิศ - สีม่วง
      building: '#b294ec',   // อาคารพาณิชย์ - สีม่วงอ่อน
      land: '#ffb800'        // ที่ดิน - สีส้ม
    }
    return colorMap[type] || '#0cc0df' // default เป็นสีคอนโด
  }

  // ฟังก์ชันสำหรับแสดงราคาเป็นจำนวนเต็ม
  const formatPriceWithoutDecimal = (price) => {
    if (!price) return '0'
    const num = parseFloat(price) || 0
    return Math.floor(num).toLocaleString('th-TH')
  }

  // Handle card click
  const handleCardClick = (propertyId, propertyType) => {
    setClickCounts(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] || 0) + 1
    }))
    
    // Log click for analytics
    console.log(`Card clicked: ${propertyType} - ID: ${propertyId}, Clicks: ${(clickCounts[propertyId] || 0) + 1}`)
    
    // Here you can add API call to save click data to database
    // saveClickData(propertyId, propertyType)
  }

  // Fetch data for each property type
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch condos
        const condosResult = await condoAPI.getAll({ limit: 8 })
        console.log('Condos API response:', condosResult)
        if (condosResult && condosResult.success) {
          setCondos(condosResult.data || [])
        }
        setLoading(prev => ({ ...prev, condos: false }))
      } catch (error) {
        console.error('Failed to fetch condos:', error)
        setLoading(prev => ({ ...prev, condos: false }))
      }

      try {
        // Fetch houses
        const housesResult = await houseAPI.getAll({ limit: 8 })
        console.log('Houses API response:', housesResult)
        if (housesResult && housesResult.success) {
          setHouses(housesResult.data || [])
        }
        setLoading(prev => ({ ...prev, houses: false }))
      } catch (error) {
        console.error('Failed to fetch houses:', error)
        setLoading(prev => ({ ...prev, houses: false }))
      }

      try {
        // Fetch lands
        const landsResult = await landAPI.getAll({ limit: 8 })
        console.log('Lands API response:', landsResult)
        if (landsResult && landsResult.success) {
          setLands(landsResult.data || [])
        }
        setLoading(prev => ({ ...prev, lands: false }))
      } catch (error) {
        console.error('Failed to fetch lands:', error)
        setLoading(prev => ({ ...prev, lands: false }))
      }

      try {
        // Fetch commercials
        const commercialsResult = await commercialAPI.getAll({ limit: 8 })
        console.log('Commercials API response:', commercialsResult)
        if (commercialsResult && commercialsResult.success) {
          setCommercials(commercialsResult.data || [])
          console.log('Commercials data:', commercialsResult.data)
        }
        setLoading(prev => ({ ...prev, commercials: false }))
      } catch (error) {
        console.error('Failed to fetch commercials:', error)
        setLoading(prev => ({ ...prev, commercials: false }))
      }
    }

    fetchData()
  }, [])

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
    console.log(`Property ${type} data:`, property)
    
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
        condo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        house: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        land: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      }
      return fallbackImages[type] || fallbackImages.condo
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
                condo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                house: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                land: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
              }
              e.target.src = fallbackImages[type] || fallbackImages.condo
            }}
            loading="lazy"
          />
          
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Top Left Badge */}
          <div className="absolute top-4 left-4">
            <div 
              className="text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20"
              style={{ backgroundColor: getTypeColor(type) }}
            >
              {getTypeLabel(type)}
            </div>
          </div>
          
          {/* Top Right Status */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#ffffff' }}>
            {property.rent_price > 0 ? 'เช่า' : 'ขาย'}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 font-prompt group-hover:text-blue-600 transition-colors duration-300 leading-snug line-clamp-2">
            {property.title || property.name}
          </h3>

          {/* Property details */}
          <div className="space-y-2 mb-4 text-xs text-gray-600">
            {/* Row 1: Bed, Bath */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <IoBedOutline className="h-4 w-4" style={{ color: '#243756' }} />
                <span className="truncate">ห้องนอน: {property.bedrooms || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <LuBath className="h-4 w-4" style={{ color: '#243756' }} />
                <span className="truncate">ห้องน้ำ: {property.bathrooms || 'N/A'}</span>
              </div>
            </div>
            {/* Row 2: Area, Floor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <TbViewportWide className="h-4 w-4" style={{ color: '#243756' }} />
                <span className="truncate">พื้นที่: {property.area ? `${property.area} ตร.ม.` : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <TbStairsUp className="h-4 w-4" style={{ color: '#243756' }} />
                <span className="truncate">ชั้นที่: {property.floor || 'N/A'}</span>
              </div>
            </div>
            {/* Row 3: Location */}
            <div className="flex items-center gap-2 whitespace-nowrap">
              <SlLocationPin className="h-4 w-4" style={{ color: '#243756' }} />
              <span className="truncate" title={property.location || property.address || 'ไม่ระบุที่อยู่'}>
                {property.location || property.address || 'ไม่ระบุที่อยู่'}
              </span>
            </div>
          </div>

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              {/* ราคาทางซ้าย */}
              <div className="text-left">
                {/* แสดงราคาตามเงื่อนไข */}
                {(() => {
                  const hasSale = property.price && property.price > 0;
                  const hasRent = property.rent_price && property.rent_price > 0;
                  
                  if (hasSale && hasRent) {
                    // มีทั้งขายและเช่า
                    return (
                      <>
                        <div className="text-xl font-bold" style={{ color: '#243756' }}>฿{formatPriceWithoutDecimal(property.price)}</div>
                        <div className="text-lg font-semibold" style={{ color: '#243756' }}>฿{formatPriceWithoutDecimal(property.rent_price)}/เดือน</div>
                      </>
                    );
                  } else if (hasSale && !hasRent) {
                    // มีแค่ขาย
                    return (
                      <div className="text-xl font-bold" style={{ color: '#243756' }}>฿{formatPriceWithoutDecimal(property.price)}</div>
                    );
                  } else if (!hasSale && hasRent) {
                    // มีแค่เช่า
                    return (
                      <div className="text-xl font-bold" style={{ color: '#243756' }}>฿{formatPriceWithoutDecimal(property.rent_price)}/เดือน</div>
                    );
                  } else {
                    // ไม่มีราคา
                    return (
                      <div className="text-lg text-gray-500">ราคาติดต่อ</div>
                    );
                  }
                })()}
              </div>
              
              {/* จำนวนการเข้าชมทางขวา */}
              <div className="flex items-center text-xs text-gray-500">
                <EyeIcon className="h-4 w-4 mr-1" style={{ color: '#243756' }} />
                <span>{clickCounts[property.id] || 0} ครั้ง</span>
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
                <span className="relative z-10">Details</span>
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

    // Combine all property types and sort by latest update time
    const getUpdatedAt = (item) => item.updated_at || item.updatedAt || item.created_at || item.createdAt || item.date || 0
    const allLoading = loading.condos || loading.houses || loading.lands || loading.commercials
    const latestItems = [
      ...condos.map(p => ({ ...p, __type: 'condo' })),
      ...houses.map(p => ({ ...p, __type: 'house' })),
      ...lands.map(p => ({ ...p, __type: 'land' })),
      ...commercials.map(p => ({ ...p, __type: 'commercial' })),
    ]
      .sort((a, b) => new Date(getUpdatedAt(b)) - new Date(getUpdatedAt(a)))
      .slice(0, 12)

    return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hot Deal Section */}
        <div className="mb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
              <span className="text-blue-600 font-oswald text-base md:text-lg lg:text-xl uppercase tracking-wider">Lastest Update</span>
              <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-oswald text-center text-blue-600 flex items-center justify-center"
            >
              <img 
                src="https://img.icons8.com/ios/50/new--v1.png" 
                alt="Latest Update Icon" 
                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
              />
            </motion.h2>
          </div>

          {/* Slider like Hot Deals layout */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex space-x-2">
              <button 
                onClick={() => document.getElementById('latest-scroll').scrollLeft -= 400}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ArrowRight className="h-5 w-5 text-blue-600 rotate-180" />
              </button>
              <button 
                onClick={() => document.getElementById('latest-scroll').scrollLeft += 400}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>

          <div 
            id="latest-scroll"
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allLoading ? (
              <div className="flex space-x-6 w-full">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/4 h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              latestItems.map((item, index) => (
                <div key={`${item.__type}-${item.id || index}`} className="flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/4">
                  <PropertyCard property={item} type={item.__type} />
                </div>
              ))
            )}
          </div>
        </div>
        





      </div>
    </div>
  )
}

export default PropertyTypeSections 