import React from 'react'
import { motion } from 'framer-motion'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Search, Bell, User } from 'lucide-react'

const Header = () => {
  return (
    <motion.header 
      className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6 font-prompt"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {/* Search Bar */}
      <motion.div 
        className="flex-1 max-w-md"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </motion.div>
          <motion.div
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              placeholder="ค้นหา..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white font-prompt transition-all duration-200"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side Actions */}
      <motion.div 
        className="flex items-center space-x-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        {/* Notification Bell */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button variant="ghost" size="sm" className="relative">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
            >
              <Bell className="h-5 w-5 text-gray-600" />
            </motion.div>
            <motion.span 
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            />
          </Button>
        </motion.div>

        {/* User Avatar */}
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <User className="h-4 w-4 text-white" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.header>
  )
}

export default Header 