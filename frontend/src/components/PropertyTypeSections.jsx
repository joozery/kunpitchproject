import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Home as HomeIcon, Building2, Eye, Heart, ArrowRight, Bed, Bath, Car, Ruler, Building } from 'lucide-react'
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

  // Fetch data for each property type
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch condos
        const condosResult = await condoAPI.getAll({ limit: 8 })
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
    if (!price) return 'ราคาติดต่อ'
    return `฿${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  const formatRentPrice = (rentPrice) => {
    if (!rentPrice) return null
    return `฿${rentPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/เดือน`
  }

    const PropertyCard = ({ property, type }) => {
    console.log(`Property ${type} data:`, property)
    
        const getPropertyImage = (property) => {
      console.log(`Getting image for ${type}:`, { cover_image: property.cover_image, images: property.images })
      
      // Check for cover_image first
      if (property.cover_image) {
        console.log(`Using cover_image: ${property.cover_image}`)
        return property.cover_image
      }
      
      // Check for images array
      if (property.images) {
        let imagesArray = property.images
        
        // If images is a string, try to parse it as JSON
        if (typeof property.images === 'string') {
          try {
            imagesArray = JSON.parse(property.images)
            console.log('Parsed images string:', imagesArray)
          } catch (e) {
            console.warn('Failed to parse images string:', property.images)
          }
        }
        
        // If it's an array and has items, return the first one
        if (Array.isArray(imagesArray) && imagesArray.length > 0) {
          console.log(`Using first image from array: ${imagesArray[0]}`)
          return imagesArray[0]
        }
      }
      
      // Fallback images based on property type
      const fallbackImages = {
        condo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        house: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        land: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      }
      console.log(`Using fallback image for ${type}: ${fallbackImages[type]}`)
      return fallbackImages[type] || fallbackImages.condo
    }

    const getPropertyTypeLabel = () => {
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
        className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 h-full flex flex-col group cursor-pointer"
      >
        {/* Image */}
        <div className="relative overflow-hidden h-48 flex-shrink-0">
          <img
            src={getPropertyImage(property)}
            alt={property.title || property.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              console.error('Image failed to load:', e.target.src)
              // Fallback to a default image if the current one fails
              const fallbackImages = {
                condo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                house: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                land: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
              }
              e.target.src = fallbackImages[type] || fallbackImages.condo
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Top Left Badge */}
          <div className="absolute top-3 left-3">
            <div className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <HomeIcon className="h-3 w-3" />
              <span>{property.listing_type === 'rent' ? 'เช่า' : 'ขาย'}</span>
            </div>
          </div>
          
          {/* Top Right Icons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button className="bg-white/90 backdrop-blur-sm text-gray-700 p-1.5 rounded transition-all duration-300 hover:bg-white">
              <Eye className="h-3 w-3" />
            </button>
            <button className="bg-white/90 backdrop-blur-sm text-gray-700 p-1.5 rounded transition-all duration-300 hover:bg-white">
              <Heart className="h-3 w-3" />
            </button>
          </div>

          {/* Bottom Right Badge */}
          {property.featured && (
            <div className="absolute bottom-3 right-3">
              <div className="text-white px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-blue-600 to-indigo-600">
                แนะนำ
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Price */}
          <div className="mb-3">
            <div className="text-lg font-bold text-blue-600">
              {formatPrice(property.price)}
            </div>
            {formatRentPrice(property.rent_price) && (
              <div className="text-xs text-gray-500">{formatRentPrice(property.rent_price)}</div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 font-oswald leading-tight line-clamp-2">
            {property.title || property.name}
          </h3>
          
          {/* Location */}
          <div className="flex items-center text-gray-600 mb-4 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-blue-600" />
            <span className="line-clamp-1">{property.location || property.address || 'ไม่ระบุที่อยู่'}</span>
          </div>

          {/* Property Details */}
          <div className="space-y-3 flex-1">
            {type !== 'land' && type !== 'commercial' && (
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Bed className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{property.bedrooms || 0}</span>
                  <span>ห้องนอน</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bath className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{property.bathrooms || 0}</span>
                  <span>ห้องน้ำ</span>
                </div>
              </div>
            )}
            
            {/* Area */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">พื้นที่: {property.area || property.size || 'ไม่ระบุ'} ตร.ม.</span>
            </div>

            {/* Project Name for Condos */}
            {type === 'condo' && property.project_name && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">โครงการ: {property.project_name}</span>
              </div>
            )}

            {/* Commercial Type */}
            {type === 'commercial' && property.commercial_type && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">ประเภท: {property.commercial_type}</span>
              </div>
            )}
          </div>

          {/* View Details Button */}
          <button className="w-full bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-blue-600 mt-4">
            ดูรายละเอียด
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    )
  }

  const PropertySection = ({ title, subtitle, properties, loading, type, icon: Icon }) => {
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
              <span className="text-blue-600 font-semibold text-xs uppercase tracking-wider">{subtitle}</span>
              <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-oswald flex items-center justify-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 50%, #64748b 75%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              <Icon className="h-8 w-8" />
              {title}
            </motion.h2>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg animate-pulse h-96">
                  <div className="h-48 bg-gradient-to-r from-slate-200 to-blue-200"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gradient-to-r from-slate-200 to-blue-200 rounded mb-3"></div>
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-blue-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gradient-to-r from-slate-200 to-blue-200 rounded"></div>
                      <div className="h-4 bg-gradient-to-r from-slate-200 to-blue-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} type={type} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">ไม่พบข้อมูล {title}</div>
            </div>
          )}

          {/* View All Button */}
          {properties.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mt-12"
            >
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30">
                ดู{title}ทั้งหมด
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Condos Section */}
      <PropertySection
        title="คอนโด/อพาร์ตเม้นท์"
        subtitle="Condos & Apartments"
        properties={condos}
        loading={loading.condos}
        type="condo"
        icon={Building2}
      />

      {/* Houses Section */}
      <PropertySection
        title="บ้านเดี่ยว/ทาวน์เฮาส์"
        subtitle="Houses & Townhouses"
        properties={houses}
        loading={loading.houses}
        type="house"
        icon={HomeIcon}
      />

      {/* Lands Section */}
      <PropertySection
        title="ที่ดิน"
        subtitle="Land Properties"
        properties={lands}
        loading={loading.lands}
        type="land"
        icon={Ruler}
      />

      {/* Commercial Section */}
      <PropertySection
        title="โฮมออฟฟิศ/ตึกแถว"
        subtitle="Commercial Properties"
        properties={commercials}
        loading={loading.commercials}
        type="commercial"
        icon={Building}
      />
    </>
  )
}

export default PropertyTypeSections 