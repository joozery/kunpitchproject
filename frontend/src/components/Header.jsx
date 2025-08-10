import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  Menu, 
  X, 
  Search, 
  Phone, 
  Mail,
  ChevronDown
} from 'lucide-react'
import whaleLogo from '../assets/WHLE-03.png'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('TH')
  const [currentCurrency, setCurrentCurrency] = useState('THB')
  const location = useLocation()

  const languages = [
    { code: 'TH', name: 'ไทย', flag: '🇹🇭', currency: 'THB' },
    { code: 'EN', name: 'English', flag: '🇺🇸', currency: 'USD' },
    { code: 'CN', name: '中文', flag: '🇨🇳', currency: 'CNY' },
    { code: 'JP', name: '日本語', flag: '🇯🇵', currency: 'JPY' }
  ]

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang.code)
    setCurrentCurrency(lang.currency)
    setIsLanguageOpen(false)
  }

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
      <div className="hidden md:block bg-blue-600">
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-white">
                <Phone className="h-4 w-4" />
                <span>02-123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Mail className="h-4 w-4" />
                <span>info@whalespace.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language & Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center space-x-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-md px-3 py-1 cursor-pointer"
                >
                  <span className="text-lg">
                    {languages.find(lang => lang.code === currentLanguage)?.flag}
                  </span>
                  <span className="text-white font-prompt text-sm font-medium">
                    {currentLanguage} | {currentCurrency}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-white transition-transform duration-200 ${
                    isLanguageOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown Menu */}
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border py-2 min-w-[160px] z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                          currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{lang.name}</div>
                          <div className="text-xs text-gray-500">{lang.currency}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              <span className="text-white font-prompt">WHALE SPACE INTERNATIONAL</span>
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
              <img 
                src={whaleLogo} 
                alt="Whale Space Logo" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold font-prompt uppercase bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 bg-clip-text text-transparent">WHALE SPACE</h1>
                <p className="text-xs text-gray-500 font-prompt uppercase">INTERNATIONAL REAL ESTATE</p>
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