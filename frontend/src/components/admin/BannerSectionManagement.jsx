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
  Edit,
  Plus,
  X
} from 'lucide-react'

const BannerSectionManagement = () => {
  const [bannerSections, setBannerSections] = useState([
    {
      id: 1,
      title: 'Banner Section 1',
      subtitle: 'คำอธิบายสั้นๆ สำหรับ banner นี้',
      backgroundType: 'image', // 'image' or 'video'
      backgroundUrl: '',
      ctaText: 'ดูเพิ่มเติม',
      ctaLink: '/property/1',
      order: 1,
      isActive: true,
      showOnPages: ['home'], // ['home', 'properties', 'projects']
      customStyles: {
        textColor: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.5)',
        buttonColor: '#3b82f6'
      }
    }
  ])
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSection, setEditingSection] = useState(null)

  // Load banner sections from API on component mount
  useEffect(() => {
    const loadBannerSections = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with actual API call
        // const data = await bannerSectionApi.getBannerSections()
        // setBannerSections(data)
      } catch (err) {
        console.error('Error loading banner sections:', err)
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล Banner Sections')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadBannerSections()
  }, [])

  const handleInputChange = (sectionId, field, value) => {
    setBannerSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, [field]: value }
          : section
      )
    )
    setIsSaved(false)
    setError('')
  }

  const handleStyleChange = (sectionId, styleField, value) => {
    setBannerSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              customStyles: { 
                ...section.customStyles, 
                [styleField]: value 
              }
            }
          : section
      )
    )
    setIsSaved(false)
  }

  const handleFileUpload = async (sectionId, field, file) => {
    if (file) {
      try {
        setIsLoading(true)
        // TODO: Implement file upload to server
        const fileUrl = URL.createObjectURL(file)
        
        setBannerSections(prev => 
          prev.map(section => 
            section.id === sectionId 
              ? { ...section, [field]: fileUrl }
              : section
          )
        )
        setIsSaved(false)
      } catch (err) {
        console.error('Error uploading file:', err)
        setError('เกิดข้อผิดพลาดในการอัปโหลดไฟล์')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const addNewSection = () => {
    const newSection = {
      id: Date.now(),
      title: 'Banner Section ใหม่',
      subtitle: 'คำอธิบายสั้นๆ',
      backgroundType: 'image',
      backgroundUrl: '',
      ctaText: 'ดูเพิ่มเติม',
      ctaLink: '/',
      order: bannerSections.length + 1,
      isActive: true,
      showOnPages: ['home'],
      customStyles: {
        textColor: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.5)',
        buttonColor: '#3b82f6'
      }
    }
    setBannerSections(prev => [...prev, newSection])
    setShowAddForm(false)
    setIsSaved(false)
  }

  const deleteSection = (sectionId) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบ banner section นี้?')) {
      setBannerSections(prev => prev.filter(section => section.id !== sectionId))
      setIsSaved(false)
    }
  }

  const toggleSectionActive = (sectionId) => {
    setBannerSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, isActive: !section.isActive }
          : section
      )
    )
    setIsSaved(false)
  }

  const moveSection = (sectionId, direction) => {
    setBannerSections(prev => {
      const sections = [...prev]
      const currentIndex = sections.findIndex(s => s.id === sectionId)
      if (currentIndex === -1) return sections

      if (direction === 'up' && currentIndex > 0) {
        [sections[currentIndex], sections[currentIndex - 1]] = [sections[currentIndex - 1], sections[currentIndex]]
      } else if (direction === 'down' && currentIndex < sections.length - 1) {
        [sections[currentIndex], sections[currentIndex + 1]] = [sections[currentIndex + 1], sections[currentIndex]]
      }

      // Update order
      sections.forEach((section, index) => {
        section.order = index + 1
      })

      return sections
    })
    setIsSaved(false)
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // TODO: Replace with actual API call
      // await bannerSectionApi.saveBannerSections(bannerSections)
      
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
      // TODO: Replace with actual API call
      // const data = await bannerSectionApi.getBannerSections()
      // setBannerSections(data)
      setIsSaved(false)
      setError('')
    } catch (err) {
      console.error('Error resetting banner sections:', err)
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
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">จัดการ Banner Sections</h1>
          <p className="text-gray-600 font-prompt">จัดการ banner sections ที่แสดงในหน้า home และหน้าอื่นๆ</p>
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
            onClick={() => setShowAddForm(true)}
            className="font-prompt"
          >
            <Plus className="h-4 w-4 mr-2" />
            เพิ่ม Banner Section
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

      {/* Add New Section Form */}
      {showAddForm && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-blue-800 font-prompt">เพิ่ม Banner Section ใหม่</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 font-prompt mb-2">
                  ชื่อ Section
                </label>
                <Input
                  placeholder="ชื่อ Banner Section"
                  className="font-prompt"
                  onChange={(e) => {
                    const newSection = {
                      id: Date.now(),
                      title: e.target.value,
                      subtitle: 'คำอธิบายสั้นๆ',
                      backgroundType: 'image',
                      backgroundUrl: '',
                      ctaText: 'ดูเพิ่มเติม',
                      ctaLink: '/',
                      order: bannerSections.length + 1,
                      isActive: true,
                      showOnPages: ['home'],
                      customStyles: {
                        textColor: '#ffffff',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        buttonColor: '#3b82f6'
                      }
                    }
                    setBannerSections(prev => [...prev, newSection])
                    setShowAddForm(false)
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Banner Sections List */}
      <div className="space-y-4">
        {bannerSections.map((section, index) => (
          <Card key={section.id} className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={index === bannerSections.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      ↓
                    </Button>
                  </div>
                  <div>
                    <CardTitle className="font-prompt">ลำดับที่ {section.order}: {section.title}</CardTitle>
                    <CardDescription className="font-prompt">
                      {section.isActive ? '✅ เปิดใช้งาน' : '❌ ปิดใช้งาน'}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSectionActive(section.id)}
                    className="font-prompt"
                  >
                    {section.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                    className="font-prompt"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    แก้ไข
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSection(section.id)}
                    className="font-prompt text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    ลบ
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {editingSection === section.id && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Settings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                      ชื่อ Section
                    </label>
                    <Input
                      value={section.title}
                      onChange={(e) => handleInputChange(section.id, 'title', e.target.value)}
                      placeholder="ชื่อ Banner Section"
                      className="font-prompt"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                      คำอธิบาย
                    </label>
                    <Input
                      value={section.subtitle}
                      onChange={(e) => handleInputChange(section.id, 'subtitle', e.target.value)}
                      placeholder="คำอธิบายสั้นๆ"
                      className="font-prompt"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                      ข้อความปุ่ม CTA
                    </label>
                    <Input
                      value={section.ctaText}
                      onChange={(e) => handleInputChange(section.id, 'ctaText', e.target.value)}
                      placeholder="ข้อความบนปุ่ม"
                      className="font-prompt"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                      ลิงก์ปุ่ม CTA
                    </label>
                    <Input
                      value={section.ctaLink}
                      onChange={(e) => handleInputChange(section.id, 'ctaLink', e.target.value)}
                      placeholder="/property/1 หรือ URL"
                      className="font-prompt"
                    />
                  </div>
                </div>

                {/* Background Settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                    ประเภทพื้นหลัง
                  </label>
                  <div className="flex space-x-4 mb-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="image"
                        checked={section.backgroundType === 'image'}
                        onChange={(e) => handleInputChange(section.id, 'backgroundType', e.target.value)}
                        className="mr-2"
                      />
                      <span className="font-prompt">รูปภาพ</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="video"
                        checked={section.backgroundType === 'video'}
                        onChange={(e) => handleInputChange(section.id, 'backgroundType', e.target.value)}
                        className="mr-2"
                      />
                      <span className="font-prompt">วิดีโอ</span>
                    </label>
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      value={section.backgroundUrl}
                      onChange={(e) => handleInputChange(section.id, 'backgroundUrl', e.target.value)}
                      placeholder="URL ของไฟล์"
                      className="font-prompt"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById(`upload-${section.id}`).click()}
                      className="font-prompt"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      อัปโหลด
                    </Button>
                    <input
                      id={`upload-${section.id}`}
                      type="file"
                      accept={section.backgroundType === 'video' ? 'video/*' : 'image/*'}
                      onChange={(e) => handleFileUpload(section.id, 'backgroundUrl', e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Style Settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-prompt mb-2">
                    การตั้งค่าสไตล์
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 font-prompt mb-1">
                        สีข้อความ
                      </label>
                      <input
                        type="color"
                        value={section.customStyles.textColor}
                        onChange={(e) => handleStyleChange(section.id, 'textColor', e.target.value)}
                        className="w-full h-10 rounded border"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 font-prompt mb-1">
                        สีพื้นหลังข้อความ
                      </label>
                      <input
                        type="color"
                        value={section.customStyles.backgroundColor}
                        onChange={(e) => handleStyleChange(section.id, 'backgroundColor', e.target.value)}
                        className="w-full h-10 rounded border"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 font-prompt mb-1">
                        สีปุ่ม
                      </label>
                      <input
                        type="color"
                        value={section.customStyles.buttonColor}
                        onChange={(e) => handleStyleChange(section.id, 'buttonColor', e.target.value)}
                        className="w-full h-10 rounded border"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            )}

            {/* Preview */}
            {previewMode && (
              <CardContent>
                <div className="relative h-48 overflow-hidden rounded-lg border">
                  {/* Background */}
                  {section.backgroundType === 'video' && section.backgroundUrl && (
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      src={section.backgroundUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )}
                  {section.backgroundType === 'image' && section.backgroundUrl && (
                    <img
                      src={section.backgroundUrl}
                      alt="Banner background"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Content Overlay */}
                  <div 
                    className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6"
                    style={{ backgroundColor: section.customStyles.backgroundColor }}
                  >
                    <h3 
                      className="text-xl font-bold mb-2 font-prompt"
                      style={{ color: section.customStyles.textColor }}
                    >
                      {section.title}
                    </h3>
                    <p 
                      className="text-lg mb-4 font-prompt"
                      style={{ color: section.customStyles.textColor }}
                    >
                      {section.subtitle}
                    </p>
                    {section.ctaText && (
                      <button
                        className="px-6 py-2 rounded-lg font-medium font-prompt"
                        style={{ 
                          backgroundColor: section.customStyles.buttonColor,
                          color: '#ffffff'
                        }}
                      >
                        {section.ctaText}
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

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

export default BannerSectionManagement 