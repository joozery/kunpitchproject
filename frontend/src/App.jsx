import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { MessageCircle, Search as SearchIcon } from 'lucide-react'
import { FaPhone, FaLine, FaFacebookF, FaWhatsapp } from 'react-icons/fa'
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
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import Contact from './pages/Contact'
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
      {/* Floating contact icons */}
      {showContactPopup && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-4 items-center">
          {[{icon: FaPhone, color: '#b98a2c', bg: '#ffffff', href: 'tel:0812345678'},
            {icon: FaLine, color: '#b98a2c', bg: '#ffffff', href: 'https://line.me/R/ti/p/@whalespace'},
            {icon: FaFacebookF, color: '#b98a2c', bg: '#ffffff', href: 'https://facebook.com/whalespace'},
            {icon: FaWhatsapp, color: '#b98a2c', bg: '#ffffff', href: 'https://wa.me/66812345678'}].map((it, idx) => (
            <a
              key={idx}
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm"
              style={{ border: '2px solid #b98a2c', background: it.bg }}
            >
              <it.icon className="w-5 h-5" style={{ color: it.color }} />
            </a>
          ))}
        </div>
      )}
      {/* Action Buttons Section - Only show on Home page */}
      {isHomePage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center justify-center">
            {/* Main Action Buttons */}
            <div className="flex items-center space-x-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              {/* Contact Button or Contact Icons */}
              {showContactPopup ? (
                <button
                  onClick={closeContactPopup}
                  className="flex items-center space-x-2 bg-white border border-yellow-500 px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-300 font-prompt cursor-pointer"
                  style={{ color: '#243756' }}
                >
                  <span>×</span>
                  <span>ช่องทางติดต่อ</span>
                </button>
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
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/contact" element={<Contact />} />
        
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
