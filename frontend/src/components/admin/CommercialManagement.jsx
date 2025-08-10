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

const CommercialManagement = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState('table')

  // Mock data for commercial properties
  useEffect(() => {
    const mockProperties = [
      {
        id: 1,
        title: 'โฮมออฟฟิศ 3 ชั้น ย่านธุรกิจ',
        location: 'สาทร, กรุงเทพฯ',
        price: 12000000,
        rentPrice: 65000,
        usableArea: 180,
        parkingSpaces: 3,
        floors: 3,
        status: 'available',
        type: 'home_office',
        yearBuilt: 2020,
        features: ['ตกแต่งพร้อม', 'ลิฟต์', 'ระบบรักษาความปลอดภัย', 'ที่จอดรถ'],
        facilities: ['ห้องประชุม', 'ครัวเล็ก', 'ห้องน้ำแยก', 'ระเบียง'],
        utilities: {
          internet: true,
          aircon: true,
          parking: true,
          security: true
        },
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        title: 'ตึกแถว 4 ชั้น หน้ากว้าง',
        location: 'ห้วยขวาง, กรุงเทพฯ',
        price: 18500000,
        rentPrice: 85000,
        usableArea: 320,
        parkingSpaces: 2,
        floors: 4,
        status: 'available',
        type: 'shophouse',
        yearBuilt: 2018,
        features: ['หน้าร้านกว้าง', 'ติดถนนใหญ่', 'ลิฟต์สินค้า', 'โกดังหลังบ้าน'],
        facilities: ['ห้องน้ำแยกชาย-หญิง', 'ครัวใหญ่', 'ระบบดับเพลิง', 'ที่จอดรถ'],
        utilities: {
          internet: true,
          aircon: true,
          parking: true,
          security: false
        },
        images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        createdAt: '2024-01-12'
      }
    ]

    setTimeout(() => {
      setProperties(mockProperties)
      setLoading(false)
    }, 1000)
  }, [])

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
          <span className="text-gray-600 font-prompt">กำลังโหลดข้อมูล...</span>
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
                            src={property.images[0]}
                            alt={property.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900 font-prompt">{property.title}</p>
                            <p className="text-sm text-gray-500 font-prompt">
                              {property.floors} ชั้น • {property.parkingSpaces} ที่จอด
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-prompt">{getTypeText(property.type)}</TableCell>
                      <TableCell className="font-prompt">{property.location}</TableCell>
                      <TableCell className="font-prompt">
                        <div>
                          <p className="font-medium text-gray-900">฿{property.price.toLocaleString()}</p>
                          {property.rentPrice > 0 && (
                            <p className="text-sm text-gray-500">฿{property.rentPrice.toLocaleString()}/เดือน</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full font-prompt ${getStatusColor(property.status)}`}>
                          {getStatusText(property.status)}
                        </span>
                      </TableCell>
                      <TableCell className="font-prompt">{property.usableArea} ตร.ม.</TableCell>
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
                          <Button variant="ghost" size="sm">
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
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={property.images[0]}
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
                        <span>{property.usableArea} ตร.ม.</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Car className="h-4 w-4" />
                        <span>{property.parkingSpaces} ที่จอด</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 font-prompt">฿{property.price.toLocaleString()}</p>
                        {property.rentPrice > 0 && (
                          <p className="text-sm text-gray-500 font-prompt">฿{property.rentPrice.toLocaleString()}/เดือน</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 font-prompt">
                        {property.floors} ชั้น
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm text-gray-500 font-prompt">
                        {getTypeText(property.type)} • {property.yearBuilt}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/admin/commercial/edit/${property.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
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

export default CommercialManagement