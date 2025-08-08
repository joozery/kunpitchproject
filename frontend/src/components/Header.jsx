import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  Menu, 
  X, 
  Search, 
  Phone, 
  Mail,
  Building2
} from 'lucide-react'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'Property', href: '/properties' },
    { name: 'เกี่ยวกับเรา', href: '/about' },
    { name: 'ติดต่อ', href: '/contact' }
  ]

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Top bar */}
      <div className={`hidden md:block transition-all duration-300 ${
        isScrolled ? 'bg-gray-100' : 'bg-blue-600'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-white">
                <Phone className="h-4 w-4" />
                <span>02-123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Mail className="h-4 w-4" />
                <span>info@kunpitch.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/admin" 
                className="text-white hover:text-blue-200 transition-colors duration-300 font-prompt"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className={`transition-all duration-300 ${
        isScrolled ? 'bg-white' : 'bg-white bg-opacity-90 backdrop-blur-sm'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-prompt">Kunpitch</h1>
                <p className="text-xs text-gray-500 font-prompt">Real Estate</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors duration-300 font-prompt ${
                    location.pathname === item.href
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-300">
                <Search className="h-5 w-5" />
                <span className="font-prompt">ค้นหา</span>
              </button>
              <Link
                to="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 font-prompt"
              >
                ติดต่อเรา
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className={`md:hidden ${isScrolled ? 'bg-white' : 'bg-white bg-opacity-95 backdrop-blur-sm'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          height: isOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-6 py-4 space-y-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`block font-medium transition-colors duration-300 font-prompt ${
                location.pathname === item.href
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-200">
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-center transition-colors duration-300 font-prompt"
            >
              ติดต่อเรา
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
}

export default Header 