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
  List,
  Users,
  Calendar
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { projectApi } from '../lib/projectApi'
import { useCurrency } from '../lib/CurrencyContext'

const Projects = () => {
  const navigate = useNavigate()
  const { convert, format } = useCurrency()
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const result = await projectApi.getAll()
        if (result.success) {
          setProjects(result.data)
          setFilteredProjects(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects
  useEffect(() => {
    let filtered = projects.filter(project => {
      // Search filter - search in multiple fields
      const searchLower = searchTerm.toLowerCase().trim()
      const matchesSearch = searchTerm === '' || 
        project.title?.toLowerCase().includes(searchLower) ||
        project.title_en?.toLowerCase().includes(searchLower) ||
        project.location?.toLowerCase().includes(searchLower) ||
        project.address?.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        project.developer?.toLowerCase().includes(searchLower) ||
        project.project_type?.toLowerCase().includes(searchLower)

      // Type filter
      const matchesType = filterType === 'all' || project.project_type === filterType

      // Status filter
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
        return 'บ้านเดี่ยว/ทาวน์เฮาส์'
      case 'land':
        return 'ที่ดิน'
      case 'commercial':
        return 'เชิงพาณิชย์'
      default:
        return type
    }
  }

  const getStatusLabel = (status) => {
    const statusText = {
      'sale': 'ขาย',
      'rent': 'เช่า',
      'both': 'ขาย/เช่า'
    }
    return statusText[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      'sale': 'bg-green-100 text-green-800',
      'rent': 'bg-blue-100 text-blue-800',
      'both': 'bg-purple-100 text-purple-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
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
    return format(convert(parseInt(price)))
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setFilterType('all')
    setFilterStatus('all')
  }

  // Check if any filter is active
  const hasActiveFilters = searchTerm !== '' || filterType !== 'all' || filterStatus !== 'all'

  const ProjectCard = ({ project }) => {
    const TypeIcon = getTypeIcon(project.project_type)
    
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
            src={project.cover_image || (project.images && project.images[0]) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              พร้อมอยู่
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Project Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-1 font-prompt group-hover:text-blue-600 transition-colors duration-300">
            {project.title}
          </h3>
          
          {/* English Title */}
          <p className="text-gray-500 mb-3 font-prompt text-sm">
            {project.title_en || project.title}
          </p>
          
          {/* Project Type */}
          <div className="flex items-center text-gray-600 mb-2 text-sm">
            <Building2 className="h-4 w-4 mr-2 text-gray-500" />
            <span>{getTypeLabel(project.project_type)}</span>
          </div>
          
          {/* Developer */}
          {project.developer && (
            <div className="flex items-center text-gray-600 mb-2 text-sm">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span>{project.developer}</span>
            </div>
          )}
          
          {/* Completion Date */}
          {project.completion_date && (
            <div className="flex items-center text-gray-600 mb-4 text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>แล้วเสร็จ {new Date(project.completion_date).getFullYear()}</span>
            </div>
          )}

          {/* Statistics Boxes */}
          <div className="flex gap-3 mt-4">
            {/* Units Box */}
            <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-gray-900">
                {project.total_units || project.bedrooms || 0}
              </div>
              <div className="text-xs text-gray-600">ยูนิต</div>
            </div>
            
            {/* Amenities Box */}
            <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-gray-900">
                {project.amenities?.length || 0}
              </div>
              <div className="text-xs text-gray-600">สิ่งอำนวยความสะดวก</div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-prompt">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="relative text-white py-20">
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900" />
          <div className="absolute inset-0" style={{ backgroundColor: '#051d40', opacity: 0.85 }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-prompt">
              โครงการของเรา
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl font-prompt">
              ค้นพบโครงการคุณภาพจาก Whale Space Development ตั้งแต่คอนโดหรู บ้านเดี่ยว ไปจนถึงที่ดินเชิงพาณิชย์
            </p>
            <div className="flex flex-wrap justify-start gap-4 text-sm">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-prompt">
                <span className="font-semibold">{filteredProjects.length}</span> โครงการ
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-prompt">
                <span className="font-semibold">100%</span> ตรวจสอบแล้ว
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-prompt">
                <span className="font-semibold">24/7</span> บริการ
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="ค้นหาโครงการ, ที่อยู่, ผู้พัฒนา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">ประเภททั้งหมด</option>
                <option value="condo">คอนโดมิเนียม</option>
                <option value="house">บ้านเดี่ยว/ทาวน์เฮาส์</option>
                <option value="land">ที่ดิน</option>
                <option value="commercial">เชิงพาณิชย์</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="sale">ขาย</option>
                <option value="rent">เช่า</option>
                <option value="both">ขาย/เช่า</option>
              </select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  ล้างฟิลเตอร์
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="แสดงแบบตาราง"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="แสดงแบบรายการ"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                  ค้นหา: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-600">✕</button>
                </span>
              )}
              {filterType !== 'all' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                  ประเภท: {getTypeLabel(filterType)}
                  <button onClick={() => setFilterType('all')} className="hover:text-green-600">✕</button>
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2">
                  สถานะ: {getStatusLabel(filterStatus)}
                  <button onClick={() => setFilterStatus('all')} className="hover:text-purple-600">✕</button>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-gray-600 font-prompt">
              พบ <span className="font-semibold text-blue-600">{filteredProjects.length}</span> โครงการ
              {hasActiveFilters && (
                <span className="text-gray-500 ml-2">
                  จากทั้งหมด <span className="font-semibold">{projects.length}</span> โครงการ
                </span>
              )}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                ล้างฟิลเตอร์ทั้งหมด
              </button>
            )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-500 text-lg font-prompt">
                        ไม่พบโครงการที่ตรงกับเงื่อนไขการค้นหา
                        {hasActiveFilters && (
                          <div className="mt-2">
                            <button
                              onClick={clearFilters}
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              ลองล้างฟิลเตอร์ดู
                            </button>
                          </div>
                        )}
                      </div>
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
                      <div className="text-gray-500 text-lg font-prompt">
                        ไม่พบโครงการที่ตรงกับเงื่อนไขการค้นหา
                        {hasActiveFilters && (
                          <div className="mt-2">
                            <button
                              onClick={clearFilters}
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              ลองล้างฟิลเตอร์ดู
                            </button>
                          </div>
                        )}
                      </div>
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