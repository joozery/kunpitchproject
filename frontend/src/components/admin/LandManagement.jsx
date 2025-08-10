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
  TreePine, 
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
  Mountain,
  Droplets,
  Zap
} from 'lucide-react'

const LandManagement = () => {
  const [lands, setLands] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState('table')

  // Mock data for lands
  useEffect(() => {
    const mockLands = [
      {
        id: 1,
        title: 'ที่ดินเปล่า 5 ไร่ ติดถนนใหญ่',
        location: 'นครปฐม',
        price: 15000000,
        rentPrice: 0,
        landSize: 8000,
        rai: 5,
        ngan: 0,
        wah: 0,
        status: 'available',
        type: 'empty_land',
        yearListed: 2024,
        features: ['ติดถนนใหญ่', 'ไฟฟ้าผ่าน', 'น้ำประปา', 'โฉนดที่ดิน'],
        zoning: 'residential',
        utilities: {
          electricity: true,
          water: true,
          internet: false,
          gas: false
        },
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        title: 'ที่ดินสวนผลไม้ 3 ไร่',
        location: 'ราชบุรี',
        price: 8500000,
        rentPrice: 15000,
        landSize: 4800,
        rai: 3,
        ngan: 0,
        wah: 0,
        status: 'available',
        type: 'orchard',
        yearListed: 2024,
        features: ['สวนมะม่วง', 'บ้านสวน', 'บ่อน้ำ', 'โฉนดที่ดิน'],
        zoning: 'agricultural',
        utilities: {
          electricity: true,
          water: true,
          internet: false,
          gas: false
        },
        images: ['https://images.unsplash.com/photo-1574263867128-bec3bf2b0b6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        createdAt: '2024-01-12'
      }
    ]

    setTimeout(() => {
      setLands(mockLands)
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
      'empty_land': 'ที่ดินเปล่า',
      'orchard': 'สวนผลไม้',
      'farm': 'ที่ดินเกษตร',
      'commercial': 'ที่ดินพาณิชย์',
      'industrial': 'ที่ดินอุตสาหกรรม'
    }
    return typeText[type] || type
  }

  const filteredLands = lands.filter(land => {
    const matchesSearch = land.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         land.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || land.status === filterStatus
    const matchesType = filterType === 'all' || land.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
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
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">จัดการที่ดิน</h1>
          <p className="text-gray-600 mt-1 font-prompt">จัดการข้อมูลที่ดินเปล่า ไร่นา สวนทั้งหมดในระบบ</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มที่ดิน
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TreePine className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">ที่ดินทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">{lands.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">ว่าง</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">
                  {lands.filter(l => l.status === 'available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Maximize className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 font-prompt">พื้นที่รวม</p>
                <p className="text-2xl font-bold text-gray-900 font-prompt">
                  {lands.reduce((sum, l) => sum + l.rai, 0)} ไร่
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
                  ฿{(lands.reduce((sum, l) => sum + l.price, 0) / 1000000).toFixed(1)}M
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
                  placeholder="ค้นหาที่ดิน..."
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
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">ประเภททั้งหมด</option>
                <option value="empty_land">ที่ดินเปล่า</option>
                <option value="orchard">สวนผลไม้</option>
                <option value="farm">ที่ดินเกษตร</option>
                <option value="commercial">ที่ดินพาณิชย์</option>
                <option value="industrial">ที่ดินอุตสาหกรรม</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 ${viewMode === 'table' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <TableIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Land List */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-prompt">ที่ดิน</TableHead>
                    <TableHead className="font-prompt">ประเภท</TableHead>
                    <TableHead className="font-prompt">ที่อยู่</TableHead>
                    <TableHead className="font-prompt">ราคา</TableHead>
                    <TableHead className="font-prompt">สถานะ</TableHead>
                    <TableHead className="font-prompt">ขนาด</TableHead>
                    <TableHead className="font-prompt">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLands.map((land) => (
                    <TableRow key={land.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={land.images[0]}
                            alt={land.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900 font-prompt">{land.title}</p>
                            <p className="text-sm text-gray-500 font-prompt">
                              {land.rai} ไร่ {land.ngan} งาน {land.wah} ตร.ว.
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-prompt">{getTypeText(land.type)}</TableCell>
                      <TableCell className="font-prompt">{land.location}</TableCell>
                      <TableCell className="font-prompt">
                        <div>
                          <p className="font-medium text-gray-900">฿{land.price.toLocaleString()}</p>
                          {land.rentPrice > 0 && (
                            <p className="text-sm text-gray-500">฿{land.rentPrice.toLocaleString()}/เดือน</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full font-prompt ${getStatusColor(land.status)}`}>
                          {getStatusText(land.status)}
                        </span>
                      </TableCell>
                      <TableCell className="font-prompt">{land.landSize.toLocaleString()} ตร.ม.</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
            {filteredLands.map((land) => (
              <Card key={land.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={land.images[0]}
                    alt={land.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(land.status)}`}>
                      {getStatusText(land.status)}
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
                      <h3 className="font-semibold text-gray-900 font-prompt">{land.title}</h3>
                      <p className="text-sm text-gray-500 font-prompt">{land.location}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 font-prompt">
                      <div className="flex items-center space-x-1">
                        <Maximize className="h-4 w-4" />
                        <span>{land.rai} ไร่</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mountain className="h-4 w-4" />
                        <span>{getTypeText(land.type)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 font-prompt">฿{land.price.toLocaleString()}</p>
                        {land.rentPrice > 0 && (
                          <p className="text-sm text-gray-500 font-prompt">฿{land.rentPrice.toLocaleString()}/เดือน</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm text-gray-500 font-prompt">
                        {land.landSize.toLocaleString()} ตร.ม.
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
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

export default LandManagement