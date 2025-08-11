import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { 
  Phone, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Smartphone,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { contactApi, validateContactData, checkApiConnection } from '../../lib/contactApi'

const ContactSettings = () => {
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    line: '',
    messenger: '',
    whatsapp: '',
    facebook: '',
    instagram: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState('')
  const [isApiConnected, setIsApiConnected] = useState(true)

  // Load contact info from API on component mount
  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        setIsLoading(true)
        
        // ตรวจสอบการเชื่อมต่อ API
        const apiConnected = await checkApiConnection()
        setIsApiConnected(apiConnected)
        
        const data = await contactApi.getContactSettings()
        setContactInfo(data)
      } catch (err) {
        console.error('Error loading contact info:', err)
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลการติดต่อ')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadContactInfo()
  }, [])

  const handleInputChange = (field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }))
    setIsSaved(false)
    setError('')
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // Validate data
      const validationErrors = validateContactData(contactInfo)
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '))
        return
      }
      
      // Save to API
      await contactApi.saveContactSettings(contactInfo)
      
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
      const data = await contactApi.getContactSettings()
      setContactInfo(data)
      setIsSaved(false)
      setError('')
    } catch (err) {
      console.error('Error resetting contact info:', err)
      setError('เกิดข้อผิดพลาดในการรีเซ็ตข้อมูล')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to get display value (hide URLs, show only relevant info)
  const getDisplayValue = (type, value) => {
    switch (type) {
      case 'phone':
        return value
      case 'line':
        return value
      case 'messenger':
        return 'คลิกเพื่อเปิด Messenger'
      case 'whatsapp':
        return value
      case 'facebook':
        return 'คลิกเพื่อเปิด Facebook'
      case 'instagram':
        return 'คลิกเพื่อเปิด Instagram'
      default:
        return value
    }
  }

  const contactFields = [
    {
      key: 'phone',
      label: 'เบอร์โทรศัพท์',
      placeholder: 'กรอกเบอร์โทรศัพท์ เช่น 081-234-5678',
      icon: Phone,
      type: 'tel',
      description: 'เบอร์โทรศัพท์สำหรับติดต่อลูกค้า'
    },
    {
      key: 'line',
      label: 'Line ID',
      placeholder: 'กรอก Line ID เช่น @whalespace',
      icon: MessageCircle,
      type: 'text',
      description: 'Line ID สำหรับติดต่อผ่าน Line'
    },
    {
      key: 'messenger',
      label: 'Facebook Messenger',
      placeholder: 'กรอก Facebook Messenger URL เช่น https://www.facebook.com/messages/t/100048118276424',
      icon: MessageCircle,
      type: 'url',
      description: 'ลิงก์ Facebook Messenger สำหรับติดต่อ (จะไม่แสดงลิงก์ให้ลูกค้าเห็น)'
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      placeholder: 'กรอกเบอร์ WhatsApp เช่น 66812345678',
      icon: Smartphone,
      type: 'tel',
      description: 'เบอร์ WhatsApp สำหรับติดต่อ'
    },
    {
      key: 'facebook',
      label: 'Facebook',
      placeholder: 'กรอก Facebook URL เช่น https://facebook.com/whalespace',
      icon: Facebook,
      type: 'url',
      description: 'ลิงก์ Facebook Page สำหรับติดต่อ (จะไม่แสดงลิงก์ให้ลูกค้าเห็น)'
    },
    {
      key: 'instagram',
      label: 'Instagram',
      placeholder: 'กรอก Instagram URL เช่น https://instagram.com/whalespace',
      icon: Instagram,
      type: 'url',
      description: 'ลิงก์ Instagram Profile สำหรับติดต่อ (จะไม่แสดงลิงก์ให้ลูกค้าเห็น)'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-prompt">ตั้งค่าการติดต่อ</h1>
        <p className="text-gray-600 mt-2 font-prompt">
          ตั้งค่าข้อมูลการติดต่อสำหรับลูกค้า เช่น เบอร์โทร Line Facebook และอื่นๆ
        </p>
      </div>

      {/* Connection Status */}
      {!isApiConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-800 font-prompt">
            ไม่สามารถเชื่อมต่อกับ API ได้ ระบบจะใช้ localStorage แทน
          </span>
        </div>
      )}

      {/* Success/Error Messages */}
      {isSaved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-prompt">บันทึกข้อมูลเรียบร้อยแล้ว</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800 font-prompt">{error}</span>
        </div>
      )}

      {/* Contact Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <span className="font-prompt">ข้อมูลการติดต่อ</span>
          </CardTitle>
          <CardDescription className="font-prompt">
            ตั้งค่าข้อมูลการติดต่อต่างๆ ที่ลูกค้าสามารถใช้ติดต่อได้
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactFields.map((field) => {
              const Icon = field.icon
              return (
                <div key={field.key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 font-prompt flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span>{field.label}</span>
                  </label>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={contactInfo[field.key]}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="font-prompt"
                  />
                  <p className="text-xs text-gray-500 font-prompt">{field.description}</p>
                </div>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 font-prompt"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isLoading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}</span>
            </Button>
            
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex items-center space-x-2 font-prompt"
            >
              <RefreshCw className="h-4 w-4" />
              <span>รีเซ็ต</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-prompt">ตัวอย่างการแสดงผล</CardTitle>
          <CardDescription className="font-prompt">
            ตัวอย่างการแสดงผลข้อมูลการติดต่อในหน้าเว็บไซต์
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 font-prompt mb-4">ช่องทางการติดต่อ</h3>
            <div className="space-y-3">
              {contactFields.map((field) => {
                if (!contactInfo[field.key]) return null
                const Icon = field.icon
                return (
                  <div key={field.key} className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Icon className="h-7 w-7 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-semibold font-prompt text-lg">{field.label}</p>
                        <p className="text-gray-600 font-prompt text-base">{getDisplayValue(field.key, contactInfo[field.key])}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {Object.values(contactInfo).every(value => !value) && (
              <p className="text-gray-500 text-center py-8 font-prompt">
                ยังไม่มีข้อมูลการติดต่อ กรุณาตั้งค่าข้อมูลก่อน
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-prompt">คำแนะนำการใช้งาน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600 font-prompt">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 font-semibold">•</span>
            <span>กรอกข้อมูลการติดต่อที่ต้องการให้ลูกค้าเห็น</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 font-semibold">•</span>
            <span>ข้อมูลจะถูกแสดงในหน้าเว็บไซต์สำหรับลูกค้า</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 font-semibold">•</span>
            <span>สามารถเพิ่มหรือแก้ไขข้อมูลได้ตลอดเวลา</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 font-semibold">•</span>
            <span>ข้อมูลจะถูกบันทึกในเบราว์เซอร์ (ในอนาคตจะเชื่อมต่อกับฐานข้อมูล)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ContactSettings 