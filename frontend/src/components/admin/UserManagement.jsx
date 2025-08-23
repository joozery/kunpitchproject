import React, { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { usersAPI } from '../../lib/api'
import { checkPermission, PERMISSIONS, PermissionGuard } from '../../lib/permissions'
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle,
  XCircle,
  Shield,
  User,
  Eye,
  Plus,
  Save,
  X
} from 'lucide-react'

const emptyForm = { name: '', email: '', password: '', role: 'editor', is_active: true }

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      const res = await usersAPI.getAll()
      if (res?.success) setUsers(res.data || [])
      else setUsers([])
    } catch (e) {
      setUsers([])
    } finally { setLoading(false) }
  }

  const startCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const startEdit = async (u) => {
    try {
      const res = await usersAPI.getById(u.id)
      setEditing(res?.data || u)
      const base = res?.data || u
      setForm({ name: base.name || '', email: base.email || '', password: '', role: base.role || 'editor', is_active: !!base.is_active })
      setShowForm(true)
    } catch (e) {
      setEditing(u)
      setForm({ name: u.name || '', email: u.email || '', password: '', role: u.role || 'editor', is_active: !!u.is_active })
      setShowForm(true)
    }
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'กรุณากรอกชื่อ'
    if (!form.email.trim()) e.email = 'กรุณากรอกอีเมล'
    if (!editing && !form.password) e.password = 'กรุณากรอกรหัสผ่าน'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    try {
      if (editing) {
        const payload = { name: form.name, email: form.email, role: form.role, is_active: form.is_active }
        if (form.password) payload.password = form.password
        await usersAPI.update(editing.id, payload)
      } else {
        await usersAPI.create({ name: form.name, email: form.email, password: form.password, role: form.role, is_active: form.is_active })
      }
      setShowForm(false)
      setEditing(null)
      setForm(emptyForm)
      await load()
    } catch (e) {
      alert(e.message || 'บันทึกไม่สำเร็จ')
    }
  }

  const remove = async (u) => {
    if (!confirm(`ลบผู้ใช้ ${u.email}?`)) return
    try { await usersAPI.delete(u.id); await load() } catch (e) { alert('ลบไม่สำเร็จ') }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-red-500" />
      case 'editor': return <Edit className="w-4 h-4 text-blue-500" />
      case 'viewer': return <Eye className="w-4 h-4 text-green-500" />
      default: return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleBadge = (role) => {
    const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
    switch (role) {
      case 'admin':
        return <span className={`${baseClasses} bg-red-100 text-red-700`}><Shield className="w-3 h-3" />Admin</span>
      case 'editor':
        return <span className={`${baseClasses} bg-blue-100 text-blue-700`}><Edit className="w-3 h-3" />Editor</span>
      case 'viewer':
        return <span className={`${baseClasses} bg-green-100 text-green-700`}><Eye className="w-3 h-3" />Viewer</span>
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-700`}><User className="w-3 h-3" />User</span>
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">จัดการผู้ใช้</h1>
            <p className="text-sm text-gray-600">จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึง</p>
          </div>
        </div>
        <PermissionGuard permission={PERMISSIONS.USER_CREATE}>
          <Button 
            onClick={startCreate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            สร้างผู้ใช้
          </Button>
        </PermissionGuard>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="ค้นหาผู้ใช้..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-200 rounded-md bg-white focus:border-blue-500 focus:ring-blue-500 appearance-none"
          >
            <option value="all">ทุกบทบาท</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              {editing ? <Edit className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-green-600" />}
              {editing ? 'แก้ไขผู้ใช้' : 'สร้างผู้ใช้ใหม่'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm) }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">ชื่อผู้ใช้</label>
                <Input 
                  value={form.name} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="กรอกชื่อผู้ใช้"
                />
                {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" />{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">อีเมล</label>
                <Input 
                  type="email" 
                  value={form.email} 
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="example@email.com"
                />
                {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" />{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  รหัสผ่าน {editing && <span className="text-gray-500 font-normal">(ปล่อยว่างถ้าไม่เปลี่ยน)</span>}
                </label>
                <Input 
                  type="password" 
                  value={form.password} 
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" />{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">บทบาท</label>
                <select 
                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  value={form.role} 
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                >
                  <option value="admin">Admin - ผู้ดูแลระบบ</option>
                  <option value="editor">Editor - ผู้แก้ไข</option>
                  <option value="viewer">Viewer - ผู้ดู</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input 
                type="checkbox" 
                id="is_active"
                checked={form.is_active} 
                onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                เปิดใช้งานบัญชีนี้
              </label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                {editing ? 'อัปเดต' : 'สร้างผู้ใช้'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm) }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                ยกเลิก
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Users Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-lg font-semibold text-gray-900">รายชื่อผู้ใช้ ({filteredUsers.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-700">ผู้ใช้</TableHead>
                <TableHead className="font-semibold text-gray-700">อีเมล</TableHead>
                <TableHead className="font-semibold text-gray-700">บทบาท</TableHead>
                <TableHead className="font-semibold text-gray-700">สถานะ</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">ไม่พบผู้ใช้</p>
                    <p className="text-sm">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(u => (
                  <TableRow key={u.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.name}</p>
                          <p className="text-sm text-gray-500">ID: {u.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-900">{u.email}</p>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(u.role)}
                    </TableCell>
                    <TableCell>
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          ใช้งาน
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <XCircle className="w-3 h-3" />
                          ปิดการใช้งาน
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <PermissionGuard permission={PERMISSIONS.USER_UPDATE}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => startEdit(u)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </PermissionGuard>
                        <PermissionGuard permission={PERMISSIONS.USER_DELETE}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => remove(u)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </PermissionGuard>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

export default UserManagement

