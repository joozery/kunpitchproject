import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye as EyeIcon } from 'lucide-react'
import { TbViewportWide, TbStairsUp } from 'react-icons/tb'
import { SlLocationPin } from 'react-icons/sl'
import { LuBath } from 'react-icons/lu'
import { IoBedOutline, IoDiamondOutline } from 'react-icons/io5'
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

        // Ensure at least 4 cards are available (add mock items if API returns less)
        let ensure = latest
        if (latest.length < 4) {
          const mockItems = [
            {
              id: 'mock-ex-1',
              __type: 'condo',
              title: 'Mock Condo – River View',
              bedrooms: 1,
              bathrooms: 1,
              area: 35,
              floor: 12,
              location: 'Bangkok',
              status: 'for_sale',
              price: 3200000,
              rent_price: 0,
              views: 0,
              images: ['https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop']
            },
            {
              id: 'mock-ex-2',
              __type: 'house',
              title: 'Mock House – Minimal Style',
              bedrooms: 3,
              bathrooms: 2,
              area: 180,
              floor: 2,
              location: 'Nonthaburi',
              status: 'for_sale',
              price: 8500000,
              rent_price: 0,
              views: 0,
              images: ['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1200&auto=format&fit=crop']
            },
            {
              id: 'mock-ex-3',
              __type: 'commercial',
              title: 'Mock Office – Ready to Move',
              bedrooms: 0,
              bathrooms: 2,
              area: 150,
              floor: 5,
              location: 'Sukhumvit, Bangkok',
              status: 'for_rent',
              price: 0,
              rent_price: 65000,
              views: 0,
              images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop']
            },
            {
              id: 'mock-ex-4',
              __type: 'land',
              title: 'Mock Land – Corner Plot',
              bedrooms: 0,
              bathrooms: 0,
              area: 200,
              floor: null,
              location: 'Pathum Thani',
              status: 'for_sale',
              price: 5200000,
              rent_price: 0,
              views: 0,
              images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop']
            }
          ]
          ensure = [...latest, ...mockItems.slice(0, 4 - latest.length)]
        }
        setItems(ensure)
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

  // ฟังก์ชันใหม่สำหรับแสดงราคาเป็นจำนวนเต็ม
  const formatPriceWithoutDecimal = (price) => {
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

  // ฟังก์ชันใหม่สำหรับสีของแต่ละ property type
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
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            <span className="text-blue-600 font-oswald text-base md:text-lg lg:text-xl uppercase tracking-wider flex items-center gap-2">
              <IoDiamondOutline className="w-5 h-5" />
              Exclusive Units
            </span>
            <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-oswald text-center text-blue-600 flex items-center justify-center"
          >
            <IoDiamondOutline className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </motion.h2>
        </div>

        {/* Slider like Hot Deals layout */}
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
          <div className="flex space-x-6 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/4 h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div id="exclusive-scroll" className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {items.map((property, index) => (
              <div key={`${property.__type}-${property.id || index}`} className="flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="relative bg-white rounded-2xl overflow-hidden transition-all duration-700 transform hover:-translate-y-4 h-full flex flex-col group cursor-pointer font-prompt shadow-lg hover:shadow-xl"
                >

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
                    <div 
                      className="text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20"
                      style={{ backgroundColor: getTypeColor(property.__type) }}
                    >
                      {getTypeLabel(property.__type)}
                    </div>
                  </div>
                  {/* Top Right Status */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#ffffff' }}>
                    {property.status === 'for_sale' || property.status === 'sale' ? 'ขาย' : property.status === 'for_rent' || property.status === 'rent' ? 'เช่า' : 'ขาย/เช่า'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 font-prompt group-hover:text-blue-600 transition-colors duration-300 leading-snug line-clamp-2">
                    {property.title || property.name}
                  </h3>

                  {/* Property details */}
                  <div className="space-y-2 mb-4 text-xs text-gray-600">
                    {/* แถวที่ 1: ห้องนอน | ห้องน้ำ */}
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
                    {/* แถวที่ 2: พื้นที่ | ชั้นที่ */}
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
                    {/* แถวที่ 3: โลเคชัน (1 คอลัมน์เต็ม) */}
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <SlLocationPin className="h-4 w-4" style={{ color: '#243756' }} />
                      <span className="truncate" title={property.location || property.address || 'ไม่ระบุที่อยู่'}>
                        {property.location || property.address || 'ไม่ระบุที่อยู่'}
                      </span>
                    </div>
                  </div>

                  {/* Price and Views */}
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
                        <span>{property.views || 0} ครั้ง</span>
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

