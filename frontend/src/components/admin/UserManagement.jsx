import React, { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { usersAPI } from '../../lib/api'

const emptyForm = { name: '', email: '', password: '', role: 'editor', is_active: true }

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

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

  if (loading) return <div className="p-6">กำลังโหลด...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 font-prompt">จัดการผู้ใช้</h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={startCreate}>สร้างผู้ใช้</Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 font-prompt">{editing ? 'แก้ไขผู้ใช้' : 'สร้างผู้ใช้ใหม่'}</h2>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">ชื่อ</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">อีเมล</label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">รหัสผ่าน {editing ? '(ปล่อยว่างถ้าไม่เปลี่ยน)' : ''}</label>
              <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">บทบาท</label>
              <select className="w-full border rounded px-3 py-2" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="viewer">viewer</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="inline-flex items-center space-x-2">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                <span>เปิดใช้งาน</span>
              </label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">บันทึก</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm) }}>ยกเลิก</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-prompt">ชื่อ</TableHead>
              <TableHead className="font-prompt">อีเมล</TableHead>
              <TableHead className="font-prompt">บทบาท</TableHead>
              <TableHead className="font-prompt">สถานะ</TableHead>
              <TableHead className="font-prompt">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell className="font-prompt">{u.name}</TableCell>
                <TableCell className="font-prompt">{u.email}</TableCell>
                <TableCell className="font-prompt">{u.role}</TableCell>
                <TableCell className="font-prompt">{u.is_active ? 'ใช้งาน' : 'ปิดการใช้งาน'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(u)}>แก้ไข</Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(u)}>ลบ</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default UserManagement

