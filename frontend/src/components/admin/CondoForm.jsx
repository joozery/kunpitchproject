import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { condoAPI, uploadAPI } from '../../lib/api'
import {
  ArrowLeft,
  Building,
  MapPin,
  FileText,
  Search,
  Star,
  Camera,
  Image,
  Upload,
  Plus,
  X,
  DollarSign,
  Calendar,
  Calculator,
  Bath,
  Bed
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
    
    // Project Facilities
    facilities: condo?.facilities || [],
    
    // Timestamps
    createdAt: condo?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [coverImage, setCoverImage] = useState(null)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [facilitiesLoading, setFacilitiesLoading] = useState(true)
  const [availableFacilities, setAvailableFacilities] = useState([])

  const listingTypes = [
    { value: 'sale', label: 'ขาย', icon: DollarSign },
    { value: 'rent', label: 'เช่า', icon: Calendar },
    { value: 'both', label: 'ขาย/เช่า', icon: Building }
  ]

  // Fetch facilities from API
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setFacilitiesLoading(true)
        const response = await condoAPI.getFacilities()
        if (response.success) {
          setAvailableFacilities(response.data.all || [])
        }
      } catch (error) {
        console.error('Error fetching facilities:', error)
        // Fallback to default facilities if API fails
        setAvailableFacilities([])
      } finally {
        setFacilitiesLoading(false)
      }
    }

    fetchFacilities()
  }, [])

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
      if (!isNaN(price) && !isNaN(area) && area > 0) {
        const pricePerSqm = (price / area).toFixed(2)
        setFormData(prev => ({ ...prev, pricePerSqm }))
      }
    }
  }, [formData.price, formData.area])



  // Convert API facilities to component format
  const projectFacilities = availableFacilities.map(facility => ({
    id: facility.id,
    label: facility.label,
    icon: FacilityIcons[facility.icon] || FacilityIcons.Star, // Fallback icon
    category: facility.category
  }))

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



  const handleFacilityToggle = (facilityId) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter(id => id !== facilityId)
        : [...prev.facilities, facilityId]
    }))
  }

  const handleImageUpload = async (file, isCover = false) => {
    try {
      setUploading(true)
      
      // Mock upload - in real app, upload to server
      const imageId = Date.now().toString()
      const imageUrl = URL.createObjectURL(file)
      
      const imageData = {
        id: imageId,
        preview: imageUrl,
        file: file,
        uploading: false
      }

      if (isCover) {
        setCoverImage(imageData)
      } else {
        setImages(prev => [...prev, imageData])
      }
    } catch (error) {
      console.error('Error uploading image:', error)
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
      setUploading(true)
      
      // Transform form data to API format
      const condoData = {
        title: formData.title,
        status: formData.status,
        price: parseFloat(formData.price) || 0,
        rent_price: parseFloat(formData.rentPrice) || 0,
        location: formData.location,
        google_map_url: formData.googleMapUrl,
        nearby_transport: formData.nearbyTransport,
        listing_type: formData.listingType,
        description: formData.description,
        area: parseFloat(formData.area),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        floor: formData.floor,
        seo_tags: formData.seoTags,
        facilities: formData.facilities,
        images: images.map(img => ({
          url: img.preview,
          public_id: img.public_id || null
        })),
        cover_image: coverImage?.preview || null
      }

      let response
      
      if (isEditing && condo?.id) {
        // Update existing condo
        response = await condoAPI.update(condo.id, condoData)
      } else {
        // Create new condo
        response = await condoAPI.create(condoData)
      }

      if (response.success) {
        console.log('Condo saved successfully:', response)
        
        // Show success message
        alert(isEditing ? 'แก้ไขข้อมูลคอนโดสำเร็จ!' : 'เพิ่มคอนโดใหม่สำเร็จ!')
        
        if (onSave) {
          onSave(response.data)
        }
        
        // Go back to list
        if (onBack) {
          onBack()
        }
      } else {
        throw new Error(response.message || 'Failed to save condo')
      }
    } catch (error) {
      console.error('Error saving condo:', error)
      alert(`เกิดข้อผิดพลาด: ${error.message}`)
    } finally {
      setLoading(false)
      setUploading(false)
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
              {isEditing ? 'แก้ไขข้อมูลคอนโด' : 'เพิ่มคอนโดใหม่'}
            </h1>
            <p className="text-gray-600 font-prompt mt-1">
              กรอกข้อมูลคอนโดให้ครบถ้วน
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
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </div>
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
              placeholder="อธิบายรายละเอียดของคอนโด เช่น สภาพห้อง การตกแต่ง สิ่งอำนวยความสะดวก..."
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
            สิ่งอำนวยความสะดวก (Project Facilities)
            {facilitiesLoading && (
              <div className="ml-3 text-sm text-blue-600">กำลังโหลด...</div>
            )}
          </h2>
          
          {facilitiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">กำลังโหลดสิ่งอำนวยความสะดวก...</span>
            </div>
          ) : (
            <div>
              {/* แสดง facilities ที่เลือกแล้ว */}
              {formData.facilities.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-green-800 font-prompt">
                        ✅ สิ่งอำนวยความสะดวกที่เลือกแล้ว ({formData.facilities.length} รายการ)
                      </h3>
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
                          className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-green-200 transition-colors"
                          onClick={() => handleFacilityToggle(facilityId)}
                        >
                          <div className="p-1 rounded-full bg-green-200">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <span className="font-prompt text-xs">{facility.label}</span>
                          <X className="h-3 w-3 text-green-500 hover:text-green-700" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* All facilities for selection */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4 text-gray-700 font-prompt">
                  📋 เลือกสิ่งอำนวยความสะดวกทั้งหมด ({availableFacilities.length} รายการ)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {projectFacilities.map(facility => {
                    const IconComponent = facility.icon
                    const isSelected = formData.facilities.includes(facility.id)
                    
                    return (
                      <div
                        key={facility.id}
                        onClick={() => handleFacilityToggle(facility.id)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className={`p-2 rounded-full transition-all duration-200 ${
                            isSelected 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <span className={`text-xs font-medium font-prompt ${
                            isSelected ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {facility.label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
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
            disabled={uploading}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            disabled={loading || uploading || facilitiesLoading}
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

export default CondoForm