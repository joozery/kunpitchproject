import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { getBreadcrumb, getRouteByPath } from '../../routes/adminRoutes.jsx'

const Breadcrumb = ({ className = '' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const breadcrumbItems = getBreadcrumb(location.pathname) || ['หน้าหลัก']
  
  const handleBreadcrumbClick = (index) => {
    if (index === 0) {
      // Click on first item (home) - navigate to dashboard
      navigate('/admin/dashboard')
    } else {
      // For other items, we could implement navigation logic
      // For now, just log the click
      console.log(`Clicked on breadcrumb item: ${breadcrumbItems[index]}`)
    }
  }

  return (
    <motion.nav 
      className={`flex items-center space-x-2 text-sm font-medium text-gray-600 font-prompt ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Home Icon */}
      <motion.button
        onClick={() => handleBreadcrumbClick(0)}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="หน้าหลัก"
      >
        <Home className="w-4 h-4" />
      </motion.button>
      
      {/* Breadcrumb Items */}
      {Array.isArray(breadcrumbItems) && breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </motion.div>
          
          <motion.button
            onClick={() => handleBreadcrumbClick(index)}
            className={`px-3 py-1 rounded-md transition-all duration-200 ${
              index === breadcrumbItems.length - 1
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={index === breadcrumbItems.length - 1}
          >
            {item}
          </motion.button>
        </React.Fragment>
      ))}
    </motion.nav>
  )
}

export default Breadcrumb 