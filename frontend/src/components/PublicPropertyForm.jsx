import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Home, 
  Landmark, 
  Store, 
  MapPin, 
  DollarSign, 
  Calendar,
  Camera,
  Upload,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const PublicPropertyForm = ({ propertyType, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    status: 'sale', // sale, rent, both
    price: '',
    rentPrice: '',
    
    // Location
    location: '',
    district: '',
    province: '',
    
    // Description
    description: '',
    
    // Property Details (adjust based on type)
    area: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    
    // Contact Information
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactLine: '',
    
    // Additional Information
    additionalInfo: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState([])

  const getPropertyTypeConfig = () => {
    switch (propertyType.id) {
      case 'condo':
        return {
          title: 'Condominium',
          icon: Building2,
          color: 'from-blue-500 to-blue-600',
          fields: ['bedrooms', 'bathrooms', 'floor', 'area'],
          areaUnit: 'sq.m.'
        }
      case 'house':
        return {
          title: 'House/Townhouse',
          icon: Home,
          color: 'from-green-500 to-green-600',
          fields: ['bedrooms', 'bathrooms', 'floor', 'area'],
          areaUnit: 'sq.m.'
        }
      case 'land':
        return {
          title: 'Land Plot',
          icon: Landmark,
          color: 'from-yellow-500 to-yellow-600',
          fields: ['area'],
          areaUnit: 'sq.wa'
        }
      case 'commercial':
        return {
          title: 'Commercial',
          icon: Store,
          color: 'from-purple-500 to-purple-600',
          fields: ['area', 'floor'],
          areaUnit: 'sq.m.'
        }
      default:
        return {
          title: 'Property',
          icon: Building2,
          color: 'from-gray-500 to-gray-600',
          fields: ['area'],
          areaUnit: 'sq.m.'
        }
    }
  }

  const config = getPropertyTypeConfig()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) newErrors.title = 'Please enter listing title'
    if (!formData.location.trim()) newErrors.location = 'Please enter location'
    if (!formData.price.trim() && formData.status !== 'rent') newErrors.price = 'Please enter sale price'
    if (!formData.rentPrice.trim() && formData.status !== 'sale') newErrors.rentPrice = 'Please enter rent price'
    if (!formData.contactName.trim()) newErrors.contactName = 'Please enter contact name'
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Please enter phone number'
    
    // Validate property-specific fields
    config.fields.forEach(field => {
      if (field === 'bedrooms' && formData.bedrooms && parseInt(formData.bedrooms) < 0) {
        newErrors.bedrooms = 'Number of bedrooms must not be less than 0'
      }
      if (field === 'bathrooms' && formData.bathrooms && parseInt(formData.bathrooms) < 0) {
        newErrors.bathrooms = 'Number of bathrooms must not be less than 0'
      }
      if (field === 'area' && formData.area && parseFloat(formData.area) <= 0) {
        newErrors.area = 'Area must be greater than 0'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Send data to backend
      const submissionData = {
        ...formData,
        propertyType: propertyType.id,
        submittedAt: new Date().toISOString(),
        status: 'pending' // Wait for admin review
      }
      
      console.log('Submitting property:', submissionData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Success
      onSubmit(submissionData)
      
    } catch (error) {
      console.error('Submission error:', error)
      alert('An error occurred while submitting. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index)
      return newImages
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-xl flex items-center justify-center`}>
              <config.icon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-prompt">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                Listing Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 2BR Condo with Furniture"
              />
              {errors.title && (
                <p className="mt-2 text-red-600 flex items-center gap-2 font-prompt text-xs">
                  <AlertCircle className="h-4 w-4" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                Listing Type *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="both">Sale/Rent</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                Sale Price (THB)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 3500000"
                disabled={formData.status === 'rent'}
              />
              {errors.price && (
                <p className="mt-2 text-red-600 flex items-center gap-2 font-prompt text-xs">
                  <AlertCircle className="h-4 w-4" />
                  {errors.price}
                </p>
              )}
            </div>

            {/* Rent Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                Rent Price (THB/month)
              </label>
              <input
                type="number"
                value={formData.rentPrice}
                onChange={(e) => handleInputChange('rentPrice', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt ${
                  errors.rentPrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 25000"
                disabled={formData.status === 'sale'}
              />
              {errors.rentPrice && (
                <p className="mt-2 text-red-600 flex items-center gap-2 font-prompt text-xs">
                  <AlertCircle className="h-4 w-4" />
                  {errors.rentPrice}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-prompt">Location</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                Address *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Silom, Bangrak, Bangkok"
              />
              {errors.location && (
                <p className="mt-2 text-red-600 flex items-center gap-2 font-prompt text-xs">
                  <AlertCircle className="h-4 w-4" />
                  {errors.location}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt"
                placeholder="e.g., Bangrak"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                Province
              </label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt"
                placeholder="e.g., Bangkok"
              />
            </div>
          </div>
        </motion.div>

        {/* Property Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-prompt">Property Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bedrooms */}
            {config.fields.includes('bedrooms') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                  Number of Bedrooms
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt ${
                    errors.bedrooms ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 2"
                  min="0"
                />
                {errors.bedrooms && (
                  <p className="mt-2 text-red-600 flex items-center gap-2 font-prompt text-xs">
                    <AlertCircle className="h-4 w-4" />
                    {errors.bedrooms}
                  </p>
                )}
              </div>
            )}

            {/* Bathrooms */}
            {config.fields.includes('bathrooms') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                  Number of Bathrooms
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt ${
                    errors.bathrooms ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 1"
                  min="0"
                />
                {errors.bathrooms && (
                  <p className="mt-2 text-red-600 flex items-center gap-2 font-prompt text-xs">
                    <AlertCircle className="h-4 w-4" />
                    {errors.bathrooms}
                  </p>
                )}
              </div>
            )}

            {/* Floor */}
            {config.fields.includes('floor') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                  Floor
                </label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt"
                  placeholder="e.g., 15 or 17-18 (for duplex)"
                />
              </div>
            )}

            {/* Area */}
            {config.fields.includes('area') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                  Area ({config.areaUnit}) *
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt ${
                    errors.area ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={`e.g., 45`}
                  step="0.01"
                  min="0"
                />
                {errors.area && (
                  <p className="mt-2 text-red-600 flex items-center gap-2 font-prompt text-xs">
                    <AlertCircle className="h-4 w-4" />
                    {errors.area}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-prompt">Additional Details</h2>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
              Property Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt"
              placeholder="Describe your property details such as amenities, view, transportation, etc."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
              Additional Information
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt"
              placeholder="Other information you want to share such as special conditions, viewing time, etc."
            />
          </div>
        </motion.div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-prompt">Images</h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3 font-prompt">
              Upload Images (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-prompt text-sm mb-2">
                  Click to select images or drag and drop files here
                </p>
                <p className="text-xs text-gray-500 font-prompt">
                  Supports JPG, PNG files up to 5MB
                </p>
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-prompt">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                Contact Name *
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt ${
                  errors.contactName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="First Name - Last Name"
              />
              {errors.contactName && (
                <p className="mt-2 text-red-600 flex items-center gap-2 font-prompt text-xs">
                  <AlertCircle className="h-4 w-4" />
                  {errors.contactName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt ${
                  errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 0812345678"
              />
              {errors.contactPhone && (
                <p className="mt-2 text-red-600 flex items-center gap-2 font-prompt text-xs">
                  <AlertCircle className="h-4 w-4" />
                  {errors.contactPhone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt"
                placeholder="e.g., example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-prompt">
                Line ID
              </label>
              <input
                type="text"
                value={formData.contactLine}
                onChange={(e) => handleInputChange('contactLine', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-prompt"
                placeholder="e.g., whalespace"
              />
            </div>
          </div>
        </motion.div>

        {/* Submit Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
        >
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300 font-prompt text-sm"
          >
            <ArrowLeft className="h-5 w-5 inline mr-2" />
            Back to Selection
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-prompt text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 inline mr-2" />
                Submit Property Listing
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  )
}

export default PublicPropertyForm 