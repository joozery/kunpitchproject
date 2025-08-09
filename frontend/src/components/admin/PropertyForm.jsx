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
  DollarSign, 
  Home, 
  Building2, 
  Landmark,
  Store,
  Calendar,
  FileText,
  Image,
  Plus,
  Save,
  ArrowLeft,
  Star
} from 'lucide-react'

const PropertyForm = ({ property = null, onBack, onSave, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    type: property?.type || 'residential',
    status: property?.status || 'available',
    price: property?.price?.toString() || '',
    rentPrice: property?.rent_price?.toString() || '',
    area: property?.area?.toString() || '',
    bedrooms: property?.bedrooms?.toString() || '',
    bathrooms: property?.bathrooms?.toString() || '',
    parking: property?.parking?.toString() || '',
    address: property?.address || '',
    district: property?.district || '',
    province: property?.province || '',
    postalCode: property?.postal_code || '',
    features: property?.features ? (typeof property.features === 'string' ? JSON.parse(property.features) : property.features) : [],
    amenities: property?.amenities ? (typeof property.amenities === 'string' ? JSON.parse(property.amenities) : property.amenities) : [],
    contactName: property?.contact_name || '',
    contactPhone: property?.contact_phone || '',
    contactEmail: property?.contact_email || '',
    notes: property?.notes || ''
  })

  const [coverImage, setCoverImage] = useState(null)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load existing images when editing
  useEffect(() => {
    if (isEditing && property && property.images && property.images.length > 0) {
      // Find cover image (first image or one marked as cover)
      const coverImageUrl = property.images[0]
      if (coverImageUrl) {
        setCoverImage({
          id: 'existing-cover',
          url: coverImageUrl,
          preview: coverImageUrl,
          publicId: null, // Will be handled by backend
          uploading: false,
          isExisting: true
        })
      }

      // Load additional images (skip first one as it's the cover)
      if (property.images.length > 1) {
        const additionalImages = property.images.slice(1).map((imageUrl, index) => ({
          id: `existing-${index}`,
          url: imageUrl,
          preview: imageUrl,
          publicId: null, // Will be handled by backend
          uploading: false,
          isExisting: true
        }))
        setImages(additionalImages)
      }
    }
  }, [isEditing, property])

  const propertyTypes = [
    { value: 'residential', label: 'ที่อยู่อาศัย', icon: Home },
    { value: 'commercial', label: 'เชิงพาณิชย์', icon: Store },
    { value: 'land', label: 'ที่ดิน', icon: Landmark }
  ]

  const propertyStatus = [
    { value: 'available', label: 'พร้อมขาย/เช่า' },
    { value: 'sold', label: 'ขายแล้ว' },
    { value: 'rented', label: 'เช่าแล้ว' },
    { value: 'pending', label: 'รอการยืนยัน' }
  ]

  const commonFeatures = [
    'สระว่ายน้ำ', 'ฟิตเนส', 'สวนสาธารณะ', 'ลิฟต์', 'ที่จอดรถ', 
    'ระบบรักษาความปลอดภัย', 'CCTV', 'สวนหย่อม', 'ห้องซักรีด',
    'ห้องเก็บของ', 'ระเบียง', 'ห้องครัว', 'ห้องนั่งเล่น'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleCoverImageUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
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
        setUploading(true)
        
        // Upload to Cloudinary via our API
        const result = await uploadAPI.uploadSingle(file)
        
        if (result.success) {
          const newCoverImage = {
            id: Date.now(),
            file,
            preview: result.data.url,
            url: result.data.url,
            publicId: result.data.public_id,
            uploading: false
          }
          
          setCoverImage(newCoverImage)
          
          // Clear cover image error if it exists
          if (errors.coverImage) {
            setErrors(prev => ({
              ...prev,
              coverImage: ''
            }))
          }
        } else {
          throw new Error(result.message || 'Upload failed')
        }
      } catch (error) {
        console.error('Cover image upload failed:', error)
        alert('ไม่สามารถอัปโหลดรูปภาพหน้าปกได้: ' + error.message)
      } finally {
        setUploading(false)
      }
    }
  }

  const removeCoverImage = () => {
    if (coverImage) {
      URL.revokeObjectURL(coverImage.preview)
      setCoverImage(null)
    }
  }

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files)
    
    if (images.length + files.length > 10) {
      alert('สามารถอัพโหลดรูปภาพได้สูงสุด 10 รูป')
      return
    }

    // Validate each file
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
      setUploading(true)
      
      // Upload multiple images to Cloudinary via our API
      const result = await uploadAPI.uploadMultiple(files)
      
      if (result.success) {
        const newImages = result.data.map((uploadResult, index) => ({
          id: Date.now() + index,
          file: files[index],
          preview: uploadResult.url,
          url: uploadResult.url,
          publicId: uploadResult.public_id,
          uploading: false
        }))

        setImages(prev => [...prev, ...newImages])
      } else {
        throw new Error(result.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Images upload failed:', error)
      alert('ไม่สามารถอัปโหลดรูปภาพได้: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (imageId) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return prev.filter(img => img.id !== imageId)
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'กรุณากรอกชื่อ Property'
    if (!formData.price.trim()) newErrors.price = 'กรุณากรอกราคา'
    if (!formData.address.trim()) newErrors.address = 'กรุณากรอกที่อยู่'
    if (!formData.contactName.trim()) newErrors.contactName = 'กรุณากรอกชื่อผู้ติดต่อ'
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'กรุณากรอกเบอร์โทรศัพท์'
    if (!coverImage) newErrors.coverImage = 'กรุณาเลือกรูปภาพหน้าปก'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      
      // Prepare property data for API
      const propertyData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        price: parseFloat(formData.price),
        rentPrice: formData.rentPrice ? parseFloat(formData.rentPrice) : 0,
        area: formData.area ? parseFloat(formData.area) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
        parking: formData.parking ? parseInt(formData.parking) : 0,
        address: formData.address,
        district: formData.district,
        province: formData.province,
        postalCode: formData.postalCode,
        location: `${formData.district}, ${formData.province}`,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        notes: formData.notes,
        features: JSON.stringify(formData.features),
        amenities: JSON.stringify(formData.amenities),
        // Add uploaded images data
        coverImageUrl: coverImage ? coverImage.url : null,
        coverImagePublicId: coverImage && !coverImage.isExisting ? coverImage.publicId : null,
        imageUrls: images.map(img => img.url),
        imagePublicIds: images.map(img => !img.isExisting ? img.publicId : null).filter(Boolean)
      }

      // Create or update property via API
      const result = isEditing 
        ? await propertyAPI.update(property.id, propertyData)
        : await propertyAPI.create(propertyData)
      
      if (result.success) {
        alert(isEditing ? 'แก้ไข Property สำเร็จ!' : 'บันทึก Property สำเร็จ!')
        onSave(result.data)
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึก: ' + result.message)
      }
    } catch (error) {
      console.error('Submit failed:', error)
      alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>กลับ</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-prompt">
              {isEditing ? 'แก้ไข Property' : 'เพิ่ม Property ใหม่'}
            </h1>
            <p className="text-gray-600 mt-1 font-prompt">
              {isEditing ? 'แก้ไขข้อมูล Property' : 'กรอกข้อมูล Property เพื่อเพิ่มเข้าระบบ'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 font-prompt">ข้อมูลพื้นฐาน</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ชื่อ Property *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="กรอกชื่อ Property"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 font-prompt">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ประเภท Property *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.isArray(propertyTypes) && propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                สถานะ *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.isArray(propertyStatus) && propertyStatus.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคา (บาท) *
              </label>
              <Input
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="กรอกราคา"
                type="number"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1 font-prompt">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ราคาเช่า (บาท/เดือน)
              </label>
              <Input
                value={formData.rentPrice}
                onChange={(e) => handleInputChange('rentPrice', e.target.value)}
                placeholder="กรอกราคาเช่า"
                type="number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                พื้นที่ (ตร.ม.)
              </label>
              <Input
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                placeholder="กรอกพื้นที่"
                type="number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ห้องนอน
              </label>
              <Input
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                placeholder="จำนวนห้องนอน"
                type="number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ห้องน้ำ
              </label>
              <Input
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                placeholder="จำนวนห้องน้ำ"
                type="number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ที่จอดรถ
              </label>
              <Input
                value={formData.parking}
                onChange={(e) => handleInputChange('parking', e.target.value)}
                placeholder="จำนวนที่จอดรถ"
                type="number"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
              คำอธิบาย
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="อธิบายรายละเอียด Property..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </Card>

        {/* Cover Image */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Star className="h-5 w-5 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-900 font-prompt">รูปภาพหน้าปก *</h2>
          </div>
          
          <div className="space-y-4">
            {!coverImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2 font-prompt">เลือกรูปภาพหน้าปกสำหรับ Property</p>
                <p className="text-sm text-gray-500 font-prompt">แนะนำขนาด 1200x800 pixels</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="hidden"
                  id="cover-image-upload"
                />
                <label htmlFor="cover-image-upload" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  เลือกรูปภาพหน้าปก
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={coverImage.preview}
                  alt="Cover"
                  className="w-full h-64 object-cover rounded-lg"
                />
                {coverImage.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  หน้าปก
                </div>
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {errors.coverImage && (
              <p className="text-red-500 text-sm font-prompt">{errors.coverImage}</p>
            )}
          </div>
        </Card>

        {/* Address Information */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 font-prompt">ข้อมูลที่อยู่</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ที่อยู่ *
              </label>
              <Input
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="กรอกที่อยู่"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1 font-prompt">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                เขต/อำเภอ
              </label>
              <Input
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                placeholder="กรอกเขต/อำเภอ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                จังหวัด
              </label>
              <Input
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                placeholder="กรอกจังหวัด"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                รหัสไปรษณีย์
              </label>
              <Input
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="กรอกรหัสไปรษณีย์"
              />
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 font-prompt">สิ่งอำนวยความสะดวก</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Array.isArray(commonFeatures) && commonFeatures.map(feature => (
              <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 font-prompt">{feature}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Images Upload */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Image className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 font-prompt">รูปภาพเพิ่มเติม</h2>
          </div>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2 font-prompt">ลากไฟล์มาที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              <p className="text-sm text-gray-500 font-prompt">รองรับ JPG, PNG, GIF (สูงสุด 10 รูป)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                เลือกรูปภาพเพิ่มเติม
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.isArray(images) && images.map(image => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt="Property"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 font-prompt">ข้อมูลผู้ติดต่อ</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                ชื่อผู้ติดต่อ *
              </label>
              <Input
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                placeholder="กรอกชื่อผู้ติดต่อ"
                className={errors.contactName ? 'border-red-500' : ''}
              />
              {errors.contactName && (
                <p className="text-red-500 text-sm mt-1 font-prompt">{errors.contactName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                เบอร์โทรศัพท์ *
              </label>
              <Input
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="กรอกเบอร์โทรศัพท์"
                className={errors.contactPhone ? 'border-red-500' : ''}
              />
              {errors.contactPhone && (
                <p className="text-red-500 text-sm mt-1 font-prompt">{errors.contactPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
                อีเมล
              </label>
              <Input
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="กรอกอีเมล"
                type="email"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-prompt">
              หมายเหตุเพิ่มเติม
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="หมายเหตุเพิ่มเติม..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6"
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            className="px-6 bg-blue-600 hover:bg-blue-700"
            disabled={uploading || isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'กำลังบันทึก...' : (isEditing ? 'บันทึกการแก้ไข' : 'บันทึก Property')}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

export default PropertyForm 