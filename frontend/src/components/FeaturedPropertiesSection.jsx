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

  return (
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
  )
}

export default FeaturedPropertiesSection 