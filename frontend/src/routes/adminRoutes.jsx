import React from 'react'
import Dashboard from '../components/admin/Dashboard'
import PropertyManagement from '../components/admin/PropertyManagement'
import CondoManagement from '../components/admin/CondoManagement'
import HouseManagement from '../components/admin/HouseManagement'
import LandManagement from '../components/admin/LandManagement'
import CommercialManagement from '../components/admin/CommercialManagement'

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
    path: '/admin/condos',
    name: 'condos',
    title: 'คอนโด',
    description: 'จัดการคอนโดมิเนียม',
    category: 'property',
    breadcrumb: ['จัดการ Property', 'คอนโด'],
    icon: 'Building',
    component: CondoManagement
  },
  {
    path: '/admin/houses',
    name: 'houses',
    title: 'บ้านเดี่ยว/ทาวเฮาส์/อพาร์ตเม้นท์',
    description: 'จัดการบ้านเดี่ยว ทาวน์เฮาส์ อพาร์ตเม้นท์',
    category: 'property',
    breadcrumb: ['จัดการ Property', 'บ้านเดี่ยว/ทาวเฮาส์/อพาร์ตเม้นท์'],
    icon: 'HomeIcon',
    component: HouseManagement
  },
  {
    path: '/admin/land',
    name: 'land',
    title: 'ที่ดิน',
    description: 'จัดการที่ดินเปล่า ไร่นา สวน',
    category: 'property',
    breadcrumb: ['จัดการ Property', 'ที่ดิน'],
    icon: 'TreePine',
    component: LandManagement
  },
  {
    path: '/admin/commercial',
    name: 'commercial',
    title: 'โฮมออฟฟิศ/ตึกแถว',
    description: 'จัดการโฮมออฟฟิศ ตึกแถว พาณิชย์',
    category: 'property',
    breadcrumb: ['จัดการ Property', 'โฮมออฟฟิศ/ตึกแถว'],
    icon: 'Briefcase',
    component: CommercialManagement
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