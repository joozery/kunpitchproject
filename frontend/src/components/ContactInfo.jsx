import React, { useState, useEffect } from 'react'
import { 
  Phone, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Smartphone,
  ExternalLink
} from 'lucide-react'
import { contactApi } from '../lib/contactApi'

const ContactInfo = () => {
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    line: '',
    messenger: '',
    whatsapp: '',
    facebook: '',
    instagram: ''
  })
  
  const [isLoading, setIsLoading] = useState(true)

  // Function to get icon color based on contact type
  const getIconColor = (type) => {
    switch (type) {
      case 'phone':
        return 'text-blue-600'
      case 'line':
        return 'text-green-500'
      case 'messenger':
        return 'text-blue-500'
      case 'whatsapp':
        return 'text-green-600'
      case 'facebook':
        return 'text-blue-600'
      case 'instagram':
        return 'text-pink-500'
      default:
        return 'text-gray-600'
    }
  }

  // Function to get contact label
  const getContactLabel = (type) => {
    switch (type) {
      case 'phone':
        return 'เบอร์โทรศัพท์'
      case 'line':
        return 'LINE'
      case 'messenger':
        return 'FB Messenger'
      case 'whatsapp':
        return 'WhatsApp'
      case 'facebook':
        return 'Facebook'
      case 'instagram':
        return 'Instagram'
      default:
        return type
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

  // Load contact info from API
  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        setIsLoading(true)
        const data = await contactApi.getContactSettings()
        setContactInfo(data)
      } catch (err) {
        console.error('Error loading contact info:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadContactInfo()
  }, [])

  const handleContactClick = (type, value) => {
    switch (type) {
      case 'phone':
        window.open(`tel:${value}`, '_self')
        break
      case 'whatsapp':
        window.open(`https://wa.me/${value.replace(/\D/g, '')}`, '_blank')
        break
      case 'line':
        // Line doesn't have direct URL scheme, show copy to clipboard
        navigator.clipboard.writeText(value)
        alert(`คัดลอก Line ID: ${value}`)
        break
      case 'messenger':
      case 'facebook':
      case 'instagram':
        if (value.startsWith('http')) {
          window.open(value, '_blank')
        } else {
          window.open(`https://${value}`, '_blank')
        }
        break
      default:
        break
    }
  }

  const contactItems = [
    {
      key: 'phone',
      icon: Phone
    },
    {
      key: 'line',
      icon: MessageCircle
    },
    {
      key: 'messenger',
      icon: MessageCircle
    },
    {
      key: 'whatsapp',
      icon: Smartphone
    },
    {
      key: 'facebook',
      icon: Facebook
    },
    {
      key: 'instagram',
      icon: Instagram
    }
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Check if there's any contact info
  const hasContactInfo = Object.values(contactInfo).some(value => value)

  if (!hasContactInfo) {
    return null // Don't render if no contact info
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 font-prompt mb-2">
          ช่องทางการติดต่อ
        </h2>
        <p className="text-gray-600 font-prompt">
          ติดต่อเราได้ผ่านช่องทางต่างๆ ด้านล่าง
        </p>
      </div>

      <div className="space-y-3">
        {contactItems.map((item) => {
          const Icon = item.icon
          const value = contactInfo[item.key]
          
          if (!value) return null

          return (
            <div
              key={item.key}
              className="bg-gray-100 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-200 border border-gray-200"
              onClick={() => handleContactClick(item.key, value)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Icon className={`h-7 w-7 ${getIconColor(item.key)}`} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold font-prompt text-lg">{getContactLabel(item.key)}</p>
                  <p className="text-gray-600 font-prompt text-base">{getDisplayValue(item.key, value)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 font-prompt">
          ติดต่อเราได้ตลอด 24 ชั่วโมง
        </p>
        <p className="text-xs text-gray-400 font-prompt mt-1">
          เราจะตอบกลับภายใน 1-2 ชั่วโมง
        </p>
      </div>
    </div>
  )
}

export default ContactInfo 