import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import Breadcrumb from './Breadcrumb'
import { usePermissions } from '../../contexts/PermissionContext'
import { getRoleDescription, getRoleBadge } from '../../lib/permissionUtils'

const AdminLayout = ({ children, activePage = 'dashboard', onPageChange }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { userRole } = usePermissions()
  const roleDescription = getRoleDescription(userRole)
  const roleBadge = getRoleBadge(userRole)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const onLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activePage={activePage} 
        onPageChange={onPageChange}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <Breadcrumb />
            {/* Role Information */}
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full border text-sm font-medium ${roleBadge.className}`}>
                {roleBadge.text}
              </span>
              <p className="text-sm text-gray-600 max-w-xs">{roleDescription}</p>
            </div>
          </div>
        </div>
        
        {/* Main Content with Scrollbar */}
        <main className="flex-1 overflow-y-auto main-scrollbar">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout 