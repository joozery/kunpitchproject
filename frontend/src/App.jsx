import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Admin from './pages/Admin'
import Home from './pages/Home'
import Login from './pages/Login'
import ErrorBoundary from './components/ErrorBoundary'

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
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            
            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Admin routes (protected) */}
            <Route path="/admin/*" element={<RequireAuth><Admin /></RequireAuth>} />
            
            {/* Redirect any other routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
