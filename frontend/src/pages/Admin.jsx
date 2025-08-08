import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import { adminRoutes } from '../routes/adminRoutes.jsx'

const Admin = () => {
  const location = useLocation()

  // Get current route based on pathname
  const getCurrentRoute = () => {
    const path = location.pathname
    const route = adminRoutes.find(r => r.path === path)
    return route ? route.name : 'dashboard'
  }

  const handlePageChange = (pageName) => {
    const route = adminRoutes.find(r => r.name === pageName)
    if (route && route.path) {
      window.location.href = route.path
    }
  }

  return (
    <AdminLayout 
      activePage={getCurrentRoute()} 
      onPageChange={handlePageChange}
    >
      <Routes>
        {/* Redirect /admin to /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Admin routes */}
        {adminRoutes.filter(route => route.component || route.redirect).map((route) => (
          <Route
            key={route.path}
            path={route.path.replace('/admin', '')}
            element={
              route.redirect ? (
                <Navigate to={route.redirect} replace />
              ) : (
                <route.component />
              )
            }
          />
        ))}
        
        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default Admin 