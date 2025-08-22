import React from 'react'
import { MapPin, Bed, Bath, Ruler, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const HotDealCard = ({ property }) => {
  const cover = Array.isArray(property.images) ? property.images?.[0] : (property.cover_image || property.images) || 'https://images.unsplash.com/photo-1560185008-b033106af1ff?q=80&w=1200&auto=format&fit=crop'

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-56">
        <img src={cover} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">Hot deal</span>
          {property.type && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">{property.type}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1 font-prompt">
          {property.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-blue-500" />
          {property.location || property.address}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <Bed className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <div className="text-xs text-gray-600">ห้องนอน</div>
            <div className="font-semibold text-gray-900">{property.bedrooms ?? 'N/A'}</div>
          </div>
          <div className="text-center">
            <Bath className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <div className="text-xs text-gray-600">ห้องน้ำ</div>
            <div className="font-semibold text-gray-900">{property.bathrooms ?? 'N/A'}</div>
          </div>
          <div className="text-center">
            <Ruler className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <div className="text-xs text-gray-600">ขนาด</div>
            <div className="font-semibold text-gray-900">{property.area ? `${property.area} ตร.ม.` : 'N/A'}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-blue-600 font-prompt">{property.price?.toLocaleString('th-TH') || '-'}</div>
          <Link to={`/property/${property.id}`} className="inline-flex items-center gap-2 text-blue-600 font-semibold">
            รายละเอียด
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HotDealCard


