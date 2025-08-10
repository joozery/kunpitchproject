import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Home as HomeIcon, Building2, Eye, Heart, ArrowRight } from 'lucide-react'
import { propertyAPI } from '../lib/api'

const FeaturedPropertiesSection = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <section className="py-20" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'}}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-prompt"
            style={{background: 'linear-gradient(135deg, #203d6b, #1d5e9d, #8bb4db)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}
          >
            ประกาศแนะนำ
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-700 text-lg lg:text-xl font-prompt max-w-3xl mx-auto"
          >
            Property ยอดนิยมที่ลูกค้าให้ความสนใจ พร้อมทำเลและราคาที่เหมาะสม
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2" style={{borderColor: '#1d5e9d'}}></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{border: '2px solid #e5e7eb'}}
              >
                <div className="relative">
                  <img
                    src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  {/* Top Left Tags */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <HomeIcon className="h-3 w-3" />
                      <span>ขาย</span>
                    </div>
                  </div>
                  
                  {/* Top Right Icons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button className="bg-white/90 backdrop-blur-sm text-gray-700 p-1.5 rounded transition-all duration-300 hover:bg-white">
                      <Building2 className="h-3 w-3" />
                    </button>
                    <button className="bg-white/90 backdrop-blur-sm text-gray-700 p-1.5 rounded transition-all duration-300 hover:bg-white">
                      <Heart className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Bottom Right Badge */}
                  {property.type === 'residential' && (
                    <div className="absolute bottom-3 right-3">
                      <div className="text-white px-2 py-1 rounded text-xs font-medium" style={{background: 'linear-gradient(135deg, #1d5e9d, #8bb4db)'}}>
                        ยืนยัน
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  {/* Price - Top */}
                  <div className="mb-3">
                    <div className="text-lg font-bold" style={{color: '#1d5e9d'}}>
                      ฿{(property.price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </div>
                    {property.rent_price > 0 && (
                      <div className="text-xs text-gray-500">฿{(property.rent_price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/เดือน</div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-900 mb-2 font-prompt line-clamp-2">{property.title}</h3>
                  
                  {/* Location */}
                  <div className="flex items-center text-gray-600 mb-4 font-prompt text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="line-clamp-1">{property.address}</span>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <HomeIcon className="h-4 w-4" style={{color: '#1d5e9d'}} />
                        <span className="font-medium">{property.bedrooms || 3}</span>
                        <span>ห้องนอน</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4" style={{color: '#1d5e9d'}} />
                        <span className="font-medium">{property.bathrooms || 2}</span>
                        <span>ห้องน้ำ</span>
                      </div>
                    </div>
                    
                    {/* Area */}
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">พื้นที่: {property.area || '95.00'} ตร.ม.</span>
                    </div>
                    
                    {/* Views */}
                    <div className="flex items-center justify-end text-xs text-gray-500">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{Math.floor(Math.random() * 300) + 100}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedPropertiesSection 