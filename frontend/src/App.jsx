import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { MessageCircle, Calculator, Search as SearchIcon } from 'lucide-react'
import Admin from './pages/Admin'
import Home from './pages/Home'
import Login from './pages/Login'
import PropertyDetail from './pages/PropertyDetail'
import ListProperty from './pages/ListProperty'
import Consult from './pages/Consult'
import Projects from './pages/Projects'
import Join from './pages/Join'
import Buy from './pages/Buy'
import Rent from './pages/Rent'
import ErrorBoundary from './components/ErrorBoundary'
import { LanguageProvider } from './contexts/LanguageContext'

const RequireAuth = ({ children }) => {
  const location = useLocation()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}

// Component ที่อยู่ภายใน Router
const AppContent = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [showContactPopup, setShowContactPopup] = useState(false)

  const handleContactClick = (e) => {
    e.preventDefault()
    setShowContactPopup(true)
  }

  const closeContactPopup = () => {
    setShowContactPopup(false)
  }

  return (
    <div className="App">
      {/* Action Buttons Section - Only show on Home page */}
      {isHomePage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center justify-center">
            {/* Main Action Buttons */}
            <div className="flex items-center space-x-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              {/* Contact Button or Contact Icons */}
              {showContactPopup ? (
                <div className="relative flex items-center space-x-2 bg-white border border-yellow-500 px-4 py-2 rounded-full">
                  {/* Close Button */}
                  <button
                    onClick={closeContactPopup}
                    className="w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors duration-200 text-xs font-bold"
                  >
                    ×
                  </button>
                  
                  {/* Phone */}
                  <div className="w-6 h-6 border border-yellow-500 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-50 transition-colors duration-200">
                    <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  
                  {/* Line */}
                  <div className="w-6 h-6 border border-yellow-500 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-50 transition-colors duration-200">
                    <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  
                  {/* Facebook */}
                  <div className="w-6 h-6 border border-yellow-500 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-50 transition-colors duration-200">
                    <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  {/* WhatsApp */}
                  <div className="w-6 h-6 border border-yellow-500 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-50 transition-colors duration-200">
                    <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleContactClick}
                  className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-yellow-500 px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-300 font-prompt cursor-pointer"
                  style={{ color: '#243756' }}
                >
                  <MessageCircle className="h-4 w-4" style={{ color: '#243756' }} />
                  <span>ช่องทางติดต่อ</span>
                </button>
              )}
              
              <Link
                to="/mortgage-calculator"
                className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-yellow-500 px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-300 font-prompt"
                style={{ color: '#243756' }}
              >
                <Calculator className="h-4 w-4" style={{ color: '#243756' }} />
                <span>คำนวณสินเชื่อ</span>
              </Link>
              <Link
                to="/find-assets"
                className="flex items-center space-x-2 text-white px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-300 font-prompt"
                style={{ 
                  background: 'linear-gradient(to right, #1c4d85, #051d40)',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(0, 0, 0, 0.3)'
                }}
              >
                <SearchIcon className="h-4 w-4" />
                <span>ค้นหาที่อยู่ในฝัน</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/list-property" element={<ListProperty />} />
        <Route path="/consult" element={<Consult />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/join" element={<Join />} />
        
        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Admin routes (protected) */}
        <Route path="/admin/*" element={<RequireAuth><Admin /></RequireAuth>} />
        
        {/* Redirect any other routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

export default App
