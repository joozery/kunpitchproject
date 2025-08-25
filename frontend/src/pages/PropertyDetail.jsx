import React, { useState, useEffect } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Bed, Bath, Home, Star, ArrowLeft, Eye, Heart, Share2, Phone, Mail, Calendar, Building2, Car, Ruler, Train, Bus, Wifi, Shield, Users, Clock, Tag } from 'lucide-react'
import { FaPhone, FaLine, FaWhatsapp, FaFacebookMessenger, FaFacebook, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaYoutube, FaFileAlt } from 'react-icons/fa'
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
  const [activeTab, setActiveTab] = useState('overview')
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  // Derived values for UI meta
  const pricePerSqm = property && property.area ? Math.round((property.price || 0) / (property.area || 1)) : null
  const rentPerSqm = property && property.area && (property.rent_price || 0) > 0 ? Math.round((property.rent_price || 0) / (property.area || 1)) : null

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
            description: 'คอนโดสวยงามพร้อมเฟอร์นิเจอร์ ตั้งอยู่ในทำเลทองของสีลม เดินทางสะดวก ใกล้รถไฟฟ้า BTS และ MRT มีสิ่งอำนวยความสะดวกครบครัน ห้องนอนหลักขนาดใหญ่พร้อมห้องน้ำในตัว ห้องนอนที่สองเหมาะสำหรับแขกหรือห้องทำงาน ห้องนั่งเล่นกว้างขวางเชื่อมต่อกับระเบียงที่สามารถชมวิวเมืองได้ ห้องครัวแยกเป็นสัดส่วนพร้อมเครื่องใช้ไฟฟ้าครบครัน ระบบรักษาความปลอดภัย 24 ชั่วโมง มีที่จอดรถส่วนตัว สระว่ายน้ำ ฟิตเนส และสวนสาธารณะภายในโครงการ ใกล้ห้างสรรพสินค้า โรงพยาบาล และโรงเรียน เดินทางสะดวกด้วยรถไฟฟ้าและรถเมล์หลายสาย',
            images: [
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
              'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
              'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            ],
            amenities: ['สระว่ายน้ำ', 'ฟิตเนส', 'ที่จอดรถ', 'ระบบรักษาความปลอดภัย', 'สวนสาธารณะ'],
            nearby: ['BTS สีลม', 'MRT สีลม', 'ห้างสรรพสินค้า', 'โรงพยาบาล', 'โรงเรียน'],
            // Additional fields from form
            projectCode: 'WS001',
            propertyType: 'condo',
            announcerStatus: 'agent',
            googleMapUrl: 'https://maps.google.com',
            nearbyTransport: 'BTS, MRT',
            selectedStations: ['silom', 'sala_daeng'],
            listingType: 'sale',
            seoTags: 'คอนโด, สีลม, ใกล้รถไฟฟ้า',
            selectedProject: 'Whale Space Condo',
            availableDate: '2024-01-15',
            specialFeatures: {
              shortTerm: true,
              allowPet: false,
              allowCompanyRegistration: true,
              foreignQuota: true,
              penthouse: false,
              luckyNumber: true
            },
            youtubeUrl: 'https://youtube.com/watch?v=example',
            floorPlan: null,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-15'
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
          description: 'คอนโดสวยงามพร้อมเฟอร์นิเจอร์ ตั้งอยู่ในทำเลทองของสีลม เดินทางสะดวก ใกล้รถไฟฟ้า BTS และ MRT มีสิ่งอำนวยความสะดวกครบครัน ห้องนอนหลักขนาดใหญ่พร้อมห้องน้ำในตัว ห้องนอนที่สองเหมาะสำหรับแขกหรือห้องทำงาน ห้องนั่งเล่นกว้างขวางเชื่อมต่อกับระเบียงที่สามารถชมวิวเมืองได้ ห้องครัวแยกเป็นสัดส่วนพร้อมเครื่องใช้ไฟฟ้าครบครัน ระบบรักษาความปลอดภัย 24 ชั่วโมง มีที่จอดรถส่วนตัว สระว่ายน้ำ ฟิตเนส และสวนสาธารณะภายในโครงการ ใกล้ห้างสรรพสินค้า โรงพยาบาล และโรงเรียน เดินทางสะดวกด้วยรถไฟฟ้าและรถเมล์หลายสาย',
          images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
          ],
          amenities: ['สระว่ายน้ำ', 'ฟิตเนส', 'ที่จอดรถ', 'ระบบรักษาความปลอดภัย', 'สวนสาธารณะ'],
          nearby: ['BTS สีลม', 'MRT สีลม', 'ห้างสรรพสินค้า', 'โรงพยาบาล', 'โรงเรียน'],
          // Additional fields from form
          projectCode: 'WS001',
          propertyType: 'condo',
          announcerStatus: 'agent',
          googleMapUrl: 'https://maps.google.com',
          nearbyTransport: 'BTS, MRT',
          selectedStations: ['silom', 'sala_daeng'],
          listingType: 'sale',
          seoTags: 'คอนโด, สีลม, ใกล้รถไฟฟ้า',
          selectedProject: 'Whale Space Condo',
          availableDate: '2024-01-15',
          specialFeatures: {
            shortTerm: true,
            allowPet: false,
            allowCompanyRegistration: true,
            foreignQuota: true,
            penthouse: false,
            luckyNumber: true
          },
          youtubeUrl: 'https://youtube.com/watch?v=example',
          floorPlan: null,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15'
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

  const getAnnouncerStatusLabel = (status) => {
    switch (status) {
      case 'owner':
        return 'เจ้าของ';
      case 'agent':
        return 'นายหน้า';
      default:
        return 'ไม่ระบุ';
    }
  };

  const getAnnouncerStatusColor = (status) => {
    switch (status) {
      case 'owner':
        return 'bg-purple-500 text-white';
      case 'agent':
        return 'bg-orange-500 text-white';
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Property Header */}
        <div className="rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">

              
              {/* Project Name */}
              {property.selectedProject && (
                <div className="mb-2">
                  <span className="text-lg font-semibold text-[#917133] font-prompt">
                    {property.selectedProject}
                  </span>
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-prompt">{property.title}</h1>
              <p className="text-gray-600 flex items-center mb-3">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                {property.location || property.address}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 font-prompt">
                <span className="font-semibold text-[#917133]">Property ID: WS{property.id}</span>
                {property.projectCode && <span>Project: {property.projectCode}</span>}
                {property.availableDate && (
                  <span className="font-semibold text-[#917133]">
                    Available on: {new Date(property.availableDate).toLocaleDateString('th-TH')}
                  </span>
                )}
                <span>อัปเดต: {new Date(property.updatedAt).toLocaleDateString('th-TH')}</span>
              </div>
            </div>
                          <div className="text-right">
                <div className="text-sm text-gray-600 mb-1 font-prompt">ราคาขาย</div>
                <div className="text-4xl font-normal text-[#917133] mb-2 font-prompt">
                  {format(convert(property.price))} บาท
                    </div>
                {property.rent_price > 0 && (
                  <div className="text-xl text-[#917133] mb-2 font-prompt">
                    {format(convert(property.rent_price))}/เดือน
                    </div>
                )}
                <div className="flex items-center justify-end text-sm text-gray-600 mt-3">
                  <Share2 className="h-5 w-5 text-gray-500 hover:text-[#917133] transition-colors cursor-pointer" />
                </div>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Professional Image Gallery */}
            <div className="mb-8">
              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {/* Main Hero Image - Left Side (Large) */}
                  <div className="col-span-2 aspect-[16/9] relative group overflow-hidden rounded-xl shadow-lg">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    {property.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                        {property.images.length} รูป
                      </div>
                    )}
                  </div>
                  
                  {/* Right Side Grid - 4 Smaller Images (2x2 Grid) */}
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    {/* Top Row - 2 Images */}
                    <div className="aspect-[16/9] group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <img 
                        src={property.images[1] || property.images[0]} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                    
                    <div className="aspect-[16/9] group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <img 
                        src={property.images[2] || property.images[0]} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                    
                    {/* Bottom Row - 2 Images */}
                    <div className="aspect-[16/9] group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <img 
                        src={property.images[3] || property.images[0]} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                    
                    <div className="aspect-[16/9] group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <img 
                        src={property.images[4] || property.images[0]} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">ไม่มีรูปภาพ</p>
                  </div>
                </div>
              )}
            </div>

            {/* YouTube Videos & Location Section */}
            <div className="mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                {/* YouTube Videos */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Video 1 */}
                    <div className="relative group overflow-hidden rounded-md shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="aspect-[3/1] bg-gray-200 relative">
                        <img 
                          src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" 
                          alt="Video 1" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="absolute top-1 left-1 flex items-center space-x-1">
                          <div className="w-3 h-3 bg-gray-800 rounded-full flex items-center justify-center">
                            <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </div>
                          <span className="text-white text-xs font-medium bg-black/50 px-1 py-0.5 rounded">Dia...</span>
                        </div>
                      </div>
                      <div className="p-1">
                        <p className="text-xs text-gray-600 font-prompt">Video</p>
                      </div>
                    </div>

                    {/* Video 2 */}
                    <div className="relative group overflow-hidden rounded-md shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="aspect-[3/1] bg-gray-200 relative">
                        <img 
                          src="https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg" 
                          alt="Video 2" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="absolute top-1 left-1 flex items-center space-x-1">
                          <div className="w-3 h-3 bg-gray-800 rounded-full flex items-center justify-center">
                            <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </div>
                          <span className="text-white text-xs font-medium bg-black/50 px-1 py-0.5 rounded">Dia...</span>
                        </div>
                      </div>
                      <div className="p-1">
                        <p className="text-xs text-gray-600 font-prompt">Video</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="lg:col-span-4 flex justify-end">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 font-medium font-prompt">บางซื่อ วงศ์สว่าง เตาปูน, กรุงเทพมหานคร</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview Content */}
            <div className="mb-8">
              <div className="space-y-8">
                {/* Key Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">รายละเอียด ยูนิต</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="flex items-center space-x-3">
                      <Bed className="h-6 w-6 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">{property.bedrooms || 'N/A'} ห้อง ห้องนอน</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Bath className="h-6 w-6 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">{property.bathrooms || 'N/A'} ห้อง ห้องน้ำ</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Ruler className="h-6 w-6 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">{property.area ? `${property.area} ตร.ม. พื้นที่ใช้สอย` : 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-6 w-6 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">{property.floor || 'N/A'} ลำดับชั้นที่</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Tags Section */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Pricing Information */}
                  <div className="flex-1">
                    <div className="space-y-2">
                      {property.rent_price > 0 && (
                        <div className="text-2xl font-bold text-[#243756] font-prompt">
                          For rent {format(convert(property.rent_price))}/month
                        </div>
                      )}
                      {property.price > 0 && (
                        <div className="text-2xl font-bold text-[#243756] font-prompt">
                          For sale {format(convert(property.price))} Bath
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col gap-2">
                    {property.specialFeatures?.shortTerm && (
                      <span className="px-4 py-2 bg-gray-600 text-white text-sm rounded-full font-medium">
                        Short-term
                      </span>
                    )}
                    {property.specialFeatures?.allowCompanyRegistration && (
                      <span className="px-4 py-2 bg-gray-600 text-white text-sm rounded-full font-medium">
                        Company Registration
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {property.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">รายละเอียด</h3>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </div>
                )}

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt">Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1 */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        ระบบรักษาความปลอดภัย
                      </div>
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        ห้องหนังสือ
                      </div>
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        สระเด็ก
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        ที่จอดรถ
                      </div>
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        เล้าจ์
                      </div>
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        สวนขนาดย่อม
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        ฟิตเนส / ยิม
                      </div>
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        สระว่ายน้ำ
                      </div>
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        แม่น้ำ
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt">Project Details</h3>
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Project Image */}
                    <div className="lg:w-1/2">
                      <img 
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                        alt="Project Rendering" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>

                    {/* Project Information */}
                    <div className="lg:w-1/2 space-y-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600 font-prompt">Project name:</span>
                          <div className="font-semibold text-gray-900 font-prompt">Lumpini Place Rama9-Ratchada</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 font-prompt">Project Type:</span>
                          <div className="font-semibold text-gray-900 font-prompt">Codomenium</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 font-prompt">Developer:</span>
                          <div className="font-semibold text-gray-900 font-prompt">Lumpini Development</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 font-prompt">Skytrian/Subway:</span>
                          <div className="font-semibold text-gray-900 font-prompt">MRT RAMA9</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 font-prompt">Location:</span>
                          <div className="font-semibold text-gray-900 font-prompt">Rama IX Rd, Huai Khwang, Bangkok 10310</div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button className="px-6 py-3 bg-[#917133] text-white rounded-lg font-medium font-prompt hover:bg-[#7a5f2a] transition-colors">
                          All Details
                        </button>
                        <button className="px-6 py-3 bg-[#917133] text-white rounded-lg font-medium font-prompt hover:bg-[#7a5f2a] transition-colors">
                          View <span className="underline">On Google map</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Facilities */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt">Project Facilities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1 */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        ระบบรักษาความปลอดภัย
                      </div>
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        ห้องหนังสือ
                      </div>
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        สระเด็ก
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        ที่จอดรถ
                      </div>
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        เล้าจ์
                      </div>
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        สวนขนาดย่อม
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        ฟิตเนส / ยิม
                      </div>
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        สระว่ายน้ำ
                      </div>
                      <div className="flex items-center text-gray-700 font-prompt">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        แม่น้ำ
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nearby Properties */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt text-center">Nearby Properties</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Property Card 1 */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                          alt="Studio Apartment" 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          For sale
                        </div>
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <Heart className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-lg font-bold text-gray-900 font-prompt">฿7,010,000</div>
                      </div>
                    </div>

                    {/* Property Card 2 */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                          alt="Living Room" 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                          <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg transform -rotate-12">
                            SOLD
                          </div>
                        </div>
                        <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          For sale
                        </div>
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <Heart className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-lg font-bold text-gray-900 font-prompt">฿86,750</div>
                      </div>
                    </div>

                    {/* Property Card 3 */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                          alt="Bedroom" 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          For rent
                        </div>
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <Heart className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-lg font-bold text-gray-900 font-prompt">฿25,000</div>
                      </div>
                    </div>

                    {/* Property Card 4 */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                          alt="Living Room" 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          For rent
                        </div>
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                            <Heart className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-lg font-bold text-gray-900 font-prompt">฿22,000</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Information */}
                {property.selectedProject && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">ข้อมูลโครงการ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">ชื่อโครงการ</div>
                        <div className="font-semibold text-gray-900">{property.selectedProject}</div>
                      </div>
                      {property.availableDate && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600">วันที่ว่าง</div>
                          <div className="font-semibold text-gray-900">{new Date(property.availableDate).toLocaleDateString('th-TH')}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Special Features */}
                {property.specialFeatures && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">คุณสมบัติพิเศษ</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.specialFeatures.shortTerm && (
                        <div className="flex items-center text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          เช่าช่วงสั้น
                        </div>
                      )}
                      {property.specialFeatures.allowPet && (
                        <div className="flex items-center text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          อนุญาตสัตว์เลี้ยง
                        </div>
                      )}
                      {property.specialFeatures.allowCompanyRegistration && (
                        <div className="flex items-center text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          ลงทะเบียนบริษัทได้
                        </div>
                      )}
                      {property.specialFeatures.foreignQuota && (
                        <div className="flex items-center text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          โควต้าชาวต่างชาติ
                        </div>
                      )}
                      {property.specialFeatures.penthouse && (
                        <div className="flex items-center text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          เพนท์เฮาส์
                        </div>
                      )}
                      {property.specialFeatures.luckyNumber && (
                        <div className="flex items-center text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          เลขมงคล
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SEO Tags */}
                {property.seoTags && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">แท็ก SEO</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.seoTags.split(',').map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Property Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 sticky top-8">
              {/* Contact Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center font-prompt">ข้อมูลติดต่อ</h3>
                <div className="space-y-1">
                  {contactInfo?.phone && (
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="flex items-center w-full bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                        <FaPhone className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold text-sm font-prompt">Call us</span>
                    </a>
                  )}
                  
                  {contactInfo?.line && (
                    <a 
                      href={`https://line.me/ti/p/${contactInfo.line}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center w-full bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                        <FaLine className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold text-sm font-prompt">Line@</span>
                    </a>
                  )}
                  
                  {contactInfo?.whatsapp && (
                    <a 
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center w-full bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                        <FaWhatsapp className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold text-sm font-prompt">WhatsApp</span>
                    </a>
                  )}
                  
                  {contactInfo?.messenger && (
                    <a 
                      href={contactInfo.messenger} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center w-full bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                        <FaFacebookMessenger className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold text-sm font-prompt">Messenger</span>
                    </a>
                  )}
                  
                  {contactInfo?.facebook && (
                    <a 
                      href={contactInfo.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center w-full bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                        <FaFacebook className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold text-sm font-prompt">Facebook</span>
                    </a>
                  )}
                  
                  {contactInfo?.instagram && (
                    <a 
                      href={contactInfo.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center w-full bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                        <FaInstagram className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold text-sm font-prompt">Instagram</span>
                    </a>
                  )}
                  
                  <div className="flex items-center w-full bg-white rounded-lg p-2 shadow-sm">
                    <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-800 font-semibold text-sm font-prompt">อัปเดตล่าสุด: วันนี้</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={property?.images?.map((image, idx) => ({ src: image })) || []}
        onIndexChange={(idx) => setIndex(idx)}
      />
    </div>
  )
}

export default PropertyDetail  