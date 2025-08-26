import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Home, Star, ArrowLeft, Eye, Heart, Share2, Phone, Mail, Calendar, Car, Train, Bus, Wifi, Shield, Users, Clock, Tag } from 'lucide-react'
import { TbViewportWide, TbStairsUp } from 'react-icons/tb'
import { LuBath } from 'react-icons/lu'
import { IoBedOutline } from 'react-icons/io5'
import { FaPhone, FaLine, FaWhatsapp, FaFacebookMessenger, FaFacebook, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaYoutube, FaFileAlt, FaSwimmingPool, FaDumbbell, FaCar, FaShieldAlt, FaBook, FaChild, FaCouch, FaSeedling, FaHome, FaStore, FaTshirt, FaWifi, FaBath, FaLock, FaVideo, FaUsers, FaLaptop, FaHamburger, FaCoffee, FaUtensils, FaDoorOpen, FaFutbol, FaTrophy, FaFilm, FaPaw, FaArrowUp, FaMotorcycle, FaShuttleVan, FaBolt } from 'react-icons/fa'
import { propertyAPI, condoAPI, houseAPI, landAPI, commercialAPI } from '../lib/api'
import { contactApi } from '../lib/contactApi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCurrency } from '../lib/CurrencyContext'
import LatestStyleCard from '../components/cards/LatestStyleCard'

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
  const [photoViewerTab, setPhotoViewerTab] = useState('photos')
  const [unitsInProject, setUnitsInProject] = useState([])
  const [nearby, setNearby] = useState([])
  const [descExpanded, setDescExpanded] = useState(false)
  const [projectInfo, setProjectInfo] = useState(null)

  // Derived values for UI meta
  const pricePerSqm = property && property.area ? Math.round((property.price || 0) / (property.area || 1)) : null
  const rentPerSqm = property && property.area && (property.rent_price || 0) > 0 ? Math.round((property.rent_price || 0) / (property.area || 1)) : null



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch property by ID (parallel across types, keep priority order)
        try {
          const [propS, condoS, houseS, landS, commS] = await Promise.allSettled([
            propertyAPI.getById(id),
            condoAPI.getById(id),
            houseAPI.getById(id),
            landAPI.getById(id),
            commercialAPI.getById(id)
          ])

          const getPayload = (settled) => {
            if (!settled || settled.status !== 'fulfilled') return null
            const result = settled.value
            return (result && result.success && result.data) ? result.data : result
          }

          const candidates = [
            getPayload(propS),
            getPayload(condoS),
            getPayload(houseS),
            getPayload(landS),
            getPayload(commS)
          ]

          let payload = candidates.find(p => p && p.id) || candidates.find(Boolean)

          // Deep fallback: if all getById failed, try fetching lists and find by id
          if (!payload) {
            const [allPropsS, allCondosS, allHousesS, allLandsS, allComS] = await Promise.allSettled([
              propertyAPI.getAll(),
              condoAPI.getAll(),
              houseAPI.getAll(),
              landAPI.getAll(),
              commercialAPI.getAll()
            ])
            const pickFromList = (settled) => {
              if (!settled || settled.status !== 'fulfilled') return null
              const v = settled.value
              const list = (v && v.data && Array.isArray(v.data)) ? v.data : (Array.isArray(v) ? v : [])
              return list.find((item) => String(item?.id) === String(id)) || null
            }
            payload = pickFromList(allPropsS) || pickFromList(allCondosS) || pickFromList(allHousesS) || pickFromList(allLandsS) || pickFromList(allComS)
          }

          if (!payload) throw new Error('Property not found across all types')

          // Normalize common field names from backend snake_case to frontend camelCase
          const normalizeEntity = (p) => ({
            ...p,
            status: (p.status === 'sale') ? 'for_sale' : (p.status === 'rent') ? 'for_rent' : p.status,
            googleMapUrl: p.googleMapUrl || p.google_map_url,
            nearbyTransport: p.nearbyTransport || p.nearby_transport,
            selectedStations: p.selectedStations || p.selected_stations || [],
            selectedProject: p.selectedProject || p.selected_project,
            projectCode: p.projectCode || p.project_code,
            type: p.type || p.property_type,
            announcerStatus: p.announcerStatus || p.announcer_status,
            seoTags: p.seoTags || p.seo_tags,
            youtubeUrl: p.youtubeUrl || p.youtube_url,
          })
          payload = normalizeEntity(payload)
          // Normalize images to array of URLs without changing UI
          const toUrl = (img) => {
            if (!img) return ''
            if (typeof img === 'string') return img
            return (
              img.secure_url ||
              img.url ||
              img.path ||
              img.image_url ||
              img.src ||
              img.link ||
              ''
            )
          }
          let normalizedImages = []
          if (Array.isArray(payload.images)) {
            normalizedImages = payload.images.map(toUrl).filter(Boolean)
          } else if (typeof payload.images === 'string') {
            // Try parse JSON string array/object
            try {
              const parsed = JSON.parse(payload.images)
              if (Array.isArray(parsed)) {
                normalizedImages = parsed.map(toUrl).filter(Boolean)
              } else if (parsed) {
                const u = toUrl(parsed)
                if (u) normalizedImages = [u]
              }
            } catch {
              normalizedImages = [payload.images]
            }
          }
          // Fallback alternative fields often used
          if (normalizedImages.length === 0) {
            const altArrays = [payload.condo_images, payload.property_images, payload.imagesUrl, payload.photos]
            for (const arr of altArrays) {
              if (Array.isArray(arr)) {
                normalizedImages = arr.map(toUrl).filter(Boolean)
                if (normalizedImages.length) break
              }
            }
          }
          if (normalizedImages.length === 0) {
            const single = payload.image || payload.imageUrl || payload.thumbnail || payload.cover
            if (single) normalizedImages = [toUrl(single)].filter(Boolean)
          }

          setProperty({
            ...payload,
            images: normalizedImages
          })
          // Increment click count
          setClickCount(prev => prev + 1)
        } catch (e) {
          // On 404 or any error, set a local fallback without issuing another API call
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

  // Load Units in Project and Nearby Properties from multiple sources
  useEffect(() => {
    const loadRelated = async () => {
      if (!property) return
      try {
        const [propS, condoS, houseS, landS, commS] = await Promise.allSettled([
          propertyAPI.getAll(),
          condoAPI.getAll({ limit: 100 }),
          houseAPI.getAll({ limit: 100 }),
          landAPI.getAll({ limit: 100 }),
          commercialAPI.getAll({ limit: 100 })
        ])

        const pull = (s) => (s && s.status === 'fulfilled' && s.value && s.value.success && Array.isArray(s.value.data)) ? s.value.data : []
        const combined = [
          ...pull(propS),
          ...pull(condoS),
          ...pull(houseS),
          ...pull(landS),
          ...pull(commS)
        ]

        // Units in same project (match by selectedProject/name or projectCode)
        const sameProject = combined.filter((p) => {
          if (!p || p.id === property.id) return false
          const sameBySelected = (property.selectedProject && (p.selectedProject === property.selectedProject || p.selected_project === property.selectedProject))
          const sameByCode = (property.projectCode && (p.projectCode === property.projectCode || p.project_code === property.projectCode))
          return Boolean(sameBySelected || sameByCode)
        })
        const fallbackLatest = [...combined]
          .sort((a,b) => new Date(b.updated_at || b.updatedAt || b.created_at || b.createdAt || 0) - new Date(a.updated_at || a.updatedAt || a.created_at || a.createdAt || 0))
          .filter(p => p && p.id !== property.id)

        setUnitsInProject((sameProject.length ? sameProject : fallbackLatest).slice(0,8))

        // Nearby properties: naive match by first token of location/address across all types
        const baseLocation = (property.location || property.address || '')
          .split(',')[0]
          ?.trim()
        let nearbyList = []
        if (baseLocation) {
          nearbyList = combined.filter((p) => {
            if (!p || p.id === property.id) return false
            return (
              (p.location && String(p.location).includes(baseLocation)) ||
              (p.address && String(p.address).includes(baseLocation))
            )
          })
        }
        if (!nearbyList.length) {
          nearbyList = fallbackLatest
        }
        setNearby(nearbyList.slice(0,8))
      } catch (err) {
        console.error('Failed to load related properties:', err)
      }
    }
    loadRelated()
  }, [property])

  // Fetch full project details from saved selection
  useEffect(() => {
    const loadProject = async () => {
      try {
        if (!property) return
        const selectedRaw = property.selectedProject || property.selected_project || ''
        const selectedName = typeof selectedRaw === 'string' ? selectedRaw : ''
        const code = property.projectCode || property.project_code || ''
        if (!selectedRaw && !code) {
          setProjectInfo(null)
          return
        }
        // If selected is numeric id → fetch directly
        const isNumericId = (val) => String(val).trim().match(/^\d+$/)
        if (isNumericId(selectedRaw)) {
          const byId = await propertyAPI.getProjectById(String(selectedRaw).trim())
          if (byId && byId.success && byId.data) {
            setProjectInfo(byId.data)
            return
          }
        }

        // Fallback: load all and match by name/code/id
        const res = await propertyAPI.getProjects()
        const list = (res && res.success && Array.isArray(res.data)) ? res.data : []
        const match = list.find(p => {
          const name = p.name || p.title || p.project_name
          const pcode = p.project_code || p.code
          const pid = p.id || p.project_id
          return (
            (selectedName && name && String(name).toLowerCase() === String(selectedName).toLowerCase()) ||
            (code && pcode && String(pcode).toLowerCase() === String(code).toLowerCase()) ||
            (isNumericId(selectedRaw) && pid && String(pid) === String(selectedRaw))
          )
        })
        if (match) setProjectInfo(match); else setProjectInfo(null)
      } catch (e) {
        setProjectInfo(null)
      }
    }
    loadProject()
  }, [property])

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

  // Parse long free-text description to readable bullet points
  const parseDescription = (text) => {
    if (!text || typeof text !== 'string') return []
    // Normalize whitespace and strip redundant symbols/emojis/hashtags
    const cleaned = text
      .replace(/[\n\r\t]+/g, ' ')
      .replace(/[#*_`~]+/g, ' ')
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, '') // most emojis
      .replace(/\s{2,}/g, ' ') // collapse spaces
      .trim()
    // Split by common separators found in imported posts (•, ·, |, newlines, spaced dashes)
    const parts = cleaned
      .split(/\n|\r|\t|\s•\s|\s\u2022\s|\s·\s|\s\|\s|\s–\s|\s-\s/g)
      .map(s => s.trim())
      .filter(s => s.length > 0)

    // If splitting produced almost nothing, try a lighter split on the dot-like bullet
    if (parts.length <= 1) {
      const alt = cleaned
        .split(/·|\u00b7|\u2022|•/g)
        .map(s => s.trim())
        .filter(s => s.length > 0)
      return alt
    }
    return parts
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

  // ฟังก์ชันสำหรับแสดง React Icons เหมือนในฟอร์มหลังบ้าน
  const getFacilityIcon = (iconName) => {
    const iconMap = {
      // Transport
      'lift': <FaArrowUp className="w-5 h-5" />,
      'private-lift': <FaLock className="w-5 h-5" />,
      'parking-common': <FaCar className="w-5 h-5" />,
      'motorcycle': <FaMotorcycle className="w-5 h-5" />,
      'shuttle': <FaShuttleVan className="w-5 h-5" />,
      'ev-charger': <FaBolt className="w-5 h-5" />,
      
      // Security
      'cctv': <FaVideo className="w-5 h-5" />,
      'access-control': <FaLock className="w-5 h-5" />,
      
      // Recreation
      'gym': <FaDumbbell className="w-5 h-5" />,
      'pool': <FaSwimmingPool className="w-5 h-5" />,
      'private-pool': <FaBath className="w-5 h-5" />,
      'sauna': <FaBath className="w-5 h-5" />,
      'steam': <FaBath className="w-5 h-5" />,
      'jacuzzi-common': <FaBath className="w-5 h-5" />,
      'sport': <FaFutbol className="w-5 h-5" />,
      'golf': <FaTrophy className="w-5 h-5" />,
      'stadium': <FaTrophy className="w-5 h-5" />,
      'playground': <FaChild className="w-5 h-5" />,
      'cinema': <FaFilm className="w-5 h-5" />,
      
      // Pet & Business
      'pet': <FaPaw className="w-5 h-5" />,
      'meeting': <FaUsers className="w-5 h-5" />,
      'coworking': <FaLaptop className="w-5 h-5" />,
      
      // Dining
      'restaurant': <FaHamburger className="w-5 h-5" />,
      'cafe': <FaCoffee className="w-5 h-5" />,
      'dining-room': <FaCoffee className="w-5 h-5" />,
      'kitchen': <FaUtensils className="w-5 h-5" />,
      
      // Common
      'lobby': <FaDoorOpen className="w-5 h-5" />,
      'lounge': <FaCouch className="w-5 h-5" />,
      'clubhouse': <FaHome className="w-5 h-5" />,
      'store': <FaStore className="w-5 h-5" />,
      'library': <FaBook className="w-5 h-5" />,
      'laundry': <FaTshirt className="w-5 h-5" />,
      'garden-common': <FaSeedling className="w-5 h-5" />,
      'wifi': <FaWifi className="w-5 h-5" />,
      
      // Default mappings for common Thai terms
      'ระบบรักษาความปลอดภัย': <FaShieldAlt className="w-5 h-5" />,
      'ห้องหนังสือ': <FaBook className="w-5 h-5" />,
      'สระเด็ก': <FaChild className="w-5 h-5" />,
      'ที่จอดรถ': <FaCar className="w-5 h-5" />,
      'เล้าจ์': <FaCouch className="w-5 h-5" />,
      'สวนขนาดย่อม': <FaSeedling className="w-5 h-5" />,
      'ฟิตเนส / ยิม': <FaDumbbell className="w-5 h-5" />,
      'สระว่ายน้ำ': <FaSwimmingPool className="w-5 h-5" />,
      'แม่น้ำ': <FaBolt className="w-5 h-5" />
    };
    
    return iconMap[iconName] || <FaHome className="w-5 h-5" />;
  };

  // Removed local mock data; using API-driven data via unitsInProject and nearby

  // --- Shared card (same style as ExclusiveUnits) ---
  const getPropertyImage = (p, fallbackKey = 'condo') => {
    if (p.cover_image) {
      let url = p.cover_image
      if (typeof url === 'string') {
        if (url.startsWith('http://')) url = url.replace('http://', 'https://')
        if (url.startsWith('//')) url = 'https:' + url
      }
      return url
    }
    if (p.images) {
      try {
        const arr = Array.isArray(p.images) ? p.images : JSON.parse(p.images)
        if (arr && arr.length) {
          let url = typeof arr[0] === 'string' ? arr[0] : (arr[0]?.url || arr[0]?.image_url)
          if (url) {
            if (url.startsWith('http://')) url = url.replace('http://', 'https://')
            if (url.startsWith('//')) url = 'https:' + url
            return url
          }
        }
      } catch {
        let url = typeof p.images === 'string' ? p.images : ''
        if (url.startsWith('http://')) url = url.replace('http://', 'https://')
        if (url.startsWith('//')) url = 'https:' + url
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

  const exGetTypeLabel = (type) => ({
    condo: 'คอนโด',
    house: 'บ้าน',
    land: 'ที่ดิน',
    commercial: 'โฮมออฟฟิศ'
  }[type] || 'อสังหาฯ')

  const exGetTypeColor = (type) => {
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

  const ExclusiveCard = ({ item, idx }) => {
    const p = item || {}
    const t = (p.type || p.property_type || p.__type || 'condo')
    const hasSale = p.price && p.price > 0
    const hasRent = p.rent_price && p.rent_price > 0
    return (
      <div className="flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/4">
        <div className="relative bg-white rounded-2xl overflow-hidden transition-all duration-700 transform hover:-translate-y-4 h-full flex flex-col group cursor-pointer font-prompt shadow-lg hover:shadow-xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
          <div className="relative overflow-hidden h-52 flex-shrink-0">
            <img src={getPropertyImage(p, t)} alt={p.title || p.name} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 left-4">
              <div className="text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20" style={{ backgroundColor: exGetTypeColor(t) }}>{exGetTypeLabel(t)}</div>
            </div>
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#ffffff' }}>
              {p.status === 'for_sale' || p.status === 'sale' ? 'ขาย' : p.status === 'for_rent' || p.status === 'rent' ? 'เช่า' : 'ขาย/เช่า'}
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col" onClick={() => { if (p.id) navigate(`/property/${p.id}`) }}>
            <h3 className="text-base font-semibold text-gray-900 mb-2 font-prompt group-hover:text-blue-600 transition-colors duration-300 leading-snug line-clamp-2">{p.title || p.name}</h3>
            <div className="space-y-2 mb-4 text-xs text-gray-600">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 whitespace-nowrap"><span className="truncate">ห้องนอน: {p.bedrooms || 'N/A'}</span></div>
                <div className="flex items-center gap-2 whitespace-nowrap"><span className="truncate">ห้องน้ำ: {p.bathrooms || 'N/A'}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 whitespace-nowrap"><span className="truncate">พื้นที่: {p.area ? `${p.area} ตร.ม.` : 'N/A'}</span></div>
                <div className="flex items-center gap-2 whitespace-nowrap"><span className="truncate">ชั้นที่: {p.floor || 'N/A'}</span></div>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap"><span className="truncate" title={p.location || p.address || 'ไม่ระบุที่อยู่'}>{p.location || p.address || 'ไม่ระบุที่อยู่'}</span></div>
            </div>
            <div className="mt-auto">
              {hasSale && hasRent ? (
                <>
                  <div className="text-xl font-bold" style={{ color: '#243756' }}>฿{formatPrice(p.price)}</div>
                  <div className="text-lg font-semibold" style={{ color: '#243756' }}>฿{formatPrice(p.rent_price)}/เดือน</div>
                </>
              ) : hasSale ? (
                <div className="text-xl font-bold" style={{ color: '#243756' }}>฿{formatPrice(p.price)}</div>
              ) : hasRent ? (
                <div className="text-xl font-bold" style={{ color: '#243756' }}>฿{formatPrice(p.rent_price)}/เดือน</div>
              ) : (
                <div className="text-lg text-gray-500">ราคาติดต่อ</div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getProjectCover = (proj, fallbackType = 'condo') => {
    if (!proj) return getPropertyImage(property, fallbackType)
    const cover = proj.cover_image || (Array.isArray(proj.project_images) ? (proj.project_images.find(i => i.is_cover)?.url || proj.project_images[0]?.url) : null)
    return cover || getPropertyImage(property, fallbackType)
  }

  // Map amenity ids to readable Thai labels
  const getAmenityLabel = (amenity) => {
    const map = {
      tv: 'ทีวี',
      aircon: 'แอร์',
      air_conditioner: 'แอร์',
      refrigerator: 'ตู้เย็น',
      microwave: 'ไมโครเวฟ',
      oven: 'เตาอบ',
      washing_machine: 'เครื่องซักผ้า',
      dryer: 'เครื่องอบผ้า',
      water_heater: 'เครื่องทำน้ำอุ่น',
      balcony: 'ระเบียง',
      wardrobe: 'ตู้เสื้อผ้า',
      sofa: 'โซฟา',
      dining_table: 'โต๊ะทานอาหาร',
      bed: 'เตียง',
      wifi: 'Wi‑Fi',
      stove: 'เตาไฟฟ้า',
      hood: 'เครื่องดูดควัน',
      bathtub: 'อ่างอาบน้ำ',
    }
    if (!amenity) return ''
    const key = String(amenity).trim()
    return map[key] || key
  }

  const hasYoutubeVideo = () => {
    try {
      const u = property?.youtubeUrl || property?.youtube_url || ''
      if (!u || typeof u !== 'string') return false
      const trimmed = u.trim()
      if (!trimmed || trimmed === 'null' || trimmed === 'undefined' || trimmed === '-') return false
      return /(youtube\.com|youtu\.be)/i.test(trimmed)
    } catch {
      return false
    }
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
        {/* Property Header Card */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              {/* Property Title */}
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold font-prompt">
                  <span className="text-[#917133]">{property.status === 'for_sale' ? 'ขาย' : 'เช่า'}</span>
                  <span className="text-gray-900"> {property.title}</span>
                </h1>
              </div>
              
              {/* Location */}
              <p className="text-gray-600 mb-3 font-prompt">
                {property.location || property.address}
              </p>
              {/* Reference Number under location (smaller, mobile-friendly) */}
              <div className="mb-3">
                <span className="inline-block border border-blue-600 rounded px-2 py-0.5 text-xs sm:text-sm text-gray-700 font-medium font-prompt bg-white/80">
                  {(() => {
                    const code = property.projectCode || property.project_code || property.id
                    const codeStr = String(code || '')
                    const hasWS = /^\s*ws/i.test(codeStr)
                    const normalized = hasWS ? codeStr.replace(/^\s*/, '') : `WS${codeStr}`
                    return `Ref: ${normalized}`
                  })()}
                </span>
              </div>
              
              {/* Property Tags */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Ref badge removed per request */}
                {property.selectedStations && property.selectedStations.length > 0 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg border border-blue-600 font-prompt">
                    ใกล้ {property.selectedStations[0]}
                  </span>
                )}
                {property.specialFeatures?.shortTerm && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg border border-blue-600 font-prompt">
                    เช่าช่วงสั้น
                  </span>
                )}
                {/* Extra tag removed per request */}
            </div>
            </div>
            
            {/* Price Section */}
                          <div className="text-right">
              {property.rent_price > 0 && (
                <>
                  <div className="text-sm text-gray-600 mb-1 font-prompt">ราคาเช่า</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#917133] mb-2 font-prompt">{format(convert(property.rent_price))}</div>
                </>
              )}
              {property.price > 0 && (
                <>
                  <div className="text-sm text-gray-600 mb-1 font-prompt">ราคาขาย</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#917133] mb-2 font-prompt">{format(convert(property.price))}</div>
                </>
              )}
              
              {/* Share Button */}
              <div className="flex justify-end mt-3">
                <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Share2 className="h-4 w-4 text-blue-700" />
                </button>
                </div>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Content */}
          <div className="w-full">
            {/* Professional Image Gallery */}
            <div className="mb-8">
              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-5 grid-rows-5 gap-2 h-96">
                  {/* Main Hero Image - Left Side (Large) */}
                  <div 
                    className="col-span-3 row-span-5 relative group overflow-hidden rounded-xl shadow-lg cursor-pointer"
                    onClick={() => {
                      setIndex(0);
                      setOpen(true);
                    }}
                  >
                    <img
                      src={property.images[0]}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = property.images[1] || property.images[2] || property.images[0]; }}
                      alt={property.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    {property.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                        {property.images.length} รูป
                      </div>
                    )}
                    
                  </div>
                  
                  {/* Top Right Image */}
                  <div 
                    className="col-start-4 col-span-2 row-span-3 group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setIndex(1);
                      setOpen(true);
                    }}
                  >
                      <img 
                        src={property.images[1] || property.images[0]} 
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = property.images[0]; }}
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    
                    </div>
                    
                  {/* Bottom Left of Right Section */}
                  <div 
                    className="col-start-4 row-start-4 row-span-2 group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setIndex(3);
                      setOpen(true);
                    }}
                  >
                      <img 
                        src={property.images[3] || property.images[0]} 
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = property.images[0]; }}
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    
                    </div>
                    
                  {/* Bottom Right of Right Section */}
                  <div 
                    className="col-start-5 row-start-4 row-span-2 group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setIndex(4);
                      setOpen(true);
                    }}
                  >
                      <img 
                        src={property.images[4] || property.images[0]} 
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = property.images[0]; }}
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    
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
            {hasYoutubeVideo() && (
            <div className="mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                {/* YouTube Thumbnails (single) */}
                <div className="lg:col-span-2 flex">
                  <a href={(property.youtubeUrl || property.youtube_url)} target="_blank" rel="noopener noreferrer" className="block group overflow-hidden rounded-md shadow-sm hover:shadow-md transition-all duration-300 w-48 sm:w-60">
                    <div className="aspect-video bg-gray-200 relative">
                      <img src={`https://img.youtube.com/vi/${String(property.youtubeUrl || property.youtube_url).split('v=')[1] || ''}/hqdefault.jpg`} alt="YouTube" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/15 group-hover:bg-black/30 transition-all duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-1"><p className="text-xs text-gray-600 font-prompt">Video</p></div>
                  </a>
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
                      <p className="text-sm text-gray-900 font-medium font-prompt">
                        {(() => {
                          const stations = (Array.isArray(property.selectedStations) && property.selectedStations.length)
                            ? property.selectedStations
                            : (Array.isArray(property.selected_stations) ? property.selected_stations : [])
                          const transport = property.nearbyTransport || property.nearby_transport
                          if (stations && stations.length) return stations.join(', ')
                          if (transport) return transport
                          return property.location || property.address || '-'
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Overview Content */}
            <div className="mb-8">
              <div className="space-y-8">
                {/* Key Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">รายละเอียด ยูนิต</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="flex items-center space-x-3">
                      <IoBedOutline className="h-6 w-6 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">{property.bedrooms || 'N/A'} ห้อง ห้องนอน</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <LuBath className="h-6 w-6 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">{property.bathrooms || 'N/A'} ห้อง ห้องน้ำ</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TbViewportWide className="h-6 w-6 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">{property.area ? `${property.area} ตร.ม. พื้นที่ใช้สอย` : 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TbStairsUp className="h-6 w-6 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">{property.floor || 'N/A'} ลำดับชั้นที่</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Tags Section */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* In-room Amenities (replace price info) */}
                  <div className="flex-1">
                    <div className="space-y-2">
                      <div className="text-lg font-semibold text-gray-900 mb-2 font-prompt">สิ่งอำนวยความสะดวกภายในห้อง</div>
                      <div className="flex flex-wrap gap-2">
                        {(property.amenities && Array.isArray(property.amenities) && property.amenities.length > 0
                          ? property.amenities
                          : []).slice(0, 12).map((a, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border">
                            {typeof a === 'string' ? getAmenityLabel(a) : (a.label || getAmenityLabel(a.id))}
                          </span>
                        ))}
                        {(!property.amenities || !Array.isArray(property.amenities) || property.amenities.length === 0) && (
                          <span className="text-gray-500 text-sm">ไม่ระบุ</span>
                        )}
                      </div>
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
                    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                      {parseDescription(property.description).length > 1 ? (
                        <ul className={`list-disc pl-6 space-y-2 text-gray-700 leading-relaxed transition-all ${descExpanded ? '' : 'max-h-48 overflow-hidden'}`}>
                          {parseDescription(property.description).map((item, idx) => (
                            <li key={idx} className="font-prompt">
                              <span className="whitespace-pre-wrap break-words">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={`text-gray-700 leading-relaxed whitespace-pre-wrap break-words transition-all ${descExpanded ? '' : 'line-clamp-5'}`}>{property.description}</p>
                      )}
                      <div className="mt-3">
                        <button onClick={() => setDescExpanded(v => !v)} className="text-blue-700 hover:underline text-sm font-prompt">
                          {descExpanded ? 'ย่อรายละเอียด' : 'อ่านเพิ่มเติม'}
                        </button>
                      </div>
                    </div>
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
                        src={getProjectCover(projectInfo, property.type || property.property_type || 'condo')} 
                        alt={(projectInfo && (projectInfo.name || projectInfo.title || projectInfo.project_name)) || property.selectedProject || property.title || 'Project'} 
                        className="w-full h-72 sm:h-80 lg:h-96 object-cover rounded-xl"
                      />
                    </div>

                    {/* Project Information */}
                    <div className="lg:w-1/2 space-y-4 self-stretch flex flex-col justify-between">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600 font-prompt">Project name:</span>
                          <div className="font-semibold text-gray-900 font-prompt">{(projectInfo && (projectInfo.name_th || projectInfo.name_en || projectInfo.name || projectInfo.title || projectInfo.project_name)) || property.selectedProject || property.projectCode || '-'}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 font-prompt">Project Type:</span>
                          <div className="font-semibold text-gray-900 font-prompt">{(projectInfo && (projectInfo.project_type || projectInfo.type)) || getTypeLabel(property.type || property.property_type)}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 font-prompt">Developer:</span>
                          <div className="font-semibold text-gray-900 font-prompt">{(projectInfo && (projectInfo.developer || projectInfo.developer_name)) || property.developer || '-'}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 font-prompt">Skytrian/Subway:</span>
                          <div className="font-semibold text-gray-900 font-prompt">{(projectInfo && (projectInfo.selected_stations || projectInfo.stations)) ? (Array.isArray(projectInfo.selected_stations || projectInfo.stations) ? (projectInfo.selected_stations || projectInfo.stations).join(', ') : (projectInfo.selected_stations || projectInfo.stations)) : ((property.selectedStations && property.selectedStations.length) ? property.selectedStations.join(', ') : (property.nearbyTransport || '-'))}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 font-prompt">Location:</span>
                          <div className="font-semibold text-gray-900 font-prompt">{(projectInfo && (projectInfo.address || projectInfo.location)) || property.location || property.address || '-'}</div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button className="px-6 py-3 bg-[#917133] text-white rounded-lg font-medium font-prompt hover:bg-[#7a5f2a] transition-colors">
                          All Details
                        </button>
                        {property.googleMapUrl && (
                          <a
                            className="px-6 py-3 bg-[#917133] text-white rounded-lg font-medium font-prompt hover:bg-[#7a5f2a] transition-colors text-center"
                            href={property.googleMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View <span className="underline">On Google map</span>
                          </a>
                        )}
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

                {/* Units in Project */}
                {/* Units in Project - removed per request */}

                {/* Nearby Properties */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt text-center">Nearby Properties</h3>
                  {nearby && nearby.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {nearby.map((p, idx) => (
                        <ExclusiveCard key={`nearby-${p.id || idx}`} item={p} idx={idx} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">ไม่พบทรัพย์ใกล้เคียง</div>
                  )}
                </div>

                {/* Project Information */}
                {/* Hide simple project info block per request */}

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

                {/* SEO Tags - hidden per request */}
              </div>
            </div>
          </div>


                      </div>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Custom Photo Viewer */}
      {open && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="w-full h-full flex flex-col">
            {/* Header with Tabs */}
            <div className="flex items-center justify-center p-4 bg-white border-b border-gray-200">
              {/* Tabs - Centered */}
              <div className="flex bg-gray-100 rounded-lg p-1">
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
                className="absolute right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
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
                    <img
                      src={property.images[index]}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                    />
                    
                    {/* Navigation Arrows */}
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {property.images.length > 1 && (
                    <div className="flex justify-center space-x-2">
                      {property.images.map((image, idx) => (
                        <button
                          key={idx}
                          onClick={() => setIndex(idx)}
                          className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            idx === index ? 'border-blue-500' : 'border-gray-300'
                          }`}
                        >
                          <img
                            src={image}
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
                  <div className="bg-white rounded-lg p-8 shadow-lg">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaMapMarkerAlt className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-prompt">ทำเลที่ตั้ง</h3>
                    <p className="text-gray-600 mb-6 font-prompt">
                      {property.location || property.address || 'ไม่ระบุที่อยู่'}
                    </p>
                    {property.googleMapUrl && (
                      <a
                        href={property.googleMapUrl}
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

export default PropertyDetail  