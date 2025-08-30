import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Grid,
  Table as TableIcon,
  Loader2,
  Star,
  Heart,
  Maximize,
  Building,
  Car,
  Wifi,
  Coffee
} from 'lucide-react'
import { commercialApi } from '../../lib/projectApi'
import { usePermissions } from '../../contexts/PermissionContext'
import PermissionGuard from './PermissionGuard'

const CommercialManagement = () => {
  const { canDelete } = usePermissions();
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState('table')

  // ดึงข้อมูลจาก API จริง
  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await commercialApi.getAll()
      console.log('ดึงข้อมูลโฮมออฟฟิศ/ตึกแถวสำเร็จ:', result)
      setProperties(result.data || [])
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err)
      setError('ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง')
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
      return
    }

    try {
      await commercialApi.delete(id)
      console.log('ลบโฮมออฟฟิศ/ตึกแถวสำเร็จ:', id)
      alert('ลบรายการสำเร็จ!')
      fetchProperties() // ดึงข้อมูลใหม่
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการลบ:', err)
      alert('เกิดข้อผิดพลาดในการลบ กรุณาลองใหม่อีกครั้ง')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'available': 'bg-green-100 text-green-800',
      'sold': 'bg-red-100 text-red-800',
      'rented': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const statusText = {
      'available': 'ว่าง',
      'sold': 'ขายแล้ว',
      'rented': 'เช่าแล้ว',
      'pending': 'รอดำเนินการ'
    }
    return statusText[status] || status
  }

  const getTypeText = (type) => {
    const typeText = {
      'home_office': 'โฮมออฟฟิศ',
      'shophouse': 'ตึกแถว',
      'office_building': 'อาคารสำนักงาน',
      'retail_space': 'ร้านค้า',
      'warehouse': 'โกดัง'
    }
    return typeText[type] || type
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus
    const matchesType = filterType === 'all' || property.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="text-gray-600 font-prompt">กำลังโหลดข้อมูลโฮมออฟฟิศ/ตึกแถว...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 font-prompt">เกิดข้อผิดพลาด</h3>
          <p className="text-gray-600 font-prompt">{error}</p>
          <Button onClick={fetchProperties} className="bg-purple-600 hover:bg-purple-700">
            ลองใหม่อีกครั้ง
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
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">โฮมออฟฟิศ/ตึกแถว</h1>
          <p className="text-gray-600 mt-1 font-prompt">จัดการข้อมูลโฮมออฟฟิศ ตึกแถว และอสังหาริมทรัพย์เชิงพาณิชย์ในระบบ</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => navigate('/admin/commercial/add')}
        >
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มอสังหาฯ
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">ทรัพย์สินทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">{properties.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">ว่าง</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">
                  {properties.filter(p => p.status === 'available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">เช่าแล้ว</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">
                  {properties.filter(p => p.status === 'rented').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">มูลค่ารวม</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">
                  ฿{(properties.reduce((sum, p) => sum + p.price, 0) / 1000000).toFixed(1)}M
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
                  placeholder="ค้นหาอสังหาฯ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="available">ว่าง</option>
                <option value="sold">ขายแล้ว</option>
                <option value="rented">เช่าแล้ว</option>
                <option value="pending">รอดำเนินการ</option>
              </select>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">ประเภททั้งหมด</option>
                <option value="home_office">โฮมออฟฟิศ</option>
                <option value="shophouse">ตึกแถว</option>
                <option value="office_building">อาคารสำนักงาน</option>
                <option value="retail_space">ร้านค้า</option>
                <option value="warehouse">โกดัง</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 ${viewMode === 'table' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <TableIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}
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
              {filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🏢</div>
                  <h3 className="text-lg font-semibold text-gray-900 font-prompt mb-2">ยังไม่มีข้อมูลโฮมออฟฟิศ/ตึกแถว</h3>
                  <p className="text-gray-600 font-prompt mb-6">เริ่มต้นโดยการเพิ่มข้อมูลโฮมออฟฟิศ/ตึกแถวใหม่</p>
                  <Button 
                    onClick={() => navigate('/admin/commercial/add')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    เพิ่มโฮมออฟฟิศ/ตึกแถวใหม่
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-prompt">อสังหาฯ</TableHead>
                      <TableHead className="font-prompt">ประเภท</TableHead>
                      <TableHead className="font-prompt">ที่อยู่</TableHead>
                      <TableHead className="font-prompt">ราคา</TableHead>
                      <TableHead className="font-prompt">สถานะ</TableHead>
                      <TableHead className="font-prompt">ขนาด</TableHead>
                      <TableHead className="font-prompt">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={property.cover_image || property.images?.[0] || '/placeholder-image.jpg'}
                              alt={property.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium text-gray-900 font-prompt">{property.title}</p>
                              <p className="text-sm text-gray-500 font-prompt">
                                {property.floors || 0} ชั้น • {property.parking_spaces || 0} ที่จอด
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-prompt">{getTypeText(property.property_type)}</TableCell>
                        <TableCell className="font-prompt">{property.location}</TableCell>
                        <TableCell className="font-prompt">
                          <div>
                            <p className="font-medium text-gray-900">฿{Number(property.price || 0).toLocaleString('th-TH')}</p>
                            {Number(property.rent_price) > 0 && (
                              <p className="text-sm text-gray-500">฿{Number(property.rent_price).toLocaleString('th-TH')}/เดือน</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full font-prompt ${getStatusColor(property.status)}`}>
                            {getStatusText(property.status)}
                          </span>
                        </TableCell>
                        <TableCell className="font-prompt">{property.area || 0} ตร.ม.</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/admin/commercial/edit/${property.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <PermissionGuard requiredPermission="canDelete">
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(property.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏢</div>
                <h3 className="text-lg font-semibold text-gray-900 font-prompt mb-2">ยังไม่มีข้อมูลโฮมออฟฟิศ/ตึกแถว</h3>
                <p className="text-gray-600 font-prompt mb-6">เริ่มต้นโดยการเพิ่มข้อมูลโฮมออฟฟิศ/ตึกแถวใหม่</p>
                <Button 
                  onClick={() => navigate('/admin/commercial/add')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มโฮมออฟฟิศ/ตึกแถวใหม่
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={property.cover_image || property.images?.[0] || '/placeholder-image.jpg'}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status)}`}>
                          {getStatusText(property.status)}
                        </span>
                      </div>
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
                          <p className="text-sm text-gray-500 font-prompt">{property.location}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 font-prompt">
                          <div className="flex items-center space-x-1">
                            <Maximize className="h-4 w-4" />
                            <span>{property.area || 0} ตร.ม.</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Car className="h-4 w-4" />
                            <span>{property.parking_spaces || 0} ที่จอด</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 font-prompt">฿{Number(property.price || 0).toLocaleString('th-TH')}</p>
                            {Number(property.rent_price) > 0 && (
                              <p className="text-sm text-gray-500 font-prompt">฿{Number(property.rent_price).toLocaleString('th-TH')}/เดือน</p>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 font-prompt">
                            {property.floors || 0} ชั้น
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="text-sm text-gray-500 font-prompt">
                            {getTypeText(property.property_type)} • {property.building_age || 'N/A'}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/admin/commercial/edit/${property.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <PermissionGuard requiredPermission="canDelete">
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(property.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default CommercialManagement