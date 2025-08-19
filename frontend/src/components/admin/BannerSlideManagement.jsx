import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Save, RefreshCw, Plus, Trash2, MoveUp, MoveDown, Upload } from 'lucide-react'
import Swal from 'sweetalert2'
import { bannerApi } from '../../lib/bannerApi'

const BannerSlideManagement = () => {
  const [slides, setSlides] = useState([])
  const [settings, setSettings] = useState({
    auto_slide: true,
    slide_interval: 5000,
    slide_height: 300,
    show_navigation: true,
    show_dots: true
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const fileInputsRef = useRef({})

  // Load data from API
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [slidesData, settingsData] = await Promise.all([
        bannerApi.getSlides(),
        bannerApi.getSettings()
      ])
      setSlides(slidesData)
      setSettings(settingsData)
    } catch (error) {
      console.error('Error loading data:', error)
      Swal.fire({
        title: 'โหลดข้อมูลไม่สำเร็จ',
        text: error.message,
        icon: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addSlide = async () => {
    try {
      const newSlide = await bannerApi.createSlide({
        title: `Banner ${slides.length + 1}`,
        link: '/',
        image_url: '',
        alt_text: `Banner ${slides.length + 1}`,
        is_active: true
      })
      setSlides(prev => [...prev, newSlide])
      Swal.fire({
        title: 'เพิ่มสไลด์สำเร็จ',
        text: 'สไลด์ใหม่ถูกเพิ่มเรียบร้อยแล้ว',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      Swal.fire({
        title: 'เพิ่มสไลด์ไม่สำเร็จ',
        text: error.message,
        icon: 'error'
      })
    }
  }

  const deleteSlide = async (id) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณต้องการลบสไลด์นี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    })

    if (result.isConfirmed) {
      try {
        await bannerApi.deleteSlide(id)
        
        // Refresh data from API instead of just updating local state
        await loadData()
        
        Swal.fire({
          title: 'ลบสำเร็จ',
          text: 'สไลด์ถูกลบเรียบร้อยแล้ว',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
      } catch (error) {
        console.error('Delete error:', error)
        Swal.fire({
          title: 'ลบไม่สำเร็จ',
          text: error.message || 'เกิดข้อผิดพลาดในการลบ',
          icon: 'error'
        })
      }
    }
  }

  const move = async (id, dir) => {
    try {
      const currentIndex = slides.findIndex(s => s.id === id)
      if (currentIndex === -1) return

      const newSlides = [...slides]
      if (dir === 'up' && currentIndex > 0) {
        [newSlides[currentIndex - 1], newSlides[currentIndex]] = [newSlides[currentIndex], newSlides[currentIndex - 1]]
      } else if (dir === 'down' && currentIndex < slides.length - 1) {
        [newSlides[currentIndex + 1], newSlides[currentIndex]] = [newSlides[currentIndex], newSlides[currentIndex + 1]]
      } else {
        return
      }

      // Update display_order for all slides
      const updatedSlides = newSlides.map((slide, index) => ({
        ...slide,
        display_order: index + 1
      }))

      await bannerApi.bulkUpdateOrders(updatedSlides.map(s => ({ id: s.id, display_order: s.display_order })))
      setSlides(updatedSlides)
    } catch (error) {
      Swal.fire({
        title: 'จัดลำดับไม่สำเร็จ',
        text: error.message,
        icon: 'error'
      })
    }
  }

  const onPickImage = async (id, file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'ไฟล์ใหญ่เกินไป',
        text: 'ไฟล์ต้องมีขนาดไม่เกิน 5MB',
        icon: 'error'
      })
      return
    }

    try {
      console.log('Starting image upload for slide:', id, 'File:', file.name, 'Size:', file.size)
      
      // Upload to Cloudinary
      const uploadResult = await bannerApi.uploadImage(file)
      console.log('Upload result:', uploadResult)
      
      if (!uploadResult.image_url) {
        throw new Error('ไม่ได้รับ URL รูปภาพจาก Cloudinary')
      }

      // Update slide with new image URL
      console.log('Updating slide with image URL:', uploadResult.image_url)
      await updateSlide(id, { image_url: uploadResult.image_url })
      
      Swal.fire({
        title: 'อัปโหลดสำเร็จ',
        text: 'รูปภาพถูกอัปโหลดเรียบร้อยแล้ว',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Image upload error:', error)
      Swal.fire({
        title: 'อัปโหลดไม่สำเร็จ',
        text: error.message || 'เกิดข้อผิดพลาดในการอัปโหลด',
        icon: 'error'
      })
    }
  }

  const updateSlide = async (id, updates) => {
    try {
      console.log('Updating slide:', id, 'with updates:', updates)
      const updatedSlide = await bannerApi.updateSlide(id, updates)
      console.log('Updated slide result:', updatedSlide)
      setSlides(prev => prev.map(s => s.id === id ? updatedSlide : s))
    } catch (error) {
      console.error('Error updating slide:', error)
      Swal.fire({
        title: 'อัปเดตไม่สำเร็จ',
        text: error.message || 'เกิดข้อผิดพลาดในการอัปเดต',
        icon: 'error'
      })
    }
  }

  const saveSettings = async () => {
    try {
      setIsSaving(true)
      await bannerApi.updateSettings(settings)
      Swal.fire({
        title: 'บันทึกสำเร็จ',
        text: 'การตั้งค่าถูกบันทึกเรียบร้อยแล้ว',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      Swal.fire({
        title: 'บันทึกไม่สำเร็จ',
        text: error.message,
        icon: 'error'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const resetData = async () => {
    const result = await Swal.fire({
      title: 'ยืนยันการรีเซ็ต',
      text: 'คุณต้องการรีเซ็ตข้อมูลเป็นค่าที่บันทึกไว้ล่าสุดหรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'รีเซ็ต',
      cancelButtonText: 'ยกเลิก'
    })

    if (result.isConfirmed) {
      await loadData()
      Swal.fire({
        title: 'รีเซ็ตสำเร็จ',
        text: 'ข้อมูลถูกรีเซ็ตเรียบร้อยแล้ว',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-prompt">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการ Banner Slides</h1>
          <p className="text-gray-500 text-sm mt-1">อัปโหลดรูปและใส่ลิงก์แบบง่าย ใช้ปุ่มบันทึกเพื่อเซฟ</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addSlide} className="font-prompt">
            <Plus className="h-4 w-4 mr-2" /> เพิ่มสไลด์
          </Button>
          <Button variant="outline" onClick={resetData} className="font-prompt">
            <RefreshCw className="h-4 w-4 mr-2" /> รีเซ็ต
          </Button>
          <Button onClick={saveSettings} disabled={isSaving} className="font-prompt">
            {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            บันทึก
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded p-3">{error}</div>
      )}

      {/* Compact settings */}
      <Card className="border-0 shadow">
        <CardHeader>
          <CardTitle className="text-base">การตั้งค่า (ย่อ)</CardTitle>
          <CardDescription>ตั้งค่าเวลาและความสูงของสไลด์</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.auto_slide}
              onChange={(e) => setSettings(prev => ({ ...prev, auto_slide: e.target.checked }))}
            />
            <span>Auto-slide</span>
          </label>
          <div>
            <div className="text-sm text-gray-600 mb-1">ช่วงเวลา (วินาที)</div>
            <Input
              type="number"
              value={Math.max(1, Math.floor(settings.slide_interval / 1000))}
              min={1}
              max={30}
              onChange={(e) => setSettings(prev => ({ ...prev, slide_interval: Math.max(1, parseInt(e.target.value) || 1) * 1000 }))}
            />
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">ความสูง (px)</div>
            <Input
              type="number"
              value={settings.slide_height}
              min={100}
              max={600}
              onChange={(e) => setSettings(prev => ({ ...prev, slide_height: Math.max(100, parseInt(e.target.value) || 100) }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Slides table */}
      <Card className="border-0 shadow">
        <CardHeader>
          <CardTitle className="text-base">สไลด์</CardTitle>
          <CardDescription>แก้ไขแบบอินไลน์ได้ทันที</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-3">ลำดับ</th>
                  <th className="py-2 pr-3">รูปภาพ</th>
                  <th className="py-2 pr-3">ชื่อ</th>
                  <th className="py-2 pr-3">ลิงก์</th>
                  <th className="py-2 pr-3">เปิดใช้งาน</th>
                  <th className="py-2 pr-3">ลบ</th>
                </tr>
              </thead>
              <tbody>
                {slides.map((s, idx) => (
                  <tr key={s.id} className="border-t align-middle">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => move(s.id, 'up')} disabled={idx === 0}>
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => move(s.id, 'down')} disabled={idx === slides.length - 1}>
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-28 h-16 bg-gray-100 border rounded overflow-hidden flex items-center justify-center cursor-pointer"
                          onClick={() => fileInputsRef.current[s.id]?.click()}
                          title="คลิกเพื่ออัปโหลด"
                        >
                          {s.image_url ? (
                            <img src={s.image_url} alt={s.alt_text} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-gray-400 flex items-center gap-2"><Upload className="h-4 w-4" /> อัปโหลด</div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={(el) => (fileInputsRef.current[s.id] = el)}
                          onChange={(e) => onPickImage(s.id, e.target.files?.[0])}
                        />
                        {s.image_url && (
                          <Button variant="outline" size="sm" onClick={() => updateSlide(s.id, { image_url: '' })}>ล้างรูป</Button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <Input 
                        value={s.title} 
                        onChange={(e) => updateSlide(s.id, { title: e.target.value })}
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <Input 
                        placeholder="/path หรือ https://..." 
                        value={s.link} 
                        onChange={(e) => updateSlide(s.id, { link: e.target.value })}
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <input 
                        type="checkbox" 
                        checked={!!s.is_active} 
                        onChange={(e) => updateSlide(s.id, { is_active: e.target.checked })}
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <Button variant="outline" size="sm" className="text-red-600" onClick={() => deleteSlide(s.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> ลบ
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BannerSlideManagement 