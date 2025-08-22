import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye as EyeIcon } from 'lucide-react'
import { TbViewportWide, TbStairsUp } from 'react-icons/tb'
import { SlLocationPin } from 'react-icons/sl'
import { LuBath } from 'react-icons/lu'
import { IoBedOutline } from 'react-icons/io5'

const formatPriceWithoutDecimal = (price) => {
  if (!price) return '0'
  const num = parseFloat(price) || 0
  return Math.floor(num).toLocaleString('th-TH')
}

const getTypeColor = (type) => {
  const colorMap = {
    condo: '#0cc0df',
    house: '#00bf63',
    apartment: '#5271ff',
    townhouse: '#2ea36b',
    commercial: '#8c52ff',
    building: '#b294ec',
    land: '#ffb800'
  }
  return colorMap[type] || '#0cc0df'
}

const LatestStyleCard = ({ property, type = 'condo', onClick }) => {
  const navigate = useNavigate()
  const getPropertyImage = (p) => {
    if (p.cover_image) return normalizeUrl(p.cover_image)
    if (p.images) {
      try {
        const arr = Array.isArray(p.images) ? p.images : JSON.parse(p.images)
        if (Array.isArray(arr) && arr.length > 0) return normalizeUrl(arr[0])
      } catch {
        return normalizeUrl(p.images)
      }
    }
    const fallback = {
      condo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      house: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      land: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    }
    return fallback[type] || fallback.condo
  }

  const normalizeUrl = (u) => {
    if (!u) return u
    if (u.startsWith('http://')) return u.replace('http://', 'https://')
    if (u.startsWith('//')) return 'https:' + u
    return u
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-white rounded-2xl overflow-hidden transition-all duration-700 transform hover:-translate-y-4 h-full flex flex-col group cursor-pointer font-prompt shadow-lg hover:shadow-xl"
      onClick={onClick}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>

      <div className="relative overflow-hidden h-44 sm:h-52 flex-shrink-0">
        <img
          src={getPropertyImage(property)}
          alt={property.title || property.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-4 left-4">
          <div className="text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20" style={{ backgroundColor: getTypeColor(type) }}>
            {({ condo: 'คอนโด', house: 'บ้านเดี่ยว', land: 'ที่ดิน', commercial: 'โฮมออฟฟิศ' }[type] || 'อสังหาฯ')}
          </div>
        </div>
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#ffffff' }}>
          {property.status === 'for_sale' || property.status === 'sale'
            ? 'ขาย'
            : property.status === 'for_rent' || property.status === 'rent'
            ? 'เช่า'
            : property.rent_price > 0
            ? 'เช่า'
            : 'ขาย'}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-gray-900 mb-2 font-prompt group-hover:text-blue-600 transition-colors duration-300 leading-snug line-clamp-2">
          {property.title || property.name}
        </h3>

        <div className="space-y-2 mb-4 text-xs text-gray-600">
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
          <div className="flex items-center gap-2 whitespace-nowrap">
            <SlLocationPin className="h-4 w-4" style={{ color: '#243756' }} />
            <span className="truncate" title={property.location || property.address || 'ไม่ระบุที่อยู่'}>
              {property.location || property.address || 'ไม่ระบุที่อยู่'}
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              {(() => {
                const hasSale = property.price && property.price > 0
                const hasRent = property.rent_price && property.rent_price > 0
                if (hasSale && hasRent) {
                  return (
                    <>
                      <div className="text-xl font-bold" style={{ color: '#243756' }}>฿{formatPriceWithoutDecimal(property.price)}</div>
                      <div className="text-lg font-semibold" style={{ color: '#243756' }}>฿{formatPriceWithoutDecimal(property.rent_price)}/เดือน</div>
                    </>
                  )
                } else if (hasSale && !hasRent) {
                  return <div className="text-xl font-bold" style={{ color: '#243756' }}>฿{formatPriceWithoutDecimal(property.price)}</div>
                } else if (!hasSale && hasRent) {
                  return <div className="text-xl font-bold" style={{ color: '#243756' }}>฿{formatPriceWithoutDecimal(property.rent_price)}/เดือน</div>
                } else {
                  return <div className="text-lg text-gray-500">ราคาติดต่อ</div>
                }
              })()}
            </div>

            <div className="flex items-center text-xs text-gray-500">
              <EyeIcon className="h-4 w-4 mr-1" />
              <span>{property.views || 0} ครั้ง</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              className="inline-flex items-center justify-center gap-2 text-white py-3 px-8 rounded-full font-bold text-sm transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
              style={{ background: 'linear-gradient(to right, #1c4d85, #051d40)' }}
              onClick={(e) => {
                e.stopPropagation()
                if (property?.id) navigate(`/property/${property.id}`)
              }}
            >
              <span className="relative z-10">Details</span>
              <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LatestStyleCard


