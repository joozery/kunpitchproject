import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import {
  ArrowLeft,
  Landmark,
  MapPin,
  FileText,
  DollarSign,
  Calendar,
  Upload,
  Plus,
  X,
  Maximize,
  Search,
  Camera,
  Calculator,
  User
} from 'lucide-react'




const LandForm = ({ land = null, onBack, onSave, isEditing = false }) => {
  const [formData, setFormData] = React.useState({
    // ข้อมูลพื้นฐาน
    title: land?.title || '', // ชื่อโครงการ
    projectCode: land?.projectCode || '', // รหัสโครงการ (อัตโนมัติ)
    announcerStatus: land?.announcerStatus || 'agent', // สถานะผู้ประกาศ: เจ้าของ/นายหน้า
    status: land?.status || 'sale', // สถานะ: ขาย/เช่า
    price: land?.price?.toString() || '', // ราคา (บาท)
    rentPrice: land?.rentPrice?.toString() || '', // ราคาเช่า (บาท/เดือน)
    landOwnership: land?.landOwnership || 'thai', // กรรมสิทธ์ที่ดิน: คนสัญชาติไทย หรือต่างชาติ
    
    // โลเคชั่น
    location: land?.location || '', // สถานที่
    googleMapUrl: land?.googleMapUrl || '', // Google Map URL
    nearbyTransport: land?.nearbyTransport || '', // BTS/MRT/APL/SRT
    
    // ประเภททรัพย์
    propertyType: land?.propertyType || 'land', // ประเภททรัพย์: ที่ดิน/ที่ดินพร้อมสิ่งปลูกสร้าง
    listingType: land?.listingType || 'sale', // ขาย/เช่า
    
    // รายละเอียด
    description: land?.description || '',
    
    // ข้อมูลอสังหาริมทรัพย์
    area: land?.area?.toString() || '', // พื้นที่ (ตารางเมตร)
    squareWa: land?.squareWa?.toString() || '', // ตารางวา
    rai: land?.rai?.toString() || '', // ไร่
    ngan: land?.ngan?.toString() || '', // งาน
    wah: land?.wah?.toString() || '', // วา
    pricePerSqWa: land?.pricePerSqWa?.toString() || '', // ราคาต่อ sq.wa
    pricePerSqm: land?.pricePerSqm?.toString() || '', // ราคาขายต่อ ตร.ม. (คำนวณอัตโนมัติ)
    rentPricePerSqWa: land?.rentPricePerSqWa?.toString() || '', // ราคาเช่าต่อ ตร.วา (คำนวณอัตโนมัติ)
    rentPricePerSqm: land?.rentPricePerSqm?.toString() || '', // ราคาเช่าต่อ ตร.ม. (คำนวณอัตโนมัติ)
    view: land?.view || '', // วิวที่มองเห็น
    unitNumber: land?.unitNumber || '', // เลขที่ยูนิต
    
    // SEO
    seoTags: land?.seoTags || '',
    
    // YouTube
    youtubeUrl: land?.youtubeUrl || '',
    
    // Timestamps
    createdAt: land?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [coverImage, setCoverImage] = React.useState(null)
  const [images, setImages] = React.useState([])
  const [errors, setErrors] = React.useState({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const listingTypes = [
    { value: 'sale', label: 'ขาย', icon: DollarSign },
    { value: 'rent', label: 'เช่า', icon: Calendar },
    { value: 'both', label: 'ขาย/เช่า', icon: Landmark }
  ]

  // Prefill when editing: map API fields (snake_case) to form fields (camelCase) and images
  React.useEffect(() => {
    if (isEditing && land) {
      console.log('LandForm - Prefilling data for editing:', land) // Debug log
      console.log('LandForm - youtube_url from API:', land.youtube_url) // Debug log
      setFormData(prev => ({
        ...prev,
        title: land.title || '',
        projectCode: land.project_code || '',
        announcerStatus: land.announcer_status || 'agent',
        status: land.status || 'sale',
        price: land.price !== undefined && land.price !== null ? String(land.price) : '',
        rentPrice: land.rent_price !== undefined && land.rent_price !== null ? String(land.rent_price) : '',
        landOwnership: land.land_ownership || 'thai',
        location: land.location || '',
        googleMapUrl: land.google_map_url || '',
        nearbyTransport: land.nearby_transport || '',
        propertyType: land.property_type || 'land',
        listingType: land.listing_type || 'sale',
        description: land.description || '',
        area: land.area !== undefined && land.area !== null ? String(land.area) : '',
        squareWa: land.square_wa !== undefined && land.square_wa !== null ? String(land.square_wa) : '',
        rai: land.rai !== undefined && land.rai !== null ? String(land.rai) : '',
        ngan: land.ngan !== undefined && land.ngan !== null ? String(land.ngan) : '',
        wah: land.wah !== undefined && land.wah !== null ? String(land.wah) : '',
        pricePerSqWa: land.price_per_sq_wa !== undefined && land.price_per_sq_wa !== null ? String(land.price_per_sq_wa) : '',
        view: land.view || '',
        unitNumber: land.unit_number || '',
        seoTags: land.seo_tags || '',
        youtubeUrl: land.youtube_url || land.youtubeUrl || '',

        createdAt: land.created_at || prev.createdAt,
        updatedAt: land.updated_at || new Date().toISOString()
      }))
      
      console.log('LandForm - formData.youtubeUrl after prefill:', formData.youtubeUrl) // Debug log

      // Set cover image
      const coverUrl = land.cover_image || null
      if (coverUrl) {
        setCoverImage({
          id: `cover-${Date.now()}`,
          preview: coverUrl,
          url: coverUrl,
          public_id: land.cover_public_id || undefined,
          uploading: false
        })
      } else {
        setCoverImage(null)
      }

      // Set gallery images (exclude cover if duplicated)
      const urls = Array.isArray(land.images) ? land.images : []
      const filtered = coverUrl ? urls.filter(u => u !== coverUrl) : urls
      const mappedImages = filtered.map((url, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        preview: url,
        url,
        public_id: undefined,
        uploading: false
      }))
      setImages(mappedImages)
    }
  }, [isEditing, land])

  // Generate auto project code (WS + ตัวเลข 7 หลัก)
  React.useEffect(() => {
    if (!isEditing && !formData.projectCode) {
      const timestamp = Date.now()
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      const code = `WS${timestamp.toString().slice(-4)}${randomNum}` // รหัส WS + ตัวเลข 7 หลัก
      setFormData(prev => ({ ...prev, projectCode: code }))
    }
  }, [isEditing])

  // คำนวณราคาต่อ ตร.วา อัตโนมัติจากราคาและขนาดที่ดิน (ไร่/งาน/วา หรือ ตร.วา รวม)
  const computeTotalSquareWa = () => {
    const manualSquareWa = parseFloat(formData.squareWa)
    const rai = parseFloat(formData.rai)
    const ngan = parseFloat(formData.ngan)
    const wah = parseFloat(formData.wah)

    if (!isNaN(manualSquareWa) && manualSquareWa > 0) return manualSquareWa

    const totalFromParts =
      (isNaN(rai) ? 0 : rai * 400) +
      (isNaN(ngan) ? 0 : ngan * 100) +
      (isNaN(wah) ? 0 : wah)

    return totalFromParts > 0 ? totalFromParts : 0
  }

  React.useEffect(() => {
    const totalSqWa = computeTotalSquareWa()
    if (totalSqWa > 0) {
      // คำนวณราคาต่อ ตร.วา
      let pricePerSqWa = 0
      let rentPricePerSqWa = 0

      const price = parseFloat(formData.price)
      const rent = parseFloat(formData.rentPrice)
      if (!isNaN(price) && price > 0) pricePerSqWa = parseFloat((price / totalSqWa).toFixed(2))
      if (!isNaN(rent) && rent > 0) rentPricePerSqWa = parseFloat((rent / totalSqWa).toFixed(2))

      // คำนวณราคาต่อ ตร.ม. (1 ตร.วา = 4 ตร.ม.)
      const pricePerSqm = pricePerSqWa > 0 ? parseFloat((pricePerSqWa / 4).toFixed(2)) : 0
      const rentPricePerSqm = rentPricePerSqWa > 0 ? parseFloat((rentPricePerSqWa / 4).toFixed(2)) : 0

      const next = { ...formData }
      if (pricePerSqWa > 0) next.pricePerSqWa = String(pricePerSqWa)
      if (pricePerSqm > 0) next.pricePerSqm = String(pricePerSqm)
      if (rentPricePerSqWa > 0) next.rentPricePerSqWa = String(rentPricePerSqWa)
      if (rentPricePerSqm > 0) next.rentPricePerSqm = String(rentPricePerSqm)
      setFormData(next)
    }
  }, [formData.price, formData.rentPrice, formData.status, formData.squareWa, formData.rai, formData.ngan, formData.wah])





  // Handle cover image upload (local preview only)
  const handleCoverImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 10MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
      return
    }

    try {
      // Upload to Cloudinary first
      const { uploadAPI } = await import('../../lib/api')
      const response = await uploadAPI.uploadSingle(file)
      
      if (response.success) {
        const imageData = {
          id: Date.now().toString(),
          preview: response.data.url,
          url: response.data.url,
          public_id: response.data.public_id,
          uploading: false
        }
        setCoverImage(imageData)
      } else {
        throw new Error(response.message || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading cover image:', error)
      alert(`อัปโหลดรูปภาพหน้าปกไม่สำเร็จ: ${error.message}`)
      
      // Fallback to local preview only
      const preview = URL.createObjectURL(file)
      setCoverImage({
        id: Date.now().toString(),
        preview: preview,
        file: file,
        isExisting: false,
      })
    }
  }

  // Handle multiple images upload (local preview only)
  const handleImagesUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (images.length + files.length > 15) {
      alert('สามารถอัพโหลดรูปภาพได้สูงสุด 15 รูป')
      return
    }
    
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 10MB: ' + file.name)
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น: ' + file.name)
        return
      }
    }
    
    try {
      // Upload to Cloudinary first
      const { uploadAPI } = await import('../../lib/api')
      const response = await uploadAPI.uploadMultiple(files)
      
      if (response.success) {
        const newImages = response.data.map((imageData, idx) => ({
          id: `${Date.now()}-${idx}`,
          preview: imageData.url,
          url: imageData.url,
          public_id: imageData.public_id,
          uploading: false,
        }))
        setImages(prev => [...prev, ...newImages])
      } else {
        throw new Error(response.message || 'Failed to upload images')
      }
    } catch (error) {
      console.error('Error uploading multiple images:', error)
      alert(`อัปโหลดรูปภาพไม่สำเร็จ: ${error.message}`)
      
      // Fallback to local preview only
      const newImages = files.map((file, idx) => ({
        id: `${Date.now()}-${idx}`,
        preview: URL.createObjectURL(file),
        file: file,
        isExisting: false,
      }))
      setImages(prev => [...prev, ...newImages])
    }
  }

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





  // Handle multiple image uploads
  const handleMultipleImageUpload = async (files) => {
    try {
      // Upload to Cloudinary first
      const { uploadAPI } = await import('../../lib/api')
      const response = await uploadAPI.uploadMultiple(files)
      
      if (response.success) {
        const newImages = response.data.map((imageData, idx) => ({
          id: `${Date.now()}-${idx}`,
          preview: imageData.url,
          url: imageData.url,
          public_id: imageData.public_id,
          uploading: false,
        }))
        setImages(prev => [...prev, ...newImages])
      } else {
        throw new Error(response.message || 'Failed to upload images')
      }
    } catch (error) {
      console.error('Error uploading multiple images:', error)
      alert(`อัปโหลดรูปภาพไม่สำเร็จ: ${error.message}`)
      
      // Fallback to local preview only
      const newImages = files.map((file, idx) => ({
        id: `${Date.now()}-${idx}`,
        preview: URL.createObjectURL(file),
        file: file,
        isExisting: false,
      }))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const handleImageUpload = async (file, isCover = false) => {
    try {
      // Upload to Cloudinary first
      const { uploadAPI } = await import('../../lib/api')
      const response = await uploadAPI.uploadSingle(file)
      
      if (response.success) {
        const imageData = {
          id: Date.now().toString(),
          preview: response.data.url,
          url: response.data.url,
          public_id: response.data.public_id,
          uploading: false
        }

        if (isCover) {
          setCoverImage(imageData)
        } else {
          setImages(prev => [...prev, imageData])
        }
      } else {
        throw new Error(response.message || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(`อัปโหลดรูปภาพไม่สำเร็จ: ${error.message}`)
      
      // Fallback to local preview only
      const preview = URL.createObjectURL(file)
      if (isCover) {
        setCoverImage({
          id: Date.now().toString(),
          preview: preview,
          file: file,
          isExisting: false,
        })
      } else {
        setImages(prev => [...prev, { 
          id: `${Date.now()}-${prev.length}`, 
          preview, 
          file,
          isExisting: false,
        }])
      }
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
    if (!formData.landOwnership) newErrors.landOwnership = 'กรุณาเลือกกรรมสิทธ์ที่ดิน'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    const payload = buildPayload()
    try {
      // Prepare images for API: separate cover and gallery
      const cover_image = coverImage?.url || coverImage?.preview || null
      const galleryImages = images.map(img => ({ url: img.url || img.preview, public_id: img.public_id }))

      const apiPayload = {
        title: payload.title,
        status: payload.status,
        price: payload.price,
        rent_price: payload.rentPrice,
        location: formData.location,
        google_map_url: formData.googleMapUrl,
        nearby_transport: formData.nearbyTransport,
        listing_type: formData.listingType,
        description: payload.description,
        area: payload.area,
        rai: payload.rai,
        ngan: payload.ngan,
        wah: payload.wah,
        square_wa: payload.squareWa,
        price_per_sq_wa: payload.pricePerSqWa,
        land_ownership: payload.landOwnership,
        view: payload.view,
        unit_number: payload.unitNumber,
        seo_tags: formData.seoTags,
        images: galleryImages,
        cover_image,
      }

      const { landAPI } = await import('../../lib/api')
      if (isEditing && land?.id) {
        await landAPI.update(land.id, apiPayload)
      } else {
        await landAPI.create(apiPayload)
      }

      if (onSave) onSave(apiPayload)
      if (onBack) onBack()
    } catch (err) {
      console.error('Save land failed:', err)
      alert(err.message || 'บันทึกไม่สำเร็จ')
    } finally {
      setIsSubmitting(false)
    }
  }

  const buildPayload = () => {
    return {
      title: formData.title,
      description: formData.description,
      type: 'land',
      status: formData.status,
      price: formData.price ? Number(formData.price) : 0,
      rentPrice: formData.rentPrice ? Number(formData.rentPrice) : 0,
      area: Number(formData.area) || 0,
      squareWa: Number(formData.squareWa || 0),
      rai: Number(formData.rai || 0),
      ngan: Number(formData.ngan || 0),
      wah: Number(formData.wah || 0),
      landOwnership: formData.landOwnership,
      address: formData.address,
      district: formData.district,
      province: formData.province,
      postalCode: formData.postalCode,
      location: [formData.district, formData.province].filter(Boolean).join(', '),
      notes: formData.notes,
      pricePerSqWa: formData.pricePerSqWa ? Number(formData.pricePerSqWa) : 0,
      view: formData.view,
      unitNumber: formData.unitNumber,
      coverImage: coverImage || null,
      images: images,
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
              {isEditing ? 'แก้ไขข้อมูลที่ดิน' : 'เพิ่มที่ดินใหม่'}
            </h1>
            <p className="text-gray-600 font-prompt mt-1">
              กรอกข้อมูลที่ดินให้ครบถ้วน
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">


        {/* ข้อมูลพื้นฐาน */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Landmark className="h-6 w-6 mr-3 text-blue-600" />
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
                placeholder="เช่น ที่ดินรามคำแหง พร้อมสร้างบ้าน"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* รหัสโครงการ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                รหัสโครงการ (WS + ตัวเลข 7 หลัก)
              </label>
              <Input
                value={formData.projectCode}
                readOnly
                className="bg-gray-100"
                placeholder="สร้างอัตโนมัติ"
              />
            </div>

            {/* สถานะผู้ประกาศ */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3 font-prompt flex items-center">
                <User className="h-5 w-5 mr-2 text-red-500" />
                สถานะผู้ประกาศ *
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {[
                  { value: 'owner', label: 'เจ้าของ (Owner)', color: 'from-orange-500 to-orange-600', borderColor: 'border-orange-500', bgColor: 'bg-orange-50' },
                  { value: 'agent', label: 'นายหน้า (Agent)', color: 'from-green-500 to-green-600', borderColor: 'border-green-500', bgColor: 'bg-green-50' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('announcerStatus', option.value)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 font-medium group hover:shadow-lg hover:scale-105 ${
                      formData.announcerStatus === option.value
                        ? `${option.borderColor} bg-gradient-to-r ${option.color} text-white shadow-lg transform scale-105`
                        : `${option.bgColor} text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md`
                    }`}
                  >
                    <div className="p-3 flex items-center justify-center space-x-2">
                      <div className={`p-1.5 rounded-full transition-all duration-300 ${
                        formData.announcerStatus === option.value 
                          ? 'bg-white/20 scale-110' 
                          : 'bg-white/80 group-hover:bg-white group-hover:scale-110'
                      }`}>
                        <User className={`h-4 w-4 ${
                          formData.announcerStatus === option.value ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className="text-sm font-semibold">{option.label}</span>
                    </div>
                    {formData.announcerStatus === option.value && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-white rounded-full shadow-sm animate-pulse"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2 font-prompt">
                เลือกสถานะของผู้ประกาศ: เจ้าของที่ดิน หรือ นายหน้าอสังหาริมทรัพย์
              </p>
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
              <label className="block text-sm font-medium text-gray-700 mb-3 font-prompt">
                สถานะ * (เลือกประเภท เช่า หรือ ขาย)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'sale', label: 'ขาย', icon: DollarSign, color: 'from-green-500 to-green-600', borderColor: 'border-green-500', bgColor: 'bg-green-50' },
                  { value: 'rent', label: 'เช่า', icon: Calendar, color: 'from-blue-500 to-blue-600', borderColor: 'border-blue-500', bgColor: 'bg-blue-50' },
                  { value: 'both', label: 'ขายและเช่า', icon: Landmark, color: 'from-purple-500 to-purple-600', borderColor: 'border-purple-500', bgColor: 'bg-purple-50' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('status', option.value)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 font-medium group hover:shadow-lg hover:scale-105 ${
                      formData.status === option.value
                        ? `${option.borderColor} bg-gradient-to-r ${option.color} text-white shadow-lg transform scale-105`
                        : `${option.bgColor} text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md`
                    }`}
                  >
                    <div className="p-3 flex items-center justify-center space-x-2">
                      <div className={`p-1.5 rounded-full transition-all duration-300 ${
                        formData.status === option.value 
                          ? 'bg-white/20 scale-110' 
                          : 'bg-white/80 group-hover:bg-white group-hover:scale-110'
                      }`}>
                        <option.icon className={`h-4 w-4 ${
                          formData.status === option.value ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className="text-sm font-semibold">{option.label}</span>
                    </div>
                    {formData.status === option.value && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-white rounded-full shadow-sm animate-pulse"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
            </div>

            {/* ประเภททรัพย์ */}
            <div>
              <label className="block text-sm font-medium text-gray-3 font-prompt">
                ประเภททรัพย์ *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'land', label: 'ที่ดินเปล่า', icon: Landmark, color: 'from-orange-500 to-orange-600', borderColor: 'border-orange-500', bgColor: 'bg-orange-50' },
                  { value: 'land_with_building', label: 'ที่ดินพร้อมสิ่งปลูกสร้าง', icon: Landmark, color: 'from-blue-500 to-blue-600', borderColor: 'border-blue-500', bgColor: 'bg-blue-50' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('propertyType', option.value)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 font-medium group hover:shadow-lg hover:scale-105 ${
                      formData.propertyType === option.value
                        ? `${option.borderColor} bg-gradient-to-r ${option.color} text-white shadow-lg transform scale-105`
                        : `${option.bgColor} text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md`
                    }`}
                  >
                    <div className="p-3 flex items-center justify-center space-x-2">
                      <div className={`p-1.5 rounded-full transition-all duration-300 ${
                        formData.propertyType === option.value 
                          ? 'bg-white/80 scale-110' 
                          : 'bg-white/80 group-hover:bg-white group-hover:scale-110'
                      }`}>
                        <option.icon className={`h-4 w-4 ${
                          formData.propertyType === option.value ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className="text-sm font-semibold">{option.label}</span>
                    </div>
                    {formData.propertyType === option.value && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-white rounded-full shadow-sm animate-pulse"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
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

            {/* กรรมสิทธ์ที่ดิน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                กรรมสิทธ์ที่ดิน *
              </label>
              <select
                value={formData.landOwnership}
                onChange={(e) => handleInputChange('landOwnership', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="thai">สัญชาติไทย</option>
                <option value="foreign">สัญชาติไทย/ต่างชาติ</option>
              </select>
              {errors.landOwnership && <p className="text-red-500 text-sm mt-1">{errors.landOwnership}</p>}
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
              placeholder="อธิบายรายละเอียดของที่ดิน เช่น สภาพหน้าที่ การตกแต่ง สิ่งอำนวยความสะดวก..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </Card>

        {/* ข้อมูลอสังหาริมทรัพย์ */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Landmark className="h-6 w-6 mr-3 text-blue-600" />
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

            {/* ตารางวา */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ตารางวา
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.squareWa}
                  onChange={(e) => handleInputChange('squareWa', e.target.value)}
                  placeholder="เช่น 25.5"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ตารางวา</span>
                </div>
              </div>
            </div>

            {/* ไร่ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ไร่
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  value={formData.rai}
                  onChange={(e) => handleInputChange('rai', e.target.value)}
                  placeholder="เช่น 2"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">ไร่</span>
                </div>
              </div>
            </div>

            {/* งาน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                งาน
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  value={formData.ngan}
                  onChange={(e) => handleInputChange('ngan', e.target.value)}
                  placeholder="เช่น 1"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">งาน</span>
                </div>
              </div>
            </div>

            {/* วา */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                วา
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.wah}
                  onChange={(e) => handleInputChange('wah', e.target.value)}
                  placeholder="เช่น 50.5"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">วา</span>
                </div>
              </div>
            </div>

            {/* ราคาขายต่อ ตร.ม. */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคาขายต่อ ตร.ม. (คำนวณอัตโนมัติ)
              </label>
              <div className="relative">
                <Input
                  value={formData.pricePerSqm ? `฿${parseFloat(formData.pricePerSqm).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /ตร.ม.` : ''}
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
                    ✅ คำนวณจากราคาขาย = ฿{parseFloat(formData.pricePerSqm).toLocaleString('th-TH')} /ตร.ม.
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
                  value={formData.rentPricePerSqm ? `฿${parseFloat(formData.rentPricePerSqm).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /ตร.ม./เดือน` : ''}
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

            {/* เลขที่ยูนิต */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                เลขที่ยูนิต
              </label>
              <Input
                value={formData.unitNumber}
                onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                placeholder="เช่น A-101 หรือ 15/123"
              />
            </div>

            {/* ราคาต่อ sq.wa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคาต่อ sq.wa
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.pricePerSqWa}
                  onChange={(e) => handleInputChange('pricePerSqWa', e.target.value)}
                  placeholder="เช่น 50000"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">฿/sq.wa</span>
                </div>
              </div>
            </div>

            {/* วิวที่มองเห็น */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                วิวที่มองเห็น
              </label>
              <Input
                value={formData.view}
                onChange={(e) => handleInputChange('view', e.target.value)}
                placeholder="เช่น วิวเมือง, วิวแม่น้ำ, วิวภูเขา, วิวทะเล"
              />
            </div>
          </div>
        </Card>

        {/* SEO Tag และ YouTube */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 font-prompt flex items-center">
            <Search className="h-6 w-6 mr-3 text-blue-600" />
            SEO Tag และ YouTube
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SEO Tag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                SEO Tag
              </label>
              <Input
                value={formData.seoTags}
                onChange={(e) => handleInputChange('seoTags', e.target.value)}
                placeholder="เช่น ที่ดิน, รามคำแหง, ลุมพินี, ขาย, เช่า"
              />
              <p className="text-sm text-gray-500 mt-1">ช่องให้กรอก tag สำหรับ SEO (แยกแท็กด้วยเครื่องหมายจุลภาค)</p>
            </div>

            {/* ลิงก์ YouTube */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt flex items-center">
                <svg className="h-5 w-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                ลิงก์ YouTube
              </label>
              <Input
                value={formData.youtubeUrl}
                onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                placeholder="เช่น https://www.youtube.com/watch?v=..."
                className="focus:ring-red-500 focus:border-red-500"
              />
              <p className="text-sm text-gray-500 mt-1">ลิงก์วิดีโอ YouTube สำหรับแสดงในหน้ารายละเอียด</p>
            </div>
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
                    onChange={handleCoverImageUpload}
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
                onChange={handleImagesUpload}
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
                      src={image.preview}
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
                    
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {/* {uploadProgress > 0 && ( // Removed as per new_code
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )} */}
          
          {/* {images.length > 0 && ( // Removed as per new_code
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
          )} */}
          
          {/* {uploadProgress > 0 && ( // Removed as per new_code
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )} */}
          
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
            disabled={isSubmitting}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
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

export default LandForm