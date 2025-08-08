import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import Breadcrumb from './Breadcrumb'

const AdminLayout = ({ children, activePage = 'dashboard', onPageChange }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
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
          <Breadcrumb />
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