import React from 'react'
import { motion } from 'framer-motion'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Search, Bell, User, ChevronDown, LogOut, Settings } from 'lucide-react'
import logo from '../../assets/WHLE-03.png'

const Header = () => {
  const onLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    window.location.href = '/login'
  }
  return (
    <motion.header 
      className="bg-white/80 backdrop-blur border-b h-16 flex items-center justify-between px-6 font-prompt"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {/* Brand + Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="hidden md:flex items-center gap-2">
          <img src={logo} alt="Whalespace" className="h-8 w-auto" />
          <span className="text-sm text-gray-600">Admin</span>
        </div>
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
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white font-prompt transition-all duration-200 rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
      </div>

      {/* Right Side Actions */}
      <motion.div 
        className="flex items-center gap-2"
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
          <Button variant="ghost" size="sm" className="relative rounded-full">
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

        {/* User Dropdown */}
        <div className="relative">
          <details className="group">
            <summary className="list-none">
              <motion.div 
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-50 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:inline text-sm text-gray-700">ผู้ดูแล</span>
                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
              </motion.div>
            </summary>
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-20">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
                <Settings className="h-4 w-4 text-gray-500" /> ตั้งค่าโปรไฟล์
              </button>
              <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-red-600">
                <LogOut className="h-4 w-4" /> ออกจากระบบ
              </button>
            </div>
          </details>
        </div>
      </motion.div>
    </motion.header>
  )
}

export default Header 