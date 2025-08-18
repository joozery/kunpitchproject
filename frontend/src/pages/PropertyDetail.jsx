import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Bed, Bath, Home, Star, ArrowLeft, Eye, Heart, Share2, Phone, Mail, Calendar, Building2, Car, Ruler } from 'lucide-react'
import { FaPhone, FaLine, FaWhatsapp, FaFacebookMessenger, FaFacebook, FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { propertyAPI } from '../lib/api'
import { contactApi } from '../lib/contactApi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCurrency } from '../lib/CurrencyContext'

const PropertyDetail = () => {
  const { id } = useParams()
  const { convert, format } = useCurrency()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [contactInfo, setContactInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch property by ID
        const result = await propertyAPI.getByIdWithFallback(id)
        if (result && result.success && result.data) {
          setProperty(result.data)
          // Increment click count
          setClickCount(prev => prev + 1)
        } else {
          // Fallback data if API fails
          setProperty({
            id: id,
            title: 'คอนโด 2 ห้องนอน พร้อมเฟอร์นิเจอร์',
            address: 'สีลม, กรุงเทพฯ',
            location: 'สีลม, กรุงเทพฯ',
            price: 3500000,
            rent_price: 25000,
            bedrooms: 2,
            bathrooms: 1,
            floor: 15,
            area: 45,
            parking: 1,
            type: 'condo',
            status: 'for_sale',
            description: 'คอนโดสวยงามพร้อมเฟอร์นิเจอร์ ตั้งอยู่ในทำเลทองของสีลม เดินทางสะดวก ใกล้รถไฟฟ้า BTS และ MRT มีสิ่งอำนวยความสะดวกครบครัน',
            images: [
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
              'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
              'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            ],
            amenities: ['สระว่ายน้ำ', 'ฟิตเนส', 'ที่จอดรถ', 'ระบบรักษาความปลอดภัย', 'สวนสาธารณะ'],
            nearby: ['BTS สีลม', 'MRT สีลม', 'ห้างสรรพสินค้า', 'โรงพยาบาล', 'โรงเรียน']
          })
        }
        
        // Fetch contact information
        try {
          const contactResult = await contactApi.getContactSettings()
          if (contactResult && contactResult.data) {
            setContactInfo(contactResult.data)
          } else {
            // Fallback contact data
            setContactInfo({
              phone: '02-123-4567',
              line: 'whalespace',
              messenger: 'https://m.me/whalespace',
              whatsapp: '0812345678',
              facebook: 'https://facebook.com/whalespace',
              instagram: 'https://instagram.com/whalespace'
            })
          }
        } catch (contactError) {
          console.error('Failed to fetch contact info:', contactError)
          // Fallback contact data
          setContactInfo({
            phone: '02-123-4567',
            line: 'whalespace',
            messenger: 'https://m.me/whalespace',
            whatsapp: '0812345678',
            facebook: 'https://facebook.com/whalespace',
            instagram: 'https://instagram.com/whalespace'
          })
        }
        
      } catch (error) {
        console.error('Failed to fetch property:', error)
        // Fallback data if API fails
        setProperty({
          id: id,
          title: 'คอนโด 2 ห้องนอน พร้อมเฟอร์นิเจอร์',
          address: 'สีลม, กรุงเทพฯ',
          location: 'สีลม, กรุงเทพฯ',
          price: 3500000,
          rent_price: 25000,
          bedrooms: 2,
          bathrooms: 1,
          floor: 15,
          area: 45,
          parking: 1,
          type: 'condo',
          status: 'for_sale',
          description: 'คอนโดสวยงามพร้อมเฟอร์นิเจอร์ ตั้งอยู่ในทำเลทองของสีลม เดินทางสะดวก ใกล้รถไฟฟ้า BTS และ MRT มีสิ่งอำนวยความสะดวกครบครัน',
          images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
          ],
          amenities: ['สระว่ายน้ำ', 'ฟิตเนส', 'ที่จอดรถ', 'ระบบรักษาความปลอดภัย', 'สวนสาธารณะ'],
          nearby: ['BTS สีลม', 'MRT สีลม', 'ห้างสรรพสินค้า', 'โรงพยาบาล', 'โรงเรียน']
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const formatPrice = (price) => {
    if (!price) return '0'
    const numPrice = parseFloat(price) || 0
    return Math.floor(numPrice).toLocaleString('th-TH')
  }

  const formatRentPrice = (rentPrice) => {
    if (!rentPrice) return null
    const numRentPrice = parseFloat(rentPrice) || 0
    return Math.floor(numRentPrice).toLocaleString('th-TH')
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'residential':
        return 'บ้านเดี่ยว';
      case 'condo':
        return 'คอนโด';
      case 'land':
        return 'ที่ดิน';
      case 'commercial':
        return 'พาณิชย์';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ไม่พบข้อมูล</h2>
          <p className="text-gray-600 mb-6">ไม่สามารถโหลดข้อมูล property ได้</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Header */}
      <Header />
      


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8">
              <div className="relative">
                <img
                  src={property.images && property.images.length > 0 ? property.images[currentImageIndex] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
                
                {/* Image Navigation */}
                {property.images && property.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 font-oswald">{property.title}</h1>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                    {property.location || property.address}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                    {format(convert(property.price))}
                  </div>
                  {property.rent_price > 0 && (
                    <div className="text-lg text-gray-500">
                      {format(convert(property.rent_price))}/เดือน
                    </div>
                  )}
                </div>
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <Bed className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">ห้องนอน</div>
                  <div className="font-semibold text-gray-900">{property.bedrooms || 'N/A'}</div>
                </div>
                <div className="text-center">
                  <Bath className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">ห้องน้ำ</div>
                  <div className="font-semibold text-gray-900">{property.bathrooms || 'N/A'}</div>
                </div>
                <div className="text-center">
                  <Home className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">ชั้นที่</div>
                  <div className="font-semibold text-gray-900">{property.floor || 'N/A'}</div>
                </div>
                <div className="text-center">
                  <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">ขนาด</div>
                  <div className="font-semibold text-gray-900">{property.area ? `${property.area} ตร.ม.` : 'N/A'}</div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">รายละเอียด</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">สิ่งอำนวยความสะดวก</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Places */}
              {property.nearby && property.nearby.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">สถานที่ใกล้เคียง</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.nearby.map((place, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {place}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Property Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent mb-2">
                  {format(convert(property.price))}
                </div>
                {property.rent_price > 0 && (
                  <div className="text-gray-600">{format(convert(property.rent_price))}/เดือน</div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>ประเภท</span>
                  <span className="font-semibold text-gray-900">{getTypeLabel(property.type)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>สถานะ</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status)}`}>
                    {getStatusLabel(property.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>จำนวนผู้ชม</span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1 text-green-500" />
                    {clickCount}
                  </span>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">ข้อมูลติดต่อ</h3>
                <div className="space-y-2">
                  {contactInfo?.phone && (
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="flex items-center w-full bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <FaPhone className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold text-base">Call us</span>
                    </a>
                  )}
                  
                  {contactInfo?.line && (
                    <a 
                      href={`https://line.me/ti/p/${contactInfo.line}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center w-full bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <FaLine className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold text-base">Line@</span>
                    </a>
                  )}
                  
                  {contactInfo?.whatsapp && (
                    <a 
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center w-full bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <FaWhatsapp className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold text-base">WhatsApp</span>
                    </a>
                  )}
                  
                  {contactInfo?.messenger && (
                    <a 
                      href={contactInfo.messenger} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center w-full bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <FaFacebookMessenger className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold text-base">Messenger</span>
                    </a>
                  )}
                  
                  {contactInfo?.facebook && (
                    <a 
                      href={contactInfo.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center w-full bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <FaFacebook className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold text-base">Facebook</span>
                    </a>
                  )}
                  
                  {contactInfo?.instagram && (
                    <a 
                      href={contactInfo.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center w-full bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <FaInstagram className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold text-base">Instagram</span>
                    </a>
                  )}
                  
                  <div className="flex items-center w-full bg-white rounded-lg p-3 shadow-sm">
                    <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-800 font-semibold text-base">อัปเดตล่าสุด: วันนี้</span>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default PropertyDetail 