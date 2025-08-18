import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye as EyeIcon } from 'lucide-react'
import { TbViewportWide, TbStairsUp } from 'react-icons/tb'
import { SlLocationPin } from 'react-icons/sl'
import { LuBath } from 'react-icons/lu'
import { IoBedOutline } from 'react-icons/io5'
import { condoAPI, houseAPI, landAPI, commercialAPI } from '../lib/api'
import { useCurrency } from '../lib/CurrencyContext'

const ExclusiveUnits = () => {
  const navigate = useNavigate()
  const { convert, format } = useCurrency()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [c, h, l, cm] = await Promise.all([
          condoAPI.getAll({ limit: 20 }),
          houseAPI.getAll({ limit: 20 }),
          landAPI.getAll({ limit: 20 }),
          commercialAPI.getAll({ limit: 20 })
        ])

        const normalize = (res, type) =>
          (res && res.success ? res.data || [] : []).map(p => ({ ...p, __type: type }))

        const all = [
          ...normalize(c, 'condo'),
          ...normalize(h, 'house'),
          ...normalize(l, 'land'),
          ...normalize(cm, 'commercial')
        ]

        const getUpdatedAt = (p) => p.updated_at || p.updatedAt || p.created_at || p.createdAt || 0
        const latest = all
          .sort((a, b) => new Date(getUpdatedAt(b)) - new Date(getUpdatedAt(a)))
          .slice(0, 12)
        setItems(latest)
      } catch (e) {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const formatPrice = (price) => {
    if (!price) return '0'
    const num = parseFloat(price) || 0
    return Math.floor(num).toLocaleString('th-TH')
  }

  const getTypeLabel = (type) => ({
    condo: 'คอนโด',
    house: 'บ้าน',
    land: 'ที่ดิน',
    commercial: 'โฮมออฟฟิศ'
  }[type] || 'อสังหาฯ')

  const getStatusStyle = (status) => {
    if (status === 'for_sale' || status === 'sale') return { background: '#00bf63', color: '#fff' }
    if (status === 'for_rent' || status === 'rent') return { background: '#0cc0df', color: '#fff' }
    return { background: 'linear-gradient(90deg, #00bf63 0%, #0cc0df 100%)', color: '#fff' }
  }

  const getPropertyImage = (property, fallbackKey = 'condo') => {
    if (property.cover_image) {
      let url = property.cover_image
      if (url.startsWith('http://')) url = url.replace('http://', 'https://')
      if (url.startsWith('//')) url = 'https:' + url
      return url
    }
    if (property.images) {
      try {
        const arr = Array.isArray(property.images) ? property.images : JSON.parse(property.images)
        if (arr && arr.length) {
          let url = arr[0]
          if (url.startsWith('http://')) url = url.replace('http://', 'https://')
          if (url.startsWith('//')) url = 'https:' + url
          return url
        }
      } catch (e) {
        let url = property.images
        if (url && url.startsWith('http://')) url = url.replace('http://', 'https://')
        if (url && url.startsWith('//')) url = 'https:' + url
        return url
      }
    }
    const fb = {
      condo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      house: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      land: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    }
    return fb[fallbackKey] || fb.condo
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header same style as Lastest Update */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            <span className="text-blue-600 font-oswald text-base md:text-lg lg:text-xl uppercase tracking-wider">Exclusive Units</span>
            <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-oswald text-center text-blue-600 flex items-center justify-center"
          >
            <img src="https://img.icons8.com/ios/50/guarantee--v1.png" alt="Exclusive Units Icon" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </motion.h2>
        </div>

        {/* Slider controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => document.getElementById('exclusive-scroll').scrollLeft -= 400}
              className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ArrowRight className="h-5 w-5 text-blue-600 rotate-180" />
            </button>
            <button
              onClick={() => document.getElementById('exclusive-scroll').scrollLeft += 400}
              className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ArrowRight className="h-5 w-5 text-blue-600" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex space-x-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-96 h-96 bg-gray-200 rounded-2xl animate-pulse flex-shrink-0"></div>
            ))}
          </div>
        ) : (
          <div id="exclusive-scroll" className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {items.map((property, index) => (
              <div key={`${property.__type}-${property.id || index}`} className="flex-shrink-0 w-96">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
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

                  {/* Image Container */}
                  <div className="relative overflow-hidden h-52 flex-shrink-0">
                    <img
                      src={getPropertyImage(property, property.__type)}
                      alt={property.title || property.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Top Left Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
                        {getTypeLabel(property.__type)}
                      </div>
                    </div>
                    {/* Top Right Status */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20" style={getStatusStyle(property.status)}>
                      {property.status === 'for_sale' || property.status === 'sale' ? 'ขาย' : property.status === 'for_rent' || property.status === 'rent' ? 'เช่า' : 'ขาย/เช่า'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-base font-semibold text-gray-900 mb-3 font-prompt group-hover:text-blue-600 transition-colors duration-300 leading-snug line-clamp-2">
                      {property.title || property.name}
                    </h3>

                    <div className="space-y-3 mb-4 text-sm">
                      {/* Row 1 */}
                      <div className="flex items-center gap-4 text-gray-600">
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
                      {/* Row 2 */}
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <TbViewportWide className="h-4 w-4 text-blue-500" />
                          <span>{property.area ? `${property.area} ตร.ม.` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SlLocationPin className="h-4 w-4 text-blue-500" />
                          <span>{property.location || property.address || 'ไม่ระบุที่อยู่'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Views */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-end mb-4">
                        <div className="text-right">
                          {property.rent_price > 0 && (
                            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">{format(convert(property.rent_price))}/เดือน</div>
                          )}
                          <div className="text-sm text-gray-600 font-medium">{format(convert(property.price))}</div>
                          <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
                            <EyeIcon className="h-4 w-4 mr-1 text-green-500" />
                            <span>{property.views || 0} ครั้ง</span>
                          </div>
                        </div>
                      </div>

                      {/* Details Button */}
                      <div className="flex justify-center">
                        <button
                          className="inline-flex items-center justify-center gap-2 text-white py-3 px-8 rounded-full font-bold text-sm transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
                          style={{ background: 'linear-gradient(to right, #1c4d85, #051d40)' }}
                          onClick={() => navigate(`/property/${property.id}`)}
                        >
                          <span className="relative z-10">Details</span>
                          <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ExclusiveUnits

