import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building as BuildingIcon, MapPin, FileText, Camera, Upload, DollarSign, Calendar, Bed, Bath, User, Youtube } from 'lucide-react'

const PublicCondoForm = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'sale',
    price: '',
    rentPrice: '',
    announcerStatus: 'agent',
    location: '',
    googleMapUrl: '',
    nearbyTransport: '',
    selectedStations: [],
    description: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    seoTags: '',
    youtubeUrl: ''
  })
  const [images, setImages] = useState([])
  const [coverImage, setCoverImage] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInput = (k, v) => {
    setFormData(prev => ({ ...prev, [k]: v }))
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!formData.title.trim()) e.title = 'กรอกชื่อประกาศ'
    if (!formData.location.trim()) e.location = 'กรอกสถานที่'
    if (formData.status !== 'rent' && !formData.price.trim()) e.price = 'กรอกราคา'
    if (formData.status !== 'sale' && !formData.rentPrice.trim()) e.rentPrice = 'กรอกราคาเช่า'
    if (!formData.area.trim()) e.area = 'กรอกพื้นที่'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      const payload = {
        title: formData.title,
        status: formData.status,
        price: formData.price ? Number(formData.price) : 0,
        rent_price: formData.rentPrice ? Number(formData.rentPrice) : 0,
        announcer_status: formData.announcerStatus,
        location: formData.location,
        google_map_url: formData.googleMapUrl,
        nearby_transport: formData.nearbyTransport,
        selected_stations: formData.selectedStations,
        description: formData.description,
        area: formData.area ? Number(formData.area) : 0,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : 0,
        floor: formData.floor,
        seo_tags: formData.seoTags,
        youtube_url: formData.youtubeUrl,
        cover_image: coverImage?.preview || null,
        images: images.map(i => ({ url: i.preview }))
      }
      onSubmit?.(payload)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onCoverChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverImage({ preview: URL.createObjectURL(file), name: file.name })
  }
  const onImagesChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 12)
    setImages(prev => [...prev, ...files.map(f => ({ preview: URL.createObjectURL(f), name: f.name }))])
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center"><BuildingIcon className="h-6 w-6 text-white"/></div>
          <h2 className="text-xl font-bold font-prompt">ข้อมูลประกาศ</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 font-prompt">ชื่อประกาศ *</label>
            <input className={`w-full px-4 py-3 border-2 rounded-lg text-sm ${errors.title ? 'border-red-500' : 'border-gray-300'}`} value={formData.title} onChange={e=>handleInput('title', e.target.value)} placeholder="เช่น คอนโด 1 ห้องนอน ใกล้ BTS"/>
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 font-prompt">ประเภทประกาศ *</label>
            <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm" value={formData.status} onChange={e=>handleInput('status', e.target.value)}>
              <option value="sale">ขาย</option>
              <option value="rent">เช่า</option>
              <option value="both">ขาย/เช่า</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 font-prompt">ราคาขาย (บาท)</label>
            <div className="relative">
              <input type="number" className={`w-full px-4 py-3 border-2 rounded-lg text-sm ${errors.price ? 'border-red-500' : 'border-gray-300'}`} value={formData.price} disabled={formData.status==='rent'} onChange={e=>handleInput('price', e.target.value)} placeholder="3500000"/>
              <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
            </div>
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 font-prompt">ราคาเช่า (บาท/เดือน)</label>
            <div className="relative">
              <input type="number" className={`w-full px-4 py-3 border-2 rounded-lg text-sm ${errors.rentPrice ? 'border-red-500' : 'border-gray-300'}`} value={formData.rentPrice} disabled={formData.status==='sale'} onChange={e=>handleInput('rentPrice', e.target.value)} placeholder="25000"/>
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
            </div>
            {errors.rentPrice && <p className="mt-1 text-xs text-red-600">{errors.rentPrice}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 font-prompt">สถานะผู้ประกาศ</label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[
                { value: 'owner', label: 'เจ้าของ' },
                { value: 'agent', label: 'นายหน้า' }
              ].map(opt => (
                <button key={opt.value} type="button" onClick={()=>handleInput('announcerStatus', opt.value)} className={`rounded-lg border-2 px-4 py-3 text-sm font-medium ${formData.announcerStatus===opt.value ? 'border-blue-600 text-white bg-blue-600' : 'border-gray-200'}`}>{opt.label}</button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center"><MapPin className="h-6 w-6 text-white"/></div><h2 className="text-xl font-bold font-prompt">ที่ตั้ง</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 font-prompt">สถานที่ *</label>
            <input className={`w-full px-4 py-3 border-2 rounded-lg text-sm ${errors.location ? 'border-red-500' : 'border-gray-300'}`} value={formData.location} onChange={e=>handleInput('location', e.target.value)} placeholder="เช่น สุขุมวิท, กรุงเทพฯ"/>
            {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 font-prompt">Google Map URL</label>
            <input className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm" value={formData.googleMapUrl} onChange={e=>handleInput('googleMapUrl', e.target.value)} placeholder="https://maps.google.com/..."/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 font-prompt">ขนส่งสาธารณะใกล้เคียง</label>
            <input className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm" value={formData.nearbyTransport} onChange={e=>handleInput('nearbyTransport', e.target.value)} placeholder="BTS/MRT/ARL/SRT"/>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center"><FileText className="h-6 w-6 text-white"/></div><h2 className="text-xl font-bold font-prompt">รายละเอียดทรัพย์</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 font-prompt">พื้นที่ (ตร.ม.) *</label>
            <input type="number" className={`w-full px-4 py-3 border-2 rounded-lg text-sm ${errors.area ? 'border-red-500' : 'border-gray-300'}`} value={formData.area} onChange={e=>handleInput('area', e.target.value)} placeholder="32"/>
            {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 font-prompt">ห้องนอน</label>
            <input type="number" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm" value={formData.bedrooms} onChange={e=>handleInput('bedrooms', e.target.value)} placeholder="1"/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 font-prompt">ห้องน้ำ</label>
            <input type="number" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm" value={formData.bathrooms} onChange={e=>handleInput('bathrooms', e.target.value)} placeholder="1"/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 font-prompt">ชั้น</label>
            <input className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm" value={formData.floor} onChange={e=>handleInput('floor', e.target.value)} placeholder="15 หรือ 17-18"/>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 font-prompt">รายละเอียดเพิ่มเติม</label>
            <textarea rows={4} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm" value={formData.description} onChange={e=>handleInput('description', e.target.value)} placeholder="สิ่งอำนวยความสะดวก วิว การเดินทาง ฯลฯ"/>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center"><Youtube className="h-6 w-6 text-white"/></div><h2 className="text-xl font-bold font-prompt">สื่อและ SEO</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 font-prompt">YouTube URL</label>
            <input className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm" value={formData.youtubeUrl} onChange={e=>handleInput('youtubeUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=..."/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 font-prompt">SEO Tags</label>
            <input className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm" value={formData.seoTags} onChange={e=>handleInput('seoTags', e.target.value)} placeholder="คั่นด้วยเครื่องหมายจุลภาค เช่น คอนโด, สุขุมวิท"/>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center"><Camera className="h-6 w-6 text-white"/></div><h2 className="text-xl font-bold font-prompt">รูปภาพ</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 font-prompt">รูปภาพหน้าปก</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input type="file" accept="image/*" className="hidden" id="cover" onChange={onCoverChange}/>
              <label htmlFor="cover" className="cursor-pointer inline-flex items-center gap-2 text-sm text-gray-700"><Upload className="h-4 w-4"/> เลือกรูปภาพ</label>
              {coverImage && <img src={coverImage.preview} alt="cover" className="mt-3 w-full h-48 object-cover rounded"/>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 font-prompt">รูปภาพเพิ่มเติม (สูงสุด 12 รูป)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input type="file" multiple accept="image/*" className="hidden" id="gallery" onChange={onImagesChange}/>
              <label htmlFor="gallery" className="cursor-pointer inline-flex items-center gap-2 text-sm text-gray-700"><Upload className="h-4 w-4"/> เลือกรูปภาพ</label>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {images.map((img, idx) => <img key={idx} src={img.preview} alt={img.name} className="w-full h-24 object-cover rounded"/>) }
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button type="button" onClick={onBack} className="px-6 py-3 border-2 border-gray-300 rounded-lg text-sm">ย้อนกลับ</button>
        <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">{isSubmitting ? 'กำลังส่ง...' : 'ส่งประกาศ'}</button>
      </div>
    </form>
  )
}

export default PublicCondoForm



