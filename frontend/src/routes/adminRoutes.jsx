import React from 'react'
import Dashboard from '../components/admin/Dashboard'
import PropertyManagement from '../components/admin/PropertyManagement'

// Route configuration for admin pages organized by categories
export const adminRoutes = [
  // Main Dashboard
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'dashboard',
    title: 'หน้าหลัก',
    description: 'ภาพรวมและสถิติ',
    category: 'main',
    breadcrumb: ['หน้าหลัก'],
    icon: 'Home',
    component: Dashboard
  },
  
  // Property Management Category
  {
    path: '/admin/properties',
    name: 'properties',
    title: 'จัดการ Property',
    description: 'จัดการข้อมูลอสังหาริมทรัพย์',
    category: 'property',
    breadcrumb: ['จัดการ Property', 'ทั้งหมด'],
    icon: 'Building2',
    component: PropertyManagement
  },
  {
    path: '/admin/residential',
    name: 'residential',
    title: 'ที่อยู่อาศัย',
    description: 'จัดการบ้าน คอนโด ทาวน์เฮาส์',
    category: 'property',
    breadcrumb: ['จัดการ Property', 'ที่อยู่อาศัย'],
    icon: 'HomeIcon',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">ที่อยู่อาศัย</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการบ้าน คอนโด ทาวน์เฮาส์</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการที่อยู่อาศัย - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  {
    path: '/admin/commercial',
    name: 'commercial',
    title: 'เชิงพาณิชย์',
    description: 'จัดการสำนักงาน ร้านค้า โรงแรม',
    category: 'property',
    breadcrumb: ['จัดการ Property', 'เชิงพาณิชย์'],
    icon: 'Store',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">เชิงพาณิชย์</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการสำนักงาน ร้านค้า โรงแรม</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการเชิงพาณิชย์ - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  {
    path: '/admin/land',
    name: 'land',
    title: 'ที่ดิน',
    description: 'จัดการที่ดินเปล่า ไร่นา สวน',
    category: 'property',
    breadcrumb: ['จัดการ Property', 'ที่ดิน'],
    icon: 'Landmark',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">ที่ดิน</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการที่ดินเปล่า ไร่นา สวน</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการที่ดิน - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  
  // Customer Management Category
  {
    path: '/admin/customers',
    name: 'customers',
    title: 'ลูกค้า',
    description: 'จัดการข้อมูลลูกค้าและผู้ติดต่อ',
    category: 'customer',
    breadcrumb: ['ลูกค้า', 'จัดการลูกค้า'],
    icon: 'Users',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">ลูกค้า</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการข้อมูลลูกค้าและผู้ติดต่อ</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการลูกค้า - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  {
    path: '/admin/appointments',
    name: 'appointments',
    title: 'นัดหมาย',
    description: 'จัดการการนัดหมายดูบ้าน',
    category: 'customer',
    breadcrumb: ['ลูกค้า', 'นัดหมาย'],
    icon: 'Calendar',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">นัดหมาย</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการการนัดหมายดูบ้าน</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการนัดหมาย - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  
  // Business Management Category
  {
    path: '/admin/contracts',
    name: 'contracts',
    title: 'สัญญา',
    description: 'จัดการสัญญาเช่า-ขาย',
    category: 'business',
    breadcrumb: ['ธุรกิจ', 'สัญญา'],
    icon: 'FileText',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">สัญญา</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการสัญญาเช่า-ขาย</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการสัญญา - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  {
    path: '/admin/payments',
    name: 'payments',
    title: 'การชำระเงิน',
    description: 'จัดการการชำระเงินและใบแจ้งหนี้',
    category: 'business',
    breadcrumb: ['ธุรกิจ', 'การชำระเงิน'],
    icon: 'CreditCard',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">การชำระเงิน</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการการชำระเงินและใบแจ้งหนี้</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการการชำระเงิน - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  {
    path: '/admin/reports',
    name: 'reports',
    title: 'รายงาน',
    description: 'รายงานยอดขายและสถิติ',
    category: 'business',
    breadcrumb: ['ธุรกิจ', 'รายงาน'],
    icon: 'BarChart3',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">รายงาน</h1>
          <p className="text-gray-600 mt-2 font-prompt">รายงานยอดขายและสถิติ</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้ารายงาน - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  
  // Content Management Category
  {
    path: '/admin/locations',
    name: 'locations',
    title: 'พื้นที่',
    description: 'จัดการพื้นที่และโซน',
    category: 'content',
    breadcrumb: ['เนื้อหา', 'พื้นที่'],
    icon: 'MapPin',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">พื้นที่</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการพื้นที่และโซน</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการพื้นที่ - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  {
    path: '/admin/pricing',
    name: 'pricing',
    title: 'ราคา',
    description: 'จัดการราคาและโปรโมชั่น',
    category: 'content',
    breadcrumb: ['เนื้อหา', 'ราคา'],
    icon: 'DollarSign',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">ราคา</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการราคาและโปรโมชั่น</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการราคา - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  {
    path: '/admin/gallery',
    name: 'gallery',
    title: 'แกลเลอรี่',
    description: 'จัดการรูปภาพและวิดีโอ',
    category: 'content',
    breadcrumb: ['เนื้อหา', 'แกลเลอรี่'],
    icon: 'Image',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">แกลเลอรี่</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการรูปภาพและวิดีโอ</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการแกลเลอรี่ - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  
  // Communication Category
  {
    path: '/admin/notifications',
    name: 'notifications',
    title: 'การแจ้งเตือน',
    description: 'จัดการการแจ้งเตือน',
    category: 'communication',
    breadcrumb: ['การสื่อสาร', 'การแจ้งเตือน'],
    icon: 'Bell',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">การแจ้งเตือน</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการการแจ้งเตือน</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการการแจ้งเตือน - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  {
    path: '/admin/messages',
    name: 'messages',
    title: 'ข้อความ',
    description: 'จัดการข้อความและแชท',
    category: 'communication',
    breadcrumb: ['การสื่อสาร', 'ข้อความ'],
    icon: 'MessageSquare',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">ข้อความ</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการข้อความและแชท</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการข้อความ - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  
  // System Management Category
  {
    path: '/admin/database',
    name: 'database',
    title: 'ฐานข้อมูล',
    description: 'จัดการฐานข้อมูลและข้อมูล',
    category: 'system',
    breadcrumb: ['ระบบ', 'ฐานข้อมูล'],
    icon: 'Database',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">ฐานข้อมูล</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการฐานข้อมูลและข้อมูล</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการฐานข้อมูล - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  {
    path: '/admin/security',
    name: 'security',
    title: 'ความปลอดภัย',
    description: 'จัดการความปลอดภัยและสิทธิ์',
    category: 'system',
    breadcrumb: ['ระบบ', 'ความปลอดภัย'],
    icon: 'Shield',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">ความปลอดภัย</h1>
          <p className="text-gray-600 mt-2 font-prompt">จัดการความปลอดภัยและสิทธิ์</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าจัดการความปลอดภัย - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  {
    path: '/admin/settings',
    name: 'settings',
    title: 'ตั้งค่า',
    description: 'ตั้งค่าระบบและโปรไฟล์',
    category: 'system',
    breadcrumb: ['ระบบ', 'ตั้งค่า'],
    icon: 'Settings',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">ตั้งค่า</h1>
          <p className="text-gray-600 mt-2 font-prompt">ตั้งค่าระบบและโปรไฟล์</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าตั้งค่า - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  
  // Support Category
  {
    path: '/admin/help',
    name: 'help',
    title: 'ช่วยเหลือ',
    description: 'คู่มือการใช้งานและ FAQ',
    category: 'support',
    breadcrumb: ['ช่วยเหลือ', 'คู่มือการใช้งาน'],
    icon: 'HelpCircle',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">ช่วยเหลือ</h1>
          <p className="text-gray-600 mt-2 font-prompt">คู่มือการใช้งานและ FAQ</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าช่วยเหลือ - กำลังพัฒนา</p>
        </div>
      </div>
    )
  },
  {
    path: '/admin/about',
    name: 'about',
    title: 'เกี่ยวกับ',
    description: 'ข้อมูลเกี่ยวกับระบบ',
    category: 'support',
    breadcrumb: ['ช่วยเหลือ', 'เกี่ยวกับ'],
    icon: 'Info',
    component: () => (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-prompt">เกี่ยวกับ</h1>
          <p className="text-gray-600 mt-2 font-prompt">ข้อมูลเกี่ยวกับระบบ</p>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-lg">
          <p className="text-gray-500 font-prompt">หน้าข้อมูลเกี่ยวกับระบบ - กำลังพัฒนา</p>
        </div>
      </div>
    )
  }
]

// Route categories for organization
export const routeCategories = {
  main: {
    name: 'หลัก',
    description: 'หน้าหลักและภาพรวม',
    icon: 'Home'
  },
  property: {
    name: 'จัดการ Property',
    description: 'จัดการข้อมูลอสังหาริมทรัพย์',
    icon: 'Building2'
  },
  customer: {
    name: 'ลูกค้า',
    description: 'จัดการข้อมูลลูกค้าและนัดหมาย',
    icon: 'Users'
  },
  business: {
    name: 'ธุรกิจ',
    description: 'สัญญา การชำระเงิน และรายงาน',
    icon: 'FileText'
  },
  content: {
    name: 'เนื้อหา',
    description: 'จัดการเนื้อหาและสื่อ',
    icon: 'Image'
  },
  communication: {
    name: 'การสื่อสาร',
    description: 'การแจ้งเตือนและข้อความ',
    icon: 'MessageSquare'
  },
  system: {
    name: 'ระบบ',
    description: 'การตั้งค่าและความปลอดภัย',
    icon: 'Settings'
  },
  support: {
    name: 'ช่วยเหลือ',
    description: 'คู่มือและข้อมูล',
    icon: 'HelpCircle'
  }
}

// Helper function to get route by name
export const getRouteByName = (name) => {
  return adminRoutes.find(route => route.name === name)
}

// Helper function to get route by path
export const getRouteByPath = (path) => {
  return adminRoutes.find(route => route.path === path)
}

// Helper function to get routes by category
export const getRoutesByCategory = (category) => {
  return adminRoutes.filter(route => route.category === category)
}

// Helper function to get breadcrumb for a route
export const getBreadcrumb = (path) => {
  const route = getRouteByPath(path)
  return route ? route.breadcrumb : ['หน้าหลัก']
} 