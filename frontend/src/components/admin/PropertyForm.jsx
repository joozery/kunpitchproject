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

  // ข้อมูลสถานีรถไฟฟ้า BTS
  const btsStations = [
    { id: 'kheha', name: 'BTS Kheha (เคหะฯ)', line: 'BTS' },
    { id: 'phraek_sa', name: 'BTS Phraek Sa (แพรกษา)', line: 'BTS' },
    { id: 'sai_luat', name: 'BTS Sai Luat (สายลวด)', line: 'BTS' },
    { id: 'chang_erawan', name: 'BTS Chang Erawan (ช้างเอราวัณ)', line: 'BTS' },
    { id: 'pu_chao', name: 'BTS Pu Chao (ปู่เจ้า)', line: 'BTS' },
    { id: 'samrong', name: 'BTS Samrong (สำโรง)', line: 'BTS' },
    { id: 'bearing', name: 'BTS Bearing (แบริ่ง)', line: 'BTS' },
    { id: 'udom_suk', name: 'BTS Udom Suk (อุดมสุข)', line: 'BTS' },
    { id: 'bang_na', name: 'BTS Bang Na (บางนา)', line: 'BTS' },
    { id: 'punnawithi', name: 'BTS Punnawithi (ปุณณวิถี)', line: 'BTS' },
    { id: 'bang_chak', name: 'BTS Bang Chak (บางจาก)', line: 'BTS' },
    { id: 'on_nut', name: 'BTS On Nut (อ่อนนุช)', line: 'BTS' },
    { id: 'phra_khanong', name: 'BTS Phra Khanong (พระโขนง)', line: 'BTS' },
    { id: 'ekkamai', name: 'BTS Ekkamai (เอกมัย)', line: 'BTS' },
    { id: 'thong_lor', name: 'BTS Thong Lo (ทองหล่อ)', line: 'BTS' },
    { id: 'phrom_phong', name: 'BTS Phrom Phong (พร้อมพงษ์)', line: 'BTS' },
    { id: 'asok', name: 'BTS Asok (อโศก)', line: 'BTS' },
    { id: 'nana', name: 'BTS Nana (นานา)', line: 'BTS' },
    { id: 'phloen_chit', name: 'BTS Phloen Chit (เพลินจิต)', line: 'BTS' },
    { id: 'chit_lom', name: 'BTS Chit Lom (ชิดลม)', line: 'BTS' },
    { id: 'siam', name: 'BTS Siam (สยาม)', line: 'BTS' },
    { id: 'ratchathewi', name: 'BTS Ratchathewi (ราชเทวี)', line: 'BTS' },
    { id: 'phaya_thai', name: 'BTS Phaya Thai (พญาไท)', line: 'BTS' },
    { id: 'victory_monument', name: 'BTS Victory Monument (อนุสาวรีย์ชัยสมรภูมิ)', line: 'BTS' },
    { id: 'sanam_pao', name: 'BTS Sanam Pao (สนามเป้า)', line: 'BTS' },
    { id: 'ari', name: 'BTS Ari (อารีย์)', line: 'BTS' },
    { id: 'saphan_khwai', name: 'BTS Saphan Khwai (สะพานควาย)', line: 'BTS' },
    { id: 'mo_chit', name: 'BTS Mo Chit (หมอชิต)', line: 'BTS' },
    { id: 'ha_yaek_lat_phrao', name: 'BTS Ha Yaek Lat Phrao (ห้าแยกลาดพร้าว)', line: 'BTS' },
    // BTS Silom Line
    { id: 'national_stadium', name: 'BTS National Stadium (สนามกีฬาแห่งชาติ)', line: 'BTS' },
    { id: 'ratchadamri', name: 'BTS Ratchadamri (ราชดำริ)', line: 'BTS' },
    { id: 'sala_daeng', name: 'BTS Sala Daeng (ศาลาแดง)', line: 'BTS' },
    { id: 'chong_nonsi', name: 'BTS Chong Nonsi (ช่องนนทรี)', line: 'BTS' },
    { id: 'saint_louis', name: 'BTS Saint Louis (เซนต์หลุยส์)', line: 'BTS' },
    { id: 'surasak', name: 'BTS Surasak (สุรศักดิ์)', line: 'BTS' },
    { id: 'saphan_taksin', name: 'BTS Saphan Taksin (สะพานตากสิน)', line: 'BTS' },
    { id: 'krung_thon_buri', name: 'BTS Krung Thon Buri (กรุงธนบุรี)', line: 'BTS' },
    { id: 'wongwian_yai', name: 'BTS Wongwian Yai (วงเวียนใหญ่)', line: 'BTS' },
    { id: 'pho_nimit', name: 'BTS Pho Nimit (โพธิ์นิมิตร)', line: 'BTS' },
    { id: 'talat_phlu', name: 'BTS Talat Phlu (ตลาดพลู)', line: 'BTS' },
    { id: 'wutthakat', name: 'BTS Wutthakat (วุฒากาศ)', line: 'BTS' },
    { id: 'bang_wa', name: 'BTS Bang Wa (บางหว้า)', line: 'BTS' },
    { id: 'royal_thai_naval_academy', name: 'BTS Royal Thai Naval Academy (โรงเรียนนายเรือ)', line: 'BTS' },
    { id: 'pak_nam', name: 'BTS Pak Nam (ปากน้ำ)', line: 'BTS' },
    { id: 'srinakarin', name: 'BTS Srinakarin (ศรีนครินทร์)', line: 'BTS' }
  ]

  // ข้อมูลสถานีรถไฟฟ้า MRT
  const mrtStations = [
    { id: 'tha_phra', name: 'MRT Tha Phra (ท่าพระ)', line: 'MRT' },
    { id: 'charan_13', name: 'MRT Charan 13 (จรัญฯ 13)', line: 'MRT' },
    { id: 'fai_chai', name: 'MRT Fai Chai (ไฟฉาย)', line: 'MRT' },
    { id: 'bang_khun_non', name: 'MRT Bang Khun Non (บางขุนนนท์)', line: 'MRT' },
    { id: 'bang_yi_khan', name: 'MRT Bang Yi Khan (บางยี่ขัน)', line: 'MRT' },
    { id: 'sirindhorn', name: 'MRT Sirindhorn (สิรินธร)', line: 'MRT' },
    { id: 'bang_phlat', name: 'MRT Bang Phlat (บางพลัด)', line: 'MRT' },
    { id: 'bang_o', name: 'MRT Bang O (บางอ้อ)', line: 'MRT' },
    { id: 'bang_pho', name: 'MRT Bang Pho (บางโพ)', line: 'MRT' },
    { id: 'tao_pun', name: 'MRT Tao Pun (เตาปูน)', line: 'MRT' },
    { id: 'bang_sue', name: 'MRT Bang Sue (บางซื่อ)', line: 'MRT' },
    { id: 'kamphaeng_phet', name: 'MRT Kamphaeng Phet (กำแพงเพชร)', line: 'MRT' },
    { id: 'chatuchak_park', name: 'MRT Chatuchak Park (สวนจตุจักร)', line: 'MRT' },
    { id: 'phahon_yothin', name: 'MRT Phahon Yothin (พหลโยธิน)', line: 'MRT' },
    { id: 'lat_phrao', name: 'MRT Lat Phrao (ลาดพร้าว)', line: 'MRT' },
    { id: 'ratchadaphisek', name: 'MRT Ratchadaphisek (รัชดาภิเษก)', line: 'MRT' },
    { id: 'sutthisan', name: 'MRT Sutthisan (สุทธิสาร)', line: 'MRT' },
    { id: 'huai_kwang', name: 'MRT Huai Khwang (ห้วยขวาง)', line: 'MRT' },
    { id: 'thailand_cultural_centre', name: 'MRT Thailand Cultural Centre (ศูนย์วัฒนธรรมแห่งประเทศไทย)', line: 'MRT' },
    { id: 'phra_ram_9', name: 'MRT Phra Ram 9 (พระราม 9)', line: 'MRT' },
    { id: 'phetchaburi', name: 'MRT Phetchaburi (เพชรบุรี)', line: 'MRT' },
    { id: 'sukhumvit', name: 'MRT Sukhumvit (สุขุมวิท)', line: 'MRT' },
    { id: 'queen_sirikit_national_convention_centre', name: 'MRT Queen Sirikit National Convention Centre (ศูนย์การประชุมแห่งชาติสิริกิติ์)', line: 'MRT' },
    { id: 'khlong_toei', name: 'MRT Khlong Toei (คลองเตย)', line: 'MRT' },
    { id: 'lumphini', name: 'MRT Lumphini (ลุมพินี)', line: 'MRT' },
    { id: 'silom', name: 'MRT Silom (สีลม)', line: 'MRT' },
    { id: 'sam_yan', name: 'MRT Sam Yan (สามย่าน)', line: 'MRT' },
    { id: 'hua_lamphong', name: 'MRT Hua Lamphong (หัวลำโพง)', line: 'MRT' },
    { id: 'wat_mangkon', name: 'MRT Wat Mangkon (วัดมังกร)', line: 'MRT' },
    { id: 'sam_yot', name: 'MRT Sam Yot (สามยอด)', line: 'MRT' },
    { id: 'sanam_chai', name: 'MRT Sanam Chai (สนามไชย)', line: 'MRT' },
    { id: 'itsaraphap', name: 'MRT Itsaraphap (อิสรภาพ)', line: 'MRT' },
    { id: 'phetkasem_48', name: 'MRT Phetkasem 48 (เพชรเกษม 48)', line: 'MRT' },
    { id: 'phasi_charoen', name: 'MRT Phasi Charoen (ภาษีเจริญ)', line: 'MRT' },
    { id: 'bang_khae', name: 'MRT Bang Khae (บางแค)', line: 'MRT' },
    { id: 'lak_song', name: 'MRT Lak Song (หลักสอง)', line: 'MRT' },
    { id: 'khlong_bang_phai', name: 'MRT Khlong Bang Phai (คลองบางไผ่)', line: 'MRT' },
    { id: 'talad_bang_yai', name: 'MRT Talad Bang Yai (ตลาดบางใหญ่)', line: 'MRT' },
    { id: 'sam_yaek_bang_yai', name: 'MRT Sam Yaek Bang Yai (สามแยกบางใหญ่)', line: 'MRT' },
    { id: 'bang_phlu', name: 'MRT Bang Phlu (บางพลู)', line: 'MRT' },
    { id: 'bang_rak_yai', name: 'MRT Bang Rak Yai (บางรักใหญ่)', line: 'MRT' },
    { id: 'bang_rak_noi_tha_it', name: 'MRT Bang Rak Noi-Tha It (บางรักน้อย-ท่าอิฐ)', line: 'MRT' },
    { id: 'sai_ma', name: 'MRT Sai Ma (ไทรม้า)', line: 'MRT' },
    { id: 'phra_nang_klao_bridge', name: 'MRT Phra Nang Klao Bridge (สะพานพระนั่งเกล้า)', line: 'MRT' },
    { id: 'yaek_nonthaburi_1', name: 'MRT Yaek Nonthaburi 1 (แยกนนทบุรี 1)', line: 'MRT' },
    { id: 'bang_kraso', name: 'MRT Bang Kraso (บางกระสอ)', line: 'MRT' },
    { id: 'nonthaburi_civic_centre', name: 'MRT Nonthaburi Civic Centre (ศูนย์ราชการนนทบุรี)', line: 'MRT' },
    { id: 'ministry_of_public_health', name: 'MRT Ministry of Public Health (กระทรวงสาธารณสุข)', line: 'MRT' },
    { id: 'yaek_tiwanon', name: 'MRT Yaek Tiwanon (แยกติวานนท์)', line: 'MRT' },
    { id: 'wong_sawang', name: 'MRT Wong Sawang (วงศ์สว่าง)', line: 'MRT' },
    { id: 'bang_son', name: 'MRT Bang Son (บางซ่อน)', line: 'MRT' },
    { id: 'parliament_house', name: 'MRT Parliament House (รัฐสภา)', line: 'MRT' },
    { id: 'sri_yan', name: 'MRT Sri Yan (ศรีย่าน)', line: 'MRT' },
    { id: 'vachiraphayaban', name: 'MRT Vachiraphayaban (วชิรพยาบาล)', line: 'MRT' },
    { id: 'national_library', name: 'MRT National Library (หอสมุดแห่งชาติ)', line: 'MRT' },
    { id: 'bang_khun_phrom', name: 'MRT Bang Khun Phrom (บางขุนพรหม)', line: 'MRT' },
    { id: 'democracy_monument', name: 'MRT Democracy Monument (อนุสาวรีย์ประชาธิปไตย)', line: 'MRT' },
    { id: 'saphan_phut', name: 'MRT Saphan Phut (สะพานพุทธฯ)', line: 'MRT' },
    { id: 'sao_ching_cha', name: 'MRT Sao Ching Cha (เสาชิงช้า)', line: 'MRT' },
    { id: 'wat_pho', name: 'MRT Wat Pho (วัดโพธิ์)', line: 'MRT' },
    { id: 'dao_khanong', name: 'MRT Dao Khanong (ดาวคะนอง)', line: 'MRT' },
    { id: 'bang_pakaeo', name: 'MRT Bang Pakaeo (บางปะแก้ว)', line: 'MRT' },
    { id: 'bang_pakok', name: 'MRT Bang Pakok (บางปะกอก)', line: 'MRT' },
    { id: 'yaek_pracha_uthit', name: 'MRT Yaek Pracha Uthit (แยกประชาอุทิศ)', line: 'MRT' },
    { id: 'rat_burana', name: 'MRT Rat Burana (ราษฎร์บูรณะ)', line: 'MRT' },
    { id: 'charoen_nakhon', name: 'MRT Charoen Nakhon (เจริญนคร)', line: 'MRT' },
    { id: 'khlong_san', name: 'MRT Khlong San (คลองสาน)', line: 'MRT' },
    { id: 'bang_phai', name: 'MRT Bang Phai (บางไผ่)', line: 'MRT' },
    { id: 'bang_wa_mrt', name: 'MRT Bang Wa (บางหว้า)', line: 'MRT' },
    { id: 'phawana', name: 'MRT Phawana (ภาวนา)', line: 'MRT' },
    { id: 'chok_chai_4', name: 'MRT Chok Chai 4 (โชคชัย 4)', line: 'MRT' },
    { id: 'lat_phrao_71', name: 'MRT Lat Phrao 71 (ลาดพร้าว 71)', line: 'MRT' },
    { id: 'lat_phrao_83', name: 'MRT Lat Phrao 83 (ลาดพร้าว 83)', line: 'MRT' },
    { id: 'mahat_thai', name: 'MRT Mahat Thai (มหาดไทย)', line: 'MRT' },
    { id: 'rajabhat_phranakhon', name: 'MRT Rajabhat Phranakhon (ราชภัฏพระนคร)', line: 'MRT' }
  ]

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