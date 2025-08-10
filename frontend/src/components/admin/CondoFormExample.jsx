import React, { useState } from 'react'
import CondoForm from './CondoForm'

// ตัวอย่างข้อมูลคอนโดสำหรับทดสอบ
const mockCondoData = {
  id: 'condo-001',
  title: 'ลุมพินี วิลล์ รามคำแหง - รามอินทรา',
  projectCode: 'CONDO123456',
  status: 'available',
  listingType: 'both',
  price: 3500000,
  rentPrice: 25000,
  location: 'รามคำแหง, กรุงเทพฯ',
  nearbyTransport: 'BTS รามคำแหง 500 ม., MRT ห้วยขวาง 1 กม.',
  description: 'คอนโดมิเนียมสวยงามในทำเลดี ใกล้สถานีรถไฟฟ้า มีสิ่งอำนวยความสะดวกครบครัน เหมาะสำหรับการอยู่อาศัยและการลงทุน',
  area: 65.5,
  bedrooms: 2,
  bathrooms: 2,
  floor: '15',
  pricePerSqm: '53435.11',
  furnishing: 'fullyFurnished',
  balcony: true,
  view: 'วิวเมือง',
  orientation: 'ทิศตะวันออก',
  maintenanceFee: '3500',
  transferFee: 'half',
  contactName: 'คุณสมชาย ใจดี',
  contactPhone: '08-1234-5678',
  contactEmail: 'contact@example.com',
  agentName: 'คุณสมหญิง ขายดี',
  agentPhone: '08-9876-5432',
  petFriendly: false,
  minimumRentPeriod: '12',
  deposit: '50000',
  advancePayment: '25000',
  seoTags: 'คอนโด, รามคำแหง, ลุมพินี, ขาย, เช่า, BTS',
  metaDescription: 'ลุมพินี วิลล์ รามคำแหง 2 ห้องนอน 2 ห้องน้ำ 65.5 ตร.ม. รามคำแหง, กรุงเทพฯ ฿3,500,000',
  facilities: [
    'wifi', 'parking', 'security24h', 'fitness', 'swimmingPool',
    'passengerLift', 'accessControl', 'lobby', 'garden'
  ],
  availableForViewing: true,
  viewingNote: 'โทรนัดล่วงหน้า 1 วัน, เข้าชมได้วันจันทร์-เสาร์ 9:00-17:00',
  featured: true,
  urgent: false,
  negotiable: true,
  images: [
    'https://via.placeholder.com/800x600/0066CC/FFFFFF?text=Cover+Image',
    'https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=Living+Room',
    'https://via.placeholder.com/800x600/FF9800/FFFFFF?text=Bedroom',
    'https://via.placeholder.com/800x600/9C27B0/FFFFFF?text=Bathroom'
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// ตัวอย่างโครงการที่มีอยู่แล้ว
const mockProjects = [
  {
    id: 'project-001',
    title: 'ลุมพินี วิลล์ รามคำแหง - รามอินทรา',
    projectCode: 'LPN-RK-RI',
    location: 'รามคำแหง, กรุงเทพฯ',
    status: 'active',
    description: 'โครงการคอนโดมิเนียมคุณภาพสูงในทำเลยุทธศาสตร์',
    facilities: ['wifi', 'parking', 'security24h', 'fitness', 'swimmingPool', 'lobby', 'garden'],
    seoTags: 'ลุมพินี, รามคำแหง, คอนโด'
  },
  {
    id: 'project-002',
    title: 'ไอดีโอ โมบิ รามคำแหง',
    projectCode: 'IDEO-MOBI-RK',
    location: 'รามคำแหง, กรุงเทพฯ',
    status: 'active',
    description: 'คอนโดมิเนียมสไตล์โมเดิร์นสำหรับคนรุ่นใหม่',
    facilities: ['wifi', 'parking', 'security24h', 'fitness', 'swimmingPool', 'coWorkingSpace', 'lobby'],
    seoTags: 'ไอดีโอ, โมบิ, รามคำแหง'
  },
  {
    id: 'project-003',
    title: 'แชปเตอร์ วัน ชายน์ บางโพ',
    projectCode: 'CHAP1-SHINE-BP',
    location: 'บางโพ, กรุงเทพฯ',
    status: 'active',
    description: 'คอนโดใหม่ใกล้สถานี MRT บางโพ',
    facilities: ['wifi', 'parking', 'security24h', 'fitness', 'swimmingPool', 'library', 'shuttleService'],
    seoTags: 'แชปเตอร์ วัน, บางโพ, MRT'
  }
]

const CondoFormExample = () => {
  const [mode, setMode] = useState('create') // 'create', 'edit', 'view'
  const [notification, setNotification] = useState(null)

  const handleBack = () => {
    console.log('Back to condo list')
    setNotification({ type: 'info', message: 'กลับสู่รายการคอนโด' })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSave = (data) => {
    console.log('Save condo data:', data)
    setNotification({ 
      type: 'success', 
      message: mode === 'edit' ? 'แก้ไขข้อมูลคอนโดสำเร็จ!' : 'เพิ่มคอนโดใหม่สำเร็จ!' 
    })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleAutoSave = (data) => {
    console.log('Auto save condo data:', data)
    setNotification({ type: 'info', message: 'บันทึกอัตโนมัติสำเร็จ' })
    setTimeout(() => setNotification(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-prompt ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          'bg-blue-500'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Mode Selector (สำหรับทดสอบ) */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 font-prompt">โหมดทดสอบ:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setMode('create')}
                className={`px-3 py-1 rounded text-sm font-medium font-prompt ${
                  mode === 'create' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                เพิ่มใหม่
              </button>
              <button
                onClick={() => setMode('edit')}
                className={`px-3 py-1 rounded text-sm font-medium font-prompt ${
                  mode === 'edit' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                แก้ไข
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <CondoForm
          condo={mode === 'edit' ? mockCondoData : null}
          isEditing={mode === 'edit'}
          onBack={handleBack}
          onSave={handleSave}
          onAutoSave={handleAutoSave}
          // Mock API functions
          mockProjects={mockProjects}
        />
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center text-sm text-gray-500 font-prompt space-y-2">
            <p>🎯 <strong>CondoForm Version 2.0</strong> - Enhanced with Advanced Features</p>
            <p>✨ Features: Auto Save, Real-time Preview, Advanced Validation, Smart Facility Management</p>
            <div className="flex items-center justify-center space-x-4 text-xs">
              <span>📱 Responsive Design</span>
              <span>🚀 Performance Optimized</span>
              <span>🎨 Modern UI/UX</span>
              <span>🔧 Developer Friendly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CondoFormExample