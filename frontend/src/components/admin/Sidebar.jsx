import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { usePermissions } from '../../contexts/PermissionContext'
import { 
  Home, 
  Building2,
  Users, 
  Settings,
  HomeIcon,
  HelpCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Building,
  TreePine,
  Briefcase,
  MessageCircle,
  FolderOpen,
  Image,
  Youtube,
  FileText
} from 'lucide-react'

const Sidebar = ({ activePage, onPageChange, collapsed = false, onToggle }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { 
    userRole,
    permissions,
    isLoading,
    canManageProjects, 
    canManageProperties, 
    canManageUsers,
    canAccessContact,
    canManageBanners,
    canManageArticles,
    canManageYoutube
  } = usePermissions()

  // เพิ่ม debug
  console.log('🔍 Sidebar Debug:', { 
    userRole, 
    permissions, 
    isLoading,
    canManageUsers,
    canManageProjects, 
    canManageProperties,
    permissionsKeys: Object.keys(permissions || {}),
    permissionsValues: permissions
  });

  const menuItems = [
    {
      id: 'dashboard',
      title: 'หน้าหลัก',
      description: 'ภาพรวมและสถิติ',
      path: '/admin/dashboard',
      icon: Home,
      permission: null // แสดงได้ทุกคน
    },
    {
      id: 'users',
      title: 'ผู้ใช้',
      description: 'จัดการผู้ใช้งานและสิทธิ์',
      path: '/admin/users',
      icon: Users,
      permission: 'canManageUsers'
    },
    {
      id: 'properties',
      title: 'จัดการ Property',
      description: 'จัดการข้อมูลอสังหาริมทรัพย์ทั้งหมด',
      path: '/admin/properties',
      icon: Building2,
      permission: 'canManageProperties'
    },
    {
      id: 'projects',
      title: 'จัดการโครงการ',
      description: 'จัดการรายละเอียดโครงการต่างๆ',
      path: '/admin/projects',
      icon: FolderOpen,
      permission: 'canManageProjects'
    },
    {
      id: 'condos',
      title: 'คอนโด/อพาร์ตเม้นท์',
      description: 'จัดการคอนโดมิเนียมและอพาร์ตเม้นท์',
      path: '/admin/condos',
      icon: Building,
      permission: 'canManageProperties'
    },
    {
      id: 'houses',
      title: 'บ้านเดี่ยว/ทาวเฮาส์',
      description: 'จัดการบ้านเดี่ยวและทาวน์เฮาส์',
      path: '/admin/houses',
      icon: HomeIcon,
      permission: 'canManageProperties'
    },
    {
      id: 'land',
      title: 'ที่ดิน',
      description: 'จัดการที่ดินเปล่า ไร่นา สวน',
      path: '/admin/land',
      icon: TreePine,
      permission: 'canManageProperties'
    },
    {
      id: 'commercial',
      title: 'โฮมออฟฟิศ/ตึกแถว',
      description: 'จัดการโฮมออฟฟิศ ตึกแถว พาณิชย์',
      path: '/admin/commercial',
      icon: Briefcase,
      permission: 'canManageProperties'
    },
    {
      id: 'contact',
      title: 'การติดต่อ',
      description: 'ตั้งค่าข้อมูลการติดต่อและโซเชียลมีเดีย',
      path: '/admin/contact',
      icon: MessageCircle,
      permission: 'canAccessContact'
    },
    {
      id: 'banner-slides',
      title: 'จัดการ Banner Slides',
      description: 'จัดการ slides สำหรับ BannerSlide component',
      path: '/admin/banner-slides',
      icon: Image,
      permission: 'canManageBanners'
    },
    {
      id: 'youtube',
      title: 'จัดการ YouTube',
      description: 'จัดการ YouTube videos ในหน้า home',
      path: '/admin/youtube',
      icon: Youtube,
      permission: 'canManageYoutube'
    },
    {
      id: 'articles',
      title: 'จัดการบทความ',
      description: 'จัดการบทความและเนื้อหาบล็อก',
      path: '/admin/articles',
      icon: FileText,
      permission: 'canManageArticles'
    },
    {
      id: 'settings',
      title: 'ตั้งค่า',
      description: 'ตั้งค่าระบบและโปรไฟล์',
      path: '/admin/settings',
      icon: Settings,
      permission: null // แสดงได้ทุกคน
    },
    {
      id: 'help',
      title: 'ช่วยเหลือ',
      description: 'คู่มือการใช้งานและ FAQ',
      path: '/admin/help',
      icon: HelpCircle,
      permission: null // แสดงได้ทุกคน
    },
    {
      id: 'about',
      title: 'เกี่ยวกับ',
      description: 'ข้อมูลเกี่ยวกับระบบ',
      path: '/admin/about',
      icon: Info,
      permission: null // แสดงได้ทุกคน
    }
  ]

  const handleMenuClick = (item) => {
    navigate(item.path)
    if (onPageChange) {
      onPageChange(item.id)
    }
  }

  const isActivePage = (item) => {
    return location.pathname === item.path || activePage === item.id
  }

  return (
    <aside className={`bg-white shadow-lg h-screen flex flex-col font-prompt relative ${
      collapsed ? 'w-20' : 'w-80'
    }`}>
      {/* Toggle Button */}
      <div className="absolute -right-3 top-6 z-10">
        <button
          onClick={onToggle}
          className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors duration-200"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </div>

      {/* Logo Section */}
      <div className={`border-b flex-shrink-0 ${collapsed ? 'p-4' : 'p-6'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className={`bg-blue-600 rounded-lg flex items-center justify-center ${
            collapsed ? 'w-12 h-12' : 'w-10 h-10'
          }`}>
            <span className="text-white font-bold text-lg">W</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-prompt">Whalespace</h1>
              <p className="text-sm text-gray-500 font-prompt">ระบบจัดการอสังหาริมทรัพย์</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto sidebar-scrollbar">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">กำลังโหลดสิทธิ์...</p>
          </div>
        ) : (
          <nav className={`space-y-2 ${collapsed ? 'p-3' : 'p-4'}`}>
          {Array.isArray(menuItems) && menuItems.map((item) => {
            // เพิ่ม debug
            console.log('🔍 Sidebar Menu Debug:', { 
              item: item.title, 
              permission: item.permission, 
              hasPermission: permissions[item.permission],
              permissions: permissions,
              userRole: userRole
            });
            
            // ตรวจสอบสิทธิ์การเข้าถึงเมนู
            if (item.permission && !permissions[item.permission]) {
              console.log('❌ Menu hidden:', item.title, 'Permission:', item.permission);
              return null; // ไม่แสดงเมนูถ้าไม่มีสิทธิ์
            }

            const Icon = item.icon
            const isActive = isActivePage(item)
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start h-auto font-prompt transition-all duration-200 ${
                  collapsed 
                    ? 'p-2 h-10 w-10 rounded-lg mx-auto' 
                    : 'p-3 text-sm h-auto'
                } ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 border-blue-200 shadow-md" 
                    : "hover:bg-gray-50 hover:shadow-sm"
                }`}
                onClick={() => handleMenuClick(item)}
                title={collapsed ? item.title : ''}
              >
                <div className={`flex items-start ${collapsed ? 'justify-center' : 'space-x-3'}`}>
                  <Icon className={`${
                    collapsed ? 'h-5 w-5' : 'h-4 w-4 mt-0.5 flex-shrink-0'
                  } ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`} />
                  {!collapsed && (
                    <div className="text-left flex-1 min-w-0">
                      <div className={`font-medium font-prompt ${
                        isActive ? "text-blue-700" : "text-gray-900"
                      }`}>
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500 font-prompt mt-0.5 leading-tight">
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>
              </Button>
            )
                      })}
          </nav>
        )}
        </div>

      {/* Admin User Section */}
      <div className={`border-t bg-gray-50 flex-shrink-0 ${collapsed ? 'p-4' : 'p-4'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className={`bg-blue-600 rounded-full flex items-center justify-center ${
            collapsed ? 'w-12 h-12' : 'w-10 h-10'
          }`}>
            <Users className={`${collapsed ? 'h-6 w-6' : 'h-5 w-5'} text-white`} />
          </div>
          {!collapsed && (
            <div>
              <div className="font-medium text-gray-900 font-prompt">
                {userRole === 'owner' ? 'เจ้าของ' : 
                 userRole === 'admin' ? 'ผู้ดูแลระบบ' :
                 userRole === 'project_manager' ? 'ผู้จัดการโครงการ' :
                 userRole === 'property_manager' ? 'ผู้จัดการทรัพย์สิน' :
                 userRole === 'editor' ? 'ผู้แก้ไข' :
                 userRole === 'viewer' ? 'ผู้ดู' : 'ผู้ดูแลระบบ'}
              </div>
              <div className="text-sm text-gray-500 font-prompt">
                {userRole === 'owner' ? 'Owner' :
                 userRole === 'admin' ? 'Administrator' :
                 userRole === 'project_manager' ? 'Project Manager' :
                 userRole === 'property_manager' ? 'Property Manager' :
                 userRole === 'editor' ? 'Editor' :
                 userRole === 'viewer' ? 'Viewer' : 'Admin'}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar 