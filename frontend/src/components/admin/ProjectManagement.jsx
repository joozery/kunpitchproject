import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { projectApi } from '../../lib/projectApi';
import ProjectForm from './ProjectForm';
import Swal from 'sweetalert2';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // โหลดข้อมูลโครงการ
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching projects from API...');
      const response = await projectApi.getAll();
      console.log('✅ Projects fetched:', response.data);
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
    Swal.fire({
      title: 'แก้ไขโครงการ',
      text: `คุณต้องการแก้ไขโครงการ "${project.name_th}" หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, แก้ไขเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        setEditingProject(project);
        setShowForm(true);
      }
    });
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

  const filteredProjects = projects.filter(project =>
    project.name_th.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.developer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">จัดการโครงการ</h1>
        <Button onClick={handleAddProject} className="bg-blue-600 hover:bg-blue-700">
          + เพิ่มโครงการใหม่
        </Button>
      </div>

      {/* ค้นหา */}
      <div className="mb-6">
        <Input
          placeholder="ค้นหาโครงการ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* ตารางแสดงข้อมูล */}
      <Card>
        <CardHeader>
          <CardTitle>รายการโครงการทั้งหมด ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'ไม่พบโครงการที่ค้นหา' : 'ยังไม่มีโครงการ'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อโครงการ</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>ผู้พัฒนา</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>จำนวนยูนิต</TableHead>
                  <TableHead>ที่ตั้ง</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.name_th}</div>
                        {project.name_en && (
                          <div className="text-sm text-gray-500">{project.name_en}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{project.project_type}</TableCell>
                    <TableCell>{project.developer}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        project.status === 'พร้อมอยู่' ? 'bg-green-100 text-green-800' :
                        project.status === 'กำลังก่อสร้าง' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'Pre-sale' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </TableCell>
                    <TableCell>{project.total_units}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{project.address}</div>
                        <div className="text-gray-500">{project.district}, {project.province}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProject(project)}
                        >
                          แก้ไข
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ลบ
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectManagement; 