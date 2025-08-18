import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Home as HomeIcon, Building2, Eye, Heart, ArrowRight, Bed, Bath, Search, Grid, List, Eye as EyeIcon } from 'lucide-react'
import { propertyAPI } from '../lib/api'
import Header from '../components/Header'
import { useCurrency } from '../lib/CurrencyContext'

const Properties = () => {
  const { convert, format } = useCurrency()
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPrice, setFilterPrice] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  // Click tracking state
  const [clickCounts, setClickCounts] = useState({})

  // Handle card click
  const handleCardClick = (propertyId, propertyType) => {
    setClickCounts(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] || 0) + 1
    }))
    
    // Log click for analytics
    console.log(`Properties page card clicked: ${propertyType} - ID: ${propertyId}, Clicks: ${(clickCounts[propertyId] || 0) + 1}`)
    
    // Here you can add API call to save click data to database
    // saveClickData(propertyId, propertyType)
  }

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const result = await propertyAPI.getAll()
        if (result.success) {
          setProperties(result.data)
          setFilteredProperties(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Filter properties
  useEffect(() => {
    let filtered = properties.filter(property => {
      const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || property.type === filterType
      const matchesStatus = filterStatus === 'all' || property.status === filterStatus
      
      let matchesPrice = true
      if (filterPrice !== 'all') {
        const price = property.price || 0
        switch (filterPrice) {
          case '0-1000000':
            matchesPrice = price >= 0 && price <= 1000000
            break
          case '1000000-5000000':
            matchesPrice = price > 1000000 && price <= 5000000
            break
          case '5000000+':
            matchesPrice = price > 5000000
            break
        }
      }
      
      return matchesSearch && matchesType && matchesStatus && matchesPrice
    })

    setFilteredProperties(filtered)
  }, [properties, searchTerm, filterType, filterStatus, filterPrice])

  const getTypeLabel = (type) => {
    switch (type) {
      case 'residential':
        return 'ที่อยู่อาศัย'
      case 'commercial':
        return 'เชิงพาณิชย์'
      case 'land':
        return 'ที่ดิน'
      default:
        return type
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available':
        return 'พร้อมขาย'
      case 'sold':
        return 'ขายแล้ว'
      case 'rented':
        return 'เช่าแล้ว'
      case 'pending':
        return 'รอการยืนยัน'
      default:
        return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'sold':
        return 'bg-red-100 text-red-800'
      case 'rented':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (price) => {
    if (!price) return '0'
    // Convert to number and remove decimals
    const numPrice = parseFloat(price) || 0
    return Math.floor(numPrice).toLocaleString('th-TH')
  }

  const formatRentPrice = (rentPrice) => {
    if (!rentPrice) return null
    // Convert to number and remove decimals
    const numRentPrice = parseFloat(rentPrice) || 0
    return Math.floor(numRentPrice).toLocaleString('th-TH')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-4 font-prompt"
          >
            Properties
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-blue-100 font-prompt"
          >
            Discover your perfect property
          </motion.p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="ค้นหาตามชื่อหรือที่อยู่..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">ประเภททั้งหมด</option>
                <option value="residential">ที่อยู่อาศัย</option>
                <option value="commercial">เชิงพาณิชย์</option>
                <option value="land">ที่ดิน</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="available">พร้อมขาย</option>
                <option value="sold">ขายแล้ว</option>
                <option value="rented">เช่าแล้ว</option>
                <option value="pending">รอการยืนยัน</option>
              </select>

              <select
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">ราคาทั้งหมด</option>
                <option value="0-1000000">0 - 1,000,000</option>
                <option value="1000000-5000000">1,000,000 - 5,000,000</option>
                <option value="5000000+">5,000,000+</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
              {/* Results Count */}
              <div className="mb-8">
                <p className="text-gray-600 font-prompt">
                  Found {filteredProperties.length} Properties
                </p>
              </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

              {/* Properties Grid/List */}
          {!loading && (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative bg-white rounded-2xl overflow-hidden transition-all duration-700 transform hover:-translate-y-2 h-full flex flex-col group cursor-pointer"
                        style={{
                          background: '#ffffff',
                          border: '3px solid transparent',
                          borderRadius: '16px',
                          backgroundImage: 'linear-gradient(#ffffff, #ffffff), linear-gradient(135deg, #3b82f6, #6b7280, #f59e0b)',
                          backgroundOrigin: 'border-box',
                          backgroundClip: 'content-box, border-box',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59,130,246,0.2)'
                        }}
                      >
                         {/* Gradient Border Overlay */}
                         <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-gray-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                         
                         {/* Shimmer Effect */}
                         <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                        
                      <div className="relative">
                        <img
                          src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                          alt={property.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          
                          {/* Enhanced Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          <div className="absolute top-4 left-4">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm border border-white/20">
                          {getTypeLabel(property.type)}
                        </div>
                          </div>
                          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm border border-white/20 ${getStatusColor(property.status)}`}>
                          {getStatusLabel(property.status)}
                        </div>
                        
                      </div>
                      <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 font-prompt group-hover:text-blue-600 transition-colors duration-300">{property.title}</h3>
                        <p className="text-gray-600 mb-4 font-prompt flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                          {property.location || property.address}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                                <HomeIcon className="h-4 w-4 text-blue-500" />
                              <span>{property.bedrooms || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Building2 className="h-4 w-4 text-blue-500" />
                              <span>{property.bathrooms || 0}</span>
                            </div>
                          </div>
                          <div className="text-right">
                             <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">{format(convert(property.price))}</div>
                             {property.rent_price > 0 && (
                               <div className="text-sm text-gray-500">{format(convert(property.rent_price))}/เดือน</div>
                             )}
                             {/* Click Count near Price */}
                             <div className="flex items-center justify-end mt-2 text-sm text-gray-500">
                               <EyeIcon className="h-4 w-4 mr-1 text-green-500" />
                               <span>{clickCounts[property.id] || 0} ครั้ง</span>
                             </div>
                           </div>
                          </div>
                          <button className="w-full bg-gradient-to-r from-blue-600 via-gray-600 to-yellow-500 text-white py-3 rounded-xl font-bold transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group-hover:from-blue-500 group-hover:via-gray-500 group-hover:to-yellow-400 relative overflow-hidden"
                           onClick={() => handleCardClick(property.id, property.type)}
                         >
                            <span className="relative z-10">ดูรายละเอียด</span>
                            <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                            
                            {/* Button Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-500 text-lg">No properties found matching your search</div>
                    </div>
                  )}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-6">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative bg-white rounded-2xl overflow-hidden transition-all duration-700 transform hover:-translate-y-2 h-full flex group cursor-pointer"
                        style={{
                          background: '#ffffff',
                          border: '3px solid transparent',
                          borderRadius: '16px',
                          backgroundImage: 'linear-gradient(#ffffff, #ffffff), linear-gradient(135deg, #3b82f6, #6b7280, #f59e0b)',
                          backgroundOrigin: 'border-box',
                          backgroundClip: 'content-box, border-box',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59,130,246,0.2)'
                        }}
                      >
                        {/* Gradient Border Overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-gray-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                        
                        <div className="relative">
                          <img
                            src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                            alt={property.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          
                          {/* Enhanced Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          <div className="absolute top-4 left-4">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm border border-white/20">
                            {getTypeLabel(property.type)}
                            </div>
                          </div>
                          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm border border-white/20 ${getStatusColor(property.status)}`}>
                            {getStatusLabel(property.status)}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 font-prompt group-hover:text-blue-600 transition-colors duration-300">{property.title}</h3>
                              <p className="text-gray-600 mb-4 font-prompt flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                                {property.location || property.address}
                              </p>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                <HomeIcon className="h-4 w-4 text-blue-500" />
                                <span>{property.bedrooms || 0}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                <Building2 className="h-4 w-4 text-blue-500" />
                                <span>{property.bathrooms || 0}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">{format(convert(property.price))}</div>
                              {property.rent_price > 0 && (
                                <div className="text-sm text-gray-500">{format(convert(property.rent_price))}/เดือน</div>
                              )}
                              {/* Click Count near Price */}
                              <div className="flex items-center justify-end mt-2 text-sm text-gray-500">
                                <EyeIcon className="h-4 w-4 mr-1 text-green-500" />
                                <span>{clickCounts[property.id] || 0} ครั้ง</span>
                              </div>
                            </div>
                          </div>
                          <button className="w-full bg-gradient-to-r from-blue-600 via-gray-600 to-yellow-500 text-white py-3 rounded-xl font-bold transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group-hover:from-blue-500 group-hover:via-gray-500 group-hover:to-yellow-400 relative overflow-hidden"
                            onClick={() => handleCardClick(property.id, property.type)}
                          >
                            <span className="relative z-10">ดูรายละเอียด</span>
                            <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                            
                            {/* Button Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-500 text-lg">No properties found matching your search</div>
                    </div>
                  )}
                </div>
              )}
            </>
              )}

              {/* No Results */}
              {filteredProperties.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-prompt">
                    No Properties Found
                  </h3>
                  <p className="text-gray-600 font-prompt">
                    Try adjusting your search criteria or contact us for assistance
                  </p>
                </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Properties 