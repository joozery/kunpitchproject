import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Building2, 
  Home, 
  Landmark, 
  Store, 
  ArrowRight, 
  MapPin, 
  Star,
  Eye,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Projects = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  // Mock data for projects
  useEffect(() => {
    const mockProjects = [
      {
        id: 1,
        name: 'Whale Space Condo',
        type: 'condo',
        status: 'under_construction',
        location: 'สีลม, กรุงเทพฯ',
        description: 'คอนโดมิเนียมระดับลักซ์ชูรี่ ตั้งอยู่ในทำเลทองของสีลม',
        price: '3500000',
        rentPrice: '25000',
        bedrooms: 2,
        bathrooms: 1,
        area: 45,
        floor: '15-25',
        completionDate: '2025-12-31',
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        amenities: ['สระว่ายน้ำ', 'ฟิตเนส', 'ที่จอดรถ', 'ระบบรักษาความปลอดภัย'],
        developer: 'Whale Space Development',
        views: 1250
      },
      {
        id: 2,
        name: 'Whale Garden House',
        type: 'house',
        status: 'ready_to_move',
        location: 'สุขุมวิท, กรุงเทพฯ',
        description: 'บ้านเดี่ยวสไตล์โมเดิร์น พร้อมสวนสวยงาม',
        price: '8500000',
        rentPrice: '0',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        floor: '1-2',
        completionDate: '2024-06-30',
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        amenities: ['สวนสวย', 'ที่จอดรถ', 'ระบบรักษาความปลอดภัย', 'ห้องทำงาน'],
        developer: 'Whale Space Development',
        views: 890
      },
      {
        id: 3,
        name: 'Whale Commercial Plaza',
        type: 'commercial',
        status: 'planning',
        location: 'บางนา, กรุงเทพฯ',
        description: 'ศูนย์การค้าและสำนักงานระดับ A',
        price: '15000000',
        rentPrice: '80000',
        bedrooms: 0,
        bathrooms: 2,
        area: 200,
        floor: '1-5',
        completionDate: '2026-12-31',
        images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        amenities: ['ที่จอดรถ', 'ระบบรักษาความปลอดภัย', 'ลิฟต์', 'ระบบปรับอากาศ'],
        developer: 'Whale Space Development',
        views: 567
      },
      {
        id: 4,
        name: 'Whale Land Estate',
        type: 'land',
        status: 'available',
        location: 'ชลบุรี',
        description: 'ที่ดินเปล่าพร้อมสิ่งปลูกสร้าง ใกล้ทะเล',
        price: '25000000',
        rentPrice: '0',
        bedrooms: 0,
        bathrooms: 0,
        area: 500,
        floor: '0',
        completionDate: 'N/A',
        images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        amenities: ['ใกล้ทะเล', 'ถนนลาดยาง', 'ไฟฟ้า', 'ประปา'],
        developer: 'Whale Space Development',
        views: 432
      }
    ]

    setProjects(mockProjects)
    setFilteredProjects(mockProjects)
    setLoading(false)
  }, [])

  // Filter projects
  useEffect(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || project.type === filterType
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus
      
      return matchesSearch && matchesType && matchesStatus
    })

    setFilteredProjects(filtered)
  }, [projects, searchTerm, filterType, filterStatus])

  const getTypeLabel = (type) => {
    switch (type) {
      case 'condo':
        return 'คอนโดมิเนียม'
      case 'house':
        return 'บ้านเดี่ยว'
      case 'land':
        return 'ที่ดิน'
      case 'commercial':
        return 'เชิงพาณิชย์'
      default:
        return type
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'planning':
        return 'วางแผน'
      case 'under_construction':
        return 'กำลังก่อสร้าง'
      case 'ready_to_move':
        return 'พร้อมเข้าอยู่'
      case 'available':
        return 'พร้อมขาย'
      default:
        return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800'
      case 'under_construction':
        return 'bg-yellow-100 text-yellow-800'
      case 'ready_to_move':
        return 'bg-green-100 text-green-800'
      case 'available':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'condo':
        return Building2
      case 'house':
        return Home
      case 'land':
        return Landmark
      case 'commercial':
        return Store
      default:
        return Building2
    }
  }

  const formatPrice = (price) => {
    if (!price) return '0'
    return parseInt(price).toLocaleString('th-TH')
  }

  const ProjectCard = ({ project }) => {
    const TypeIcon = getTypeIcon(project.type)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group"
        onClick={() => navigate(`/project/${project.id}`)}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.images[0]}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
              {getStatusLabel(project.status)}
            </span>
          </div>
          
          {/* Type Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 flex items-center gap-2">
              <TypeIcon className="h-3 w-3" />
              {getTypeLabel(project.type)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 font-prompt group-hover:text-blue-600 transition-colors duration-300">
            {project.name}
          </h3>
          
          <p className="text-gray-600 mb-3 font-prompt flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            {project.location}
          </p>
          
          <p className="text-gray-600 mb-4 font-prompt text-sm line-clamp-2">
            {project.description}
          </p>

          {/* Project Details */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              <span>พื้นที่: {project.area} ตร.ม.</span>
            </div>
            {project.bedrooms > 0 && (
              <div className="flex items-center text-gray-600">
                <Home className="h-4 w-4 mr-2 text-blue-500" />
                <span>{project.bedrooms} ห้องนอน</span>
              </div>
            )}
            {project.bathrooms > 0 && (
              <div className="flex items-center text-gray-600">
                <Star className="h-4 w-4 mr-2 text-green-500" />
                <span>{project.bathrooms} ห้องน้ำ</span>
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <Building2 className="h-4 w-4 mr-2 text-purple-500" />
              <span>ชั้น: {project.floor}</span>
            </div>
          </div>

          {/* Price */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-bold text-blue-600">
                ฿{formatPrice(project.price)}
              </div>
              {project.rentPrice > 0 && (
                <div className="text-sm text-gray-500">
                  ฿{formatPrice(project.rentPrice)}/เดือน
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>ผู้พัฒนา: {project.developer}</span>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {project.views}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            <span className="flex items-center justify-center gap-2">
              ดูรายละเอียด
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-4 font-oswald"
          >
            โครงการของเรา
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-blue-100 font-prompt"
          >
            ค้นพบโครงการคุณภาพจาก Whale Space Development
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
                placeholder="ค้นหาโครงการ..."
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
                <option value="condo">คอนโดมิเนียม</option>
                <option value="house">บ้านเดี่ยว</option>
                <option value="land">ที่ดิน</option>
                <option value="commercial">เชิงพาณิชย์</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="planning">วางแผน</option>
                <option value="under_construction">กำลังก่อสร้าง</option>
                <option value="ready_to_move">พร้อมเข้าอยู่</option>
                <option value="available">พร้อมขาย</option>
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

      {/* Projects Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600 font-prompt">
              พบ {filteredProjects.length} โครงการ
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Projects Grid/List */}
          {!loading && (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-500 text-lg">ไม่พบโครงการที่ตรงกับเงื่อนไขการค้นหา</div>
                    </div>
                  )}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-6">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-500 text-lg">ไม่พบโครงการที่ตรงกับเงื่อนไขการค้นหา</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* No Results */}
          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-prompt">
                ไม่พบโครงการ
              </h3>
              <p className="text-gray-600 font-prompt">
                ลองปรับเงื่อนไขการค้นหาหรือติดต่อเราเพื่อขอข้อมูลเพิ่มเติม
              </p>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

export default Projects 