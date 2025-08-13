import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import axios from 'axios'
import logo from '../assets/WHLE-03.png'

const API_BASE_URL = 'https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com/api'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('กรอกอีเมลและรหัสผ่าน'); return }
    try {
      setLoading(true)
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password })
      if (res?.data?.success && res.data.token) {
        localStorage.setItem('auth_token', res.data.token)
        localStorage.setItem('auth_user', JSON.stringify(res.data.user))
        const redirectTo = (location.state && location.state.from) || '/admin/dashboard'
        navigate(redirectTo, { replace: true })
      } else {
        setError('เข้าสู่ระบบไม่สำเร็จ')
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'เข้าสู่ระบบไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-8 pt-8 text-center">
            <img src={logo} alt="Whalespace Logo" className="h-12 w-auto mx-auto" />
            <h1 className="mt-4 text-2xl font-bold font-prompt text-gray-900">เข้าสู่ระบบผู้ดูแล</h1>
            <p className="text-sm text-gray-500 mt-1 font-prompt">ยินดีต้อนรับกลับ</p>
          </div>
          <form onSubmit={onSubmit} className="p-8 pt-6 space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-prompt text-gray-700">อีเมล</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">@</span>
                <Input className="pl-8" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-prompt text-gray-700">รหัสผ่าน</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">••</span>
                <Input className="pl-8" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
            {error && <div className="text-red-600 text-sm font-prompt">{error}</div>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </form>
        </div>
        <div className="text-center text-xs text-gray-400 mt-4 font-prompt">© {new Date().getFullYear()} Whalespace</div>
      </div>
    </div>
  )
}

export default Login

