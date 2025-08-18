import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Admin from './pages/Admin'
import Home from './pages/Home'
import Login from './pages/Login'
import PropertyDetail from './pages/PropertyDetail'
import ListProperty from './pages/ListProperty'
import Consult from './pages/Consult'
import Projects from './pages/Projects'
import Join from './pages/Join'
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

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
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
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

export default App
