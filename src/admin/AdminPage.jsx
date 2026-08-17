import { useState, useEffect } from 'react'
import AdminLogin     from './AdminLogin'
import AdminDashboard from './AdminDashboard'

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('wedding_admin') === '1')

  useEffect(() => {
    document.body.classList.add('admin-mode')
    return () => document.body.classList.remove('admin-mode')
  }, [])

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />
  return <AdminDashboard onLogout={() => setAuthed(false)} />
}
