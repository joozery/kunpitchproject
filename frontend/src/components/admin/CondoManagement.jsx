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
import { 
  Building, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin,
  Home as HomeIcon,
  Bath,
  Car,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Grid,
  Table as TableIcon,
  Loader2,
  Star,
  Heart
} from 'lucide-react'
import CondoForm from './CondoForm'

const CondoManagement = () => {
  const [condos, setCondos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('table')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingCondo, setEditingCondo] = useState(null)

  // Mock data for condos
  useEffect(() => {
    const mockCondos = [
      {
        id: 1,
        title: 'คอนโด ลุมพินี วิลล์ รามคำแหง',
        location: 'รามคำแหง, กรุงเทพฯ',
        price: 3500000,
        rentPrice: 25000,
        bedrooms: 2,
        bathrooms: 2,
        parkingSpaces: 1,
        floor: 15,
        totalFloors: 30,
        size: 65,
        status: 'available',
        type: 'sale',
        yearBuilt: 2020,
        facilities: ['สระว่ายน้ำ', 'ฟิตเนส', 'ลิฟต์', 'รปภ.24ชม.'],
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        title: 'คอนโด ไอดีโอ โมบิ สุขุมวิท',
        location: 'สุขุมวิท, กรุงเทพฯ',
        price: 4200000,
        rentPrice: 32000,
        bedrooms: 1,
        bathrooms: 1,
        parkingSpaces: 1,
        floor: 22,
        totalFloors: 35,
        size: 45,
        status: 'available',
        type: 'sale',
        yearBuilt: 2021,
        facilities: ['สระว่ายน้ำ', 'ฟิตเนส', 'Co-working', 'รปภ.24ชม.'],
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        createdAt: '2024-01-12'
      },
      {
        id: 3,
        title: 'คอนโด เดอะ เบส พาร์ค เวสต์',
        location: 'สุขุมวิท 77, กรุงเทพฯ',
        price: 2800000,
        rentPrice: 22000,
        bedrooms: 1,
        bathrooms: 1,
        parkingSpaces: 0,
        floor: 8,
        totalFloors: 25,
        size: 35,
        status: 'sold',
        type: 'sale',
        yearBuilt: 2019,
        facilities: ['สระว่ายน้ำ', 'ฟิตเนส', 'รปภ.24ชม.'],
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        createdAt: '2024-01-10'
      }
    ]

    setTimeout(() => {
      setCondos(mockCondos)
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

  const filteredCondos = condos.filter(condo => {
    const matchesSearch = condo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         condo.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || condo.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleAddCondo = () => {
    setShowAddForm(true)
  }

  const handleEditCondo = (condo) => {
    setEditingCondo(condo)
    setShowEditForm(true)
  }

  const handleSaveCondo = (condoData) => {
    // Refresh data or update state
    if (showAddForm) {
      setCondos(prev => [...prev, { ...condoData, id: Date.now() }])
      setShowAddForm(false)
    } else if (showEditForm) {
      setCondos(prev => prev.map(c => c.id === editingCondo.id ? { ...condoData, id: editingCondo.id } : c))
      setShowEditForm(false)
      setEditingCondo(null)
    }
  }

  const handleDeleteCondo = (condoId) => {
    if (window.confirm('คุณต้องการลบคอนโดนี้หรือไม่?')) {
      setCondos(prev => prev.filter(c => c.id !== condoId))
    }
  }

  if (showAddForm) {
    return (
      <CondoForm 
        onBack={() => setShowAddForm(false)}
        onSave={handleSaveCondo}
      />
    )
  }

  if (showEditForm && editingCondo) {
    return (
      <CondoForm 
        condo={editingCondo}
        onBack={() => {
          setShowEditForm(false)
          setEditingCondo(null)
        }}
        onSave={handleSaveCondo}
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
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">จัดการคอนโด</h1>
          <p className="text-gray-600 mt-1 font-prompt">จัดการข้อมูลคอนโดมิเนียมทั้งหมดในระบบ</p>
        </div>
        <Button 
          onClick={handleAddCondo}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มคอนโด
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">คอนโดทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">{condos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <HomeIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">ว่าง</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">
                  {condos.filter(c => c.status === 'available').length}
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
                  {condos.filter(c => c.status === 'sold').length}
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
                <p className="text-sm font-medium text-gray-600 font-prompt">มูลค่ารวม</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">
                  ฿{(condos.reduce((sum, c) => sum + c.price, 0) / 1000000).toFixed(1)}M
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
                  placeholder="ค้นหาคอนโด..."
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
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="available">ว่าง</option>
                <option value="sold">ขายแล้ว</option>
                <option value="rented">เช่าแล้ว</option>
                <option value="pending">รอดำเนินการ</option>
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

      {/* Condo List */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-prompt">คอนโด</TableHead>
                    <TableHead className="font-prompt">ที่อยู่</TableHead>
                    <TableHead className="font-prompt">ราคา</TableHead>
                    <TableHead className="font-prompt">สถานะ</TableHead>
                    <TableHead className="font-prompt">ชั้น</TableHead>
                    <TableHead className="font-prompt">ขนาด</TableHead>
                    <TableHead className="font-prompt">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCondos.map((condo) => (
                    <TableRow key={condo.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={condo.images[0]}
                            alt={condo.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900 font-prompt">{condo.title}</p>
                            <p className="text-sm text-gray-500 font-prompt">
                              {condo.bedrooms} ห้องนอน • {condo.bathrooms} ห้องน้ำ
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-prompt">{condo.location}</TableCell>
                      <TableCell className="font-prompt">
                        <div>
                          <p className="font-medium text-gray-900">฿{condo.price.toLocaleString()}</p>
                          {condo.rentPrice > 0 && (
                            <p className="text-sm text-gray-500">฿{condo.rentPrice.toLocaleString()}/เดือน</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full font-prompt ${getStatusColor(condo.status)}`}>
                          {getStatusText(condo.status)}
                        </span>
                      </TableCell>
                      <TableCell className="font-prompt">{condo.floor}/{condo.totalFloors}</TableCell>
                      <TableCell className="font-prompt">{condo.size} ตร.ม.</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditCondo(condo)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteCondo(condo.id)}
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
            {filteredCondos.map((condo) => (
              <Card key={condo.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={condo.images[0]}
                    alt={condo.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(condo.status)}`}>
                      {getStatusText(condo.status)}
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
                      <h3 className="font-semibold text-gray-900 font-prompt">{condo.title}</h3>
                      <p className="text-sm text-gray-500 font-prompt">{condo.location}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 font-prompt">
                      <div className="flex items-center space-x-1">
                        <HomeIcon className="h-4 w-4" />
                        <span>{condo.bedrooms}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bath className="h-4 w-4" />
                        <span>{condo.bathrooms}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Car className="h-4 w-4" />
                        <span>{condo.parkingSpaces}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 font-prompt">฿{condo.price.toLocaleString()}</p>
                        {condo.rentPrice > 0 && (
                          <p className="text-sm text-gray-500 font-prompt">฿{condo.rentPrice.toLocaleString()}/เดือน</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 font-prompt">
                        ชั้น {condo.floor}/{condo.totalFloors}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm text-gray-500 font-prompt">
                        {condo.size} ตร.ม. • {condo.yearBuilt}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditCondo(condo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteCondo(condo.id)}
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

export default CondoManagement