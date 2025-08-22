import React, { useState, useEffect } from 'react'
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
            description: 'คอนโดสวยงามพร้อมเฟอร์นิเจอร์ ตั้งอยู่ในทำเลทองของสีลม เดินทางสะดวก ใกล้รถไฟฟ้า BTS และ MRT มีสิ่งอำนวยความสะดวกครบครัน',
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
          description: 'คอนโดสวยงามพร้อมเฟอร์นิเจอร์ ตั้งอยู่ในทำเลทองของสีลม เดินทางสะดวก ใกล้รถไฟฟ้า BTS และ MRT มีสิ่งอำนวยความสะดวกครบครัน',
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Property Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full font-prompt">
                  คอนโด Low rise
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full font-prompt">
                  คอนโดชั้นเตี้ย
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full font-prompt">
                  ปล่อยเช่าชาวต่างชาติ
                </span>
                <button className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <span className="text-lg font-bold">+</span>
                </button>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-prompt">{property.title}</h1>
              <p className="text-gray-600 flex items-center mb-3">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                {property.location || property.address}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 font-prompt">
                <span>Ref: WS{property.id}</span>
                {property.projectCode && <span>Project: {property.projectCode}</span>}
                <span>อัปเดต: {new Date(property.updatedAt).toLocaleDateString('th-TH')}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1 font-prompt">ราคาขาย</div>
              <div className="text-4xl font-bold text-orange-600 mb-2 font-prompt">
                {format(convert(property.price))} บาท
                  </div>
              {property.rent_price > 0 && (
                <div className="text-xl text-gray-500 mb-2 font-prompt">
                  {format(convert(property.rent_price))}/เดือน
                  </div>
                )}
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Share2 className="h-4 w-4 mr-1 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8">
              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[520px] p-3">
                  {/* Main image */}
                  <div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    {property.images.length > 1 && (
                      <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                        {property.images.length} รูป
                      </div>
                    )}
                  </div>
                  {/* Side images */}
                  <div className="rounded-xl overflow-hidden">
                    <img src={property.images[1] || property.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={property.images[2] || property.images[0]} alt="" className="w-full h-full object-cover" />
                    {property.images.length > 3 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-semibold">ดูรูปอีก {property.images.length - 3} รูป</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <img
                  src={'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
              )}
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-lg mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {['overview', 'details', 'amenities', 'location', 'media'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab === 'overview' && 'ภาพรวม'}
                      {tab === 'details' && 'รายละเอียด'}
                      {tab === 'amenities' && 'สิ่งอำนวยความสะดวก'}
                      {tab === 'location' && 'ทำเล'}
                      {tab === 'media' && 'สื่อ'}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Key Features */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">รายละเอียด ยูนิต</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

                    {/* Price Analysis */}
                    <div className="bg-gradient-to-r from-blue-50 to-yellow-50 p-6 rounded-xl">
                                              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">การวิเคราะห์ราคา</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pricePerSqm !== null && (
                          <div className="bg-white p-4 rounded-lg">
                            <div className="text-sm text-gray-600">ราคาขายต่อ ตร.ม.</div>
                            <div className="text-xl font-bold text-blue-600">{format(convert(pricePerSqm))}</div>
                          </div>
                        )}
                        {rentPerSqm !== null && (
                          <div className="bg-white p-4 rounded-lg">
                            <div className="text-sm text-gray-600">ราคาเช่าต่อ ตร.ม.</div>
                            <div className="text-xl font-bold text-green-600">{format(convert(rentPerSqm))}</div>
                    </div>
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
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                                              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">ข้อมูลพื้นฐาน</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600">ประเภททรัพย์สิน</div>
                          <div className="font-semibold text-gray-900">{getTypeLabel(property.propertyType || property.type)}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600">สถานะ</div>
                          <div className="font-semibold text-gray-900">{getStatusLabel(property.status)}</div>
                </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600">ประเภทการประกาศ</div>
                          <div className="font-semibold text-gray-900">{getStatusLabel(property.listingType || property.status)}</div>
                </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600">สถานะผู้ประกาศ</div>
                          <div className="font-semibold text-gray-900">{getAnnouncerStatusLabel(property.announcerStatus)}</div>
                </div>
                </div>
              </div>

                    {/* Project Information */}
                    {property.selectedProject && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">ข้อมูลโครงการ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
              )}

                {/* Amenities Tab */}
                {activeTab === 'amenities' && (
                  <div className="space-y-6">
                    {/* Room Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">สิ่งอำนวยความสะดวกภายในห้อง</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

                    {/* Project Amenities */}
                    {property.projectAmenities && property.projectAmenities.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">สิ่งอำนวยความสะดวกของโครงการ</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {property.projectAmenities.map((amenity, index) => (
                            <div key={index} className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              {amenity}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div className="space-y-6">
                    {/* Transport */}
                    {property.nearbyTransport && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">การเดินทาง</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600 mb-2">ระบบขนส่งใกล้เคียง</div>
                          <div className="font-semibold text-gray-900">{property.nearbyTransport}</div>
                        </div>
                      </div>
                    )}

                    {/* Selected Stations */}
                    {property.selectedStations && property.selectedStations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">สถานีรถไฟฟ้าใกล้เคียง</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {property.selectedStations.map((station, index) => (
                            <div key={index} className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                              <Train className="h-5 w-5 text-blue-500 mr-3" />
                              {station}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Places */}
              {property.nearby && property.nearby.length > 0 && (
                <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">สถานที่ใกล้เคียง</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.nearby.map((place, index) => (
                            <div key={index} className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {place}
                      </div>
                    ))}
                  </div>
                </div>
              )}

                    {/* Google Map */}
                    {property.googleMapUrl && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">แผนที่</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <a 
                            href={property.googleMapUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            ดูแผนที่ Google Maps
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className="space-y-6">
                    {/* YouTube Video */}
                    {property.youtubeUrl && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">วิดีโอ YouTube</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <a 
                            href={property.youtubeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-red-600 hover:text-red-800"
                          >
                            <FaYoutube className="h-6 w-6 mr-2" />
                            ดูวิดีโอ YouTube
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Floor Plan */}
                    {property.floorPlan && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">แปลนห้อง</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <a 
                            href={property.floorPlan} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <FaFileAlt className="h-6 w-6 mr-2" />
                            ดูแปลนห้อง
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center font-prompt">ข้อมูลติดต่อ</h3>
                <div className="space-y-2">
                  {contactInfo?.phone && (
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="flex items-center w-full bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-102 cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <FaPhone className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold text-base font-prompt">Call us</span>
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
                      <span className="text-gray-800 font-semibold text-base font-prompt">Line@</span>
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
                      <span className="text-gray-800 font-semibold text-base font-prompt">WhatsApp</span>
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
                      <span className="text-gray-800 font-semibold text-base font-prompt">Messenger</span>
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
                      <span className="text-gray-800 font-semibold text-base font-prompt">Facebook</span>
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
                      <span className="text-gray-800 font-semibold text-base font-prompt">Instagram</span>
                    </a>
                  )}
                  
                  <div className="flex items-center w-full bg-white rounded-lg p-3 shadow-sm">
                    <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-800 font-semibold text-base font-prompt">อัปเดตล่าสุด: วันนี้</span>
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