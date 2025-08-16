import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  Menu, 
  X, 
  Search,
  ChevronDown
} from 'lucide-react'
import whaleLogo from '../assets/icon2.png'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('TH')
  const [currentCurrency, setCurrentCurrency] = useState('THB')

  const location = useLocation()

  const languages = [
    { code: 'TH', name: 'ไทย', flag: '🇹🇭' },
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'CN', name: '中文', flag: '🇨🇳' },
    { code: 'JP', name: '日本語', flag: '🇯🇵' }
  ]

  const currencies = [
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }
  ]

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang.code)
    setIsLanguageOpen(false)
  }

  const handleCurrencyChange = (curr) => {
    setCurrentCurrency(curr.code)
    setIsCurrencyOpen(false)
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
    { name: 'Home', href: '/' },
    { name: 'Property type', href: '/properties' },
    { name: 'Projects', href: '/projects' },
    { name: 'Join us', href: '/join' }
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


            {/* Main header */}
      <div className={`transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-sm' : 'bg-transparent'
      }`}
      style={{
        backgroundColor: isScrolled ? '#051d40' : 'transparent'
      }}
      >
        <div className="px-6">
          <div className="flex items-center justify-between h-20 w-full">
          {/* Left Side - Logo & Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src={whaleLogo} 
                alt="Whale Space Logo" 
                className="h-16 w-16 object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 ml-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-normal transition-colors duration-300 font-taviraj text-lg ${
                    location.pathname === item.href
                      ? 'text-blue-300 drop-shadow-md'
                      : isScrolled ? 'text-white' : 'text-white hover:text-blue-200 drop-shadow-sm'
                  }`}
                  style={{
                    textShadow: location.pathname === item.href 
                      ? '2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(147, 197, 253, 0.6)' 
                      : isScrolled 
                        ? '2px 2px 4px rgba(0, 0, 0, 0.6)' 
                        : '2px 2px 4px rgba(0, 0, 0, 0.4), 0 0 6px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side - Language, Currency & CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language & Currency Selectors */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full px-4 py-2 cursor-pointer transition-all duration-300 h-10"
                  style={{
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <span className="text-lg">
                    {languages.find(lang => lang.code === currentLanguage)?.flag}
                  </span>
                  <span className="text-white font-taviraj text-sm font-medium">
                    {currentLanguage}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-white transition-transform duration-200 ${
                    isLanguageOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Language Dropdown Menu */}
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border py-2 min-w-[160px] z-50"
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
                          <div className="font-medium font-taviraj">{lang.name}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full px-4 py-2 cursor-pointer transition-all duration-300 h-10"
                  style={{
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <span className="text-white font-taviraj text-sm font-medium">
                    {currencies.find(curr => curr.code === currentCurrency)?.symbol} {currentCurrency}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-white transition-transform duration-200 ${
                    isCurrencyOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Currency Dropdown Menu */}
                {isCurrencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border py-2 min-w-[160px] z-50"
                  >
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleCurrencyChange(curr)}
                        className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                          currentCurrency === curr.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg font-medium">{curr.symbol}</span>
                        <div className="flex-1 text-left">
                          <div className="font-medium font-taviraj">{curr.name}</div>
                          <div className="text-xs text-gray-500">{curr.code}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/list-property"
                className="text-white px-8 py-2 rounded-full font-semibold transition-colors duration-300 font-taviraj"
                style={{ 
                  backgroundColor: '#b08d57',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(0, 0, 0, 0.3)'
                }}
              >
                List Your Property
              </Link>
              <Link
                to="/consult"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-8 py-2 rounded-full font-semibold transition-colors duration-300 font-taviraj"
              >
                Consult us
              </Link>
            </div>
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
              className={`md:hidden backdrop-blur-sm`}
              style={{
                backgroundColor: isScrolled ? '#051d40' : 'transparent'
              }}
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
                    className={`block font-normal transition-colors duration-300 font-taviraj text-lg ${
                      location.pathname === item.href
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Language & Currency Selectors */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  {/* Language Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                      className="w-full flex items-center justify-between space-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3 cursor-pointer transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">
                          {languages.find(lang => lang.code === currentLanguage)?.flag}
                        </span>
                        <span className="font-taviraj text-sm font-medium text-gray-700">
                          {currentLanguage}
                        </span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        isLanguageOpen ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Mobile Language Dropdown Menu */}
                    {isLanguageOpen && (
                      <div className="mt-2 bg-white rounded-lg border py-2">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              handleLanguageChange(lang)
                              setIsOpen(false)
                            }}
                            className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                              currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <div className="flex-1 text-left">
                              <div className="font-medium font-taviraj">{lang.name}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Currency Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                      className="w-full flex items-center justify-between space-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3 cursor-pointer transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-medium text-gray-700">
                          {currencies.find(curr => curr.code === currentCurrency)?.symbol}
                        </span>
                        <span className="font-taviraj text-sm font-medium text-gray-700">
                          {currentCurrency}
                        </span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        isCurrencyOpen ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Mobile Currency Dropdown Menu */}
                    {isCurrencyOpen && (
                      <div className="mt-2 bg-white rounded-lg border py-2">
                        {currencies.map((curr) => (
                          <button
                            key={curr.code}
                            onClick={() => {
                              handleCurrencyChange(curr)
                              setIsOpen(false)
                            }}
                            className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                              currentCurrency === curr.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            <span className="text-lg font-medium">{curr.symbol}</span>
                            <div className="flex-1 text-left">
                              <div className="font-medium font-taviraj">{curr.name}</div>
                              <div className="text-xs text-gray-500">{curr.code}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    to="/list-property"
                    onClick={() => setIsOpen(false)}
                    className="block text-white px-8 py-2 rounded-full font-semibold text-center transition-colors duration-300 font-taviraj"
                    style={{ 
                      backgroundColor: '#b08d57',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    List Your Property
                  </Link>
                  <Link
                    to="/consult"
                    onClick={() => setIsOpen(false)}
                    className="block bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-8 py-2 rounded-full font-semibold text-center transition-colors duration-300 font-taviraj"
                  >
                    Consult us
                  </Link>
                </div>
              </div>
            </motion.div>
    </motion.header>
  )
}

export default Header 