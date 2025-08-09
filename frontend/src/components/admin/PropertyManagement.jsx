import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table'
import { propertyAPI } from '../../lib/api'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  MapPin,
  Home,
  Bed,
  Bath,
  Train,
  Car,
  Star,
  Heart,
  Grid,
  Table as TableIcon,
  Loader2
} from 'lucide-react'
import PropertyForm from './PropertyForm'

const PropertyManagement = () => {
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('table')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await propertyAPI.getAll()
      
      if (result.success) {
        setProperties(result.data)
        setFilteredProperties(result.data)
      } else {
        setError(result.message || 'ไม่สามารถดึงข้อมูลได้')
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Load properties on component mount
  useEffect(() => {
    fetchProperties()
  }, [])

  // Filter properties based on search and filters
  useEffect(() => {
    let filtered = properties.filter(property => {
      const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || property.type === filterType
      const matchesStatus = filterStatus === 'all' || property.status === filterStatus
      
      return matchesSearch && matchesType && matchesStatus
    })

    setFilteredProperties(filtered)
  }, [properties, searchTerm, filterType, filterStatus])

  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบ Property นี้หรือไม่?')) {
      try {
        const result = await propertyAPI.delete(id)
        
        if (result.success) {
          alert('ลบ Property สำเร็จ!')
          // Refresh the properties list
          fetchProperties()
        } else {
          alert('เกิดข้อผิดพลาดในการลบ: ' + result.message)
        }
      } catch (error) {
        console.error('Delete failed:', error)
        alert('เกิดข้อผิดพลาดในการลบ: ' + error.message)
      }
    }
  }

  const handleAddProperty = async (propertyData) => {
    try {
      // The property is already created in PropertyForm
      // Just refresh the list
      await fetchProperties()
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to refresh properties:', error)
    }
  }

  const handleEditProperty = async (property) => {
    try {
      // Fetch the complete property data including images
      const result = await propertyAPI.getById(property.id)
      
      if (result.success) {
        setEditingProperty(result.data)
        setShowEditForm(true)
      } else {
        alert('ไม่สามารถดึงข้อมูล Property ได้: ' + result.message)
      }
    } catch (error) {
      console.error('Failed to fetch property details:', error)
      alert('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + error.message)
    }
  }

  const handleUpdateProperty = async (propertyData) => {
    try {
      // The property is already updated in PropertyForm
      // Just refresh the list
      await fetchProperties()
      setShowEditForm(false)
      setEditingProperty(null)
    } catch (error) {
      console.error('Failed to refresh properties:', error)
    }
  }

  if (showAddForm) {
    return (
      <PropertyForm 
        onBack={() => setShowAddForm(false)}
        onSave={handleAddProperty}
      />
    )
  }

  if (showEditForm && editingProperty) {
    return (
      <PropertyForm 
        property={editingProperty}
        onBack={() => {
          setShowEditForm(false)
          setEditingProperty(null)
        }}
        onSave={handleUpdateProperty}
        isEditing={true}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600 font-prompt">กำลังโหลดข้อมูล...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-prompt mb-4">{error}</p>
          <Button onClick={fetchProperties} className="bg-blue-600 hover:bg-blue-700">
            ลองใหม่
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">จัดการ Property</h1>
          <p className="text-gray-600 mt-1 font-prompt">จัดการข้อมูลอสังหาริมทรัพย์ทั้งหมดในระบบ</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          เพิ่ม Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">Property ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">{properties.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">พร้อมขาย</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">
                  {properties.filter(p => p.status === 'พร้อมขาย').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">ขายแล้ว</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">
                  {properties.filter(p => p.sold).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">ยอดดูรวม</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">
                  {properties.reduce((sum, p) => sum + p.views, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="ค้นหา Property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">ประเภททั้งหมด</option>
                <option value="คอนโดมิเนียม">คอนโดมิเนียม</option>
                <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
                <option value="ทาวน์เฮาส์">ทาวน์เฮาส์</option>
                <option value="สำนักงาน">สำนักงาน</option>
                <option value="ร้านค้า">ร้านค้า</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="พร้อมขาย">พร้อมขาย</option>
                <option value="ขายแล้ว">ขายแล้ว</option>
                <option value="เช่าแล้ว">เช่าแล้ว</option>
                <option value="กำลังก่อสร้าง">กำลังก่อสร้าง</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <TableIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property List */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-prompt">Property</TableHead>
                    <TableHead className="font-prompt">ประเภท</TableHead>
                    <TableHead className="font-prompt">ที่อยู่</TableHead>
                    <TableHead className="font-prompt">ราคา</TableHead>
                    <TableHead className="font-prompt">สถานะ</TableHead>
                    <TableHead className="font-prompt">ยอดดู</TableHead>
                    <TableHead className="font-prompt">วันที่สร้าง</TableHead>
                    <TableHead className="font-prompt">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(filteredProperties) && filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                            alt={property.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900 font-prompt">{property.title}</p>
                            <p className="text-sm text-gray-500 font-prompt">
                              {property.bedrooms} ห้องนอน • {property.bathrooms} ห้องน้ำ
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-prompt">
                        {property.type === 'residential' ? 'ที่อยู่อาศัย' : 
                         property.type === 'commercial' ? 'เชิงพาณิชย์' : 'ที่ดิน'}
                      </TableCell>
                      <TableCell className="font-prompt">{property.location || property.address}</TableCell>
                      <TableCell className="font-prompt">
                        <div>
                          <p className="font-medium text-gray-900">฿{property.price?.toLocaleString()}</p>
                          {property.rent_price > 0 && (
                            <p className="text-sm text-gray-500">฿{property.rent_price?.toLocaleString()}/เดือน</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full font-prompt ${
                          property.status === 'available' ? 'bg-green-100 text-green-800' :
                          property.status === 'sold' ? 'bg-red-100 text-red-800' :
                          property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status === 'available' ? 'พร้อมขาย' :
                           property.status === 'sold' ? 'ขายแล้ว' :
                           property.status === 'rented' ? 'เช่าแล้ว' : 'รอการยืนยัน'}
                        </span>
                      </TableCell>
                      <TableCell className="font-prompt">{property.views || 0}</TableCell>
                      <TableCell className="font-prompt">
                        {new Date(property.created_at).toLocaleDateString('th-TH')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditProperty(property)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(property.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(filteredProperties) && filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  {property.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      แนะนำ
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 font-prompt">{property.title}</h3>
                      <p className="text-sm text-gray-500 font-prompt">{property.location || property.address}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 font-prompt">
                      <div className="flex items-center space-x-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Car className="h-4 w-4" />
                        <span>{property.parking || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 font-prompt">฿{property.price?.toLocaleString()}</p>
                        {property.rent_price > 0 && (
                          <p className="text-sm text-gray-500 font-prompt">฿{property.rent_price?.toLocaleString()}/เดือน</p>
                        )}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full font-prompt ${
                        property.status === 'available' ? 'bg-green-100 text-green-800' :
                        property.status === 'sold' ? 'bg-red-100 text-red-800' :
                        property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status === 'available' ? 'พร้อมขาย' :
                         property.status === 'sold' ? 'ขายแล้ว' :
                         property.status === 'rented' ? 'เช่าแล้ว' : 'รอการยืนยัน'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 font-prompt">
                        <Eye className="h-4 w-4" />
                        <span>{property.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditProperty(property)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(property.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default PropertyManagement 