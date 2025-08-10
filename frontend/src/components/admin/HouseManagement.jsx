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
  HomeIcon, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin,
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
  Heart,
  Maximize
} from 'lucide-react'
import HouseForm from './HouseForm'
import { houseAPI } from '../../lib/api'

const HouseManagement = () => {
  const [houses, setHouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingHouse, setEditingHouse] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState('table')
  const [updatingStatusId, setUpdatingStatusId] = useState(null)

  // Load houses from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await houseAPI.getAll()
        if (res.success) {
          setHouses(res.data || [])
        } else {
          setHouses([])
        }
      } catch (e) {
        console.error('Failed to load houses:', e)
        setHouses([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAddClick = () => setShowAddForm(true)
  const handleEditClick = (house) => { setEditingHouse(house); setShowEditForm(true) }
  const refreshList = async () => {
    try {
      setLoading(true)
      const res = await houseAPI.getAll()
      if (res.success) {
        setHouses(res.data || [])
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }
  const handleSaved = async () => {
    setShowAddForm(false)
    setShowEditForm(false)
    setEditingHouse(null)
    await refreshList()
  }

  const handleStatusChange = async (house, newStatus) => {
    if (!newStatus || newStatus === house.status) return
    try {
      setUpdatingStatusId(house.id)
      await houseAPI.update(house.id, { status: newStatus })
      setHouses(prev => prev.map(h => h.id === house.id ? { ...h, status: newStatus } : h))
    } catch (err) {
      console.error('Update status failed:', err)
      alert('อัปเดตสถานะไม่สำเร็จ: ' + (err.message || 'เกิดข้อผิดพลาด'))
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'sale': 'bg-green-100 text-green-800',
      'rent': 'bg-blue-100 text-blue-800',
      'both': 'bg-purple-100 text-purple-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const statusText = {
      'sale': 'ขาย',
      'rent': 'เช่า',
      'both': 'ขาย/เช่า'
    }
    return statusText[status] || status
  }

  const getTypeText = (type) => {
    const typeText = {
      'house': 'บ้านเดี่ยว',
      'townhouse': 'ทาวน์เฮาส์',
      'apartment': 'อพาร์ตเมนต์'
    }
    return typeText[type] || type
  }

  const filteredHouses = houses.filter(house => {
    const matchesSearch = (house.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (house.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || house.status === filterStatus
    const matchesType = filterType === 'all' || house.property_type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

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

  if (showAddForm) {
    return (
      <HouseForm
        onBack={() => setShowAddForm(false)}
        onSave={handleSaved}
      />
    )
  }

  if (showEditForm && editingHouse) {
    return (
      <HouseForm
        initialData={editingHouse}
        isEditing
        onBack={() => { setShowEditForm(false); setEditingHouse(null) }}
        onSave={handleSaved}
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
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">บ้านเดี่ยว/ทาวเฮาส์/อพาร์ตเมนต์</h1>
          <p className="text-gray-600 mt-1 font-prompt">จัดการข้อมูลบ้านเดี่ยว ทาวน์เฮาส์ และอพาร์ตเมนต์ในระบบ</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddClick}>
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มบ้าน
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <HomeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">บ้านทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">{houses.length}</p>
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
                <p className="text-sm font-medium text-gray-600 font-prompt">สำหรับขาย</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">
                  {houses.filter(h => h.status === 'sale' || h.status === 'both').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">สำหรับเช่า</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">
                  {houses.filter(h => h.status === 'rent' || h.status === 'both').length}
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
                  ฿{(houses.reduce((sum, h) => sum + Number(h.price || 0), 0) / 1000000).toFixed(1)}M
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
                  placeholder="ค้นหาบ้าน..."
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
                <option value="sale">ขาย</option>
                <option value="rent">เช่า</option>
                <option value="both">ขาย/เช่า</option>
              </select>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">ประเภททั้งหมด</option>
                <option value="house">บ้านเดี่ยว</option>
                <option value="townhouse">ทาวน์เฮาส์</option>
                <option value="apartment">อพาร์ตเมนต์</option>
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

      {/* House List */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-prompt">บ้าน</TableHead>
                    <TableHead className="font-prompt">ประเภท</TableHead>
                    <TableHead className="font-prompt">ที่อยู่</TableHead>
                    <TableHead className="font-prompt">ราคา</TableHead>
                    <TableHead className="font-prompt">สถานะ</TableHead>
                    <TableHead className="font-prompt">ขนาด</TableHead>
                    <TableHead className="font-prompt">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHouses.map((house) => (
                    <TableRow key={house.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={house.cover_image || (house.images && house.images[0])}
                            alt={house.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900 font-prompt">{house.title}</p>
                            <p className="text-sm text-gray-500 font-prompt">
                              {house.bedrooms} ห้องนอน • {house.bathrooms} ห้องน้ำ
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-prompt">{getTypeText(house.property_type)}</TableCell>
                      <TableCell className="font-prompt">{house.location}</TableCell>
                      <TableCell className="font-prompt">
                        <div>
                          <p className="font-medium text-gray-900">฿{Number(house.price || 0).toLocaleString('th-TH')}</p>
                          {Number(house.rent_price || 0) > 0 && (
                            <p className="text-sm text-gray-500">฿{Number(house.rent_price).toLocaleString('th-TH')}/เดือน</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full font-prompt ${getStatusColor(house.status)}`}>
                            {getStatusText(house.status)}
                          </span>
                          <select
                            value={house.status}
                            disabled={updatingStatusId === house.id}
                            onChange={(e) => handleStatusChange(house, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-xs"
                          >
                            <option value="sale">ขาย</option>
                            <option value="rent">เช่า</option>
                            <option value="both">ขาย/เช่า</option>
                          </select>
                        </div>
                      </TableCell>
                      <TableCell className="font-prompt">{Number(house.area || 0)} ตร.ม.</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(house)}>
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
            {filteredHouses.map((house) => (
              <Card key={house.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={house.cover_image || (house.images && house.images[0])}
                    alt={house.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(house.status)}`}>
                      {getStatusText(house.status)}
                    </span>
                    <select
                      value={house.status}
                      disabled={updatingStatusId === house.id}
                      onChange={(e) => handleStatusChange(house, e.target.value)}
                      className="px-2 py-1 border border-gray-200 rounded text-xs bg-white/90"
                    >
                      <option value="sale">ขาย</option>
                      <option value="rent">เช่า</option>
                      <option value="both">ขาย/เช่า</option>
                    </select>
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
                      <h3 className="font-semibold text-gray-900 font-prompt">{house.title}</h3>
                      <p className="text-sm text-gray-500 font-prompt">{house.location}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 font-prompt">
                      <div className="flex items-center space-x-1">
                        <HomeIcon className="h-4 w-4" />
                        <span>{house.bedrooms}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bath className="h-4 w-4" />
                        <span>{house.bathrooms}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{Number(house.area || 0)} ตร.ม.</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 font-prompt">฿{Number(house.price || 0).toLocaleString('th-TH')}</p>
                        {Number(house.rent_price || 0) > 0 && (
                          <p className="text-sm text-gray-500 font-prompt">฿{Number(house.rent_price).toLocaleString('th-TH')}/เดือน</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 font-prompt">
                        {getTypeText(house.property_type)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm text-gray-500 font-prompt">
                        {Number(house.area || 0)} ตร.ม.
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(house)}>
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

export default HouseManagement