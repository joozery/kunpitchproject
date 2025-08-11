import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import ProjectForm from './ProjectForm';

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
      // TODO: เรียก API เพื่อดึงข้อมูลโครงการ
      const mockProjects = [
        {
          id: 1,
          name_th: 'ลุมพินี พาร์ค',
          name_en: 'Lumpini Park',
          project_type: 'คอนโดมิเนียม',
          developer: 'ลุมพินี ดีเวลลอปเมนต์',
          status: 'พร้อมอยู่',
          total_units: 500,
          address: '123 ลุมพินี ถนนลุมพินี',
          district: 'ลุมพินี',
          province: 'กรุงเทพมหานคร'
        },
        {
          id: 2,
          name_th: 'สุขุมวิท 71',
          name_en: 'Sukhumvit 71',
          project_type: 'บ้านเดี่ยว',
          developer: 'สุขุมวิท ดีเวลลอปเมนต์',
          status: 'กำลังก่อสร้าง',
          total_units: 50,
          address: '456 สุขุมวิท 71 ถนนสุขุมวิท',
          district: 'วัฒนา',
          province: 'กรุงเทพมหานคร'
        }
      ];
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('คุณต้องการลบโครงการนี้หรือไม่?')) {
      try {
        // TODO: เรียก API เพื่อลบโครงการ
        setProjects(prev => prev.filter(project => project.id !== id));
        alert('ลบโครงการเรียบร้อยแล้ว');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('เกิดข้อผิดพลาดในการลบโครงการ');
      }
    }
  };

  const handleSubmit = async (projectData) => {
    try {
      if (editingProject) {
        // อัปเดตโครงการ
        // TODO: เรียก API เพื่ออัปเดตโครงการ
        setProjects(prev => prev.map(project => 
          project.id === editingProject.id 
            ? { ...project, ...projectData }
            : project
        ));
        alert('อัปเดตโครงการเรียบร้อยแล้ว');
      } else {
        // เพิ่มโครงการใหม่
        // TODO: เรียก API เพื่อเพิ่มโครงการ
        const newProject = {
          id: Date.now(),
          ...projectData
        };
        setProjects(prev => [newProject, ...prev]);
        alert('เพิ่มโครงการเรียบร้อยแล้ว');
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกโครงการ');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
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