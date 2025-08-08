import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
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
  Table as TableIcon
} from 'lucide-react'
import PropertyForm from './PropertyForm'

const PropertyManagement = () => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: 'คอนโดลุมพินี พาร์ค',
      type: 'คอนโดมิเนียม',
      location: 'ลุมพินี, กรุงเทพฯ',
      btsStation: 'ลุมพินี',
      btsDistance: '0.3 กม.',
      price: '2,500,000',
      rentPrice: '15,000',
      status: 'พร้อมขาย',
      area: '45 ตร.ม.',
      bedrooms: 1,
      bathrooms: 1,
      parking: 1,
      floor: 15,
      totalFloors: 25,
      createdDate: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      sold: false,
      rented: false,
      featured: true,
      views: 245
    },
    {
      id: 2,
      name: 'บ้านเดี่ยวสุขุมวิท 71',
      type: 'บ้านเดี่ยว',
      location: 'สุขุมวิท 71, กรุงเทพฯ',
      btsStation: 'อโศก',
      btsDistance: '1.2 กม.',
      price: '8,500,000',
      rentPrice: '45,000',
      status: 'พร้อมขาย',
      area: '120 ตร.ม.',
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      floor: 1,
      totalFloors: 1,
      createdDate: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      sold: false,
      rented: false,
      featured: false,
      views: 189
    },
    {
      id: 3,
      name: 'ทาวน์เฮาส์รัชดา',
      type: 'ทาวน์เฮาส์',
      location: 'รัชดา, กรุงเทพฯ',
      btsStation: 'รัชดาภิเษก',
      btsDistance: '0.8 กม.',
      price: '4,200,000',
      rentPrice: '25,000',
      status: 'กำลังก่อสร้าง',
      area: '85 ตร.ม.',
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      floor: 2,
      totalFloors: 3,
      createdDate: '2024-01-08',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      sold: false,
      rented: false,
      featured: true,
      views: 156
    },
    {
      id: 4,
      name: 'ออฟฟิศสุขุมวิท 63',
      type: 'สำนักงาน',
      location: 'สุขุมวิท 63, กรุงเทพฯ',
      btsStation: 'เอกมัย',
      btsDistance: '0.5 กม.',
      price: '12,000,000',
      rentPrice: '80,000',
      status: 'พร้อมขาย',
      area: '200 ตร.ม.',
      bedrooms: 0,
      bathrooms: 2,
      parking: 5,
      floor: 8,
      totalFloors: 15,
      createdDate: '2024-01-05',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      sold: false,
      rented: false,
      featured: false,
      views: 98
    },
    {
      id: 5,
      name: 'ร้านค้าสีลม',
      type: 'ร้านค้า',
      location: 'สีลม, กรุงเทพฯ',
      btsStation: 'ศาลาแดง',
      btsDistance: '0.2 กม.',
      price: '6,500,000',
      rentPrice: '35,000',
      status: 'พร้อมขาย',
      area: '80 ตร.ม.',
      bedrooms: 0,
      bathrooms: 1,
      parking: 2,
      floor: 1,
      totalFloors: 3,
      createdDate: '2024-01-03',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      sold: false,
      rented: false,
      featured: false,
      views: 134
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('table')
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || property.type === filterType
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleDelete = (id) => {
    if (window.confirm('คุณต้องการลบ Property นี้หรือไม่?')) {
      setProperties(properties.filter(property => property.id !== id))
    }
  }

  const handleAddProperty = (propertyData) => {
    const newProperty = {
      id: Date.now(),
      name: propertyData.title,
      type: propertyData.type === 'residential' ? 'ที่อยู่อาศัย' : 
            propertyData.type === 'commercial' ? 'เชิงพาณิชย์' : 'ที่ดิน',
      location: propertyData.address,
      price: propertyData.price,
      rentPrice: propertyData.rentPrice || '0',
      status: propertyData.status === 'available' ? 'พร้อมขาย' : 
              propertyData.status === 'sold' ? 'ขายแล้ว' : 
              propertyData.status === 'rented' ? 'เช่าแล้ว' : 'รอการยืนยัน',
      area: propertyData.area ? `${propertyData.area} ตร.ม.` : '-',
      bedrooms: propertyData.bedrooms || 0,
      bathrooms: propertyData.bathrooms || 0,
      parking: propertyData.parking || 0,
      floor: 1,
      totalFloors: 1,
      createdDate: new Date().toISOString().split('T')[0],
      image: propertyData.coverImage ? propertyData.coverImage.url : 
             (propertyData.images && propertyData.images.length > 0 ? propertyData.images[0].url : 
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'),
      coverImage: propertyData.coverImage,
      images: propertyData.images || [],
      sold: propertyData.status === 'sold',
      rented: propertyData.status === 'rented',
      featured: false,
      views: 0
    }
    
    setProperties([newProperty, ...properties])
    setShowAddForm(false)
  }

  if (showAddForm) {
    return (
      <PropertyForm 
        onBack={() => setShowAddForm(false)}
        onSave={handleAddProperty}
      />
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
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={property.image}
                            alt={property.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900 font-prompt">{property.name}</p>
                            <p className="text-sm text-gray-500 font-prompt">
                              {property.bedrooms} ห้องนอน • {property.bathrooms} ห้องน้ำ
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-prompt">{property.type}</TableCell>
                      <TableCell className="font-prompt">{property.location}</TableCell>
                      <TableCell className="font-prompt">
                        <div>
                          <p className="font-medium text-gray-900">฿{property.price}</p>
                          <p className="text-sm text-gray-500">฿{property.rentPrice}/เดือน</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full font-prompt ${
                          property.status === 'พร้อมขาย' ? 'bg-green-100 text-green-800' :
                          property.status === 'ขายแล้ว' ? 'bg-red-100 text-red-800' :
                          property.status === 'เช่าแล้ว' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status}
                        </span>
                      </TableCell>
                      <TableCell className="font-prompt">{property.views}</TableCell>
                      <TableCell className="font-prompt">{property.createdDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.name}
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
                      <h3 className="font-semibold text-gray-900 font-prompt">{property.name}</h3>
                      <p className="text-sm text-gray-500 font-prompt">{property.location}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 font-prompt">
                      <div className="flex items-center space-x-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Car className="h-4 w-4" />
                        <span>{property.parking}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 font-prompt">฿{property.price}</p>
                        <p className="text-sm text-gray-500 font-prompt">฿{property.rentPrice}/เดือน</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full font-prompt ${
                        property.status === 'พร้อมขาย' ? 'bg-green-100 text-green-800' :
                        property.status === 'ขายแล้ว' ? 'bg-red-100 text-red-800' :
                        property.status === 'เช่าแล้ว' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 font-prompt">
                        <Eye className="h-4 w-4" />
                        <span>{property.views}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
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