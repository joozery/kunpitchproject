import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Home, Star, ArrowLeft, Eye, Heart, Share2, Phone, Mail, Calendar, Car, Train, Bus, Wifi, Shield, Users, Clock, Tag, Send, MessageCircle, Search } from 'lucide-react'
import { TbViewportWide, TbStairsUp } from 'react-icons/tb'
import { LuBath } from 'react-icons/lu'
import { IoBedOutline } from 'react-icons/io5'
import { FaPhone, FaLine, FaWhatsapp, FaFacebookMessenger, FaFacebook, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaYoutube, FaFileAlt, FaSwimmingPool, FaDumbbell, FaCar, FaShieldAlt, FaBook, FaChild, FaCouch, FaSeedling, FaHome, FaStore, FaTshirt, FaWifi, FaBath, FaLock, FaVideo, FaUsers, FaLaptop, FaHamburger, FaCoffee, FaUtensils, FaDoorOpen, FaFutbol, FaTrophy, FaFilm, FaPaw, FaArrowUp, FaMotorcycle, FaShuttleVan, FaBolt, FaRegCheckCircle, FaBuilding } from 'react-icons/fa'
import { BiArea } from 'react-icons/bi'
import { MdOutlineTrain } from 'react-icons/md'
import { propertyAPI } from '../lib/api'
import { getStationLabelById } from '../lib/stations'
import { contactApi } from '../lib/contactApi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCurrency } from '../lib/CurrencyContext'

const ProjectDetail = () => {
  const { id } = useParams()
  const { convert, format } = useCurrency()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [contactInfo, setContactInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [photoViewerTab, setPhotoViewerTab] = useState('photos')
  const [descExpanded, setDescExpanded] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch project by ID
        const projectResult = await propertyAPI.getProjectById(id)
        console.log('🔍 Project API Result:', projectResult)
        if (projectResult && projectResult.success && projectResult.data) {
          console.log('✅ Project Data:', projectResult.data)
          console.log('🖼️ Project Images:', projectResult.data.project_images)
          console.log('🎬 Video Review:', projectResult.data.video_review)
          console.log('🎬 Video Review 2:', projectResult.data.video_review_2)
          setProject(projectResult.data)
        } else {
          // Fallback: try to get from projects list
          const projectsResult = await propertyAPI.getProjects()
          if (projectsResult && projectsResult.success && Array.isArray(projectsResult.data)) {
            const foundProject = projectsResult.data.find(p => 
              String(p.id) === String(id) || 
              String(p.project_code) === String(id) ||
              String(p.name).toLowerCase() === String(id).toLowerCase()
            )
            if (foundProject) {
              setProject(foundProject)
            } else {
              throw new Error('Project not found')
            }
          } else {
            throw new Error('Project not found')
          }
        }
        
        // Fetch contact information
        try {
          const contactResult = await contactApi.getContactSettings()
          if (contactResult && contactResult.data) {
            setContactInfo(contactResult.data)
          } else {
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
        console.error('Failed to fetch project:', error)
        // Fallback project data
        setProject({
          id: id,
          name: 'ศิรนินทร์ เรสซิเดนเซส พัฒนาการ',
          name_th: 'ศิรนินทร์ เรสซิเดนเซส พัฒนาการ',
          name_en: 'Sirinin Residences Pattanakarn',
          project_type: 'บ้านเดี่ยว',
          developer: 'Singha Estate Public Company Limited',
          address: '585 Soi Pattanakarn 32, Suan Luang Subdistrict, Suan Luang District, Bangkok 10250',
          description: 'โครงการบ้านเดี่ยวสไตล์โมเดิร์น ตั้งอยู่ในทำเลทองของพัฒนาการ เดินทางสะดวก ใกล้รถไฟฟ้า BTS และ MRT มีสิ่งอำนวยความสะดวกครบครัน',
          images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
          ],
          facilities: ['สระว่ายน้ำ', 'ฟิตเนส', 'ที่จอดรถ', 'ระบบรักษาความปลอดภัย', 'สวนสาธารณะ'],
          amenities: ['สระว่ายน้ำ', 'ฟิตเนส', 'ที่จอดรถ', 'ระบบรักษาความปลอดภัย', 'สวนสาธารณะ'],
          selected_stations: [],
          location_highlights: '• BTS พัฒนาการ – 5 นาที\n• BTS อ่อนนุช – 3 นาที\n• สยามพารากอน – 15 นาที\n• เซ็นทรัลเวิลด์ – 20 นาที\n• สวนลุมพินี – 25 นาที',
          video_review: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          video_review_2: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
          official_website: 'https://www.singhaestate.com',
          official_website_2: 'https://www.sirinin-residences.com',
          project_code: 'WS001',
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

  // Normalize mixed inputs (array, json string, comma-separated string) → array<string>
  const normalizeToArray = (value) => {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) return []
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) return parsed
      } catch {}
      return trimmed.split(',').map(s => s.trim()).filter(Boolean)
    }
    return []
  }

  // Use the exact labels from the Project/Admin form
  const getStationFormLabel = (station) => {
    return getStationLabelById(station)
  }

  // Match Project Facilities IDs to the same labels used in the admin ProjectForm
  const getProjectFacilityLabel = (idOrObj) => {
    if (!idOrObj) return ''
    const key = typeof idOrObj === 'string' ? idOrObj : (idOrObj.id || idOrObj.label || '')
    const map = {
      passengerLift: 'Passenger Lift',
      shuttleService: 'Shuttle Service',
      evCharger: 'EV Charger',
      parking: 'Parking',
      security24h: '24-hour security with CCTV',
      accessControl: 'Access control System',
      fitness: 'Fitness / Gym',
      swimmingPool: 'Swimming Pool',
      sauna: 'Sauna',
      steamRoom: 'Steam Room',
      sportArea: 'Sport Area',
      golfSimulator: 'Golf simulator',
      kidsPlayground: 'Kids Playground',
      cinemaRoom: 'Cinema Room / Theatre',
      allowPet: 'Allow Pet',
      meetingRoom: 'Meeting Room',
      coWorkingSpace: 'Co-Working Space',
      restaurant: 'Restaurant',
      cafe: 'Cafe',
      privateDiningRoom: 'Private Dining Room / Party Room',
      coKitchen: 'Co-Kitchen',
      lobby: 'Lobby',
      loungeArea: 'Lounge Area',
      clubhouse: 'Clubhouse',
      convenienceStore: 'Convenience Store / Minimart',
      library: 'Library',
      laundry: 'Laundry',
      garden: 'Garden',
      wifi: 'WIFI'
    }
    if (map[key]) return map[key]
    return typeof idOrObj === 'string' ? idOrObj : (idOrObj.label || key)
  }

  const capitalizeFirst = (text) => {
    if (!text || typeof text !== 'string') return text
    const [first, ...rest] = text
    return first.toUpperCase() + rest.join('').toLowerCase()
  }

  const getProjectCover = (proj) => {
    if (!proj) return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    const cover = proj.cover_image || (Array.isArray(proj.project_images) ? (proj.project_images.find(i => i.is_cover)?.url || proj.project_images[0]?.url) : null)
    return cover || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  }

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

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ไม่พบข้อมูล</h2>
          <p className="text-gray-600 mb-6">ไม่สามารถโหลดข้อมูลโครงการได้</p>
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
    <div className="min-h-screen bg-white">
      {/* Main Header */}
      <Header />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 mt-20 pb-32">
        {/* Project Header Card */}
        <div className="mb-6 sm:mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              {/* Project Title */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-2">
                <h1 className="text-xl sm:text-2xl font-bold font-prompt leading-tight">
                  <span className="text-[#917133]">โครงการ</span>
                  <span className="text-gray-900"> {project.name_th || project.name || project.title}</span>
                </h1>
              </div>
              
              {/* Location */}
              <p className="text-gray-600 mb-3 font-prompt text-sm sm:text-base">
                {project.address || project.location}
              </p>
              
              {/* Project Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-0">
                {/* Building Type */}
                <span className="px-3 py-1 bg-blue-50 text-gray-700 text-sm rounded-lg border border-blue-600 font-prompt">
                  {(() => {
                    const buildingType = project.building_type || []
                    if (Array.isArray(buildingType)) {
                      if (buildingType.includes('high-rise')) {
                        return 'High-rise'
                      } else if (buildingType.includes('low-rise')) {
                        return 'Low-rise'
                      }
                    }
                    return 'ไม่ระบุ'
                  })()}
                </span>
                
                {/* Project Type */}
                <span className="px-3 py-1 bg-blue-50 text-gray-700 text-sm rounded-lg border border-blue-600 font-prompt">
                  {project.project_type || project.type || 'โครงการ'}
                </span>
                
                {/* Developer */}
                {project.developer && (
                  <span className="px-3 py-1 bg-green-50 text-gray-700 text-sm rounded-lg border border-green-600 font-prompt">
                    {project.developer}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="w-full">
            {/* Professional Image Gallery */}
            <div className="mb-6 sm:mb-8">
              {project.project_images && project.project_images.length > 0 ? (
                (() => {
                  const images = Array.isArray(project.project_images) ? project.project_images : [project.project_images]
                  return (
                <div className="grid grid-cols-5 grid-rows-5 gap-1 sm:gap-2 h-64 sm:h-80 lg:h-96">
                  {/* Main Hero Image - Left Side (Large) */}
                  <div 
                    className="col-span-3 row-span-5 relative group overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer"
                    onClick={() => {
                      setIndex(0);
                      setOpen(true);
                    }}
                  >
                    <img
                      src={images[0]?.url || images[0]}
                      alt={project.name || project.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    {images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                        {images.length} รูป
                      </div>
                    )}
                  </div>
                  
                  {/* Top Right Image */}
                  {images[1] && (
                    <div 
                      className="col-start-4 col-span-2 row-span-3 group overflow-hidden rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setIndex(1);
                        setOpen(true);
                      }}
                    >
                      <img 
                        src={images[1]?.url || images[1]} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                  )}
                  
                  {/* Bottom Left of Right Section */}
                  {images[2] && (
                    <div 
                      className="col-start-4 row-start-4 row-span-2 group overflow-hidden rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setIndex(2);
                        setOpen(true);
                      }}
                    >
                      <img 
                        src={images[2]?.url || images[2]} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                  )}
                  
                  {/* Bottom Right of Right Section */}
                  {images[3] && (
                    <div 
                      className="col-start-5 row-start-4 row-span-2 group overflow-hidden rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        setIndex(3);
                        setOpen(true);
                      }}
                    >
                      <img 
                        src={images[3]?.url || images[3]} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                  )}
                </div>
                  )
                })()
              ) : (
                <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">ไม่มีรูปภาพ</p>
                  </div>
                </div>
              )}
            </div>

            {/* YouTube Videos Section */}
            {(() => {
              const videos = []
              if (project.video_review) videos.push(project.video_review)
              if (project.video_review_2) videos.push(project.video_review_2)
              
              console.log('🎬 Videos Array:', videos)
              console.log('🎬 Video Review:', project.video_review)
              console.log('🎬 Video Review 2:', project.video_review_2)
              
              if (videos.length === 0) return null
              
              // Function to convert YouTube URL to embed format
              const convertToEmbedUrl = (url) => {
                if (!url) return ''
                console.log('🔗 Converting URL:', url)
                
                // Handle different YouTube URL formats
                if (url.includes('youtube.com/watch?v=')) {
                  const videoId = url.split('watch?v=')[1].split('&')[0]
                  const embedUrl = `https://www.youtube.com/embed/${videoId}`
                  console.log('🎯 Converted to embed URL:', embedUrl)
                  return embedUrl
                } else if (url.includes('youtube.com/embed/')) {
                  console.log('✅ Already embed URL:', url)
                  return url
                } else if (url.includes('youtu.be/')) {
                  const videoId = url.split('youtu.be/')[1].split('?')[0]
                  const embedUrl = `https://www.youtube.com/embed/${videoId}`
                  console.log('🎯 Converted youtu.be to embed URL:', embedUrl)
                  return embedUrl
                } else {
                  console.log('⚠️ Unknown URL format:', url)
                  return url
                }
              }
              
              return (
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt">วิดีโอรีวิวโครงการ (YouTube)</h3>
                  {videos.length === 1 ? (
                    // Single video display
                    <div className="w-full">
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={convertToEmbedUrl(videos[0])}
                          title="วิดีโอรีวิวโครงการ (YouTube)"
                          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : (
                    // Multiple videos slide show
                    <div className="relative">
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        {videos.map((video, index) => (
                          <div
                            key={index}
                            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                              currentVideoIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                          >
                            <iframe
                              src={convertToEmbedUrl(video)}
                              title={`วิดีโอรีวิวโครงการ (YouTube) - ช่องที่ ${index + 1}`}
                              className="w-full h-full rounded-lg shadow-lg"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ))}
                      </div>
                      
                      {/* Video counter */}
                      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {currentVideoIndex + 1} / {videos.length}
                      </div>
                      
                      {/* Navigation arrows */}
                      {videos.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentVideoIndex(prev => prev === 0 ? videos.length - 1 : prev - 1)}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-colors"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setCurrentVideoIndex(prev => prev === videos.length - 1 ? 0 : prev + 1)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-colors"
                          >
                            <svg className="w-6 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                      
                      {/* Video thumbnails */}
                      {videos.length > 1 && (
                        <div className="mt-4 flex justify-center space-x-2">
                          {videos.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentVideoIndex(index)}
                              className={`w-3 h-3 rounded-full transition-colors ${
                                currentVideoIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })()}

            {/* Official Website Section */}
            {(() => {
              const websites = []
              if (project.official_website) websites.push(project.official_website)
              if (project.official_website_2) websites.push(project.official_website_2)
              
              console.log('🌐 Official Websites:', websites)
              console.log('🌐 Official Website 1:', project.official_website)
              console.log('🌐 Official Website 2:', project.official_website_2)
              
              if (websites.length === 0) return null
              
              return (
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt">เว็บไซต์อย่างเป็นทางการ</h3>
                  <div className="flex flex-wrap gap-3">
                    {websites.map((website, index) => (
                      <a
                        key={index}
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-lg shadow-md px-4 py-3 border border-gray-200 hover:shadow-lg transition-shadow flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0-9c-5 0-9 4-9 9s4 9 9 9" />
                          </svg>
                        </div>
                        <span className="text-gray-900 font-medium font-prompt">Link Official</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* Project Details */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Project Information */}
                <div className="space-y-3">
                  {project.project_type && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#917133] rounded-lg flex items-center justify-center">
                        <FaBuilding className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">ประเภทโครงการ</div>
                        <div className="text-gray-900 font-medium font-prompt">{project.project_type}</div>
                      </div>
                    </div>
                  )}
                  
                  {project.developer && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#917133] rounded-lg flex items-center justify-center">
                        <FaUsers className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">ผู้พัฒนา</div>
                        <div className="text-gray-900 font-medium font-prompt">{project.developer}</div>
                      </div>
                    </div>
                  )}
                  
                  {project.completion_year && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#917133] rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">ปีที่เสร็จสมบูรณ์</div>
                        <div className="text-gray-900 font-medium font-prompt">{project.completion_year}</div>
                      </div>
                    </div>
                  )}
                  
                  {project.status && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#917133] rounded-lg flex items-center justify-center">
                        <FaTrophy className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">สถานะ</div>
                        <div className="text-gray-900 font-medium font-prompt">{project.status}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Project Specifications */}
                <div className="space-y-3">
                  {project.area_range && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#917133] rounded-lg flex items-center justify-center">
                        <TbViewportWide className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">ขนาดพื้นที่</div>
                        <div className="text-gray-900 font-medium font-prompt">{project.area_range}</div>
                      </div>
                    </div>
                  )}
                  
                  {project.total_units && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#917133] rounded-lg flex items-center justify-center">
                        <FaHome className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">จำนวนยูนิตทั้งหมด</div>
                        <div className="text-gray-900 font-medium font-prompt">{project.total_units}</div>
                      </div>
                    </div>
                  )}
                  
                  {project.total_buildings && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#917133] rounded-lg flex items-center justify-center">
                        <FaBuilding className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">จำนวนอาคาร</div>
                        <div className="text-gray-900 font-medium font-prompt">{project.total_buildings}</div>
                      </div>
                    </div>
                  )}
                  
                  {project.floors_info && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#917133] rounded-lg flex items-center justify-center">
                        <TbStairsUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">ข้อมูลชั้น</div>
                        <div className="text-gray-900 font-medium font-prompt">{project.floors_info}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Overview Content */}
            <div className="mb-6 sm:mb-8">
              <div className="space-y-6 sm:space-y-8">
                {/* Description */}
                {project.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">รายละเอียดโครงการ</h3>
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <div 
                        className={`text-gray-700 leading-relaxed transition-all ${descExpanded ? '' : 'max-h-48 overflow-hidden'}`}
                        dangerouslySetInnerHTML={{ 
                          __html: project.description 
                        }}
                      />
                      <div className="mt-3">
                        <button onClick={() => setDescExpanded(v => !v)} className="text-blue-700 hover:underline text-sm font-prompt">
                          {descExpanded ? 'ย่อรายละเอียด' : 'อ่านเพิ่มเติม'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Project Facilities */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt">Project Facilities</h3>
                  {(() => {
                    const facilities = normalizeToArray(project?.facilities || project?.project_facilities || project?.common_facilities)
                    if (!facilities.length) return <div className="text-gray-500 text-sm">ไม่ระบุ</div>
                    return (
                      <div className="grid grid-cols-2 gap-3">
                        {facilities.slice(0, 24).map((f, idx) => (
                          <div key={idx} className="flex items-center text-gray-700 font-prompt">
                            <FaRegCheckCircle className="w-4 h-4 mr-3 text-[#917133]" />
                            <span className="text-sm">{capitalizeFirst(getProjectFacilityLabel(f))}</span>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>

                {/* Project Location */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt">ทำเลที่ตั้ง (โครงการ)</h3>
                  {(() => {
                    const rawStations = project.selected_stations || []
                    const stations = Array.isArray(rawStations) 
                      ? rawStations
                      : (typeof rawStations === 'string' ? [rawStations] : [])
                    
                    const cleanStations = stations
                      .filter(station => {
                        if (!station) return false
                        const stationStr = String(station).trim()
                        return stationStr.length > 0 && 
                               stationStr !== '[]' && 
                               stationStr !== 'null' && 
                               stationStr !== 'undefined' &&
                               stationStr !== '-'
                      })
                      .map(station => String(station).trim())
                    
                    const locationHighlights = project.location_highlights || ''
                    if (!locationHighlights && cleanStations.length === 0) return <div className="text-gray-500 text-sm">ไม่ระบุ</div>
                    
                    // Parse location data
                    const parseLocationData = (text) => {
                      if (!text) return { transport: [], shopping: [], parks: [], hospitals: [], schools: [], others: [] }
                      
                      const plainText = text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                      const items = plainText.split(/[•\-\*]/).filter(item => item.trim())
                      
                      const cleanedItems = []
                      for (let i = 0; i < items.length; i++) {
                        const currentItem = items[i].trim()
                        const nextItem = items[i + 1] ? items[i + 1].trim() : ''
                        
                        if (currentItem.match(/^(minute|hour|kilometer|km|นาที|ชั่วโมง)/i) && 
                            !currentItem.match(/^[A-Za-z]/)) {
                          continue
                        }
                        
                        if (currentItem.match(/^\)+$/) || currentItem.match(/^[0-9\s]+$/)) {
                          continue
                        }
                        
                        if (currentItem.match(/\([0-9]+$/) && nextItem.match(/^(minute|hour)/i)) {
                          cleanedItems.push(currentItem + ' ' + nextItem)
                          i++
                        } else {
                          cleanedItems.push(currentItem)
                        }
                      }
                      
                      const categories = {
                        transport: [],
                        shopping: [],
                        parks: [],
                        hospitals: [],
                        schools: [],
                        others: []
                      }
                      
                      cleanedItems.forEach(item => {
                        const cleanItem = item.trim()
                        if (!cleanItem) return
                        
                        const hasDistanceOrTime = /\d+\s*(kilometer|km|minute|hour|นาที|ชั่วโมง)/i.test(cleanItem)
                        
                        if (cleanItem.toLowerCase().includes('bts') || cleanItem.toLowerCase().includes('mrt') || cleanItem.toLowerCase().includes('arl') || cleanItem.toLowerCase().includes('srt') || cleanItem.toLowerCase().includes('pier') || cleanItem.toLowerCase().includes('expressway')) {
                          categories.transport.push(cleanItem)
                        } else if (cleanItem.toLowerCase().includes('mall') || cleanItem.toLowerCase().includes('shopping') || cleanItem.toLowerCase().includes('department store') || cleanItem.toLowerCase().includes('complex') || cleanItem.toLowerCase().includes('tower') || cleanItem.toLowerCase().includes('avenue') || cleanItem.toLowerCase().includes('commons') || cleanItem.toLowerCase().includes('emporium') || cleanItem.toLowerCase().includes('terminal')) {
                          categories.shopping.push(cleanItem)
                        } else if (cleanItem.toLowerCase().includes('park') || cleanItem.toLowerCase().includes('สวน')) {
                          categories.parks.push(cleanItem)
                        } else if (cleanItem.toLowerCase().includes('hospital') || cleanItem.toLowerCase().includes('โรงพยาบาล')) {
                          categories.hospitals.push(cleanItem)
                        } else if (cleanItem.toLowerCase().includes('school') || cleanItem.toLowerCase().includes('โรงเรียน')) {
                          categories.schools.push(cleanItem)
                        } else if (hasDistanceOrTime) {
                          categories.transport.push(cleanItem)
                        } else {
                          categories.others.push(cleanItem)
                        }
                      })
                      
                      return categories
                    }
                    
                    const locationData = parseLocationData(locationHighlights)
                    const hasData = Object.values(locationData).some(cat => cat.length > 0) || cleanStations.length > 0
                    
                    if (!hasData) return <div className="text-gray-500 text-sm">ไม่ระบุ</div>
                    
                    return (
                      <div className="space-y-6">
                        {/* แถวแรก: สถานีขนส่ง + การเดินทาง */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* สถานีขนส่ง */}
                          {cleanStations.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                              <h4 className="font-semibold text-[#243756] mb-3 flex items-center gap-2">
                                <MdOutlineTrain className="w-5 h-5 text-[#917133]" />
                                สถานีขนส่ง
                              </h4>
                              <div className="space-y-2">
                                {cleanStations.map((station, idx) => (
                                  <div key={idx} className="flex items-center text-gray-700 font-prompt">
                                    <FaRegCheckCircle className="w-4 h-4 mr-2 text-[#917133]" />
                                    <span className="text-sm">{getStationFormLabel(station)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* การเดินทาง */}
                          {locationData.transport.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                              <h4 className="font-semibold text-[#243756] mb-3 flex items-center gap-2">
                                <MdOutlineTrain className="w-5 h-5 text-[#917133]" />
                                การเดินทาง
                              </h4>
                              <div className="space-y-2">
                                {locationData.transport.map((item, idx) => (
                                  <div key={idx} className="flex items-start text-gray-700 font-prompt">
                                    <FaRegCheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#917133] flex-shrink-0" />
                                    <span className="text-sm leading-relaxed">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* แถวที่สอง: ห้างสรรพสินค้า + สวนสาธารณะ */}
                        {(locationData.shopping.length > 0 || locationData.parks.length > 0) && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* ห้างสรรพสินค้า */}
                            {locationData.shopping.length > 0 && (
                              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <h4 className="font-semibold text-[#243756] mb-3 flex items-center gap-2">
                                  <FaStore className="w-5 h-5 text-[#917133]" />
                                  ห้างสรรพสินค้า & ศูนย์การค้า
                                </h4>
                                <div className="space-y-2">
                                  {locationData.shopping.map((item, idx) => (
                                    <div key={idx} className="flex items-start text-gray-700 font-prompt">
                                      <FaRegCheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#917133] flex-shrink-0" />
                                      <span className="text-sm leading-relaxed">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* สวนสาธารณะ */}
                            {locationData.parks.length > 0 && (
                              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <h4 className="font-semibold text-[#243756] mb-3 flex items-center gap-2">
                                  <FaSeedling className="w-5 h-5 text-[#917133]" />
                                  สวนสาธารณะ
                                </h4>
                                <div className="space-y-2">
                                  {locationData.parks.map((item, idx) => (
                                    <div key={idx} className="flex items-start text-gray-700 font-prompt">
                                      <FaRegCheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#917133] flex-shrink-0" />
                                      <span className="text-sm leading-relaxed">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* แถวที่สาม: โรงพยาบาล + โรงเรียน */}
                        {(locationData.hospitals.length > 0 || locationData.schools.length > 0) && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* โรงพยาบาล */}
                            {locationData.hospitals.length > 0 && (
                              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <h4 className="font-semibold text-[#243756] mb-3 flex items-center gap-2">
                                  <FaShieldAlt className="w-5 h-5 text-[#917133]" />
                                  โรงพยาบาล
                                </h4>
                                <div className="space-y-2">
                                  {locationData.hospitals.map((item, idx) => (
                                    <div key={idx} className="flex items-start text-gray-700 font-prompt">
                                      <FaRegCheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#917133] flex-shrink-0" />
                                      <span className="text-sm leading-relaxed">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* โรงเรียน */}
                            {locationData.schools.length > 0 && (
                              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <h4 className="font-semibold text-[#243756] mb-3 flex items-center gap-2">
                                  <FaBook className="w-5 h-5 text-[#917133]" />
                                  โรงเรียน
                                </h4>
                                <div className="space-y-2">
                                  {locationData.schools.map((item, idx) => (
                                    <div key={idx} className="flex items-start text-gray-700 font-prompt">
                                      <FaRegCheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#917133] flex-shrink-0" />
                                      <span className="text-sm leading-relaxed">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* แถวที่สี่: อื่นๆ (เต็มความกว้าง) */}
                        {locationData.others.length > 0 && (
                          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h4 className="font-semibold text-[#243756] mb-3 flex items-center gap-2">
                              <FaHome className="w-5 h-5 text-[#917133]" />
                              สิ่งอำนวยความสะดวกอื่นๆ
                            </h4>
                            <div className="space-y-2">
                              {locationData.others.map((item, idx) => (
                                <div key={idx} className="flex items-start text-gray-700 font-prompt">
                                  <FaRegCheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#917133] flex-shrink-0" />
                                  <span className="text-sm leading-relaxed">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>

                {/* Units in Project */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt text-center">Units in Project</h3>
                  {(() => {
                    // ดึงข้อมูลยูนิตจาก API หรือใช้ข้อมูลตัวอย่าง
                    const units = project.units || project.available_units || []
                    
                    if (!units.length) {
                      return (
                        <div className="text-center text-gray-500">ยังไม่มีข้อมูลยูนิต</div>
                      )
                    }
                    
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {units.map((unit, index) => (
                          <div key={index} className="flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/4">
                            <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl overflow-hidden transition-all duration-700 transform hover:-translate-y-4 h-full flex flex-col group cursor-pointer font-prompt shadow-lg hover:shadow-xl border border-gray-200">
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                              <div className="relative overflow-hidden h-52 flex-shrink-0">
                                <img 
                                  src={unit.image || unit.cover_image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} 
                                  alt={unit.title || `ยูนิต ${unit.unit_number || index + 1}`} 
                                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute top-4 left-4">
                                  <div className="text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20" style={{ backgroundColor: '#0cc0df' }}>
                                    {unit.type || 'ยูนิต'}
                                  </div>
                                </div>
                                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#ffffff' }}>
                                  {unit.status === 'available' ? 'ว่าง' : unit.status === 'sold' ? 'ขายแล้ว' : unit.status === 'reserved' ? 'จองแล้ว' : 'ไม่ระบุ'}
                                </div>
                              </div>
                              <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-base font-semibold text-gray-900 mb-2 font-prompt group-hover:text-blue-600 transition-colors duration-300 leading-snug line-clamp-2">
                                  {unit.title || `ยูนิต ${unit.unit_number || index + 1}`}
                                </h3>
                                <div className="space-y-2 mb-4 text-xs text-gray-600">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <span className="truncate">ห้องนอน: {unit.bedrooms || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <span className="truncate">ห้องน้ำ: {unit.bathrooms || 'N/A'}</span>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <span className="truncate">พื้นที่: {unit.area ? `${unit.area} ตร.ม.` : 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <span className="truncate">ชั้นที่: {unit.floor || 'N/A'}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 whitespace-nowrap">
                                    <span className="truncate" title={unit.location || unit.address || 'ไม่ระบุที่อยู่'}>
                                      {unit.location || unit.address || 'ไม่ระบุที่อยู่'}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-auto">
                                  {unit.price ? (
                                    <div className="text-xl font-bold" style={{ color: '#243756' }}>฿{unit.price}</div>
                                  ) : unit.rent_price ? (
                                    <div className="text-xl font-bold" style={{ color: '#243756' }}>฿{unit.rent_price}/เดือน</div>
                                  ) : (
                                    <div className="text-lg text-gray-500">ราคาติดต่อ</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>

                {/* Nearby Projects */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt text-center">Nearby Projects</h3>
                  {(() => {
                    // ดึงข้อมูลโครงการใกล้เคียงจาก API หรือใช้ข้อมูลตัวอย่าง
                    const nearbyProjects = project.nearby_projects || []
                    
                    if (!nearbyProjects.length) {
                      return (
                        <div className="text-center text-gray-500">ยังไม่มีข้อมูลโครงการใกล้เคียง</div>
                      )
                    }
                    
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {nearbyProjects.map((nearbyProject, index) => (
                          <div key={index} className="flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/4">
                            <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl overflow-hidden transition-all duration-700 transform hover:-translate-y-4 h-full flex flex-col group cursor-pointer font-prompt shadow-lg hover:shadow-xl border border-gray-200">
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                              <div className="relative overflow-hidden h-52 flex-shrink-0">
                                <img 
                                  src={nearbyProject.cover_image || nearbyProject.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} 
                                  alt={nearbyProject.name || `โครงการ ${index + 1}`} 
                                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute top-4 left-4">
                                  <div className="text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20" style={{ backgroundColor: '#0cc0df' }}>
                                    {nearbyProject.project_type || 'โครงการ'}
                                  </div>
                                </div>
                                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#ffffff' }}>
                                  {nearbyProject.status || 'ไม่ระบุ'}
                                </div>
                              </div>
                              <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-base font-semibold text-gray-900 mb-2 font-prompt group-hover:text-blue-600 transition-colors duration-300 leading-snug line-clamp-2">
                                  {nearbyProject.name || `โครงการ ${index + 1}`}
                                </h3>
                                <div className="space-y-2 mb-4 text-xs text-gray-600">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <span className="truncate">ประเภท: {nearbyProject.project_type || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <span className="truncate">สถานะ: {nearbyProject.status || 'N/A'}</span>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <span className="truncate">ผู้พัฒนา: {nearbyProject.developer || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <span className="truncate">ระยะทาง: {nearbyProject.distance || 'N/A'}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 whitespace-nowrap">
                                    <span className="truncate" title={nearbyProject.address || 'ไม่ระบุที่อยู่'}>
                                      {nearbyProject.address || 'ไม่ระบุที่อยู่'}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-auto">
                                  {nearbyProject.price_range ? (
                                    <div className="text-xl font-bold" style={{ color: '#243756' }}>{nearbyProject.price_range}</div>
                                  ) : (
                                    <div className="text-lg text-gray-500">ราคาติดต่อ</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centered CTA Buttons (Contact + Search) */}
      <div className="fixed inset-x-0 bottom-4 sm:bottom-6 z-40 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          {/* Header Text Above Button */}
          <div className="text-center pointer-events-auto">
            <div className="text-xs sm:text-sm text-gray-500 font-prompt">Interested in this project?</div>
          </div>
          
          {/* Contact Button */}
          <div className="flex items-center rounded-full px-3 sm:px-4 py-2 pointer-events-auto">
            <button
              onClick={() => setShowContactModal(true)}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-full gold-cta font-prompt text-sm sm:text-base"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Contact Us now</span>
              <span className="shine" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      
      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-gray-200">
            <div className="flex items-start justify-end mb-4">
              <button onClick={() => setShowContactModal(false)} className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            {/* Header Text */}
            <div className="text-center mb-6">
              <div className="text-sm text-gray-500 font-prompt mb-1">Interested in this project?</div>
              <div className="text-lg font-bold text-gray-900 font-prompt">Contact Us now</div>
            </div>
            
            <div className="space-y-3">
              <a href={contactInfo?.line ? `https://line.me/R/ti/p/~${contactInfo.line}` : '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-6 py-3 rounded-full text-white font-medium font-prompt mx-auto w-48" style={{ background: '#06c755' }}>
                <FaLine className="w-5 h-5" />
                <span>Line</span>
              </a>
              <a href={contactInfo?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-6 py-3 rounded-full text-white font-medium font-prompt mx-auto w-48" style={{ background: '#1877F2' }}>
                <FaFacebook className="w-5 h-5" />
                <span>Facebook</span>
              </a>
              <a href={contactInfo?.whatsapp ? `https://wa.me/${String(contactInfo.whatsapp).replace(/\D/g,'')}` : '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-6 py-3 rounded-full text-white font-medium font-prompt mx-auto w-48" style={{ background: '#25D366' }}>
                <FaWhatsapp className="w-5 h-5" />
                <span>Whatsapp</span>
              </a>
              <a href={contactInfo?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-6 py-3 rounded-full text-white font-medium font-prompt mx-auto w-48" style={{ background: 'linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}>
                <FaInstagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
              <a href={contactInfo?.phone ? `tel:${contactInfo.phone}` : '#'} className="flex items-center justify-center gap-3 px-6 py-3 rounded-full text-white font-medium font-prompt mx-auto w-48" style={{ background: '#60a5fa' }}>
                <Phone className="w-5 h-5" />
                <span>Call</span>
              </a>
            </div>
            <div className="mt-6">
              <div className="text-center text-gray-600 text-sm font-prompt mb-3">Can't find your right space?</div>
              <a href="/properties" className="w-full inline-flex items-center justify-center px-4 py-3 rounded-full text-white font-semibold font-prompt" style={{ background: '#6b7280' }}>
                Let us help you find it
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Photo Viewer */}
      {open && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-blue-50 z-50 flex items-center justify-center">
          <div className="w-full h-full flex flex-col">
            {/* Header with Tabs */}
            <div className="flex items-center justify-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
              {/* Tabs - Centered */}
              <div className="flex bg-blue-100 rounded-lg p-1">
                <button
                  onClick={() => setPhotoViewerTab('photos')}
                  className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                    photoViewerTab === 'photos'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  รูปภาพ
                </button>
                <button
                  onClick={() => setPhotoViewerTab('location')}
                  className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                    photoViewerTab === 'location'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ทำเลที่ตั้ง
                </button>
              </div>
              
              {/* Close Button - Absolute positioned */}
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex items-center justify-center p-4">
              {photoViewerTab === 'photos' ? (
                /* Photos Tab */
                <div className="w-full max-w-4xl">
                  {/* Main Image */}
                  <div className="relative mb-4">
                    {(() => { 
                      const images = Array.isArray(project.project_images) ? project.project_images : [project.project_images]
                      return (
                    <>
                    <img
                      src={images[index]?.url || images[index]}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                    />
                    
                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                    </>) 
                    })()}
                  </div>

                  {/* Thumbnails */}
                  {Array.isArray(project.project_images) && project.project_images.length > 1 && (
                    <div className="flex justify-center space-x-2">
                      {project.project_images.map((image, idx) => (
                        <button
                          key={idx}
                          onClick={() => setIndex(idx)}
                          className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            idx === index ? 'border-blue-500' : 'border-gray-300'
                          }`}
                        >
                          <img
                            src={image?.url || image}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Location Tab */
                <div className="w-full max-w-2xl text-center">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-8 shadow-lg border border-gray-200">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaMapMarkerAlt className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-prompt">ทำเลที่ตั้ง</h3>
                    <p className="text-gray-600 mb-6 font-prompt">
                      {project.address || project.location || 'ไม่ระบุที่อยู่'}
                    </p>
                    {project.google_map_url && (
                      <a
                        href={project.google_map_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-prompt"
                      >
                        <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                        ดูใน Google Maps
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetail
                