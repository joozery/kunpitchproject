import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Building2, 
  Home, 
  Landmark, 
  Store, 
  ArrowRight, 
  MapPin, 
  DollarSign, 
  Calendar,
  FileText,
  Camera,
  Upload,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PublicPropertyForm from '../components/PublicPropertyForm'

const ListProperty = () => {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState(null)
  const [step, setStep] = useState(1)

  const propertyTypes = [
    {
      id: 'condo',
      name: 'Condominium',
      description: 'High-rise apartments with amenities',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      features: ['Bedrooms', 'Bathrooms', 'Floor', 'Living Area', 'Facilities']
    },
    {
      id: 'house',
      name: 'House/Townhouse',
      description: 'Single house, townhouse or duplex',
      icon: Home,
      color: 'from-green-500 to-green-600',
      features: ['Bedrooms', 'Bathrooms', 'Floor', 'Living Area', 'Parking', 'Garden']
    },
    {
      id: 'land',
      name: 'Land Plot',
      description: 'Empty land with or without structures',
      icon: Landmark,
      color: 'from-yellow-500 to-yellow-600',
      features: ['Land Area', 'Ownership', 'Title Deed', 'Usage', 'View']
    },
    {
      id: 'commercial',
      name: 'Commercial',
      description: 'Home office, shop house, retail space',
      icon: Store,
      color: 'from-purple-500 to-purple-600',
      features: ['Commercial Space', 'Floor', 'Parking', 'Security System']
    }
  ]

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    setStep(2)
  }

  const handleBackToSelection = () => {
    setSelectedType(null)
    setStep(1)
  }

  const handleFormSubmit = (formData) => {
    // ส่งข้อมูลไปยัง backend หรือ admin สำหรับตรวจสอบ
    console.log('Property submission:', formData)
    
    // แสดงข้อความสำเร็จ
    alert('Thank you for listing your property! Our team will contact you within 24 hours.')
    
    // กลับไปหน้าหลัก
    navigate('/')
  }

  const renderTypeSelection = () => (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <div className="w-6 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          <span className="text-blue-600 font-prompt text-sm md:text-base lg:text-lg uppercase tracking-wider font-medium">List Your Property</span>
          <div className="w-6 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 font-prompt text-gray-900"
        >
          List Your Property
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base text-gray-600 max-w-3xl mx-auto font-prompt leading-relaxed"
        >
          Choose the property type you want to list for sale or rent. 
          We'll help you create an attractive listing that reaches the right customers.
        </motion.p>
      </div>

      {/* Property Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {propertyTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            className="group cursor-pointer"
            onClick={() => handleTypeSelect(type)}
          >
            <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-200 h-full">
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <type.icon className="h-7 w-7 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-center font-prompt group-hover:text-blue-600 transition-colors duration-300">
                {type.name}
              </h3>
              
              <p className="text-gray-600 text-center mb-6 font-prompt leading-relaxed text-sm">
                {type.description}
              </p>
              
              {/* Features */}
              <div className="space-y-2 mb-6">
                {type.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="font-prompt">{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA Button */}
              <div className="text-center mt-auto">
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-prompt">
                  Select This Type
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-8 text-center font-prompt">
          Why Choose Us?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-3 font-prompt">Professional Photography</h3>
            <p className="text-gray-600 font-prompt leading-relaxed text-sm">Our professional photographers will help make your property look attractive</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-3 font-prompt">Professional Listing</h3>
            <p className="text-gray-600 font-prompt leading-relaxed text-sm">Our team will help write attractive listings that draw customers</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-3 font-prompt">Multi-Platform Upload</h3>
            <p className="text-gray-600 font-prompt leading-relaxed text-sm">Listings will be published on multiple platforms to reach more customers</p>
          </div>
        </div>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-center"
      >
        <p className="text-gray-600 mb-4 font-prompt text-base">
          Have questions or need help?
        </p>
        <button 
          onClick={() => navigate('/consult')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-prompt"
        >
          Contact Us
          <ArrowRight className="h-5 w-5" />
        </button>
      </motion.div>
    </div>
  )

  const renderForm = () => {
    if (!selectedType) return null

    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleBackToSelection}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-prompt transition-colors duration-300 text-base"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Property Type Selection
        </motion.button>

        {/* Form Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${selectedType.color} rounded-2xl flex items-center justify-center`}>
              <selectedType.icon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 font-prompt">
              List {selectedType.name}
            </h1>
          </div>
          
          <p className="text-base text-gray-600 max-w-2xl mx-auto font-prompt leading-relaxed">
            Fill in your property details completely so our team can help create an attractive listing.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <PublicPropertyForm
            propertyType={selectedType}
            onBack={handleBackToSelection}
            onSubmit={handleFormSubmit}
          />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        {step === 1 ? renderTypeSelection() : renderForm()}
      </main>
      
      <Footer />
    </div>
  )
}

export default ListProperty 