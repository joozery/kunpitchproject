import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter,
  Home, 
  Building2, 
  Landmark,
  MapPin,
  DollarSign,
  ArrowRight,
  Grid,
  List
} from 'lucide-react'
import { propertyAPI } from '../lib/api'
import Header from '../components/Header'

const Properties = () => {
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPrice, setFilterPrice] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Page Header */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-prompt">
              Property ทั้งหมด
            </h1>
            <p className="text-xl text-blue-100 font-prompt">
              ค้นหาอสังหาริมทรัพย์ที่ใช่สำหรับคุณ
            </p>
          </div>
        </div>
      </section>

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
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-8">
                <p className="text-gray-600 font-prompt">
                  พบ {filteredProperties.length} Property
                </p>
              </div>

              {/* Properties Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="relative">
                        <img
                          src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {getTypeLabel(property.type)}
                        </div>
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(property.status)}`}>
                          {getStatusLabel(property.status)}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-prompt">{property.title}</h3>
                        <p className="text-gray-600 mb-4 font-prompt flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {property.location || property.address}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Home className="h-4 w-4" />
                              <span>{property.bedrooms || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Building2 className="h-4 w-4" />
                              <span>{property.bathrooms || 0}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-blue-600">฿{property.price?.toLocaleString()}</div>
                            {property.rent_price > 0 && (
                              <div className="text-sm text-gray-500">฿{property.rent_price?.toLocaleString()}/เดือน</div>
                            )}
                          </div>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2">
                          <span>ดูรายละเอียด</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="relative md:w-1/3">
                          <img
                            src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                            alt={property.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {getTypeLabel(property.type)}
                          </div>
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2 font-prompt">{property.title}</h3>
                              <p className="text-gray-600 mb-4 font-prompt flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {property.location || property.address}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                <div className="flex items-center space-x-1">
                                  <Home className="h-4 w-4" />
                                  <span>{property.bedrooms || 0} ห้องนอน</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Building2 className="h-4 w-4" />
                                  <span>{property.bathrooms || 0} ห้องน้ำ</span>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(property.status)}`}>
                                  {getStatusLabel(property.status)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600 mb-2">฿{property.price?.toLocaleString()}</div>
                              {property.rent_price > 0 && (
                                <div className="text-sm text-gray-500 mb-4">฿{property.rent_price?.toLocaleString()}/เดือน</div>
                              )}
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center space-x-2">
                                <span>ดูรายละเอียด</span>
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {filteredProperties.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-prompt">
                    ไม่พบ Property ที่ตรงกับเงื่อนไข
                  </h3>
                  <p className="text-gray-600 font-prompt">
                    ลองเปลี่ยนเงื่อนไขการค้นหาหรือติดต่อเราเพื่อขอคำปรึกษา
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Properties 