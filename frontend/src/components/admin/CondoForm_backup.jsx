import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { propertyAPI, uploadAPI } from '../../lib/api'
import { 
  Upload, 
  X, 
  MapPin, 
  Building, 
  FileText,
  Image,
  Plus,
  Save,
  ArrowLeft,
  Star,
  Calendar,
  Eye,
  EyeOff,
  MapIcon,
  Phone,
  Mail,
  Calculator,
  Home,
  Bed,
  Bath,
  Ruler,
  Car,
  Wifi,
  Shield,
  Trees,
  Camera,
  Search,
  Filter,
  Grid,
  List,
  AlertCircle,
  CheckCircle,
  Info,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Edit3,
  Copy,
  Trash2,
  RefreshCw,
  Settings
} from 'lucide-react'
import { FacilityIcons } from '../icons/FacilityIcons'

const CondoForm = ({ condo = null, onBack, onSave, isEditing = false }) => {
  const [formData, setFormData] = useState({
    // ข้อมูลพื้นฐาน
    title: condo?.title || '', // ชื่อโครงการ
    projectCode: condo?.projectCode || '', // รหัสโครงการ (อัตโนมัติ)
    status: condo?.status || 'sale', // สถานะ: ขาย/เช่า
    price: condo?.price?.toString() || '', // ราคา (บาท)
    rentPrice: condo?.rentPrice?.toString() || '', // ราคาเช่า (บาท/เดือน)
    
    // โลเคชั่น
    location: condo?.location || '', // สถานที่
    googleMapUrl: condo?.googleMapUrl || '', // Google Map URL
    nearbyTransport: condo?.nearbyTransport || '', // BTS/MRT/APL/SRT
    
    // ประเภท
    listingType: condo?.listingType || 'sale', // ขาย/เช่า
    
    // รายละเอียด
    description: condo?.description || '',
    
    // ข้อมูลอสังหาริมทรัพย์
    area: condo?.area?.toString() || '', // พื้นที่ (ตารางเมตร)
    bedrooms: condo?.bedrooms?.toString() || '', // ห้องนอน
    bathrooms: condo?.bathrooms?.toString() || '', // ห้องน้ำ
    floor: condo?.floor || '', // ชั้นที่ (text สำหรับ duplex เช่น 17-18)
    pricePerSqm: condo?.pricePerSqm?.toString() || '', // ราคาต่อ ตร.ม. (คำนวณอัตโนมัติ)
    
    // SEO
    seoTags: condo?.seoTags || '',
    
    // Project Facilities (จะโหลดจากโครงการ)
    facilities: condo?.facilities || [],
    selectedProjectId: condo?.selectedProjectId || '',
    
    // Timestamps
    createdAt: condo?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [coverImage, setCoverImage] = useState(null)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeCategory, setActiveCategory] = useState('transport')
  const [viewMode, setViewMode] = useState('grid') // 'grid', 'list', or 'compact'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [availableProjects, setAvailableProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  
  // New state for enhanced features
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [lastSaved, setLastSaved] = useState(null)
  const [isDirty, setIsDirty] = useState(false)
  const [validationMode, setValidationMode] = useState('onSubmit') // 'onSubmit', 'onChange', 'onBlur'
  const [showFacilitySearch, setShowFacilitySearch] = useState(false)
  const [facilitySearchTerm, setFacilitySearchTerm] = useState('')

  // Generate auto project code (ตัวเลขอัตโนมัติ)
  useEffect(() => {
    if (!isEditing && !formData.projectCode) {
      const timestamp = Date.now()
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      const code = `${timestamp.toString().slice(-6)}${randomNum}` // รหัสตัวเลข 9 หลัก
      setFormData(prev => ({ ...prev, projectCode: code }))
    }
  }, [isEditing])

  // Auto calculate price per sqm
  useEffect(() => {
    if (formData.price && formData.area) {
      const price = parseFloat(formData.price)
      const area = parseFloat(formData.area)
      if (price > 0 && area > 0) {
        const pricePerSqm = (price / area).toFixed(2)
        setFormData(prev => ({ ...prev, pricePerSqm }))
      }
    }
  }, [formData.price, formData.area])

  // Load available projects for selection
  useEffect(() => {
    const loadProjects = async () => {
      setLoadingProjects(true)
      try {
        const response = await propertyAPI.getProjects()
        if (response.success) {
          setAvailableProjects(response.data || [])
        }
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setLoadingProjects(false)
      }
    }
    
    loadProjects()
  }, [])

  // Load existing images when editing
  useEffect(() => {
    if (isEditing && condo && condo.images && condo.images.length > 0) {
      const coverImageUrl = condo.images[0]
      if (coverImageUrl) {
        setCoverImage({
          id: 'existing-cover',
          url: coverImageUrl,
          preview: coverImageUrl,
          publicId: null,
          uploading: false,
          isExisting: true
        })
      }

      if (condo.images.length > 1) {
        const additionalImages = condo.images.slice(1).map((imageUrl, index) => ({
          id: `existing-${index}`,
          url: imageUrl,
          preview: imageUrl,
          publicId: null,
          uploading: false,
          isExisting: true
        }))
        setImages(additionalImages)
      }
    }
  }, [isEditing, condo])

  const listingTypes = [
    { value: 'sale', label: 'ขาย', icon: DollarSign },
    { value: 'rent', label: 'เช่า', icon: Calendar },
    { value: 'both', label: 'ขาย/เช่า', icon: TrendingUp }
  ]

  // Project Facilities with icons - Updated with all requested facilities
  const projectFacilities = [
    // Transportation & Access
    { id: 'passengerLift', label: 'Passenger Lift', icon: FacilityIcons.PassengerLift, category: 'transport' },
    { id: 'privateLift', label: 'Private Lift', icon: FacilityIcons.PrivateLift, category: 'transport' },
    { id: 'shuttleService', label: 'Shuttle Service', icon: FacilityIcons.Shuttle, category: 'transport' },
    { id: 'parking', label: 'Parking', icon: FacilityIcons.Parking, category: 'transport' },
    { id: 'motorcycleParking', label: 'Motorcycle Parking', icon: FacilityIcons.Motorcycle, category: 'transport' },
    { id: 'evCharger', label: 'EV Charger', icon: FacilityIcons.EvCharger, category: 'transport' },
    
    // Security & Control
    { id: 'accessControl', label: 'Access Control (Fingerprint / Keycard)', icon: FacilityIcons.AccessControl, category: 'security' },
    { id: 'security24h', label: '24-hour Security with CCTV', icon: FacilityIcons.Security, category: 'security' },
    
    // Wellness & Recreation
    { id: 'fitness', label: 'Fitness / Gym', icon: FacilityIcons.Gym, category: 'wellness' },
    { id: 'swimmingPool', label: 'Swimming Pool', icon: FacilityIcons.Pool, category: 'wellness' },
    { id: 'privatePool', label: 'Private Pool', icon: FacilityIcons.PrivatePool, category: 'wellness' },
    { id: 'jacuzzi', label: 'Jacuzzi', icon: FacilityIcons.Jacuzzi, category: 'wellness' },
    { id: 'sauna', label: 'Sauna', icon: FacilityIcons.Sauna, category: 'wellness' },
    { id: 'steamRoom', label: 'Steam Room', icon: FacilityIcons.SteamRoom, category: 'wellness' },
    { id: 'sportArea', label: 'Sport Area', icon: FacilityIcons.SportArea, category: 'wellness' },
    { id: 'golfSimulator', label: 'Golf Simulator', icon: FacilityIcons.GolfSimulator, category: 'wellness' },
    { id: 'stadium', label: 'Stadium', icon: FacilityIcons.Stadium, category: 'wellness' },
    
    // Lifestyle & Entertainment
    { id: 'cinemaRoom', label: 'Cinema Room / Theatre', icon: FacilityIcons.Cinema, category: 'lifestyle' },
    { id: 'kidsPlayground', label: 'Kids Playground', icon: FacilityIcons.Playground, category: 'lifestyle' },
    { id: 'allowPet', label: 'Allow Pet', icon: FacilityIcons.Pet, category: 'lifestyle' },
    
    // Business & Work
    { id: 'meetingRoom', label: 'Meeting Room', icon: FacilityIcons.MeetingRoom, category: 'business' },
    { id: 'coWorkingSpace', label: 'Co-Working Space', icon: FacilityIcons.CoWorking, category: 'business' },
    
    // Food & Dining
    { id: 'restaurant', label: 'Restaurant', icon: FacilityIcons.Restaurant, category: 'dining' },
    { id: 'cafe', label: 'Cafe', icon: FacilityIcons.Cafe, category: 'dining' },
    { id: 'privateDiningRoom', label: 'Private Dining Room / Party Room', icon: FacilityIcons.DiningRoom, category: 'dining' },
    { id: 'coKitchen', label: 'Co-Kitchen', icon: FacilityIcons.CoKitchen, category: 'dining' },
    
    // Common Areas
    { id: 'lobby', label: 'Lobby', icon: FacilityIcons.Lobby, category: 'common' },
    { id: 'loungeArea', label: 'Lounge Area', icon: FacilityIcons.Lounge, category: 'common' },
    { id: 'clubhouse', label: 'Clubhouse', icon: FacilityIcons.Clubhouse, category: 'common' },
    
    // Services & Amenities
    { id: 'convenienceStore', label: 'Convenience Store / Minimart', icon: FacilityIcons.Store, category: 'services' },
    { id: 'library', label: 'Library', icon: FacilityIcons.Library, category: 'services' },
    { id: 'laundry', label: 'Laundry', icon: FacilityIcons.Laundry, category: 'services' },
    
    // Environment
    { id: 'garden', label: 'Garden', icon: FacilityIcons.Garden, category: 'environment' },
    { id: 'wifi', label: 'WIFI', icon: FacilityIcons.Wifi, category: 'environment' }
  ]

  // Group facilities by category
  const groupedFacilities = projectFacilities.reduce((acc, facility) => {
    if (!acc[facility.category]) {
      acc[facility.category] = []
    }
    acc[facility.category].push(facility)
    return acc
  }, {})

  const categoryLabels = {
    transport: 'การขนส่ง & การเข้าถึง',
    security: 'ความปลอดภัย & การควบคุม',
    wellness: 'สุขภาพ & นันทนาการ',
    lifestyle: 'ไลฟ์สไตล์ & ความบันเทิง',
    business: 'ธุรกิจ & การทำงาน',
    dining: 'อาหาร & การรับประทาน',
    common: 'พื้นที่ส่วนกลาง',
    services: 'บริการ & สิ่งอำนวยความสะดวก',
    environment: 'สิ่งแวดล้อม & เทคโนโลยี'
  }

  // Enhanced auto save functionality
  useEffect(() => {
    if (autoSave && isDirty && !isSubmitting) {
      const saveTimer = setTimeout(() => {
        handleAutoSave()
      }, 3000) // Auto save after 3 seconds of inactivity

      return () => clearTimeout(saveTimer)
    }
  }, [formData, isDirty, autoSave, isSubmitting])

  // Validation based on mode
  useEffect(() => {
    if (validationMode === 'onChange' && isDirty) {
      validateForm(false)
    }
  }, [formData, validationMode, isDirty])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }))
    
    setIsDirty(true)
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Real-time validation for specific fields
    if (validationMode === 'onChange') {
      validateField(field, value)
    }
  }

  const validateField = (field, value) => {
    const newErrors = { ...errors }
    
    switch (field) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'กรุณาระบุชื่อโครงการ'
        } else {
          delete newErrors.title
        }
        break
      case 'price':
        if (!value.trim()) {
          newErrors.price = 'กรุณาระบุราคา'
        } else if (isNaN(parseFloat(value))) {
          newErrors.price = 'ราคาต้องเป็นตัวเลข'
        } else {
          delete newErrors.price
        }
        break
      case 'area':
        if (!value.trim()) {
          newErrors.area = 'กรุณาระบุพื้นที่'
        } else if (isNaN(parseFloat(value))) {
          newErrors.area = 'พื้นที่ต้องเป็นตัวเลข'
        } else {
          delete newErrors.area
        }
        break
      case 'contactPhone':
        if (value && !/^[0-9-+\s()]+$/.test(value)) {
          newErrors.contactPhone = 'รูปแบบเบอร์โทรไม่ถูกต้อง'
        } else {
          delete newErrors.contactPhone
        }
        break
      case 'contactEmail':
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          newErrors.contactEmail = 'รูปแบบอีเมลไม่ถูกต้อง'
        } else {
          delete newErrors.contactEmail
        }
        break
      default:
        break
    }
    
    setErrors(newErrors)
  }

  const handleAutoSave = async () => {
    if (!isEditing || !isDirty) return
    
    try {
      // Mock auto save - would normally call API
      console.log('Auto saving...', formData)
      setLastSaved(new Date())
      setIsDirty(false)
    } catch (error) {
      console.error('Auto save failed:', error)
    }
  }

  const handleFormReset = () => {
    if (window.confirm('คุณต้องการรีเซ็ตฟอร์มใช่หรือไม่? ข้อมูลที่แก้ไขจะหายไป')) {
      setFormData({
        title: condo?.title || '',
        projectCode: condo?.projectCode || '',
        status: condo?.status || 'available',
        listingType: condo?.listingType || 'sale',
        price: condo?.price?.toString() || '',
        rentPrice: condo?.rentPrice?.toString() || '',
        location: condo?.location || '',
        nearbyTransport: condo?.nearbyTransport || '',
        description: condo?.description || '',
        area: condo?.area?.toString() || '',
        bedrooms: condo?.bedrooms?.toString() || '',
        bathrooms: condo?.bathrooms?.toString() || '',
        floor: condo?.floor || '',
        pricePerSqm: condo?.pricePerSqm?.toString() || '',
        furnishing: condo?.furnishing || 'unfurnished',
        balcony: condo?.balcony || false,
        view: condo?.view || '',
        orientation: condo?.orientation || '',
        maintenanceFee: condo?.maintenanceFee?.toString() || '',
        transferFee: condo?.transferFee || 'half',
        contactName: condo?.contactName || '',
        contactPhone: condo?.contactPhone || '',
        contactEmail: condo?.contactEmail || '',
        agentName: condo?.agentName || '',
        agentPhone: condo?.agentPhone || '',
        petFriendly: condo?.petFriendly || false,
        minimumRentPeriod: condo?.minimumRentPeriod || '1',
        deposit: condo?.deposit?.toString() || '',
        advancePayment: condo?.advancePayment?.toString() || '',
        seoTags: condo?.seoTags || '',
        metaDescription: condo?.metaDescription || '',
        facilities: condo?.facilities || [],
        availableForViewing: condo?.availableForViewing || true,
        viewingNote: condo?.viewingNote || '',
        featured: condo?.featured || false,
        urgent: condo?.urgent || false,
        negotiable: condo?.negotiable || false,
        createdAt: condo?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      setErrors({})
      setIsDirty(false)
    }
  }

  const handleDuplicateForm = () => {
    const duplicatedData = {
      ...formData,
      title: `${formData.title} (Copy)`,
      projectCode: `CONDO${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setFormData(duplicatedData)
    setIsDirty(true)
  }

  const handleFacilityToggle = (facilityId) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter(id => id !== facilityId)
        : [...prev.facilities, facilityId],
      updatedAt: new Date().toISOString()
    }))
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
    setFormData(prev => ({
      ...prev,
      projectCode: project.projectCode || project.code || '',
      title: project.title || prev.title,
      location: project.location || prev.location,
      facilities: project.facilities || [],
      // Auto-load project details
      description: project.description || prev.description,
      seoTags: project.seoTags || prev.seoTags
    }))
  }

  const handleProjectSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      return availableProjects
    }
    return availableProjects.filter(project => 
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const validateForm = (showAlert = true) => {
    const newErrors = {}

    // Required fields
    if (!formData.title.trim()) newErrors.title = 'กรุณาระบุชื่อโครงการ'
    if (!formData.status) newErrors.status = 'กรุณาเลือกสถานะ'
    if (!formData.price.trim()) newErrors.price = 'กรุณาระบุราคา'
    if (!formData.area.trim()) newErrors.area = 'กรุณาระบุพื้นที่'
    if (!formData.bedrooms.trim()) newErrors.bedrooms = 'กรุณาระบุจำนวนห้องนอน'
    if (!formData.bathrooms.trim()) newErrors.bathrooms = 'กรุณาระบุจำนวนห้องน้ำ'
    if (!formData.floor.trim()) newErrors.floor = 'กรุณาระบุชั้นที่'
    if (!formData.location.trim()) newErrors.location = 'กรุณาระบุสถานที่'

    // Validate price is number
    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'ราคาต้องเป็นตัวเลข'
    } else if (formData.price && parseFloat(formData.price) <= 0) {
      newErrors.price = 'ราคาต้องมากกว่า 0'
    }

    // Validate rent price if provided
    if (formData.rentPrice && isNaN(parseFloat(formData.rentPrice))) {
      newErrors.rentPrice = 'ราคาเช่าต้องเป็นตัวเลข'
    } else if (formData.rentPrice && parseFloat(formData.rentPrice) <= 0) {
      newErrors.rentPrice = 'ราคาเช่าต้องมากกว่า 0'
    }

    // Validate area is number
    if (formData.area && isNaN(parseFloat(formData.area))) {
      newErrors.area = 'พื้นที่ต้องเป็นตัวเลข'
    } else if (formData.area && parseFloat(formData.area) <= 0) {
      newErrors.area = 'พื้นที่ต้องมากกว่า 0'
    }

    // Validate bedrooms and bathrooms
    if (formData.bedrooms && (isNaN(parseInt(formData.bedrooms)) || parseInt(formData.bedrooms) < 0)) {
      newErrors.bedrooms = 'จำนวนห้องนอนต้องเป็นตัวเลขที่ไม่เป็นลบ'
    }
    
    if (formData.bathrooms && (isNaN(parseInt(formData.bathrooms)) || parseInt(formData.bathrooms) < 0)) {
      newErrors.bathrooms = 'จำนวนห้องน้ำต้องเป็นตัวเลขที่ไม่เป็นลบ'
    }

    // Validate contact information format
    if (formData.contactPhone && !/^[0-9-+\s()]+$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'รูปแบบเบอร์โทรไม่ถูกต้อง'
    }
    
    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'รูปแบบอีเมลไม่ถูกต้อง'
    }

    if (formData.agentPhone && !/^[0-9-+\s()]+$/.test(formData.agentPhone)) {
      newErrors.agentPhone = 'รูปแบบเบอร์โทรเอเจนต์ไม่ถูกต้อง'
    }

    // Validate maintenance fee
    if (formData.maintenanceFee && isNaN(parseFloat(formData.maintenanceFee))) {
      newErrors.maintenanceFee = 'ค่าส่วนกลางต้องเป็นตัวเลข'
    } else if (formData.maintenanceFee && parseFloat(formData.maintenanceFee) < 0) {
      newErrors.maintenanceFee = 'ค่าส่วนกลางต้องไม่เป็นลบ'
    }

    // Validate deposit and advance payment
    if (formData.deposit && isNaN(parseFloat(formData.deposit))) {
      newErrors.deposit = 'เงินมัดจำต้องเป็นตัวเลข'
    } else if (formData.deposit && parseFloat(formData.deposit) < 0) {
      newErrors.deposit = 'เงินมัดจำต้องไม่เป็นลบ'
    }

    if (formData.advancePayment && isNaN(parseFloat(formData.advancePayment))) {
      newErrors.advancePayment = 'เงินล่วงหน้าต้องเป็นตัวเลข'
    } else if (formData.advancePayment && parseFloat(formData.advancePayment) < 0) {
      newErrors.advancePayment = 'เงินล่วงหน้าต้องไม่เป็นลบ'
    }

    // Validate minimum rent period
    if (formData.minimumRentPeriod && (isNaN(parseInt(formData.minimumRentPeriod)) || parseInt(formData.minimumRentPeriod) < 1)) {
      newErrors.minimumRentPeriod = 'ระยะเวลาเช่าขั้นต่ำต้องเป็นตัวเลขที่มากกว่า 0'
    }

    setErrors(newErrors)
    
    if (showAlert && Object.keys(newErrors).length > 0) {
      alert('กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน')
    }
    
    return Object.keys(newErrors).length === 0
  }

  const getFilteredFacilities = () => {
    if (!facilitySearchTerm) {
      return groupedFacilities[activeCategory] || []
    }
    
    const allFacilities = projectFacilities.filter(facility => 
      facility.label.toLowerCase().includes(facilitySearchTerm.toLowerCase()) ||
      facility.category === activeCategory
    )
    
    return allFacilities.filter(facility => facility.category === activeCategory)
  }

  const calculateEstimatedReturn = () => {
    const price = parseFloat(formData.price) || 0
    const rentPrice = parseFloat(formData.rentPrice) || 0
    
    if (price > 0 && rentPrice > 0) {
      const annualRent = rentPrice * 12
      const returnRate = ((annualRent / price) * 100).toFixed(2)
      return returnRate
    }
    return null
  }

  const generateMetaDescription = () => {
    const parts = []
    if (formData.title) parts.push(formData.title)
    if (formData.bedrooms) parts.push(`${formData.bedrooms} ห้องนอน`)
    if (formData.bathrooms) parts.push(`${formData.bathrooms} ห้องน้ำ`)
    if (formData.area) parts.push(`${formData.area} ตร.ม.`)
    if (formData.location) parts.push(formData.location)
    if (formData.price) parts.push(`฿${parseFloat(formData.price).toLocaleString()}`)
    
    return parts.join(' • ')
  }

  const handleImageUpload = async (file, isCover = false) => {
    try {
      setUploading(true)
      
      const imageId = Date.now().toString()
      const imageObj = {
        id: imageId,
        file,
        preview: URL.createObjectURL(file),
        uploading: true,
        publicId: null,
        url: null
      }

      if (isCover) {
        setCoverImage(imageObj)
      } else {
        setImages(prev => [...prev, imageObj])
      }

      const result = await uploadAPI.uploadImage(file)
      
      if (result.success) {
        const uploadedImage = {
          ...imageObj,
          uploading: false,
          publicId: result.publicId,
          url: result.url
        }

        if (isCover) {
          setCoverImage(uploadedImage)
        } else {
          setImages(prev => prev.map(img => 
            img.id === imageId ? uploadedImage : img
          ))
        }
      } else {
        throw new Error(result.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ' + error.message)
      
      // Remove failed upload
      if (isCover) {
        setCoverImage(null)
      } else {
        setImages(prev => prev.filter(img => img.id !== imageId))
      }
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (imageId, isCover = false) => {
    if (isCover) {
      setCoverImage(null)
    } else {
      setImages(prev => prev.filter(img => img.id !== imageId))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare image URLs
      const imageUrls = []
      
      if (coverImage && (coverImage.url || coverImage.isExisting)) {
        imageUrls.push(coverImage.url)
      }
      
      images.forEach(img => {
        if (img.url || img.isExisting) {
          imageUrls.push(img.url)
        }
      })

      const condoData = {
        ...formData,
        price: parseFloat(formData.price),
        rentPrice: formData.rentPrice ? parseFloat(formData.rentPrice) : 0,
        area: parseFloat(formData.area),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        pricePerSqm: parseFloat(formData.pricePerSqm),
        images: imageUrls,
        type: 'condo' // Set type as condo
      }

      let result
      if (isEditing) {
        result = await propertyAPI.update(condo.id, condoData)
      } else {
        result = await propertyAPI.create(condoData)
      }

      if (result.success) {
        alert(isEditing ? 'แก้ไขคอนโดสำเร็จ!' : 'เพิ่มคอนโดสำเร็จ!')
        onSave(result.data)
      } else {
        throw new Error(result.message || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('เกิดข้อผิดพลาด: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Enhanced Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center space-x-2 hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>กลับ</span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-prompt">
                  {isEditing ? 'แก้ไขคอนโด' : 'เพิ่มคอนโดใหม่'}
                </h1>
                <p className="text-gray-600 mt-1 font-prompt text-sm lg:text-base">
                  {isEditing ? 'แก้ไขข้อมูลคอนโดมิเนียม' : 'เพิ่มข้อมูลคอนโดมิเนียมใหม่'}
                </p>
                {formData.projectCode && (
                  <p className="text-blue-600 text-sm font-medium">
                    รหัส: {formData.projectCode}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Status Indicators */}
            <div className="flex items-center space-x-3 text-sm">
              {isDirty && (
                <div className="flex items-center space-x-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-prompt">มีการแก้ไข</span>
                </div>
              )}
              
              {lastSaved && (
                <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-prompt">
                    บันทึกล่าสุด: {lastSaved.toLocaleTimeString('th-TH', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              )}
              
              {Object.keys(errors).length > 0 && (
                <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-prompt">{Object.keys(errors).length} ข้อผิดพลาด</span>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Settings Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">ตั้งค่า</span>
                </Button>
              </div>
              
              {/* Auto Save Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoSave(!autoSave)}
                className={`flex items-center space-x-2 ${
                  autoSave ? 'bg-green-50 text-green-700 border-green-200' : ''
                }`}
              >
                <RefreshCw className={`h-4 w-4 ${autoSave ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {autoSave ? 'Auto Save เปิด' : 'Auto Save ปิด'}
                </span>
              </Button>
              
              {/* Preview Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="hidden sm:inline">
                  {showPreview ? 'ซ่อนตัวอย่าง' : 'แสดงตัวอย่าง'}
                </span>
              </Button>
              
              {/* Utility Actions */}
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDuplicateForm}
                  className="flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">คัดลอก</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleFormReset}
                className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">รีเซ็ต</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Advanced Settings Panel */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <h3 className="text-sm font-medium text-gray-700 mb-3 font-prompt">ตั้งค่าการทำงาน</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1 font-prompt">
                  โหมดการตรวจสอบ
                </label>
                <select
                  value={validationMode}
                  onChange={(e) => setValidationMode(e.target.value)}
                  className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="onSubmit">ตรวจสอบเมื่อส่งฟอร์ม</option>
                  <option value="onChange">ตรวจสอบทันทีที่แก้ไข</option>
                  <option value="onBlur">ตรวจสอบเมื่อออกจากช่อง</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoSaveSettings"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autoSaveSettings" className="text-xs font-medium text-gray-600 font-prompt">
                  บันทึกอัตโนมัติ
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="facilitySearch"
                  checked={showFacilitySearch}
                  onChange={(e) => setShowFacilitySearch(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="facilitySearch" className="text-xs font-medium text-gray-600 font-prompt">
                  ค้นหาสิ่งอำนวยความสะดวก
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Project Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Building className="h-6 w-6 mr-3 text-blue-600" />
            เลือกโครงการคอนโด
          </h2>
          
          <div className="space-y-4">
            {/* Search Projects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ค้นหาโครงการที่มีอยู่ (เพื่อโหลด Facilities อัตโนมัติ)
              </label>
              <div className="relative">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="พิมพ์ชื่อโครงการเพื่อโหลด facilities..."
                  className="pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Project List */}
            {searchTerm && (
              <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                {loadingProjects ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2">กำลังโหลดโครงการ...</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {handleProjectSearch(searchTerm).map(project => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectSelect(project)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 font-prompt">
                              {project.title}
                            </h4>
                            <p className="text-sm text-gray-600 font-prompt">
                              รหัส: {project.projectCode || project.code} • {project.location}
                            </p>
                            {project.facilities && project.facilities.length > 0 && (
                              <p className="text-xs text-blue-600 mt-1">
                                มีสิ่งอำนวยความสะดวก {project.facilities.length} รายการ
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-green-600 font-prompt">
                              คลิกเพื่อโหลด Facilities
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected Project Info */}
            {selectedProject && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-800 font-prompt">
                      โหลด Facilities จาก: {selectedProject.title}
                    </h4>
                    <p className="text-sm text-green-600 font-prompt">
                      Facilities จะถูกโหลดอัตโนมัติ ({formData.facilities.length} รายการ)
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProject(null)
                      setFormData(prev => ({ ...prev, facilities: [] }))
                    }}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    ยกเลิก
                  </Button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 font-prompt text-center">
                หรือกรอกข้อมูลห้องโดยตรง
              </p>
            </div>
          </div>
        </Card>

        {/* ข้อมูลพื้นฐาน */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Building className="h-6 w-6 mr-3 text-blue-600" />
            ข้อมูลพื้นฐาน
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ชื่อโครงการ */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ชื่อโครงการ *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="เช่น คอนโด ลุมพินี วิลล์ รามคำแหง"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* รหัสโครงการ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                รหัสโครงการ (ตัวเลขอัตโนมัติ)
              </label>
              <Input
                value={formData.projectCode}
                readOnly
                className="bg-gray-100"
                placeholder="สร้างอัตโนมัติ"
              />
            </div>

            {/* สร้างเมื่อ - แก้ไขล่าสุด */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                สร้างเมื่อ - แก้ไขล่าสุด
              </label>
              <Input
                value={`${new Date(formData.createdAt).toLocaleDateString('th-TH')} - ${new Date(formData.updatedAt).toLocaleDateString('th-TH')}`}
                readOnly
                className="bg-gray-100"
              />
            </div>

            {/* สถานะ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                สถานะ * (เลือกประเภท เช่า หรือ ขาย)
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="sale">ขาย</option>
                <option value="rent">เช่า</option>
                <option value="both">ขาย/เช่า</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
            </div>

            {/* ประเภท */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ประเภท
              </label>
              <select
                value={formData.listingType}
                onChange={(e) => handleInputChange('listingType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {listingTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ราคา (บาท) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคา (บาท) * {formData.status !== 'rent' && '(กรณีขาย)'}
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="เช่น 3500000"
                  className={errors.price ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* ราคาเช่า */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคาเช่า (บาท/เดือน)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.rentPrice}
                  onChange={(e) => handleInputChange('rentPrice', e.target.value)}
                  placeholder="เช่น 25000"
                  className={errors.rentPrice ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.rentPrice && <p className="text-red-500 text-sm mt-1">{errors.rentPrice}</p>}
            </div>
          </div>
        </Card>

        {/* โลเคชั่น */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <MapPin className="h-6 w-6 mr-3 text-blue-600" />
            โลเคชั่น
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* สถานที่ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                โลเคชั่น : สถานที่ *
              </label>
              <div className="relative">
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="เช่น รามคำแหง, กรุงเทพฯ"
                  className={errors.location ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Google Map */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                โลเคชั่น : Google Map URL
              </label>
              <div className="relative">
                <Input
                  type="url"
                  value={formData.googleMapUrl}
                  onChange={(e) => handleInputChange('googleMapUrl', e.target.value)}
                  placeholder="เช่น https://maps.google.com/..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <MapIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">ลิงก์ Google Maps สำหรับแสดงตำแหน่งที่ตั้ง</p>
            </div>

            {/* ขนส่งใกล้เคียง */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                โลเคชั่น BTS MRT APL SRT :
              </label>
              <Input
                value={formData.nearbyTransport}
                onChange={(e) => handleInputChange('nearbyTransport', e.target.value)}
                placeholder="เช่น BTS รามคำแหง 500 ม., MRT ห้วยขวาง 1 กม."
              />
              <p className="text-sm text-gray-500 mt-1">ระบุระยะทางและชื่อสถานีขนส่งสาธารณะใกล้เคียง</p>
            </div>
          </div>
        </Card>

        {/* รายละเอียด */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <FileText className="h-6 w-6 mr-3 text-blue-600" />
            รายละเอียด
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
              รายละเอียด
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="อธิบายรายละเอียดของคอนโด..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </Card>

        {/* ข้อมูลอสังหาริมทรัพย์ */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Building className="h-6 w-6 mr-3 text-blue-600" />
            ข้อมูลอสังหาริมทรัพย์
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* พื้นที่ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                พื้นที่ (ตารางเมตร) *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="เช่น 65.5"
                  className={errors.area ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ตร.ม.</span>
                </div>
              </div>
              {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
            </div>

            {/* ห้องนอน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ห้องนอน *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  placeholder="เช่น 2"
                  className={errors.bedrooms ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Bed className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
            </div>

            {/* ห้องน้ำ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ห้องน้ำ *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  placeholder="เช่น 2"
                  className={errors.bathrooms ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Bath className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
            </div>

            {/* จำนวนชั้นคอนโด */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                จำนวนชั้นคอนโดต้องเป็น ชั้นที่ *
              </label>
              <div className="relative">
                <Input
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  placeholder="เช่น 15 หรือ 17-18 (สำหรับ duplex)"
                  className={errors.floor ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Building className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">สำหรับห้อง duplex ให้ใส่เป็น 17-18 (ชั้นเชื่อม)</p>
              {errors.floor && <p className="text-red-500 text-sm mt-1">{errors.floor}</p>}
            </div>

            {/* ราคาต่อ per sq.m. */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคาต่อ per sq.m. (ฟังก์ชันคำนวณอัตโนมัติ)
              </label>
              <div className="relative">
                <Input
                  value={formData.pricePerSqm ? `฿${parseFloat(formData.pricePerSqm).toLocaleString('th-TH', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })} /ตร.ม.` : ''}
                  readOnly
                  className="bg-green-50 border-green-200 text-green-700 font-semibold"
                  placeholder="จะคำนวณอัตโนมัติเมื่อกรอกราคาและพื้นที่"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Calculator className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-1">ตัวอย่างการคำนวณ:</h4>
                <p className="text-sm text-blue-700">
                  48,000 บาท ÷ 47.48 ตารางเมตร = 1,010.95 บาท/ตร.ม.
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  การคำนวณ: ราคา ÷ พื้นที่ = ราคาต่อตารางเมตร
                </p>
              </div>
            </div>
          </div>
        </Card>



        {/* ข้อมูลการเช่า - ลบออก */}
        {false && (
          <Card className="p-6 border-green-200 bg-green-50">
            <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
              <Calendar className="h-6 w-6 mr-3 text-green-600" />
              ข้อมูลการเช่า
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ระยะเวลาเช่าขั้นต่ำ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  ระยะเวลาเช่าขั้นต่ำ (เดือน)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.minimumRentPeriod}
                  onChange={(e) => handleInputChange('minimumRentPeriod', e.target.value)}
                  placeholder="เช่น 12"
                  className={errors.minimumRentPeriod ? 'border-red-500' : ''}
                />
                {errors.minimumRentPeriod && <p className="text-red-500 text-sm mt-1">{errors.minimumRentPeriod}</p>}
              </div>

              {/* เงินมัดจำ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  เงินมัดจำ (บาท)
                </label>
                <Input
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => handleInputChange('deposit', e.target.value)}
                  placeholder="เช่น 50000"
                  className={errors.deposit ? 'border-red-500' : ''}
                />
                {errors.deposit && <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>}
              </div>

              {/* เงินล่วงหน้า */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  เงินล่วงหน้า (บาท)
                </label>
                <Input
                  type="number"
                  value={formData.advancePayment}
                  onChange={(e) => handleInputChange('advancePayment', e.target.value)}
                  placeholder="เช่น 25000"
                  className={errors.advancePayment ? 'border-red-500' : ''}
                />
                {errors.advancePayment && <p className="text-red-500 text-sm mt-1">{errors.advancePayment}</p>}
              </div>

              {/* อนุญาตสัตว์เลี้ยง */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="petFriendly"
                  checked={formData.petFriendly}
                  onChange={(e) => handleInputChange('petFriendly', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="petFriendly" className="text-sm font-medium text-gray-700 font-prompt">
                  อนุญาตสัตว์เลี้ยง
                </label>
              </div>
            </div>
          </Card>
        )}

        {/* ข้อมูลติดต่อ - ลบออก */}
        {false && <Card className="p-6">
          <div>Hidden content</div>
        </Card>}
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Phone className="h-6 w-6 mr-3 text-blue-600" />
            ข้อมูลติดต่อ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ผู้ติดต่อหลัก */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 font-prompt">ผู้ติดต่อหลัก</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  ชื่อผู้ติดต่อ
                </label>
                <Input
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  placeholder="เช่น คุณสมชาย ใจดี"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  เบอร์โทรศัพท์
                </label>
                <div className="relative">
                  <Input
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="เช่น 08-1234-5678"
                    className={errors.contactPhone ? 'border-red-500' : ''}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  อีเมล
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="เช่น contact@example.com"
                    className={errors.contactEmail ? 'border-red-500' : ''}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
              </div>
            </div>

            {/* ตัวแทนขาย */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 font-prompt">ตัวแทนขาย</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  ชื่อเอเจนต์
                </label>
                <Input
                  value={formData.agentName}
                  onChange={(e) => handleInputChange('agentName', e.target.value)}
                  placeholder="เช่น คุณสมหญิง ขายดี"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  เบอร์โทรเอเจนต์
                </label>
                <div className="relative">
                  <Input
                    value={formData.agentPhone}
                    onChange={(e) => handleInputChange('agentPhone', e.target.value)}
                    placeholder="เช่น 08-9876-5432"
                    className={errors.agentPhone ? 'border-red-500' : ''}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                {errors.agentPhone && <p className="text-red-500 text-sm mt-1">{errors.agentPhone}</p>}
              </div>
            </div>
          </div>
        </Card>

        {/* การเข้าชม - ลบออก */}
        {false && <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Calendar className="h-6 w-6 mr-3 text-blue-600" />
            การเข้าชม
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="availableForViewing"
                checked={formData.availableForViewing}
                onChange={(e) => handleInputChange('availableForViewing', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="availableForViewing" className="text-sm font-medium text-gray-700 font-prompt">
                เปิดให้เข้าชม
              </label>
            </div>

            {formData.availableForViewing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  หมายเหตุการเข้าชม
                </label>
                <textarea
                  value={formData.viewingNote}
                  onChange={(e) => handleInputChange('viewingNote', e.target.value)}
                  placeholder="เช่น โทรนัดล่วงหน้า 1 วัน, เข้าชมได้วันจันทร์-เสาร์ 9:00-17:00"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </Card>

        {/* สถานะพิเศษ - ลบออก */}
        {false && <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Star className="h-6 w-6 mr-3 text-blue-600" />
            สถานะพิเศษ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 font-prompt">
                แนะนำ (Featured)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="urgent"
                checked={formData.urgent}
                onChange={(e) => handleInputChange('urgent', e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="urgent" className="text-sm font-medium text-gray-700 font-prompt">
                ขายด่วน (Urgent)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="negotiable"
                checked={formData.negotiable}
                onChange={(e) => handleInputChange('negotiable', e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="negotiable" className="text-sm font-medium text-gray-700 font-prompt">
                ราคาต่อรองได้
              </label>
            </div>
          </div>
        </Card>

        {/* SEO Tag */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Search className="h-6 w-6 mr-3 text-blue-600" />
            SEO Tag
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
              SEO Tag
            </label>
            <Input
              value={formData.seoTags}
              onChange={(e) => handleInputChange('seoTags', e.target.value)}
              placeholder="เช่น คอนโด, รามคำแหง, ลุมพินี, ขาย, เช่า"
            />
            <p className="text-sm text-gray-500 mt-1">ช่องให้กรอก tag สำหรับ SEO (แยกแท็กด้วยเครื่องหมายจุลภาค)</p>
          </div>
        </Card>

        {/* Project Facilities */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Star className="h-6 w-6 mr-3 text-blue-600" />
            Project Facilities
          </h2>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <span>💡</span>
              <span className="font-prompt">
                <strong>คำแนะนำ:</strong> ช่องติ๊ก โชว์พร้อม icon - เอาไปอยู่ตรงช่อง add project
                เมื่อเราใส่ข้อมูลโปรเจ็คคอนโด ตอนเราลงห้องแค่แท็กชื่อคอนโด facilities จะมาโดยอัตโนมัติ
              </span>
            </div>
          </div>

          {/* Selected Project Facilities Display */}
          {selectedProject && formData.facilities.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-green-800 font-prompt">
                    Facilities จากโครงการ: {selectedProject.title}
                  </h3>
                  <p className="text-sm text-green-600 font-prompt">
                    โหลดอัตโนมัติ ({formData.facilities.length} รายการ)
                  </p>
                </div>
              </div>
              
              {/* Selected Facilities Display */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {formData.facilities.map(facilityId => {
                  const facility = projectFacilities.find(f => f.id === facilityId)
                  if (!facility) return null
                  const IconComponent = facility.icon
                  return (
                    <div
                      key={facilityId}
                      className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      <div className="p-1 rounded-full bg-green-200">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="font-prompt text-xs">{facility.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Manual Facility Selection (Fallback) */}
          {!selectedProject && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-yellow-700 mb-4">
                <span>⚠️</span>
                <span className="font-prompt">
                  <strong>หมายเหตุ:</strong> กรุณาเลือกโครงการด้านบนเพื่อโหลด Facilities อัตโนมัติ
                  หรือสามารถเลือก Facilities ด้วยตนเองได้ด้านล่าง
                </span>
              </div>
              
              {/* แสดง facilities ที่เลือกแล้ว */}
              {formData.facilities.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {formData.facilities.map(facilityId => {
                    const facility = projectFacilities.find(f => f.id === facilityId)
                    if (!facility) return null
                    const IconComponent = facility.icon
                    return (
                      <div
                        key={facilityId}
                        className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium"
                        onClick={() => handleFacilityToggle(facilityId)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="p-1 rounded-full bg-blue-200">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span className="font-prompt text-xs">{facility.label}</span>
                        <X className="h-3 w-3 text-blue-500 hover:text-blue-700 cursor-pointer" />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </Card>



        {/* รูปภาพ */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Camera className="h-6 w-6 mr-3 text-blue-600" />
            รูปภาพ
          </h2>
          
          {/* รูปภาพหน้าปก */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 font-prompt flex items-center">
              <Camera className="h-5 w-5 mr-2 text-blue-500" />
              รูปภาพหน้าปก
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
              {coverImage ? (
                <div className="relative">
                  <img
                    src={coverImage.preview}
                    alt="Cover"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(coverImage.id, true)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  {coverImage.uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <div className="text-white font-prompt">กำลังอัปโหลด...</div>
                    </div>
                  )}
                </div>
              ) : (
                <label className="cursor-pointer block text-center hover:bg-gray-50 rounded-lg p-4 transition-colors">
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <span className="text-gray-600 font-prompt font-medium">คลิกเพื่อเลือกรูปภาพหน้าปก</span>
                  <p className="text-sm text-gray-500 mt-2">รองรับไฟล์ JPG, PNG, WebP</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], true)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* รูปภาพเพิ่มเติม */}
          <div>
            <h3 className="text-lg font-medium mb-4 font-prompt flex items-center justify-between">
              <div className="flex items-center">
                <Image className="h-5 w-5 mr-2 text-blue-500" />
                รูปภาพเพิ่มเติม
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                อัปโหลดได้ สูงสุด 100 รูป
              </span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.preview}
                    alt={`Additional ${image.id}`}
                    className="w-full h-32 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {image.uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <div className="text-white text-xs font-prompt">อัปโหลด...</div>
                    </div>
                  )}
                  {/* Image Number */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    {images.findIndex(img => img.id === image.id) + 1}
                  </div>
                </div>
              ))}
              
              {images.length < 100 && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                  <Plus className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                  <span className="text-sm text-gray-600 group-hover:text-blue-600 font-prompt transition-colors">เพิ่มรูป</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach(file => {
                          if (images.length < 100) {
                            handleImageUpload(file, false)
                          }
                        })
                      }
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            {/* Upload Progress */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-prompt">
                  อัปโหลดแล้ว {images.length}/100 รูป
                </span>
                {uploading && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="font-prompt">กำลังอัปโหลด...</span>
                  </div>
                )}
              </div>
              
              {images.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('คุณต้องการลบรูปภาพทั้งหมดใช่หรือไม่?')) {
                        setImages([])
                      }
                    }}
                    className="text-red-600 hover:text-red-700 font-prompt text-sm transition-colors"
                  >
                    ลบทั้งหมด
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-prompt">
                <span className="font-medium">💡 คำแนะนำ:</span> รูปภาพหน้าปกจะแสดงเป็นรูปหลักในรายการ 
                รูปภาพเพิ่มเติมจะแสดงในแกลลอรี่ของประกาศ สามารถอัปโหลดได้สูงสุด 100 รูป
              </p>
            </div>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || uploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
                          <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>กำลังบันทึก...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Save className="h-5 w-5" />
              <span>{isEditing ? 'บันทึกการแก้ไข' : 'บันทึกคอนโด'}</span>
            </div>
            )}
          </Button>
        </div>
      </form>

      {/* Preview Card */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed top-4 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[80vh] overflow-y-auto"
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 font-prompt">ตัวอย่างบัตรคอนโด</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(false)}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4">
            {/* Preview Card Content */}
            <div className="space-y-3">
              {/* Cover Image */}
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                {coverImage ? (
                  <img
                    src={coverImage.preview}
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Camera className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {formData.featured && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    แนะนำ
                  </span>
                )}
                {formData.urgent && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    ขายด่วน
                  </span>
                )}
                {formData.negotiable && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    ต่อรองได้
                  </span>
                )}
              </div>

              {/* Title */}
              <h4 className="font-semibold text-gray-900 font-prompt">
                {formData.title || 'ชื่อคอนโด...'}
              </h4>

              {/* Location */}
              {formData.location && (
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {formData.location}
                </div>
              )}

              {/* Property Details */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Bed className="h-4 w-4 mr-1" />
                  {formData.bedrooms || '0'} ห้องนอน
                </div>
                <div className="flex items-center text-gray-600">
                  <Bath className="h-4 w-4 mr-1" />
                  {formData.bathrooms || '0'} ห้องน้ำ
                </div>
                <div className="flex items-center text-gray-600">
                  <Ruler className="h-4 w-4 mr-1" />
                  {formData.area || '0'} ตร.ม.
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1">
                {formData.price && (
                  <div className="text-xl font-bold text-blue-600">
                    ฿{parseFloat(formData.price).toLocaleString()}
                    {formData.listingType === 'sale' ? '' : formData.listingType === 'rent' ? '/เดือน' : ''}
                  </div>
                )}
                {formData.rentPrice && formData.listingType !== 'sale' && (
                  <div className="text-sm text-gray-600">
                    เช่า: ฿{parseFloat(formData.rentPrice).toLocaleString()}/เดือน
                  </div>
                )}
                {formData.pricePerSqm && (
                  <div className="text-sm text-gray-500">
                    ฿{parseFloat(formData.pricePerSqm).toLocaleString()}/ตร.ม.
                  </div>
                )}
              </div>

              {/* Key Features */}
              {formData.facilities.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2 font-prompt">สิ่งอำนวยความสะดวก</h5>
                  <div className="grid grid-cols-4 gap-1">
                    {formData.facilities.slice(0, 8).map(facilityId => {
                      const facility = projectFacilities.find(f => f.id === facilityId)
                      if (!facility) return null
                      const IconComponent = facility.icon
                      return (
                        <div
                          key={facilityId}
                          className="flex flex-col items-center p-1 text-center"
                          title={facility.label}
                        >
                          <div className="p-1 bg-gray-100 rounded-full">
                            <IconComponent className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className="text-xs text-gray-500 mt-1 truncate w-full">
                            {facility.label.split(' ')[0]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  {formData.facilities.length > 8 && (
                    <div className="text-xs text-gray-500 mt-1 text-center">
                      และอีก {formData.facilities.length - 8} รายการ
                    </div>
                  )}
                </div>
              )}

              {/* Contact */}
              {(formData.contactPhone || formData.agentPhone) && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">ติดต่อ:</span>
                    <span className="text-blue-600 font-medium">
                      {formData.contactPhone || formData.agentPhone}
                    </span>
                  </div>
                </div>
              )}

              {/* Validation Status */}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">สถานะ:</span>
                  {Object.keys(errors).length === 0 ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      พร้อมใช้งาน
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {Object.keys(errors).length} ข้อผิดพลาด
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default CondoForm