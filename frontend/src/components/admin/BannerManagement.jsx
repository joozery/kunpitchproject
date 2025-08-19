import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { 
  Image, 
  Video, 
  Link, 
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Upload,
  Trash2,
  Eye,
  Edit
} from 'lucide-react'
import { 
  getBannerSettings, 
  saveBannerSettings, 
  uploadBannerMedia,
  validateBannerData, 
  checkBannerApiConnection 
} from '../../lib/bannerApi'

const BannerManagement = () => {
  const [bannerData, setBannerData] = useState({
    title: 'Your Perfect Space Awaits',
    subtitle: 'ค้นหาอสังหาริมทรัพย์ที่ใช่สำหรับคุณ',
    backgroundType: 'video', // 'video' or 'image'
    backgroundVideo: '',
    backgroundImage: '',
    ctaText: 'ค้นหาตอนนี้',
    ctaLink: '/search',
    searchPlaceholder: 'ค้นหาตำแหน่งที่ต้องการ...',
    showSearchForm: true,
    showTabs: true,
    tabs: [
      { id: 'buy', label: 'ซื้อ', active: true },
      { id: 'rent', label: 'เช่า', active: false },
      { id: 'sell', label: 'ขาย', active: false }
    ]
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState('')
  const [previewMode, setPreviewMode] = useState(false)

  // Load banner data from API on component mount
  useEffect(() => {
    const loadBannerData = async () => {
      try {
        setIsLoading(true)
        
        // ตรวจสอบการเชื่อมต่อ API
        const apiConnected = await checkBannerApiConnection()
        if (!apiConnected) {
          console.warn('Banner API not connected, using default data')
        }
        
        const data = await getBannerSettings()
        setBannerData(data)
      } catch (err) {
        console.error('Error loading banner data:', err)
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล Banner')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadBannerData()
  }, [])

  const handleInputChange = (field, value) => {
    setBannerData(prev => ({
      ...prev,
      [field]: value
    }))
    setIsSaved(false)
    setError('')
  }

  const handleTabChange = (tabId) => {
    setBannerData(prev => ({
      ...prev,
      tabs: prev.tabs.map(tab => ({
        ...tab,
        active: tab.id === tabId
      }))
    }))
    setIsSaved(false)
  }

  const handleFileUpload = async (field, file) => {
    if (file) {
      try {
        setIsLoading(true)
        const fileType = field === 'backgroundVideo' ? 'video' : 'image'
        const mediaUrl = await uploadBannerMedia(file, fileType)
        
        setBannerData(prev => ({
          ...prev,
          [field]: mediaUrl
        }))
        setIsSaved(false)
      } catch (err) {
        console.error('Error uploading file:', err)
        setError('เกิดข้อผิดพลาดในการอัปโหลดไฟล์')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // Validate data
      const validationErrors = validateBannerData(bannerData)
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '))
        return
      }
      
      // Save to API
      await saveBannerSettings(bannerData)
      
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    try {
      setIsLoading(true)
      const data = await getBannerSettings()
      setBannerData(data)
      setIsSaved(false)
      setError('')
    } catch (err) {
      console.error('Error resetting banner data:', err)
      setError('เกิดข้อผิดพลาดในการรีเซ็ตข้อมูล')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-prompt">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">จัดการ Banner</h1>
          <p className="text-gray-600 font-prompt">ปรับแต่ง Hero Section และ Banner หลักของเว็บไซต์</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="font-prompt"
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'ซ่อนตัวอย่าง' : 'ดูตัวอย่าง'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="font-prompt"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            บันทึกการเปลี่ยนแปลง
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {isSaved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-prompt">บันทึกข้อมูลสำเร็จแล้ว!</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800 font-prompt">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center font-prompt">
              <Edit className="h-5 w-5 mr-2 text-blue-600" />
              เนื้อหาหลัก
            </CardTitle>
            <CardDescription className="font-prompt">
              ปรับแต่งข้อความและเนื้อหาหลักของ Banner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                หัวข้อหลัก
              </label>
              <Input
                value={bannerData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="ใส่หัวข้อหลักของ Banner"
                className="font-prompt"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                หัวข้อรอง
              </label>
              <Textarea
                value={bannerData.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                placeholder="ใส่หัวข้อรองหรือคำอธิบาย"
                rows={2}
                className="font-prompt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                ข้อความปุ่ม CTA
              </label>
              <Input
                value={bannerData.ctaText}
                onChange={(e) => handleInputChange('ctaText', e.target.value)}
                placeholder="ข้อความบนปุ่ม Call-to-Action"
                className="font-prompt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                ลิงก์ปุ่ม CTA
              </label>
              <Input
                value={bannerData.ctaLink}
                onChange={(e) => handleInputChange('ctaLink', e.target.value)}
                placeholder="/search หรือ URL ปลายทาง"
                className="font-prompt"
              />
            </div>
          </CardContent>
        </Card>

        {/* Background Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center font-prompt">
              <Image className="h-5 w-5 mr-2 text-green-600" />
              พื้นหลัง
            </CardTitle>
            <CardDescription className="font-prompt">
              เลือกประเภทพื้นหลังและอัปโหลดไฟล์
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                ประเภทพื้นหลัง
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="video"
                    checked={bannerData.backgroundType === 'video'}
                    onChange={(e) => handleInputChange('backgroundType', e.target.value)}
                    className="mr-2"
                  />
                  <span className="font-prompt">วิดีโอ</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="image"
                    checked={bannerData.backgroundType === 'image'}
                    onChange={(e) => handleInputChange('backgroundType', e.target.value)}
                    className="mr-2"
                  />
                  <span className="font-prompt">รูปภาพ</span>
                </label>
              </div>
            </div>

            {bannerData.backgroundType === 'video' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                  วิดีโอพื้นหลัง
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={bannerData.backgroundVideo}
                    onChange={(e) => handleInputChange('backgroundVideo', e.target.value)}
                    placeholder="URL ของวิดีโอ"
                    className="font-prompt"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('videoUpload').click()}
                    className="font-prompt"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    อัปโหลด
                  </Button>
                  <input
                    id="videoUpload"
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload('backgroundVideo', e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {bannerData.backgroundType === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                  รูปภาพพื้นหลัง
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={bannerData.backgroundImage}
                    onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
                    placeholder="URL ของรูปภาพ"
                    className="font-prompt"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('imageUpload').click()}
                    className="font-prompt"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    อัปโหลด
                  </Button>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('backgroundImage', e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search Form Settings */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center font-prompt">
            <Link className="h-5 w-5 mr-2 text-purple-600" />
            ฟอร์มค้นหา
          </CardTitle>
          <CardDescription className="font-prompt">
            ปรับแต่งฟอร์มค้นหาอสังหาริมทรัพย์
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={bannerData.showSearchForm}
                onChange={(e) => handleInputChange('showSearchForm', e.target.checked)}
                className="mr-2"
              />
              <span className="font-prompt">แสดงฟอร์มค้นหา</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={bannerData.showTabs}
                onChange={(e) => handleInputChange('showTabs', e.target.checked)}
                className="mr-2"
              />
              <span className="font-prompt">แสดงแท็บ Buy/Rent/Sell</span>
            </label>
          </div>

          {bannerData.showSearchForm && (
            <div>
              <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                Placeholder ของช่องค้นหา
              </label>
              <Input
                value={bannerData.searchPlaceholder}
                onChange={(e) => handleInputChange('searchPlaceholder', e.target.value)}
                placeholder="ข้อความในช่องค้นหา"
                className="font-prompt"
              />
            </div>
          )}

          {bannerData.showTabs && (
            <div>
              <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                แท็บการค้นหา
              </label>
              <div className="space-y-2">
                {bannerData.tabs.map((tab) => (
                  <div key={tab.id} className="flex items-center space-x-4">
                    <Input
                      value={tab.label}
                      onChange={(e) => {
                        const updatedTabs = bannerData.tabs.map(t => 
                          t.id === tab.id ? { ...t, label: e.target.value } : t
                        )
                        setBannerData(prev => ({ ...prev, tabs: updatedTabs }))
                      }}
                      className="font-prompt w-24"
                    />
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="activeTab"
                        checked={tab.active}
                        onChange={() => handleTabChange(tab.id)}
                        className="mr-2"
                      />
                      <span className="font-prompt text-sm">แท็บเริ่มต้น</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Section */}
      {previewMode && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center font-prompt">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              ตัวอย่าง Banner
            </CardTitle>
            <CardDescription className="font-prompt">
              ดูตัวอย่างการแสดงผลของ Banner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 overflow-hidden rounded-lg border">
              {/* Background */}
              {bannerData.backgroundType === 'video' && bannerData.backgroundVideo && (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={bannerData.backgroundVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
              {bannerData.backgroundType === 'image' && bannerData.backgroundImage && (
                <img
                  src={bannerData.backgroundImage}
                  alt="Banner background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              
              {/* Content Overlay */}
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center p-6">
                <h1 className="text-2xl font-bold mb-2 font-prompt">
                  {bannerData.title}
                </h1>
                <p className="text-lg mb-4 font-prompt">
                  {bannerData.subtitle}
                </p>
                {bannerData.ctaText && (
                  <Button className="font-prompt">
                    {bannerData.ctaText}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
          className="font-prompt"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          รีเซ็ต
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="font-prompt"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>
    </div>
  )
}

export default BannerManagement 