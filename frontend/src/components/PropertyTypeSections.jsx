import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Home as HomeIcon, Building2, Eye, Heart, ArrowRight, Bed, Bath, Car, Ruler, Building, Square, Eye as EyeIcon } from 'lucide-react'
import { condoAPI, houseAPI, landAPI, commercialAPI } from '../lib/api'

const PropertyTypeSections = () => {
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

    const getTypeLabel = (type) => {
      const labels = {
        condo: 'คอนโด',
        house: 'บ้าน',
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
        className="relative bg-white rounded-2xl overflow-hidden transition-all duration-700 transform hover:-translate-y-4 h-full flex flex-col group cursor-pointer"
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
          
          {/* Top Left Badge with Blue-Gold Gradient */}
          <div className="absolute top-4 left-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
              {getTypeLabel(type)}
            </div>
          </div>
          
          {/* Top Right Price Badge with Gold */}
          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm border border-white/20">
              ฿{formatPrice(property.price)}
            </div>
          </div>
          
          {/* Bottom Right Status Badge with Gray */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
              {property.status === 'sale' ? 'ขาย' : property.status === 'rent' ? 'เช่า' : 'ขาย/เช่า'}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-3 font-prompt group-hover:text-blue-600 transition-colors duration-300">
            {property.title || property.name}
          </h3>
          
          {/* Location */}
          <p className="text-gray-600 mb-4 font-prompt flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            {property.location || property.address || 'ไม่ระบุที่อยู่'}
          </p>

          {/* Property Details */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            {property.bedrooms && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Bed className="h-4 w-4 text-blue-500" />
                <span>{property.bedrooms} ห้องนอน</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Bath className="h-4 w-4 text-blue-500" />
                <span>{property.bathrooms} ห้องน้ำ</span>
              </div>
            )}
            {property.area && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Square className="h-4 w-4 text-blue-500" />
                <span>{property.area} ตร.ม.</span>
              </div>
            )}
            {property.parking && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Car className="h-4 w-4 text-blue-500" />
                <span>{property.parking} ที่จอด</span>
              </div>
            )}
          </div>
          
          {/* Price Section */}
          <div className="mt-auto">
            <div className="text-right mb-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                ฿{formatPrice(property.price)}
              </div>
              {property.rent_price > 0 && (
                <div className="text-sm text-gray-500 font-medium">
                  ฿{formatRentPrice(property.rent_price)}/เดือน
                </div>
              )}
              {/* Click Count near Price */}
              <div className="flex items-center justify-end mt-2 text-sm text-gray-500">
                <EyeIcon className="h-4 w-4 mr-1 text-green-500" />
                <span>{clickCounts[property.id] || 0} ครั้ง</span>
              </div>
            </div>
            
            {/* View Details Button with Blue-Gold Gradient */}
            <button 
              className="w-full bg-gradient-to-r from-blue-600 via-gray-600 to-yellow-500 text-white py-3 px-4 rounded-xl font-bold text-sm transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group-hover:from-blue-500 group-hover:via-gray-500 group-hover:to-yellow-400 relative overflow-hidden"
              onClick={() => handleCardClick(property.id, type)}
            >
              <span className="relative z-10">ดูรายละเอียด</span>
              <ArrowRight className="h-4 w-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              
              {/* Button Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Condos Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-prompt">คอนโด</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => document.getElementById('condos-scroll').scrollLeft -= 400}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ArrowRight className="h-5 w-5 text-blue-600 rotate-180" />
              </button>
              <button 
                onClick={() => document.getElementById('condos-scroll').scrollLeft += 400}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          <div 
            id="condos-scroll"
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading.condos ? (
              <div className="flex space-x-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-80 h-96 bg-gray-200 rounded-2xl animate-pulse flex-shrink-0"></div>
                ))}
              </div>
            ) : (
              condos.map((condo, index) => (
                <div key={condo.id} className="flex-shrink-0 w-80">
                  <PropertyCard property={condo} type="condo" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Houses Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-prompt">บ้าน</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => document.getElementById('houses-scroll').scrollLeft -= 400}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ArrowRight className="h-5 w-5 text-blue-600 rotate-180" />
              </button>
              <button 
                onClick={() => document.getElementById('houses-scroll').scrollLeft += 400}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          <div 
            id="houses-scroll"
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading.houses ? (
              <div className="flex space-x-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-80 h-96 bg-gray-200 rounded-2xl animate-pulse flex-shrink-0"></div>
                ))}
              </div>
            ) : (
              houses.map((house, index) => (
                <div key={house.id} className="flex-shrink-0 w-80">
                  <PropertyCard property={house} type="house" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lands Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-prompt">ที่ดิน</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => document.getElementById('lands-scroll').scrollLeft -= 400}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ArrowRight className="h-5 w-5 text-blue-600 rotate-180" />
              </button>
              <button 
                onClick={() => document.getElementById('lands-scroll').scrollLeft += 400}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          <div 
            id="lands-scroll"
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading.lands ? (
              <div className="flex space-x-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-80 h-96 bg-gray-200 rounded-2xl animate-pulse flex-shrink-0"></div>
                ))}
              </div>
            ) : (
              lands.map((land, index) => (
                <div key={land.id} className="flex-shrink-0 w-80">
                  <PropertyCard property={land} type="land" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Commercials Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-prompt">โฮมออฟฟิศ</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => document.getElementById('commercials-scroll').scrollLeft -= 400}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ArrowRight className="h-5 w-5 text-blue-600 rotate-180" />
              </button>
              <button 
                onClick={() => document.getElementById('commercials-scroll').scrollLeft += 400}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          <div 
            id="commercials-scroll"
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading.commercials ? (
              <div className="flex space-x-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-80 h-96 bg-gray-200 rounded-2xl animate-pulse flex-shrink-0"></div>
                ))}
              </div>
            ) : (
              commercials.map((commercial, index) => (
                <div key={commercial.id} className="flex-shrink-0 w-80">
                  <PropertyCard property={commercial} type="commercial" />
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