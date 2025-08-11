import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { projectApi } from '../../lib/projectApi';
import ProjectForm from './ProjectForm';
import Swal from 'sweetalert2';
import { 
  FaBuilding, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaEye,
  FaCog,
  FaFilter,
  FaTh,
  FaList
} from 'react-icons/fa';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showStats, setShowStats] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  // โหลดข้อมูลโครงการ
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectApi.getAll();
      setProjects(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'เกิดข้อผิดพลาดในการโหลดข้อมูลโครงการ',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    Swal.fire({
      title: 'เพิ่มโครงการใหม่',
      text: 'คุณต้องการเพิ่มโครงการใหม่หรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, เพิ่มเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        setEditingProject(null);
        setShowForm(true);
      }
    });
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = async (id) => {
    const result = await Swal.fire({
      title: 'คุณต้องการลบโครงการนี้หรือไม่?',
      text: "การดำเนินการนี้ไม่สามารถยกเลิกได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    });
    
    if (result.isConfirmed) {
      try {
        setLoading(true);
        console.log('🔄 Deleting project:', id);
        await projectApi.delete(id);
        console.log('✅ Project deleted:', id);
        
        setProjects(prev => prev.filter(project => project.id !== id));
        
        Swal.fire(
          'ลบแล้ว!',
          'โครงการถูกลบเรียบร้อยแล้ว',
          'success'
        );
      } catch (error) {
        console.error('❌ Error deleting project:', error);
        
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: `เกิดข้อผิดพลาดในการลบโครงการ: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (projectData) => {
    try {
      setLoading(true);
      if (editingProject) {
        // อัปเดตโครงการ
        console.log('🔄 Updating project:', editingProject.id);
        const response = await projectApi.update(editingProject.id, projectData);
        console.log('✅ Project updated:', response.data);
        
        // อัปเดต state projects โดยรวมข้อมูลเดิมกับข้อมูลใหม่
        setProjects(prev => prev.map(project => 
          project.id === editingProject.id 
            ? { 
                ...project, 
                ...response.data,
                // ตรวจสอบว่า facilities มีใน response หรือไม่
                facilities: response.data.facilities || project.facilities || []
              }
            : project
        ));
        
        Swal.fire({
          title: 'สำเร็จ!',
          text: 'อัปเดตโครงการเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      } else {
        // เพิ่มโครงการใหม่
        console.log('🔄 Creating new project:', projectData);
        const response = await projectApi.create(projectData);
        console.log('✅ Project created:', response.data);
        
        setProjects(prev => [response.data, ...prev]);
        
        Swal.fire({
          title: 'สำเร็จ!',
          text: 'เพิ่มโครงการเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      console.error('❌ Error saving project:', error);
      
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: `เกิดข้อผิดพลาดในการบันทึกโครงการ: ${error.message}`,
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: 'ยกเลิกการดำเนินการ',
      text: 'คุณต้องการยกเลิกการดำเนินการหรือไม่? ข้อมูลที่กรอกจะหายไป',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ยกเลิกเลย!',
      cancelButtonText: 'ไม่, กลับไปกรอกข้อมูล'
    }).then((result) => {
      if (result.isConfirmed) {
        setShowForm(false);
        setEditingProject(null);
      }
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name_th?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.developer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.province?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === '' || project.project_type === filterType;
    const matchesStatus = filterStatus === '' || project.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // คำนวณ statistics
  const stats = {
    total: projects.length,
    byType: projects.reduce((acc, project) => {
      acc[project.project_type] = (acc[project.project_type] || 0) + 1;
      return acc;
    }, {}),
    byStatus: projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {}),
    totalUnits: projects.reduce((sum, project) => sum + (parseInt(project.total_units) || 0), 0)
  };

  // ประเภทโครงการทั้งหมด
  const projectTypes = [...new Set(projects.map(p => p.project_type).filter(Boolean))];
  const projectStatuses = [...new Set(projects.map(p => p.status).filter(Boolean))];

  // Placeholder image data URI
  const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxnIG9wYWNpdHk9IjAuNSI+CjxwYXRoIGQ9Ik0xNzUgMTIwVjE4MEgyMjVWMTIwSDE3NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik0xNjAgMTA1SDI0MFYxOTVIMTYwVjEwNVoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjE4NSIgY3k9IjEzNSIgcj0iMTAiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik0xODAgMTY1TDIwMCAxNDVMMjIwIDE2NUwyMzAgMTg1SDE3MUwxODAgMTY1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L2c+Cjx0ZXh0IHg9IjIwMCIgeT0iMjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPuC4o+C4t+C4m+C4oOC4suC4nuC5guC4hOC4o+C4h+C4geC4suC4o+C4peC4m+C5jDwvdGV4dD4KPC9zdmc+";

  if (showForm) {
    return (
      <ProjectForm
        project={editingProject}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">จัดการโครงการ</h1>
          <p className="text-gray-600 mt-1 font-prompt">จัดการข้อมูลโครงการอสังหาริมทรัพย์ทั้งหมด</p>
        </div>
        <Button 
          onClick={handleAddProject} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-prompt"
        >
          <FaPlus className="h-4 w-4 mr-2" />
          เพิ่มโครงการใหม่
        </Button>
      </div>
      {/* Statistics Cards */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium font-prompt">โครงการทั้งหมด</p>
                    <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
                  </div>
                  <div className="bg-blue-200 p-3 rounded-full">
                    <FaBuilding className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium font-prompt">รวมจำนวนยูนิต</p>
                    <p className="text-3xl font-bold text-green-700">{stats.totalUnits.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-200 p-3 rounded-full">
                    <FaCog className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium font-prompt">ประเภทโครงการ</p>
                    <p className="text-3xl font-bold text-yellow-700">{projectTypes.length}</p>
                  </div>
                  <div className="bg-yellow-200 p-3 rounded-full">
                    <FaFilter className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium font-prompt">สถานะ</p>
                    <p className="text-3xl font-bold text-purple-700">{projectStatuses.length}</p>
                  </div>
                  <div className="bg-purple-200 p-3 rounded-full">
                    <FaEye className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      )}

      {/* Search and Filter Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center space-x-2 font-prompt">
            <FaSearch className="h-5 w-5 text-gray-600" />
            <span>ค้นหาและกรองข้อมูล</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="ค้นหาโครงการ, ผู้พัฒนา, ที่ตั้ง..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-prompt"
              />
            </div>

            {/* Project Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm font-prompt ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">ประเภทโครงการทั้งหมด</option>
              {projectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm font-prompt ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">สถานะทั้งหมด</option>
              {projectStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterType('');
                setFilterStatus('');
              }}
              className="font-prompt"
            >
              <FaFilter className="mr-2 h-4 w-4" />
              ล้างตัวกรอง
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 font-prompt">
              <FaBuilding className="h-5 w-5 text-gray-600" />
              <span>รายการโครงการ ({filteredProjects.length})</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <FaList className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <FaTh className="h-4 w-4" />
                </button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className="font-prompt"
              >
                <FaEye className="mr-2 h-4 w-4" />
                {showStats ? 'ซ่อนสถิติ' : 'แสดงสถิติ'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className={viewMode === 'table' ? 'p-0' : 'p-6'}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 font-prompt">กำลังโหลดข้อมูล...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FaBuilding className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 font-prompt mb-2">
                {searchTerm || filterType || filterStatus ? 'ไม่พบโครงการที่ค้นหา' : 'ยังไม่มีโครงการ'}
              </h3>
              <p className="text-gray-500 font-prompt">
                {searchTerm || filterType || filterStatus 
                  ? 'ลองเปลี่ยนเงื่อนไขการค้นหาหรือเพิ่มโครงการใหม่' 
                  : 'เริ่มต้นด้วยการเพิ่มโครงการแรกของคุณ'}
              </p>
              {!searchTerm && !filterType && !filterStatus && (
                <Button onClick={handleAddProject} className="mt-4 font-prompt">
                  <FaPlus className="mr-2 h-4 w-4" />
                  เพิ่มโครงการใหม่
                </Button>
              )}
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-prompt">โครงการ</TableHead>
                  <TableHead className="font-prompt">ประเภท</TableHead>
                  <TableHead className="font-prompt">ผู้พัฒนา</TableHead>
                  <TableHead className="font-prompt">สถานะ</TableHead>
                  <TableHead className="font-prompt">ยูนิต</TableHead>
                  <TableHead className="font-prompt">ที่ตั้ง</TableHead>
                  <TableHead className="font-prompt">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={project.cover_image || placeholderImage}
                          alt={project.name_th}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = placeholderImage;
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-900 font-prompt">{project.name_th}</p>
                          {project.name_en && (
                            <p className="text-sm text-gray-500 font-prompt">{project.name_en}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-prompt">{project.project_type}</TableCell>
                    <TableCell className="font-prompt">{project.developer}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'พร้อมอยู่' ? 'bg-green-100 text-green-800' :
                        project.status === 'กำลังก่อสร้าง' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'Pre-sale' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-prompt">{project.total_units || '-'}</TableCell>
                    <TableCell className="font-prompt">
                      <div className="text-sm">
                        {project.district && project.province ? 
                          `${project.district}, ${project.province}` : 
                          '-'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditProject(project)}
                          className="font-prompt"
                        >
                          <FaEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-700 font-prompt"
                        >
                          <FaTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-xl transition-all duration-200 border-2 hover:border-blue-200">
                  <CardContent className="p-0">
                    {/* Project Image */}
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <img
                        src={project.cover_image || placeholderImage}
                        alt={project.name_th}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.target.src = placeholderImage;
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'พร้อมอยู่' ? 'bg-green-100 text-green-800' :
                          project.status === 'กำลังก่อสร้าง' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'Pre-sale' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Project Header */}
                      <div className="mb-4">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors font-prompt line-clamp-2">
                          {project.name_th}
                        </h3>
                        {project.name_en && (
                          <p className="text-sm text-gray-500 font-prompt mt-1">{project.name_en}</p>
                        )}
                      </div>

                      {/* Project Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaBuilding className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-prompt">{project.project_type}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <FaUser className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-prompt">{project.developer}</span>
                        </div>

                        {(project.district || project.province) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FaMapMarkerAlt className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-prompt">{project.district}, {project.province}</span>
                          </div>
                        )}

                        {project.completion_year && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FaCalendarAlt className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-prompt">แล้วเสร็จ {project.completion_year}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          {project.total_units && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{parseInt(project.total_units).toLocaleString()}</div>
                                <div className="text-xs text-gray-500 font-prompt">ยูนิต</div>
                              </div>
                            </div>
                          )}

                          {project.facilities && project.facilities.length > 0 && (
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="text-center">
                                <div className="text-lg font-semibold text-blue-600">{project.facilities.length}</div>
                                <div className="text-xs text-blue-500 font-prompt">สิ่งอำนวยความสะดวก</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProject(project)}
                          className="flex-1 font-prompt group-hover:border-blue-300 hover:bg-blue-50"
                        >
                          <FaEdit className="mr-2 h-4 w-4" />
                          แก้ไข
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 font-prompt"
                        >
                          <FaTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectManagement; 