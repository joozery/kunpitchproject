import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Home, Star, ArrowLeft, Eye, Heart, Share2, Phone, Mail, Calendar, Car, Train, Bus, Wifi, Shield, Users, Clock, Tag, Send, MessageCircle, Search } from 'lucide-react'
import { TbViewportWide, TbStairsUp } from 'react-icons/tb'
import { LuBath } from 'react-icons/lu'
import { IoBedOutline } from 'react-icons/io5'
import { FaPhone, FaLine, FaWhatsapp, FaFacebookMessenger, FaFacebook, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaYoutube, FaFileAlt, FaSwimmingPool, FaDumbbell, FaCar, FaShieldAlt, FaBook, FaChild, FaCouch, FaSeedling, FaHome, FaStore, FaTshirt, FaWifi, FaBath, FaLock, FaVideo, FaUsers, FaLaptop, FaHamburger, FaCoffee, FaUtensils, FaDoorOpen, FaFutbol, FaTrophy, FaFilm, FaPaw, FaArrowUp, FaMotorcycle, FaShuttleVan, FaBolt, FaRegCheckCircle } from 'react-icons/fa'
import { BiArea } from 'react-icons/bi'
import { MdOutlineTrain } from 'react-icons/md'
import { propertyAPI, condoAPI, houseAPI, landAPI, commercialAPI } from '../lib/api'
import { contactApi } from '../lib/contactApi'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCurrency } from '../lib/CurrencyContext'
import LatestStyleCard from '../components/cards/LatestStyleCard'
import { getStationLabelById } from '../lib/stations'

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
  const lastFetchedIdRef = useRef(null)
  const [showContactModal, setShowContactModal] = useState(false)

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

          // Helpers to normalize special features from backend
          const parseJsonSafe = (v) => {
            if (!v) return null
            if (typeof v === 'object') return v
            if (typeof v === 'string') {
              const trimmed = v.trim()
              if (!trimmed || trimmed === 'null' || trimmed === 'undefined' || trimmed === '-') return null
              try { return JSON.parse(trimmed) } catch { return null }
            }
            return null
          }
          const normalizeSpecialFeatures = (raw) => {
            const obj = parseJsonSafe(raw) || (typeof raw === 'object' ? raw : null)
            if (!obj) return null
            const map = {
              shortTerm: obj.shortTerm ?? obj.short_term,
              allowPet: obj.allowPet ?? obj.allow_pet,
              allowCompanyRegistration: obj.allowCompanyRegistration ?? obj.allow_company_registration,
              foreignQuota: obj.foreignQuota ?? obj.foreign_quota,
              penthouse: obj.penthouse,
              luckyNumber: obj.luckyNumber ?? obj.lucky_number,
            }
            // Keep only truthy booleans
            const cleaned = {}
            Object.entries(map).forEach(([k, v]) => { if (typeof v === 'boolean') cleaned[k] = v })
            return Object.keys(cleaned).length ? cleaned : null
          }

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
            availableDate: p.availableDate || p.available_date,
            specialFeatures: normalizeSpecialFeatures(p.specialFeatures || p.special_features || p.special_features_json)
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
      if (lastFetchedIdRef.current === id) return
      lastFetchedIdRef.current = id
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
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
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
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
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
                        <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl overflow-hidden transition-all duration-700 transform hover:-translate-y-4 h-full flex flex-col group cursor-pointer font-prompt shadow-lg hover:shadow-xl border border-gray-200">
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

  // Normalize mixed inputs (array, json string, comma-separated string) → array<string>
  const normalizeToArray = (value) => {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) return []
      // Try JSON array first
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) return parsed
      } catch {}
      // Fallback comma-separated
      return trimmed.split(',').map(s => s.trim()).filter(Boolean)
    }
    return []
  }

  // Format station IDs/slugs to readable names (prefer Thai when possible)
  const formatStationName = (station) => {
    if (!station) return ''
    if (typeof station === 'object') {
      return station.name_th || station.name || station.title || station.label || ''
    }
    const s = String(station).trim()
    const map = {
      thong_lor: 'ทองหล่อ',
      thonglor: 'ทองหล่อ',
      asok: 'อโศก',
      asoke: 'อโศก',
      ekkamai: 'เอกมัย',
      phrom_phong: 'พร้อมพงษ์',
      sala_daeng: 'ศาลาแดง',
      silom: 'สีลม',
      chit_lom: 'ชิดลม',
      chidlom: 'ชิดลม',
      phaya_thai: 'พญาไท',
      mo_chit: 'หมอชิต',
      bang_na: 'บางนา',
      on_nut: 'อ่อนนุช',
      nana: 'นานา',
      ari: 'อารีย์',
      sathorn: 'สาทร',
      ratchada: 'รัชดา',
    }
    if (map[s]) return map[s]
    // Fallback: replace underscores with spaces and title-case
    const pretty = s.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
    return pretty
  }

  const formatStationsList = (list) => {
    if (!Array.isArray(list)) return ''
    return list.map((s) => getStationLabelById(s)).filter(Boolean).join(', ')
  }

  // Map amenity ids to readable Thai labels
  const getAmenityLabel = (amenity) => {
    if (!amenity) return ''
    const raw = typeof amenity === 'string' ? amenity : (amenity.id || amenity.label || '')
    const key = String(raw).trim().toLowerCase().replace(/[\s\-]+/g, '_').replace(/[\/]+/g, '_')
    const map = {
      fully_furnished: 'Fully Furnished',
      air_conditioner: 'Air Conditioner',
      aircon: 'Air Conditioner',
      ac: 'Air Conditioner',
      television: 'Television',
      tv: 'Television',
      refrigerator: 'Refrigerator',
      microwave: 'Microwave',
      electric_stove: 'Electric Stove',
      stove: 'Electric Stove',
      range_hood: 'Range Hood',
      hood: 'Range Hood',
      washing_machine: 'Washing Machine',
      water_heater: 'Water Heater',
      oven: 'Oven',
      bathtub: 'Bathtub',
      digital_door_lock: 'Digital Door Lock',
      smart_lock: 'Digital Door Lock',
      internet: 'Internet / Wi‑Fi',
      wi_fi: 'Internet / Wi‑Fi',
      wifi: 'Internet / Wi‑Fi',
      smart_home_system: 'Smart Home System',
      smart_home: 'Smart Home System',
      jacuzzi: 'Jacuzzi',
      motorcycle_parking: 'Motorcycle Parking',
      balcony: 'Balcony',
      parking: 'Parking',
      private_elevator: 'Private Elevator',
      dishwasher: 'Dishwasher',
      walk_in_closet: 'Walk-in Closet',
      walk_in: 'Walk-in Closet',
      private_pool: 'Private Pool',
      water_filtration_system: 'Water Filtration System',
      water_filter: 'Water Filtration System',
      private_garden: 'Private Garden',
      wine_cooler_wine_cellar: 'Wine Cooler / Wine Cellar',
      wine_cooler: 'Wine Cooler / Wine Cellar',
      wine_cellar: 'Wine Cooler / Wine Cellar',
      built_in_wardrobe: 'Built-in Wardrobe',
      builtin_wardrobe: 'Built-in Wardrobe',
    }
    return map[key] || (typeof amenity === 'string' ? amenity : (amenity.label || raw))
  }

  // Match Project Facilities IDs to the same labels used in the admin ProjectForm
  const getProjectFacilityLabel = (idOrObj) => {
    if (!idOrObj) return ''
    const key = typeof idOrObj === 'string' ? idOrObj : (idOrObj.id || idOrObj.label || '')
    const map = {
      // Transport
      passengerLift: 'Passenger Lift',
      shuttleService: 'Shuttle Service',
      evCharger: 'EV Charger',
      parking: 'Parking',
      // Security
      security24h: '24-hour security with CCTV',
      accessControl: 'Access control System',
      // Recreation
      fitness: 'Fitness / Gym',
      swimmingPool: 'Swimming Pool',
      sauna: 'Sauna',
      steamRoom: 'Steam Room',
      sportArea: 'Sport Area',
      golfSimulator: 'Golf simulator',
      kidsPlayground: 'Kids Playground',
      cinemaRoom: 'Cinema Room / Theatre',
      // Pet & Business
      allowPet: 'Allow Pet',
      meetingRoom: 'Meeting Room',
      coWorkingSpace: 'Co-Working Space',
      // Dining
      restaurant: 'Restaurant',
      cafe: 'Cafe',
      privateDiningRoom: 'Private Dining Room / Party Room',
      coKitchen: 'Co-Kitchen',
      // Common
      lobby: 'Lobby',
      loungeArea: 'Lounge Area',
      clubhouse: 'Clubhouse',
      convenienceStore: 'Convenience Store / Minimart',
      library: 'Library',
      laundry: 'Laundry',
      garden: 'Garden',
      wifi: 'WIFI'
    }
    // Exact match
    if (map[key]) return map[key]
    // Sometimes backend may save label already
    return typeof idOrObj === 'string' ? idOrObj : (idOrObj.label || key)
  }

  const capitalizeFirst = (text) => {
    if (!text || typeof text !== 'string') return text
    const [first, ...rest] = text
    return first.toUpperCase() + rest.join('').toLowerCase()
  }

  const formatISODate = (input) => {
    if (!input) return ''
    const d = new Date(input)
    if (Number.isNaN(d.getTime())) return ''
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const formatMonthYear = (input) => {
    if (!input) return ''
    const d = new Date(input)
    if (Number.isNaN(d.getTime())) return ''
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${month}/${year}`
  }

  const getYoutubeId = (url) => {
    if (!url || typeof url !== 'string') return null
    const trimmed = url.trim()
    if (!trimmed || trimmed === 'null' || trimmed === 'undefined' || trimmed === '-') return null
    // Support youtu.be, watch?v=, embed/, shorts/
    const patterns = [
      /youtu\.be\/([^#&?\/]*)/i,
      /youtube\.com\/(?:watch\?v=|embed\/|shorts\/)([^#&?\/]*)/i,
      /youtube\.com\/.+&v=([^#&?\/]*)/i
    ]
    for (const re of patterns) {
      const m = trimmed.match(re)
      if (m && m[1] && m[1].length === 11) return m[1]
    }
    // Fallback simple query parse
    try {
      const u = new URL(trimmed)
      const v = u.searchParams.get('v')
      if (v && v.length === 11) return v
    } catch {}
    return null
  }

  const hasYoutubeVideo = () => {
    const idStr = getYoutubeId(property?.youtubeUrl || property?.youtube_url)
    return Boolean(idStr)
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
    <div className="min-h-screen bg-white">
      {/* Main Header */}
      <Header />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 mt-20 pb-32">
        {/* Property Header Card */}
        <div className="mb-6 sm:mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              {/* Property Title */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-2">
                <h1 className="text-xl sm:text-2xl font-bold font-prompt leading-tight">
                  <span className="text-[#917133]">{property.status === 'for_sale' ? 'ขาย' : 'เช่า'}</span>
                  <span className="text-gray-900"> {property.title}</span>
                </h1>
              </div>
              
              {/* Location */}
              <p className="text-gray-600 mb-3 font-prompt text-sm sm:text-base">
                {property.location || property.address}
              </p>
              {/* Reference Number under location (smaller, mobile-friendly) */}
              <div className="mb-3">
                <span className="inline-block border border-blue-600 rounded px-2 py-1 text-xs sm:text-sm text-gray-700 font-medium font-prompt bg-blue-50/80">
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
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-0">
                {/* Ref badge removed per request */}
                {property.selectedStations && property.selectedStations.length > 0 && (
                  <span className="px-3 py-1 bg-blue-50 text-gray-700 text-sm rounded-lg border border-blue-600 font-prompt">
                    ใกล้ {formatStationName(property.selectedStations[0])}
                  </span>
                )}
                {/* Availability tag (replaces short-term if availableDate exists) */}
                {property.availableDate ? (
                  <span className="px-3 py-1 text-white text-sm rounded-lg font-prompt bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm">
                    Available: {formatMonthYear(property.availableDate)}
                  </span>
                ) : (
                  property.specialFeatures?.shortTerm && (
                    <span className="px-3 py-1 text-white text-sm rounded-lg font-prompt bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm">
                    เช่าช่วงสั้น
                  </span>
                  )
                )}
              </div>

              {/* Mobile Price Display - Same line as tags */}
              <div className="sm:hidden mt-3">
                <div className="flex flex-wrap items-center gap-3">
                  {property.rent_price > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 font-prompt">เช่า:</span>
                      <span className="text-lg font-bold text-blue-600 font-prompt">{format(convert(property.rent_price))}</span>
            </div>
                  )}
                  {property.price > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 font-prompt">ขาย:</span>
                      <span className="text-lg font-bold text-blue-600 font-prompt">{format(convert(property.price))}</span>
            </div>
                  )}
                    </div>
              </div>
                    </div>
            
                        {/* Price Section - Hidden on mobile, shown on desktop */}
            <div className="hidden sm:block text-center sm:text-right mt-4 sm:mt-0">
              {property.rent_price > 0 && (
                <>
                  <div className="text-sm text-gray-600 mb-1 font-prompt">ราคาเช่า/เดือน</div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-2 font-prompt">{format(convert(property.rent_price))}</div>
                </>
              )}
              {property.price > 0 && (
                <>
                  <div className="text-sm text-gray-600 mb-1 font-prompt">ราคาขาย</div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-2 font-prompt">{format(convert(property.price))}</div>
                </>
              )}
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="w-full">
            {/* Professional Image Gallery */}
            <div className="mb-6 sm:mb-8">
              {property.images && property.images.length > 0 ? (
                (() => {
                  const images = property.images.slice(0, 100)
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
                          src={images[0]}
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = images[1] || images[2] || images[0]; }}
                      alt={property.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    {/* Rent badges */}
                    {(property.rent_price > 0 || (property.area && property.rent_price > 0)) && (
                      <div className="absolute left-3 bottom-3 space-y-2">
                        {property.rent_price > 0 && (
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
                               style={{ background: 'rgba(0,0,0,0.6)' }}>
                            <span>{format(convert(property.rent_price))} / เดือน</span>
                          </div>
                        )}
                        {rentPerSqm && (
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
                               style={{ background: 'rgba(0,0,0,0.6)' }}>
                            <span>{format(convert(rentPerSqm))} / ตร.ม.</span>
                          </div>
                        )}
                      </div>
                    )}
                    {images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                          {images.length} รูป
                      </div>
                    )}
                    
                  </div>
                  
                  {/* Top Right Image */}
                  <div 
                    className="col-start-4 col-span-2 row-span-3 group overflow-hidden rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setIndex(1);
                      setOpen(true);
                    }}
                  >
                      <img 
                            src={images[1] || images[0]} 
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = images[0]; }}
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    
                    </div>
                    
                  {/* Bottom Left of Right Section */}
                  <div 
                    className="col-start-4 row-start-4 row-span-2 group overflow-hidden rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setIndex(3);
                      setOpen(true);
                    }}
                  >
                      <img 
                            src={images[3] || images[0]} 
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = images[0]; }}
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    
                    </div>
                    
                  {/* Bottom Right of Right Section */}
                  <div 
                    className="col-start-5 row-start-4 row-span-2 group overflow-hidden rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setIndex(4);
                      setOpen(true);
                    }}
                  >
                      <img 
                            src={images[4] || images[0]} 
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = images[0]; }}
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    
                  </div>
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

            {/* YouTube Videos & Location Section */}
            {(() => {
              const floorPlans = normalizeToArray(
                (() => {
                  const raw = property.floorPlan || property.floor_plan || property.floorPlans || property.floorPlanImages || property.planImages || property.floor_plans
                  if (!raw) return []
                  if (Array.isArray(raw)) {
                    return raw.map((item) => (item && typeof item === 'object' ? (item.url || item.src || '') : item)).filter(Boolean)
                  }
                  if (typeof raw === 'object') {
                    return raw.url ? [raw.url] : []
                  }
                  return [raw]
                })()
              )
              const hasYT = hasYoutubeVideo()
              if (!hasYT && !(floorPlans && floorPlans.length)) return null
              return (
            <div className="mb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-1">
                    {/* Media group: Video + Floor plan side-by-side */}
                    {(hasYT || (floorPlans && floorPlans.length > 0)) && (
                      <div className="lg:col-span-4">
                        <div className="flex gap-1">
                          {hasYT && (
                            <a href={(property.youtubeUrl || property.youtube_url)} target="_blank" rel="noopener noreferrer" className="block group overflow-hidden rounded-md shadow-sm hover:shadow-md transition-all duration-300 w-48 sm:w-60">
                              <div className="aspect-video bg-gradient-to-br from-gray-100 to-blue-100 relative">
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
                            )}
                            {floorPlans && floorPlans.length > 0 && (
                              <a href={floorPlans[0]} target="_blank" rel="noopener noreferrer" className="block group overflow-hidden rounded-md shadow-sm hover:shadow-md transition-all duration-300 w-48 sm:w-60">
                                <div className="aspect-video bg-gradient-to-br from-gray-100 to-blue-100 relative">
                                  <img src={floorPlans[0]} alt="Floor plan" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                        </div>
                                <div className="p-1"><p className="text-xs text-gray-600 font-prompt">Floor plan</p></div>
                              </a>
                            )}
                      </div>
                      </div>
                    )}

                {/* Location */}
                <div className="lg:col-span-2 flex justify-end">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <MdOutlineTrain className="w-3 h-3 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-900 font-medium font-prompt">
                        {(() => {
                          const stations = (Array.isArray(property.selectedStations) && property.selectedStations.length)
                            ? property.selectedStations
                            : (Array.isArray(property.selected_stations) ? property.selected_stations : [])
                          const transport = property.nearbyTransport || property.nearby_transport
                          if (stations && stations.length) return formatStationsList(stations)
                          if (transport) return transport
                          return property.location || property.address || '-'
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              )
            })()}

            {/* Overview Content */}
            <div className="mb-6 sm:mb-8">
              <div className="space-y-6 sm:space-y-8">
                {/* Key Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">รายละเอียด ยูนิต</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
                      {(() => {
                        const propertyType = property.type || property.property_type || 'condo'
                        return propertyType === 'house' ? (
                          <BiArea className="h-6 w-6 text-gray-600" />
                        ) : (
                          <TbViewportWide className="h-6 w-6 text-gray-600" />
                        )
                      })()}
                      <div>
                        <div className="text-sm text-gray-600 font-prompt">
                          {property.area ? `${property.area} ${(() => {
                            const propertyType = property.type || property.property_type || 'condo';
                            return propertyType === 'house' ? 'ตร.ว.' : 'ตร.ม.';
                          })()} พื้นที่ใช้สอย` : 'N/A'}
                        </div>
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
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
                  {/* In-room Amenities (replace price info) */}
                  <div className="flex-1">
                    <div className="space-y-3 sm:space-y-2">
                      <div className="text-lg font-semibold text-gray-900 mb-3 sm:mb-2 font-prompt">Special Features</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {property.specialFeatures && Object.entries(property.specialFeatures).some(([, v]) => Boolean(v)) ? (
                          Object.entries(property.specialFeatures).map(([key, value]) => {
                            if (!value) return null
                            const labelMap = {
                              shortTerm: 'Short-term',
                              allowPet: 'Allow Pet',
                              allowCompanyRegistration: 'Company Registration',
                              foreignQuota: 'Foreign Quota',
                              penthouse: 'Penthouse',
                              luckyNumber: 'Lucky Number'
                            }
                            const iconMap = {
                              shortTerm: <Clock className="w-4 h-4 text-[#917133]" />,
                              allowPet: <FaPaw className="w-4 h-4 text-[#917133]" />,
                              allowCompanyRegistration: <FaUsers className="w-4 h-4 text-[#917133]" />,
                              foreignQuota: <FaLock className="w-4 h-4 text-[#917133]" />,
                              penthouse: <FaHome className="w-4 h-4 text-[#917133]" />,
                              luckyNumber: <Star className="w-4 h-4 text-[#917133]" />
                            }
                            const label = labelMap[key] || key
                            const icon = iconMap[key] || <FaRegCheckCircle className="w-4 h-4 text-[#917133]" />
                            return (
                              <div key={key} className="flex items-center text-gray-700 font-prompt">
                                <span className="mr-3">{icon}</span>
                                <span className="text-sm">{label}</span>
                        </div>
                            )
                          })
                        ) : (
                          <span className="text-gray-500 text-sm">ไม่ระบุ</span>
                      )}
                        </div>
                    </div>
                  </div>

                  {/* Tags column removed to avoid duplication with Special Features */}
                </div>

                {/* Description */}
                {property.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 font-prompt">รายละเอียด</h3>
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <div 
                        className={`text-gray-700 leading-relaxed transition-all ${descExpanded ? '' : 'max-h-48 overflow-hidden'}`}
                        dangerouslySetInnerHTML={{ 
                          __html: property.description 
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

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt">Amenities</h3>
                  {(() => {
                    const projectAmenities = normalizeToArray(projectInfo?.amenities)
                    const propertyAmenities = normalizeToArray(property?.amenities)
                    const list = projectAmenities.length ? projectAmenities : propertyAmenities
                    if (!list.length) return <div className="text-gray-500 text-sm">ไม่ระบุ</div>
                    return (
                      <div className="grid grid-cols-2 gap-3">
                        {list.slice(0, 24).map((a, idx) => {
                          const label = typeof a === 'string' ? getAmenityLabel(a) : (a?.label || getAmenityLabel(a?.id))
                          return (
                            <div key={idx} className="flex items-center text-gray-700 font-prompt">
                              <FaRegCheckCircle className="w-4 h-4 mr-3 text-[#917133]" />
                              <span className="text-sm">{capitalizeFirst(label)}</span>
                        </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt">Project Details</h3>
                  <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    {/* Project Image */}
                    <div className="lg:w-1/2">
                      <img 
                        src={getProjectCover(projectInfo, property.type || property.property_type || 'condo')} 
                        alt={(projectInfo && (projectInfo.name || projectInfo.title || projectInfo.project_name)) || property.selectedProject || property.title || 'Project'} 
                        className="w-full h-48 sm:h-64 lg:h-80 xl:h-96 object-cover rounded-lg sm:rounded-xl"
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
                          <span className="text-sm text-gray-600 font-prompt">สถานีขนส่ง:</span>
                          <div className="font-semibold text-gray-900 font-prompt">
                            {(() => {
                              // Priority: projectInfo.stations > property.selectedStations > property.nearbyTransport
                              const projectStations = projectInfo?.stations || projectInfo?.selected_stations || []
                              const propertyStations = property?.selectedStations || property?.selected_stations || []
                              const nearbyTransport = property?.nearbyTransport || property?.nearby_transport || ''
                              
                              // Combine and filter stations
                              let allStations = []
                              if (Array.isArray(projectStations)) {
                                allStations = [...allStations, ...projectStations]
                              }
                              if (Array.isArray(propertyStations)) {
                                allStations = [...allStations, ...propertyStations]
                              }
                              
                              // Clean and filter valid stations
                              const cleanStations = allStations
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
                              
                              // Remove duplicates
                              const uniqueStations = [...new Set(cleanStations)]
                              
                              if (uniqueStations.length > 0) {
                                return formatStationsList(uniqueStations)
                              }
                              
                              // Fallback to nearby transport if no stations
                              if (nearbyTransport && nearbyTransport !== '[]' && nearbyTransport !== 'null') {
                                return nearbyTransport
                              }
                              
                              return '-'
                            })()}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 font-prompt">Location:</span>
                          <div className="font-semibold text-gray-900 font-prompt">{(projectInfo && (projectInfo.address || projectInfo.location)) || property.location || property.address || '-'}</div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Link 
                          to={`/project/${projectInfo?.id || property.selectedProject || property.projectCode}`}
                          className="px-3 sm:px-4 py-2 bg-[#917133] text-white rounded-md text-xs sm:text-sm font-medium font-prompt hover:bg-[#7a5f2a] transition-colors text-center"
                        >
                          All Details
                        </Link>
                        {property.googleMapUrl && (
                          <a
                            className="px-3 sm:px-4 py-2 bg-[#917133] text-white rounded-md text-xs sm:text-sm font-medium font-prompt hover:bg-[#7a5f2a] transition-colors text-center"
                            href={property.googleMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Google map
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                                

                {/* Project Facilities */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt">Project Facilities</h3>
                  {(() => {
                    const facilities = normalizeToArray(projectInfo?.facilities || projectInfo?.project_facilities || projectInfo?.common_facilities)
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

                {/* Project Location (from Project Details) */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt">ทำเลที่ตั้ง (โครงการ)</h3>
                  {(() => {
                    // ใช้ข้อมูลจากหลายแหล่ง: projectInfo > property > fallback
                    const projectStations = projectInfo?.selected_stations || projectInfo?.stations || []
                    const propertyStations = property?.selectedStations || property?.selected_stations || []
                    const nearbyTransport = property?.nearbyTransport || property?.nearby_transport || ''
                    
                    // รวมข้อมูลสถานีจากทุกแหล่ง
                    let allStations = []
                    if (Array.isArray(projectStations)) {
                      allStations = [...allStations, ...projectStations]
                    }
                    if (Array.isArray(propertyStations)) {
                      allStations = [...allStations, ...propertyStations]
                    }
                    
                    // Clean and filter valid stations
                    const cleanStations = allStations
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
                    
                    // Remove duplicates
                    const uniqueStations = [...new Set(cleanStations)]
                    
                    // ใช้ location_highlights จากฟอร์มโครงการ (จุดเด่นทำเล)
                    const locationHighlights = projectInfo?.location_highlights || ''
                    
                    // Check if we have any data to show
                    if (!locationHighlights && uniqueStations.length === 0) return <div className="text-gray-500 text-sm">ไม่ระบุ</div>
                      
                      // แยกข้อมูลตามประเภท
                      const parseLocationData = (text) => {
                        if (!text) return { transport: [], shopping: [], parks: [], hospitals: [], schools: [], others: [] }
                        
                        // Remove HTML tags and convert to plain text
                        const plainText = text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                        
                        // Split by bullet points (•) first, then by newlines
                        const items = plainText.split(/[•\-\*]/).filter(item => item.trim())
                        
                        // Clean up items that are incomplete (like "minute drive)" or "minute walk)")
                        const cleanedItems = []
                        for (let i = 0; i < items.length; i++) {
                          const currentItem = items[i].trim()
                          const nextItem = items[i + 1] ? items[i + 1].trim() : ''
                          
                          // Skip incomplete items that are just time/distance fragments
                          if (currentItem.match(/^(minute|hour|kilometer|km|นาที|ชั่วโมง)/i) && 
                              !currentItem.match(/^[A-Za-z]/)) {
                            continue
                          }
                          
                          // Skip items that are just closing parentheses or fragments
                          if (currentItem.match(/^\)+$/) || currentItem.match(/^[0-9\s]+$/)) {
                            continue
                          }
                          
                          // If current item ends with incomplete time/distance, try to combine with next
                          if (currentItem.match(/\([0-9]+$/) && nextItem.match(/^(minute|hour)/i)) {
                            cleanedItems.push(currentItem + ' ' + nextItem)
                            i++ // Skip next item since we combined it
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
                          
                          // Check if this is a complete location item (contains distance/time info)
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
                            // If it has distance/time info but doesn't match other categories, it's likely transport
                            categories.transport.push(cleanItem)
                          } else {
                            categories.others.push(cleanItem)
                          }
                        })
                        
                        return categories
                      }
                      
                      const locationData = parseLocationData(locationHighlights)
                      const hasData = Object.values(locationData).some(cat => cat.length > 0) || uniqueStations.length > 0
                      
                      if (!hasData) return <div className="text-gray-500 text-sm">ไม่ระบุ</div>
                      
                      return (
                        <div className="space-y-6">
                          {/* แถวแรก: สถานีขนส่ง + การเดินทาง */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* สถานีขนส่ง */}
                            {uniqueStations.length > 0 && (
                              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <h4 className="font-semibold text-[#243756] mb-3 flex items-center gap-2">
                                  <MdOutlineTrain className="w-5 h-5 text-[#917133]" />
                                  สถานีขนส่ง
                                </h4>
                                <div className="space-y-2">
                                  {uniqueStations.map((station, idx) => (
                                    <div key={idx} className="flex items-center text-gray-700 font-prompt">
                                      <FaRegCheckCircle className="w-4 h-4 mr-2 text-[#917133]" />
                                      <span className="text-sm">{getStationLabelById(station)}</span>
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
                {/* Units in Project - removed per request */}

                {/* Nearby Properties */}
                <div>
                  <h3 className="text-lg font-semibold text-[#243756] mb-4 font-prompt text-center">Nearby Properties</h3>
                  {nearby && nearby.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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

                {/* Special Features duplicated block removed per request; now shown in-room */}

                {/* SEO Tags - hidden per request */}
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
            <div className="text-xs sm:text-sm text-gray-500 font-prompt">Interested in this property?</div>
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
              <div className="text-sm text-gray-500 font-prompt mb-1">Interested in this property?</div>
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
                    {(() => { const images = property.images.slice(0, 100); return (
                    <>
                    <img
                      src={images[index]}
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
                    </>) })()}
                  </div>

                  {/* Thumbnails */}
                  {property.images.length > 1 && (
                    <div className="flex justify-center space-x-2">
                      {property.images.slice(0, 100).map((image, idx) => (
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
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-8 shadow-lg border border-gray-200">
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