import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import {
  ArrowLeft,
  Building,
  MapPin,
  FileText,
  Search,
  Star,
  Camera,
  Upload,
  X,
  DollarSign,
  Calendar,
  Calculator,
  Bath,
  Bed
} from 'lucide-react'
import { houseAPI, uploadAPI } from '../../lib/api'
import { projectApi } from '../../lib/projectApi'
// Additional icon packs for amenities
import { 
  FaTv, FaWineBottle, FaCouch, FaUtensils, FaSnowflake, FaBath, FaLock, FaWifi, FaCar, FaSwimmingPool, FaSeedling, FaTshirt,
  FaArrowUp, FaMotorcycle, FaShuttleVan, FaBolt, FaVideo, FaDumbbell, FaFutbol, FaTrophy, FaChild, FaFilm, FaPaw, FaUsers,
  FaLaptop, FaHamburger, FaCoffee, FaDoorOpen, FaHome, FaStore, FaBook, FaBuilding
} from 'react-icons/fa'
import { MdKitchen, MdMicrowave, MdLocalLaundryService, MdHotTub, MdBalcony, MdCheckroom, MdElevator } from 'react-icons/md'
import { RiHomeWifiLine, RiFilterLine } from 'react-icons/ri'
import { PiCookingPot, PiThermometerHot, PiOven } from 'react-icons/pi'
import { TbAirConditioning } from 'react-icons/tb'
import { LuFan } from 'react-icons/lu'

const HouseForm = ({ initialData = null, onBack, onSave, isEditing = false }) => {
  const [formData, setFormData] = useState({
    // ข้อมูลพื้นฐาน
    title: initialData?.title || '', // ชื่อประกาศ/โครงการ
    projectCode: initialData?.projectCode || '', // รหัสโครงการ (อัตโนมัติ)
    status: initialData?.status || 'sale', // สถานะ: ขาย/เช่า
    price: initialData?.price?.toString() || '', // ราคา (บาท)
    rentPrice: initialData?.rentPrice?.toString() || '', // ราคาเช่า (บาท/เดือน)
    
    // โลเคชั่น
    location: initialData?.location || '', // สถานที่
    googleMapUrl: initialData?.googleMapUrl || '', // Google Map URL
    nearbyTransport: initialData?.nearbyTransport || '', // BTS/MRT/APL/SRT
    
    // ประเภททรัพย์
    propertyType: initialData?.propertyType || 'house', // house | townhouse | apartment
    
    // รายละเอียด
    description: initialData?.description || '',
    
    // ข้อมูลอสังหาริมทรัพย์
    area: initialData?.area?.toString() || '', // พื้นที่ (ตารางเมตร)
    bedrooms: initialData?.bedrooms?.toString() || '', // ห้องนอน
    bathrooms: initialData?.bathrooms?.toString() || '', // ห้องน้ำ
    floor: initialData?.floor || '', // ชั้นที่
    pricePerSqm: initialData?.pricePerSqm?.toString() || '', // ราคาขายต่อ ตร.ม. (คำนวณอัตโนมัติ)
    rentPricePerSqm: initialData?.rentPricePerSqm?.toString() || '', // ราคาเช่าต่อ ตร.ม. (คำนวณอัตโนมัติ)
    landAreaSqWa: initialData?.landAreaSqWa?.toString() || '', // พื้นที่ดิน (ตารางวา)
    
    // SEO
    seoTags: initialData?.seoTags || '',
    // Tag: บ้านมือ 1 (First-hand)
    isNewHouse: Boolean(initialData?.isNewHouse) || false,
    
    // โปรเจค
    selectedProject: initialData?.selected_project || '',
    availableDate: initialData?.available_date || '',
    
    // สิ่งอำนวยความสะดวกภายในห้อง (Amenities)
    amenities: [],
    
    // Timestamps
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [coverImage, setCoverImage] = useState(null)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [selectedProjectInfo, setSelectedProjectInfo] = useState(null)
  const [projectSearchTerm, setProjectSearchTerm] = useState('')
  const [filteredProjects, setFilteredProjects] = useState([])
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedAmenities, setSelectedAmenities] = useState([])

  const propertyTypes = [
    { value: 'house', label: 'บ้านเดี่ยว' },
    { value: 'townhouse', label: 'ทาวน์เฮาส์' },
    { value: 'apartment', label: 'อพาร์ตเมนต์' }
  ]

  // รายการสิ่งอำนวยความสะดวกภายในห้อง (Amenities)
  const [amenitiesList] = useState([
    { id: 'fullyFurnished', label: 'Fully Furnished', category: 'furniture', icon: 'furniture' },
    { id: 'airConditioner', label: 'Air Conditioner', category: 'appliance', icon: 'ac' },
    { id: 'television', label: 'Television', category: 'appliance', icon: 'tv' },
    { id: 'refrigerator', label: 'Refrigerator', category: 'appliance', icon: 'fridge' },
    { id: 'microwave', label: 'Microwave', category: 'appliance', icon: 'microwave' },
    { id: 'electricStove', label: 'Electric Stove', category: 'appliance', icon: 'stove' },
    { id: 'rangeHood', label: 'Range Hood', category: 'appliance', icon: 'hood' },
    { id: 'washingMachine', label: 'Washing Machine', category: 'appliance', icon: 'washing' },
    { id: 'waterHeater', label: 'Water Heater', category: 'appliance', icon: 'heater' },
    { id: 'oven', label: 'Oven', category: 'appliance', icon: 'oven' },
    { id: 'bathtub', label: 'Bathtub', category: 'bathroom', icon: 'bathtub' },
    { id: 'digitalDoorLock', label: 'Digital Door Lock', category: 'security', icon: 'lock' },
    { id: 'internetWifi', label: 'Internet / Wi-Fi', category: 'technology', icon: 'wifi' },
    { id: 'garage', label: 'Garage', category: 'parking', icon: 'garage' },
    { id: 'smartHomeSystem', label: 'Smart Home System', category: 'technology', icon: 'smart' },
    { id: 'jacuzzi', label: 'Jacuzzi', category: 'luxury', icon: 'jacuzzi' },
    { id: 'parking', label: 'Parking', category: 'parking', icon: 'parking' },
    { id: 'balcony', label: 'Balcony', category: 'structure', icon: 'balcony' },
    { id: 'dishwasher', label: 'Dishwasher', category: 'appliance', icon: 'dishwasher' },
    { id: 'walkInCloset', label: 'Walk-in Closet', category: 'storage', icon: 'closet' },
    { id: 'privateElevator', label: 'Private Elevator', category: 'luxury', icon: 'elevator' },
    { id: 'privatePool', label: 'Private Pool', category: 'luxury', icon: 'pool' },
    { id: 'waterFiltration', label: 'Water Filtration System', category: 'utility', icon: 'filter' },
    { id: 'privateGarden', label: 'Private Garden', category: 'outdoor', icon: 'garden' },
    { id: 'wineCooler', label: 'Wine Cooler / Wine Cellar', category: 'luxury', icon: 'wine' },
    { id: 'builtInWardrobe', label: 'Built-in Wardrobe', category: 'storage', icon: 'wardrobe' }
  ])

  // Prefill when editing (API data mapping)
  useEffect(() => {
    if (isEditing && initialData) {
      const mappedFacilities = []
      // Normalize amenities from API: accept array or JSON string
      let parsedAmenities = []
      if (Array.isArray(initialData.amenities)) {
        parsedAmenities = initialData.amenities
      } else if (typeof initialData.amenities === 'string') {
        try {
          const maybe = JSON.parse(initialData.amenities)
          parsedAmenities = Array.isArray(maybe) ? maybe : []
        } catch (e) {
          parsedAmenities = []
        }
      }

      setFormData(prev => ({
        ...prev,
        title: initialData.title || '',
        projectCode: initialData.project_code || prev.projectCode,
        status: initialData.status || 'sale',
        price: initialData.price !== undefined && initialData.price !== null ? String(initialData.price) : '',
        rentPrice: initialData.rent_price !== undefined && initialData.rent_price !== null ? String(initialData.rent_price) : '',
        location: initialData.location || '',
        googleMapUrl: initialData.google_map_url || '',
        nearbyTransport: initialData.nearby_transport || '',
        propertyType: initialData.property_type || 'house',
        description: initialData.description || '',
        area: initialData.area !== undefined && initialData.area !== null ? String(initialData.area) : '',
        bedrooms: initialData.bedrooms !== undefined && initialData.bedrooms !== null ? String(initialData.bedrooms) : '',
        bathrooms: initialData.bathrooms !== undefined && initialData.bathrooms !== null ? String(initialData.bathrooms) : '',
        floor: initialData.floor || '',
        pricePerSqm: initialData.price_per_sqm !== undefined && initialData.price_per_sqm !== null ? String(initialData.price_per_sqm) : '',
        landAreaSqWa: initialData.land_area_sqwa !== undefined && initialData.land_area_sqwa !== null ? String(initialData.land_area_sqwa) : '',
        pricePerSqWa: initialData.price_per_sqwa !== undefined && initialData.price_per_sqwa !== null ? String(initialData.price_per_sqwa) : '',
        rentPricePerSqWa: initialData.rent_price_per_sqwa !== undefined && initialData.rent_price_per_sqwa !== null ? String(initialData.rent_price_per_sqwa) : '',
        seoTags: initialData.seo_tags || '',
        isNewHouse: Boolean(initialData.is_new_house) || false,
        selectedProject: initialData.selected_project || '',
        availableDate: initialData.available_date || '',
        amenities: parsedAmenities,
        
        createdAt: initialData.created_at || prev.createdAt,
        updatedAt: initialData.updated_at || new Date().toISOString()
      }))

      // จัดการรูปภาพจาก API response
      const coverUrl = initialData.cover_image || null
      if (coverUrl) {
        setCoverImage({
          id: `cover-${Date.now()}`,
          url: coverUrl,
          preview: coverUrl, // backward compatibility with old rendering
          uploading: false
        })
      } else {
        setCoverImage(null)
      }

      const urls = Array.isArray(initialData.images) ? initialData.images : []
      const filtered = coverUrl ? urls.filter(u => u !== coverUrl) : urls
      const mappedImages = filtered.map((url, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        url,
        preview: url, // backward compatibility with old rendering
        uploading: false
      }))
      setImages(mappedImages)

      // จัดการ amenities
      console.log('House amenities from API (normalized):', parsedAmenities)
      setSelectedAmenities(parsedAmenities)
    }
  }, [isEditing, initialData])

  // Fetch projects (like CondoForm)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true)
        const response = await projectApi.getAll()
        const rawList = Array.isArray(response.data) ? response.data : (response.data?.items || [])
        const formatted = rawList.map(p => ({
          id: p.id.toString(),
          name: p.name_th || p.name_en || p.name || 'ไม่ระบุชื่อ',
          location: `${p.district || ''}${p.district && p.province ? ', ' : ''}${p.province || ''}`.replace(/^,\s*|,\s*$/g, ''),
          developer: p.developer || ''
        }))
        setProjects(formatted)
        setFilteredProjects(formatted)
      } catch (e) {
        setProjects([])
        setFilteredProjects([])
      } finally {
        setProjectsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Filter projects
  useEffect(() => {
    if (!projectSearchTerm.trim()) setFilteredProjects(projects)
    else {
      const kw = projectSearchTerm.toLowerCase()
      setFilteredProjects(projects.filter(p => (
        p.name.toLowerCase().includes(kw) ||
        p.location.toLowerCase().includes(kw) ||
        p.developer.toLowerCase().includes(kw)
      )))
    }
  }, [projectSearchTerm, projects])

  // Selected project info
  useEffect(() => {
    if (formData.selectedProject) {
      setSelectedProjectInfo(projects.find(p => p.id === formData.selectedProject) || null)
    } else setSelectedProjectInfo(null)
  }, [formData.selectedProject, projects])

  // Generate auto project code (WS + ตัวเลข 7 หลัก)
  useEffect(() => {
    if (!isEditing && !formData.projectCode) {
      const timestamp = Date.now()
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      const code = `WS${timestamp.toString().slice(-4)}${randomNum}` // รหัส WS + ตัวเลข 7 หลัก
      setFormData(prev => ({ ...prev, projectCode: code }))
    }
  }, [isEditing])

  // ฟังก์ชันสำหรับแสดง React Icons
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
      
      // Amenities (more accurate icons)
      'furniture': <FaCouch className="w-5 h-5" />,                 // Fully Furnished
      'ac': <TbAirConditioning className="w-5 h-5" />,               // Air Conditioner
      'tv': <FaTv className="w-5 h-5" />,                            // Television
      'fridge': <MdKitchen className="w-5 h-5" />,                   // Refrigerator
      'microwave': <MdMicrowave className="w-5 h-5" />,              // Microwave
      'stove': <PiCookingPot className="w-5 h-5" />,                 // Electric Stove
      'hood': <LuFan className="w-5 h-5" />,                         // Range Hood
      'washing': <MdLocalLaundryService className="w-5 h-5" />,      // Washing Machine
      'heater': <PiThermometerHot className="w-5 h-5" />,           // Water Heater
      'oven': <PiOven className="w-5 h-5" />,                        // Oven
      'bathtub': <FaBath className="w-5 h-5" />,                     // Bathtub
      'lock': <FaLock className="w-5 h-5" />,                        // Digital Door Lock
      'garage': <FaCar className="w-5 h-5" />,                       // Garage
      'smart': <RiHomeWifiLine className="w-5 h-5" />,               // Smart Home System
      'jacuzzi': <MdHotTub className="w-5 h-5" />,                   // Jacuzzi
      'parking': <FaCar className="w-5 h-5" />,                      // Parking
      'balcony': <MdBalcony className="w-5 h-5" />,                  // Balcony
      'dishwasher': <FaUtensils className="w-5 h-5" />,              // Dishwasher
      'closet': <MdCheckroom className="w-5 h-5" />,                 // Walk-in Closet
      'elevator': <MdElevator className="w-5 h-5" />,                // Private Elevator
      'filter': <RiFilterLine className="w-5 h-5" />,                // Water Filtration System
      'garden': <FaSeedling className="w-5 h-5" />,                  // Private Garden
      'wine': <FaWineBottle className="w-5 h-5" />,                  // Wine Cooler / Cellar
      'wardrobe': <MdCheckroom className="w-5 h-5" />                // Built-in Wardrobe
    };
    
    return iconMap[iconName] || <FaBuilding className="w-5 h-5" />;
  }

  // Auto calculate sale price per sqm
  useEffect(() => {
    if (formData.area && formData.price) {
      const area = parseFloat(formData.area)
      const price = parseFloat(formData.price)
      if (!isNaN(area) && !isNaN(price) && area > 0 && price > 0) {
        const pricePerSqm = (price / area).toFixed(2)
        setFormData(prev => ({ ...prev, pricePerSqm }))
      } else if (!formData.price || formData.price === '') {
        setFormData(prev => ({ ...prev, pricePerSqm: '' }))
      }
    }
  }, [formData.price, formData.area])

  // Auto calculate rent price per sqm
  useEffect(() => {
    if (formData.area && formData.rentPrice) {
      const area = parseFloat(formData.area)
      const rentPrice = parseFloat(formData.rentPrice)
      if (!isNaN(area) && !isNaN(rentPrice) && area > 0 && rentPrice > 0) {
        const rentPricePerSqm = (rentPrice / area).toFixed(2)
        setFormData(prev => ({ ...prev, rentPricePerSqm }))
      } else if (!formData.rentPrice || formData.rentPrice === '') {
        setFormData(prev => ({ ...prev, rentPricePerSqm: '' }))
      }
    }
  }, [formData.rentPrice, formData.area])



  // Convert API facilities to component format
  // removed facilities block (like CondoForm)
  // Calculate per square wa (land)
  useEffect(() => {
    if (formData.landAreaSqWa && formData.price) {
      const sqwa = parseFloat(formData.landAreaSqWa)
      const price = parseFloat(formData.price)
      if (!isNaN(sqwa) && !isNaN(price) && sqwa > 0 && price > 0) {
        const pricePerSqWa = (price / sqwa).toFixed(2)
        setFormData(prev => ({ ...prev, pricePerSqWa }))
      } else if (!formData.price || !formData.landAreaSqWa) {
        setFormData(prev => ({ ...prev, pricePerSqWa: '' }))
      }
    }
  }, [formData.price, formData.landAreaSqWa])

  useEffect(() => {
    if (formData.landAreaSqWa && formData.rentPrice) {
      const sqwa = parseFloat(formData.landAreaSqWa)
      const rent = parseFloat(formData.rentPrice)
      if (!isNaN(sqwa) && !isNaN(rent) && sqwa > 0 && rent > 0) {
        const rentPricePerSqWa = (rent / sqwa).toFixed(2)
        setFormData(prev => ({ ...prev, rentPricePerSqWa }))
      } else if (!formData.rentPrice || !formData.landAreaSqWa) {
        setFormData(prev => ({ ...prev, rentPricePerSqWa: '' }))
      }
    }
  }, [formData.rentPrice, formData.landAreaSqWa])

  // อัปเดต formData.amenities เมื่อ selectedAmenities เปลี่ยน
  useEffect(() => {
    console.log('selectedAmenities changed:', selectedAmenities)
    console.log('formData before update:', formData)
    console.log('selectedAmenities length:', selectedAmenities ? selectedAmenities.length : 0)
    console.log('selectedAmenities type:', typeof selectedAmenities)
    console.log('formData.amenities before update:', formData.amenities)
    if (selectedAmenities && Array.isArray(selectedAmenities)) {
      setFormData(prev => {
        const updated = {
          ...prev,
          amenities: selectedAmenities
        }
        console.log('Updated formData:', updated)
        return updated
      })
      console.log('Updated formData.amenities:', selectedAmenities)
    }
  }, [selectedAmenities])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      updatedAt: new Date().toISOString()
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }



  // removed facility toggle (facilities section deleted)

  // Handle multiple image uploads
  const handleMultipleImageUpload = async (files) => {
    try {
      setUploading(true)
      setUploadProgress(0)
      
      const totalFiles = files.length
      let uploadedCount = 0
      
      for (const file of files) {
        try {
          await handleImageUpload(file, false)
          uploadedCount++
          setUploadProgress((uploadedCount / totalFiles) * 100)
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error)
          // Continue with other files
        }
      }
      
      setUploadProgress(100)
      setTimeout(() => setUploadProgress(0), 2000) // Hide progress after 2 seconds
    } catch (error) {
      console.error('Error uploading multiple images:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (file, isCover = false) => {
    try {
      setUploading(true)
      
      // อัพโหลดไป Cloudinary ผ่าน API
      const result = await uploadAPI.uploadSingle(file)
      const uploaded = result?.data || result // interceptor returns response.data; guard for shape
      const imageUrl = uploaded.url
      const publicId = uploaded.public_id
      
      const imageData = {
        id: Date.now().toString(),
        url: imageUrl,
        preview: imageUrl, // backward compatibility with old rendering
        public_id: publicId,
        uploading: false,
        file
      }

      if (isCover) {
        setCoverImage(imageData)
      } else {
        setImages(prev => [...prev, imageData])
      }
      
      console.log('อัพโหลดรูปภาพสำเร็จ:', uploaded)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(`อัปโหลดรูปภาพไม่สำเร็จ: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async (imageId, isCover = false) => {
    try {
      let imageToRemove = null;
      
      if (isCover) {
        imageToRemove = coverImage;
        setCoverImage(null);
      } else {
        imageToRemove = images.find(img => img.id === imageId);
        setImages(prev => prev.filter(img => img.id !== imageId));
      }
      
      // ลบรูปจาก Cloudinary ถ้ามี public_id
      if (imageToRemove && imageToRemove.public_id) {
        try {
          await uploadAPI.delete(imageToRemove.public_id);
          console.log('ลบรูปจาก Cloudinary สำเร็จ:', imageToRemove.public_id);
        } catch (error) {
          console.error('ไม่สามารถลบรูปจาก Cloudinary:', error);
          // ไม่ต้องแสดง error ให้ user เพราะรูปหายจาก UI แล้ว
        }
      }
    } catch (error) {
      console.error('Error removing image:', error);
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title) newErrors.title = 'กรุณากรอกชื่อโครงการ'
    if (!formData.status) newErrors.status = 'กรุณาเลือกสถานะ'
    if (!formData.price && formData.status !== 'rent') newErrors.price = 'กรุณากรอกราคา'
    if (!formData.location) newErrors.location = 'กรุณากรอกสถานที่'
    if (!formData.area) newErrors.area = 'กรุณากรอกพื้นที่'
    if (!formData.bedrooms) newErrors.bedrooms = 'กรุณากรอกจำนวนห้องนอน'
    if (!formData.bathrooms) newErrors.bathrooms = 'กรุณากรอกจำนวนห้องน้ำ'
    if (!formData.floor) newErrors.floor = 'กรุณากรอกชั้นที่'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      
      // แปลงข้อมูลให้ตรงกับ backend API
      const houseData = {
        title: formData.title,
        status: formData.status,
        price: parseFloat(formData.price) || 0,
        rent_price: parseFloat(formData.rentPrice) || 0,
        location: formData.location,
        google_map_url: formData.googleMapUrl,
        nearby_transport: formData.nearbyTransport,
        listing_type: formData.status, // ใช้ status เป็น listing_type
        property_type: formData.propertyType,
        description: formData.description,
        area: parseFloat(formData.area),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        floor: formData.floor,
        price_per_sqm: parseFloat(formData.pricePerSqm) || 0,
        land_area_sqwa: parseFloat(formData.landAreaSqWa) || null,
        price_per_sqwa: parseFloat(formData.pricePerSqWa) || null,
        rent_price_per_sqwa: parseFloat(formData.rentPricePerSqWa) || null,
        seo_tags: formData.seoTags,
        is_new_house: Boolean(formData.isNewHouse),
        project_code: formData.projectCode, // ส่งรหัสโครงการที่สร้าง WSxxx ไปเก็บ
        selected_project: formData.selectedProject,
        available_date: formData.availableDate,
        amenities: selectedAmenities,
        images: images.map(img => ({ 
          url: img.url, 
          public_id: img.public_id || null 
        })),
        cover_image: coverImage?.url || null
      }

      console.log('ส่งข้อมูลไป API:', houseData)
      console.log('Amenities ที่จะส่งไป:', selectedAmenities)
      console.log('formData.amenities:', formData.amenities)
      console.log('selectedAmenities type:', typeof selectedAmenities)
      console.log('selectedAmenities isArray:', Array.isArray(selectedAmenities))
      console.log('selectedAmenities length:', selectedAmenities ? selectedAmenities.length : 0)

      if (isEditing) {
        // แก้ไขบ้าน
        const result = await houseAPI.update(initialData.id, houseData)
        console.log('แก้ไขบ้านสำเร็จ:', result)
        alert('แก้ไขประกาศบ้านสำเร็จ!')
      } else {
        // สร้างบ้านใหม่
        const result = await houseAPI.create(houseData)
        console.log('สร้างบ้านสำเร็จ:', result)
        alert('เพิ่มประกาศบ้านสำเร็จ!')
      }

      if (onSave) {
        onSave(houseData)
      }

      if (onBack) {
        onBack()
      }
    } catch (error) {
      console.error('Error saving house:', error)
      alert(`เกิดข้อผิดพลาด: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>กลับ</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-prompt">
              {isEditing ? 'แก้ไขประกาศบ้าน' : 'เพิ่มบ้านเดี่ยว/ทาวน์เฮาส์/อพาร์ตเมนต์'}
            </h1>
            <p className="text-gray-600 font-prompt mt-1">
              กรอกข้อมูลอสังหาให้ครบถ้วน
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">


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
                ชื่อประกาศ/โครงการ *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="เช่น บ้านเดี่ยว โครงการ ABC, ทาวน์เฮาส์ทำเลดี, อพาร์ตเมนต์ใกล้ BTS"
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

            {/* ประเภททรัพย์ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ประเภททรัพย์
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
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
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </Card>

      {/* โปรเจคและวันที่ว่าง */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
          <Building className="h-6 w-6 mr-3 text-blue-600" />
          โปรเจคและวันที่ว่าง
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* โปรเจค */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">โปรเจค</label>
            <div className="mb-3">
              <Input
                type="text"
                placeholder="ค้นหาโปรเจค (ชื่อ, สถานที่, หรือผู้พัฒนา)..."
                value={projectSearchTerm}
                onFocus={() => setIsProjectDropdownOpen(true)}
                onChange={(e) => setProjectSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredProjects.length > 0) {
                    const first = filteredProjects[0]
                    setFormData(prev => ({ ...prev, selectedProject: first.id }))
                    setIsProjectDropdownOpen(false)
                  }
                  if (e.key === 'Escape') setIsProjectDropdownOpen(false)
                }}
                className="w-full"
              />
            </div>
            {projectsLoading ? (
              <div className="flex items-center justify-center py-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">กำลังโหลดโปรเจค...</span>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProjectDropdownOpen(prev => !prev)}
                  className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="truncate">{selectedProjectInfo ? `${selectedProjectInfo.name} - ${selectedProjectInfo.location}` : '-- เลือกโปรเจคที่บ้านนี้อยู่ --'}</span>
                  <svg className={`h-4 w-4 ml-2 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
                </button>
                {isProjectDropdownOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-auto" role="listbox">
                    {filteredProjects.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">ไม่พบโปรเจค</div>
                    ) : (
                      filteredProjects.map(project => (
                        <div
                          key={project.id}
                          className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${formData.selectedProject === project.id ? 'bg-blue-50' : ''}`}
                          role="option"
                          aria-selected={formData.selectedProject === project.id}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, selectedProject: project.id }))
                            setIsProjectDropdownOpen(false)
                          }}
                        >
                          <div className="font-medium text-gray-800">{project.name}</div>
                          <div className="text-xs text-gray-500">{project.location} {project.developer ? `• ${project.developer}` : ''}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {projectSearchTerm && (
                  <p className="text-sm text-gray-500 mt-1">พบ {filteredProjects.length} โปรเจค จาก {projects.length} โปรเจค</p>
                )}
              </div>
            )}

            {selectedProjectInfo && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 font-prompt">✅ เลือกแล้ว: {selectedProjectInfo.name}</h4>
                <p className="text-sm text-blue-600 mt-1">📍 {selectedProjectInfo.location}</p>
                {selectedProjectInfo.developer && <p className="text-sm text-blue-600">🏢 ผู้พัฒนา: {selectedProjectInfo.developer}</p>}
              </div>
            )}
          </div>

          {/* วันที่ว่าง */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">วันที่ว่าง</label>
            <Input
              type="date"
              value={formData.availableDate}
              onChange={(e) => setFormData(prev => ({ ...prev, availableDate: e.target.value }))}
              placeholder="เลือกวันที่ว่าง"
            />
            <p className="text-sm text-gray-500 mt-1">วันที่ที่บ้านจะว่างพร้อมเข้าอยู่</p>
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
                โลเคชั่น : สถานที่
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
                  <MapPin className="h-4 w-4 text-gray-400" />
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
                placeholder="อธิบายรายละเอียด เช่น สภาพบ้าน การตกแต่ง ทำเล สิ่งอำนวยความสะดวก..."
              rows={5}
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
                 พื้นที่ (ตารางเมตร)
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

            {/* พื้นที่ดิน (ตารางวา) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                 พื้นที่ดิน (ตารางวา)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.landAreaSqWa}
                  onChange={(e) => handleInputChange('landAreaSqWa', e.target.value)}
                  placeholder="เช่น 50"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ตร.ว.</span>
                </div>
              </div>
            </div>

            {/* ห้องนอน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                 ห้องนอน
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
                 ห้องน้ำ
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

            {/* จำนวนชั้น */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                 จำนวนชั้น
              </label>
              <div className="relative">
                <Input
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  placeholder="เช่น 2"
                  className={errors.floor ? 'border-red-500' : ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Building className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.floor && <p className="text-red-500 text-sm mt-1">{errors.floor}</p>}
            </div>

            {/* ราคาขาย/เช่าต่อ ตร.ม. */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ราคาขายต่อ ตร.ม. */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  ราคาขายต่อ ตร.ม. (คำนวณอัตโนมัติ)
                </label>
                <div className="relative">
                  <Input
                    value={formData.pricePerSqm ? `฿${parseFloat(formData.pricePerSqm).toLocaleString('th-TH', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} /ตร.ม.` : ''}
                    readOnly
                    className="bg-green-50 border-green-200 text-green-700 font-semibold"
                    placeholder="จะคำนวณจากราคาขาย"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Calculator className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                {formData.pricePerSqm && (
                  <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-xs text-green-700">
                      ✅ คำนวณจากราคาขาย = ฿{parseFloat(formData.pricePerSqm).toLocaleString('th-TH')}
                      {' '} /ตร.ม.
                    </p>
                  </div>
                )}
              </div>

              {/* ราคาเช่าต่อ ตร.ม. */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                  ราคาเช่าต่อ ตร.ม. (คำนวณอัตโนมัติ)
                </label>
                <div className="relative">
                  <Input
                    value={formData.rentPricePerSqm ? `฿${parseFloat(formData.rentPricePerSqm).toLocaleString('th-TH', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} /ตร.ม./เดือน` : ''}
                    readOnly
                    className="bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                    placeholder="จะคำนวณจากราคาเช่า"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Calculator className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                {formData.rentPricePerSqm && (
                  <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-xs text-blue-700">
                      ✅ คำนวณจากราคาเช่า = ฿{parseFloat(formData.rentPricePerSqm).toLocaleString('th-TH')} /ตร.ม./เดือน
                    </p>
                  </div>
                )}
              </div>

              {/* ตัวอย่างการคำนวณ */}
              <div className="md:col-span-2">
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">ตัวอย่างการคำนวณ:</h4>
                  {formData.status === 'rent' ? (
                    <div>
                      <p className="text-sm text-blue-700">
                        ราคาเช่า: 25,000 บาท/เดือน ÷ 47.48 ตารางเมตร = 526.54 บาท/ตร.ม./เดือน
                      </p>
                      <p className="text-xs text-blue-600 mt-1">การคำนวณ: ราคาเช่า ÷ พื้นที่ = ราคาต่อตารางเมตรต่อเดือน</p>
                    </div>
                  ) : formData.status === 'sale' ? (
                    <div>
                      <p className="text-sm text-blue-700">
                        ราคาขาย: 4,800,000 บาท ÷ 47.48 ตารางเมตร = 101,095.95 บาท/ตร.ม.
                      </p>
                      <p className="text-xs text-blue-600 mt-1">การคำนวณ: ราคาขาย ÷ พื้นที่ = ราคาต่อตารางเมตร</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-blue-700">48,000 บาท ÷ 47.48 ตารางเมตร = 1,010.95 บาท/ตร.ม.</p>
                      <p className="text-xs text-blue-600 mt-1">การคำนวณ: ราคา ÷ พื้นที่ = ราคาต่อตารางเมตร</p>
                    </div>
                  )}
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-700">
                      💡 <strong>หมายเหตุ:</strong> ระบบจะคำนวณอัตโนมัติเมื่อกรอกข้อมูลครบถ้วน
                      {formData.status === 'rent' && ' (ราคาเช่าต่อเดือน)'}
                      {formData.status === 'sale' && ' (ราคาขาย)'}
                      {formData.status === 'both' && ' (ราคาขายหรือราคาเช่า)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ราคาต่อ ตร.ว. (ขาย/เช่า) */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">ราคาขายต่อ ตร.ว. (คำนวณอัตโนมัติ)</label>
                <Input
                  value={formData.pricePerSqWa ? `฿${parseFloat(formData.pricePerSqWa).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /ตร.ว.` : ''}
                  readOnly
                  className="bg-green-50 border-green-200 text-green-700 font-semibold"
                  placeholder="จะคำนวณจากราคาขาย ÷ พื้นที่ดิน (ตร.ว.)"
                />
                {formData.pricePerSqWa && (
                  <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-xs text-green-700">
                      ✅ คำนวณแล้ว: จากราคาขาย ÷ พื้นที่ดิน (ตร.ว.) = ฿{parseFloat(formData.pricePerSqWa).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /ตร.ว.
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">ราคาเช่าต่อ ตร.ว. (คำนวณอัตโนมัติ)</label>
                <Input
                  value={formData.rentPricePerSqWa ? `฿${parseFloat(formData.rentPricePerSqWa).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /ตร.ว./เดือน` : ''}
                  readOnly
                  className="bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                  placeholder="จะคำนวณจากราคาเช่า ÷ พื้นที่ดิน (ตร.ว.)"
                />
                {formData.rentPricePerSqWa && (
                  <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-xs text-blue-700">
                      ✅ คำนวณแล้ว: จากราคาเช่า ÷ พื้นที่ดิน (ตร.ว.) = ฿{parseFloat(formData.rentPricePerSqWa).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /ตร.ว./เดือน
                    </p>
                  </div>
                )}
              </div>
              {/* ตัวอย่างการคำนวณ ตร.ว. */}
              <div className="md:col-span-2">
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">ตัวอย่างการคำนวณ:</h4>
                  {formData.status === 'rent' ? (
                    <div>
                      <p className="text-sm text-blue-700">
                        ราคาเช่า: {formData.rentPrice ? parseFloat(formData.rentPrice).toLocaleString('th-TH') : '—'} บาท/เดือน ÷ {formData.landAreaSqWa || '—'} ตารางวา = {formData.rentPrice && formData.landAreaSqWa ? (parseFloat(formData.rentPrice) / parseFloat(formData.landAreaSqWa)).toFixed(2) : '—'} บาท/ตร.ว./เดือน
                      </p>
                      <p className="text-xs text-blue-600 mt-1">การคำนวณ: ราคาเช่า ÷ พื้นที่ดิน (ตร.ว.) = ราคาเช่าต่อ ตร.ว.</p>
                    </div>
                  ) : formData.status === 'sale' ? (
                    <div>
                      <p className="text-sm text-blue-700">
                        ราคาขาย: {formData.price ? parseFloat(formData.price).toLocaleString('th-TH') : '—'} บาท ÷ {formData.landAreaSqWa || '—'} ตารางวา = {formData.price && formData.landAreaSqWa ? (parseFloat(formData.price) / parseFloat(formData.landAreaSqWa)).toFixed(2) : '—'} บาท/ตร.ว.
                      </p>
                      <p className="text-xs text-blue-600 mt-1">การคำนวณ: ราคาขาย ÷ พื้นที่ดิน (ตร.ว.) = ราคาขายต่อ ตร.ว.</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-blue-700">
                        {formData.price ? parseFloat(formData.price).toLocaleString('th-TH') : '—'} บาท ÷ {formData.landAreaSqWa || '—'} ตารางวา = {formData.price && formData.landAreaSqWa ? (parseFloat(formData.price) / parseFloat(formData.landAreaSqWa)).toFixed(2) : '—'} บาท/ตร.ว.
                      </p>
                      <p className="text-xs text-blue-600 mt-1">การคำนวณ: ราคา ÷ พื้นที่ดิน (ตร.ว.) = ราคา/เช่าต่อ ตร.ว.</p>
                    </div>
                  )}
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-700">
                      💡 <strong>หมายเหตุ:</strong> ระบบจะคำนวณอัตโนมัติเมื่อกรอกข้อมูลครบถ้วน (ราคาขาย/เช่า + พื้นที่ดินเป็น ตร.ว.)
                    </p>
                  </div>
                </div>
              </div>
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

        {/* แท็กเพิ่มเติม */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <FileText className="h-6 w-6 mr-3 text-blue-600" />
            แท็กเพิ่มเติม
          </h2>
          <div>
            {/* Tag: บ้านมือ 1 (First-hand) */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isNewHouse}
                onChange={(e) => handleInputChange('isNewHouse', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700 font-prompt">บ้านมือ 1 (First-hand)</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">เลือกเมื่อเป็นบ้านใหม่ไม่เคยอยู่อาศัย</p>
          </div>
        </Card>

        {/* สิ่งอำนวยความสะดวกภายในห้อง (Amenities) */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Star className="h-6 w-6 mr-3 text-blue-600" />
            สิ่งอำนวยความสะดวกภายในห้อง
          </h2>
          
          {/* Debug Info */}
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-700 font-prompt">
              <span className="font-medium">🐛 Debug:</span> 
              selectedAmenities: {JSON.stringify(selectedAmenities)} | 
              formData.amenities: {JSON.stringify(formData.amenities)}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {amenitiesList.map((amenity) => (
              <label key={amenity.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAmenities(prev => [...prev, amenity.id])
                      setFormData(prev => ({
                        ...prev,
                        amenities: [...prev.amenities, amenity.id]
                      }))
                    } else {
                      setSelectedAmenities(prev => prev.filter(id => id !== amenity.id))
                      setFormData(prev => ({
                        ...prev,
                        amenities: prev.amenities.filter(id => id !== amenity.id)
                      }))
                    }
                  }}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex items-center">
                  <span className="mr-2 text-blue-600">
                    {getFacilityIcon(amenity.icon)}
                  </span>
                  <span className="text-sm text-gray-700 font-prompt">{amenity.label}</span>
                </div>
              </label>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 font-prompt">
              <span className="font-medium">💡 คำแนะนำ:</span> เลือกสิ่งอำนวยความสะดวกที่มีอยู่ในห้อง 
              เพื่อให้ผู้ซื้อ/ผู้เช่าเห็นข้อมูลที่ครบถ้วน
            </p>
          </div>
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
                    src={coverImage.url || coverImage.preview}
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

          {/* Multiple Images Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              รูปภาพเพิ่มเติม (สูงสุด 100 รูป)
            </label>
            
            {/* Drag & Drop Area */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const files = Array.from(e.dataTransfer.files).filter(file => 
                  file.type.startsWith('image/')
                )
                if (files.length > 0) {
                  handleMultipleImageUpload(files)
                }
              }}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                ลากและวางรูปภาพที่นี่ หรือ
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="multiple-images"
                onChange={(e) => {
                  if (e.target.files) {
                    handleMultipleImageUpload(e.target.files)
                  }
                }}
              />
              <label 
                htmlFor="multiple-images"
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                เลือกรูปภาพ
              </label>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url || image.preview}
                      alt={`Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.id, false)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          <div className="flex items-center justify-between text-sm mt-4">
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
          
          {/* Progress Bar */}
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-prompt">
              <span className="font-medium">💡 คำแนะนำ:</span> รูปภาพหน้าปกจะแสดงเป็นรูปหลักในรายการ 
              รูปภาพเพิ่มเติมจะแสดงในแกลลอรี่ของประกาศ สามารถอัปโหลดได้สูงสุด 100 รูป
            </p>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={uploading}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            disabled={loading || uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading || uploading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>กำลังบันทึก...</span>
              </div>
            ) : (
              isEditing ? 'อัปเดต' : 'บันทึก'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default HouseForm