import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { 
  Home, 
  Building2,
  Users, 
  FileText,
  Calendar,
  BarChart3,
  Settings,
  MapPin,
  DollarSign,
  Image,
  HomeIcon,
  Store,
  Landmark,
  CreditCard,
  MessageSquare,
  Bell,
  Database,
  Shield,
  HelpCircle,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const Sidebar = ({ activePage, onPageChange, collapsed = false, onToggle }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      id: 'dashboard',
      title: 'หน้าหลัก',
      description: 'ภาพรวมและสถิติ',
      path: '/admin/dashboard',
      icon: Home
    },
    {
      id: 'properties',
      title: 'จัดการ Property',
      description: 'จัดการข้อมูลอสังหาริมทรัพย์',
      path: '/admin/properties',
      icon: Building2
    },
    {
      id: 'residential',
      title: 'ที่อยู่อาศัย',
      description: 'จัดการบ้าน คอนโด ทาวน์เฮาส์',
      path: '/admin/residential',
      icon: HomeIcon
    },
    {
      id: 'commercial',
      title: 'เชิงพาณิชย์',
      description: 'จัดการสำนักงาน ร้านค้า โรงแรม',
      path: '/admin/commercial',
      icon: Store
    },
    {
      id: 'land',
      title: 'ที่ดิน',
      description: 'จัดการที่ดินเปล่า ไร่นา สวน',
      path: '/admin/land',
      icon: Landmark
    },
    {
      id: 'customers',
      title: 'ลูกค้า',
      description: 'จัดการข้อมูลลูกค้าและผู้ติดต่อ',
      path: '/admin/customers',
      icon: Users
    },
    {
      id: 'appointments',
      title: 'นัดหมาย',
      description: 'จัดการการนัดหมายดูบ้าน',
      path: '/admin/appointments',
      icon: Calendar
    },
    {
      id: 'contracts',
      title: 'สัญญา',
      description: 'จัดการสัญญาเช่า-ขาย',
      path: '/admin/contracts',
      icon: FileText
    },
    {
      id: 'payments',
      title: 'การชำระเงิน',
      description: 'จัดการการชำระเงินและใบแจ้งหนี้',
      path: '/admin/payments',
      icon: CreditCard
    },
    {
      id: 'reports',
      title: 'รายงาน',
      description: 'รายงานยอดขายและสถิติ',
      path: '/admin/reports',
      icon: BarChart3
    },
    {
      id: 'locations',
      title: 'พื้นที่',
      description: 'จัดการพื้นที่และโซน',
      path: '/admin/locations',
      icon: MapPin
    },
    {
      id: 'pricing',
      title: 'ราคา',
      description: 'จัดการราคาและโปรโมชั่น',
      path: '/admin/pricing',
      icon: DollarSign
    },
    {
      id: 'gallery',
      title: 'แกลเลอรี่',
      description: 'จัดการรูปภาพและวิดีโอ',
      path: '/admin/gallery',
      icon: Image
    },
    {
      id: 'notifications',
      title: 'การแจ้งเตือน',
      description: 'จัดการการแจ้งเตือน',
      path: '/admin/notifications',
      icon: Bell
    },
    {
      id: 'messages',
      title: 'ข้อความ',
      description: 'จัดการข้อความและแชท',
      path: '/admin/messages',
      icon: MessageSquare
    },
    {
      id: 'database',
      title: 'ฐานข้อมูล',
      description: 'จัดการฐานข้อมูลและข้อมูล',
      path: '/admin/database',
      icon: Database
    },
    {
      id: 'security',
      title: 'ความปลอดภัย',
      description: 'จัดการความปลอดภัยและสิทธิ์',
      path: '/admin/security',
      icon: Shield
    },
    {
      id: 'settings',
      title: 'ตั้งค่า',
      description: 'ตั้งค่าระบบและโปรไฟล์',
      path: '/admin/settings',
      icon: Settings
    },
    {
      id: 'help',
      title: 'ช่วยเหลือ',
      description: 'คู่มือการใช้งานและ FAQ',
      path: '/admin/help',
      icon: HelpCircle
    },
    {
      id: 'about',
      title: 'เกี่ยวกับ',
      description: 'ข้อมูลเกี่ยวกับระบบ',
      path: '/admin/about',
      icon: Info
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
        <nav className={`space-y-2 ${collapsed ? 'p-3' : 'p-4'}`}>
          {menuItems.map((item) => {
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
              <div className="font-medium text-gray-900 font-prompt">ผู้ดูแลระบบ</div>
              <div className="text-sm text-gray-500 font-prompt">Real Estate Manager</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar 