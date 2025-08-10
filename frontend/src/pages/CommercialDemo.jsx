import React, { useState, useEffect } from 'react'
import { CommercialForm } from '../components/admin/CommercialForm'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import {
  ArrowLeft,
  Building,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'

const CommercialDemo = () => {
  const [commercials, setCommercials] = useState([])
  const [currentView, setCurrentView] = useState('list') // 'list' หรือ 'form'
  const [editingCommercial, setEditingCommercial] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [viewingCommercial, setViewingCommercial] = useState(null)

  // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    const savedCommercials = localStorage.getItem('demoCommercials')
    if (savedCommercials) {
      try {
        setCommercials(JSON.parse(savedCommercials))
      } catch (error) {
        console.error('Error loading saved commercials:', error)
      }
    }
  }, [])

  // บันทึกข้อมูลลง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('demoCommercials', JSON.stringify(commercials))
  }, [commercials])

  const handleBack = () => {
    setCurrentView('list')
    setEditingCommercial(null)
    setIsEditing(false)
    setViewingCommercial(null)
  }

  const handleSave = (commercialData) => {
    if (isEditing) {
      // แก้ไขข้อมูลที่มีอยู่
      setCommercials(prev => prev.map(c => 
        c.id === commercialData.id ? commercialData : c
      ))
    } else {
      // เพิ่มข้อมูลใหม่
      setCommercials(prev => [...prev, commercialData])
    }
    setCurrentView('list')
    setEditingCommercial(null)
    setIsEditing(false)
  }

  const handleEdit = (commercial) => {
    setEditingCommercial(commercial)
    setIsEditing(true)
    setCurrentView('form')
  }

  const handleView = (commercial) => {
    setViewingCommercial(commercial)
    setCurrentView('view')
  }

  const handleDelete = (id) => {
    if (window.confirm('คุณต้องการลบข้อมูลนี้ใช่หรือไม่?')) {
      setCommercials(prev => prev.filter(c => c.id !== id))
    }
  }

  // หน้าดูข้อมูล
  if (currentView === 'view' && viewingCommercial) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปรายการ
          </Button>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => handleEdit(viewingCommercial)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              แก้ไข
            </Button>
            <Button
              onClick={() => handleDelete(viewingCommercial.id)}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              ลบ
            </Button>
          </div>
        </div>

        <Card className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* รูปภาพ */}
            <div>
              {viewingCommercial.coverImage ? (
                <img
                  src={viewingCommercial.coverImage.url}
                  alt={viewingCommercial.title}
                  className="w-full h-80 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Building className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* ข้อมูล */}
            <div className="space-y-6">
              <div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  viewingCommercial.status === 'sale' ? 'bg-green-100 text-green-800' :
                  viewingCommercial.status === 'rent' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {viewingCommercial.status === 'sale' ? 'ขาย' :
                   viewingCommercial.status === 'rent' ? 'เช่า' : 'ขาย/เช่า'}
                </span>
                <span className="ml-3 text-sm text-gray-500 font-mono">
                  {viewingCommercial.projectCode}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">
                {viewingCommercial.title}
              </h1>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{viewingCommercial.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500">พื้นที่:</span>
                    <span className="ml-2 font-medium">{viewingCommercial.area} ตร.ม.</span>
                  </div>
                  <div>
                    <span className="text-gray-500">ชั้น:</span>
                    <span className="ml-2 font-medium">{viewingCommercial.floors} ชั้น</span>
                  </div>
                  <div>
                    <span className="text-gray-500">ห้อง:</span>
                    <span className="ml-2 font-medium">{viewingCommercial.rooms} ห้อง</span>
                  </div>
                  <div>
                    <span className="text-gray-500">ห้องน้ำ:</span>
                    <span className="ml-2 font-medium">{viewingCommercial.bathrooms} ห้อง</span>
                  </div>
                </div>

                {viewingCommercial.description && (
                  <div>
                    <span className="text-gray-500">รายละเอียด:</span>
                    <p className="mt-2 text-gray-700">{viewingCommercial.description}</p>
                  </div>
                )}

                {viewingCommercial.price > 0 && (
                  <div className="text-2xl font-bold text-green-600">
                    ฿{viewingCommercial.price.toLocaleString('th-TH')}
                  </div>
                )}

                {viewingCommercial.rentPrice > 0 && (
                  <div className="text-lg text-blue-600">
                    เช่า: ฿{viewingCommercial.rentPrice.toLocaleString('th-TH')}/เดือน
                  </div>
                )}

                {viewingCommercial.facilities.length > 0 && (
                  <div>
                    <span className="text-gray-500">สิ่งอำนวยความสะดวก:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {viewingCommercial.facilities.map((facilityId) => (
                        <span
                          key={facilityId}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {facilityId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // หน้าแบบฟอร์ม
  if (currentView === 'form') {
    return (
      <CommercialForm
        commercial={editingCommercial}
        onBack={handleBack}
        onSave={handleSave}
        isEditing={isEditing}
      />
    )
  }

  // หน้ารายการ
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ระบบจัดการโฮมออฟฟิศ/ตึกแถว (Demo)
          </h1>
          <p className="text-gray-600 mt-1">
            หน้าทดสอบ CommercialForm โดยไม่ต้องเชื่อมต่อ API
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCommercial(null)
            setIsEditing(false)
            setCurrentView('form')
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มใหม่
        </Button>
      </div>

      {/* Commercial List */}
      {commercials.length === 0 ? (
        <Card className="p-12 text-center">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ยังไม่มีข้อมูลโฮมออฟฟิศ/ตึกแถว
          </h3>
          <p className="text-gray-500 mb-4">
            เริ่มต้นโดยการเพิ่มข้อมูลโฮมออฟฟิศ/ตึกแถวใหม่
          </p>
          <Button
            onClick={() => {
              setEditingCommercial(null)
              setIsEditing(false)
              setCurrentView('form')
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มข้อมูลใหม่
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commercials.map((commercial) => (
            <Card key={commercial.id} className="p-6 hover:shadow-lg transition-shadow">
              {/* Cover Image */}
              {commercial.coverImage ? (
                <div className="mb-4">
                  <img
                    src={commercial.coverImage.url}
                    alt={commercial.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <Building className="h-12 w-12 text-gray-400" />
                </div>
              )}

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    commercial.status === 'sale' ? 'bg-green-100 text-green-800' :
                    commercial.status === 'rent' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {commercial.status === 'sale' ? 'ขาย' :
                     commercial.status === 'rent' ? 'เช่า' : 'ขาย/เช่า'}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {commercial.projectCode}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {commercial.title}
                </h3>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{commercial.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">พื้นที่:</span>
                    <span className="ml-1 font-medium">{commercial.area} ตร.ม.</span>
                  </div>
                  <div>
                    <span className="text-gray-500">ชั้น:</span>
                    <span className="ml-1 font-medium">{commercial.floors} ชั้น</span>
                  </div>
                </div>

                {commercial.price > 0 && (
                  <div className="text-lg font-bold text-green-600">
                    ฿{commercial.price.toLocaleString('th-TH')}
                  </div>
                )}

                {commercial.rentPrice > 0 && (
                  <div className="text-sm text-blue-600">
                    เช่า: ฿{commercial.rentPrice.toLocaleString('th-TH')}/เดือน
                  </div>
                )}

                {/* Facilities Preview */}
                {commercial.facilities.length > 0 && (
                  <div className="pt-3 border-t">
                    <div className="flex flex-wrap gap-1">
                      {commercial.facilities.slice(0, 3).map((facilityId) => (
                        <span
                          key={facilityId}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {facilityId}
                        </span>
                      ))}
                      {commercial.facilities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{commercial.facilities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-3 border-t">
                  <Button
                    onClick={() => handleView(commercial)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    ดู
                  </Button>
                  <Button
                    onClick={() => handleEdit(commercial)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    แก้ไข
                  </Button>
                  <Button
                    onClick={() => handleDelete(commercial.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Demo Info */}
      <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-3">
          💡 ข้อมูลการทดสอบ
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>• หน้านี้เป็นหน้าทดสอบ CommercialForm โดยไม่ต้องเชื่อมต่อ API</p>
          <p>• สามารถเพิ่ม แก้ไข ลบ ดูข้อมูลโฮมออฟฟิศ/ตึกแถวได้</p>
          <p>• รูปภาพจะถูกจำลองการอัปโหลดในเครื่อง (ไม่ส่งไปยัง server)</p>
          <p>• ข้อมูลจะถูกเก็บใน localStorage ของเบราว์เซอร์</p>
          <p>• ฟีเจอร์คำนวณราคาต่อตารางเมตรทำงานอัตโนมัติ</p>
          <p>• มีการแสดงผลแบบ responsive design</p>
        </div>
      </Card>
    </div>
  )
}

export default CommercialDemo 