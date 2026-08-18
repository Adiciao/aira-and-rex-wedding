import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useWedding } from '../context/WeddingContext'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import InfoTab   from './tabs/InfoTab'
import ImagesTab from './tabs/ImagesTab'
import RSVPTab   from './tabs/RSVPTab'
import GuestsTab from './tabs/GuestsTab'
import MessagesTab from './tabs/MessagesTab'
import StripsTab from './tabs/StripsTab'
import './admin.css'

const TABS = [
  { id: 'rsvp',     icon: '💌', label: 'RSVPs' },
  { id: 'guests',   icon: '👥', label: 'Guest List' },
  { id: 'messages', icon: '💬', label: 'Messages' },
  { id: 'strips',   icon: '🎞',  label: 'Strips Images' },
  { id: 'info',     icon: '✏️',  label: 'Wedding Info' },
  { id: 'images',   icon: '🖼',  label: 'Images' },
]

export default function AdminDashboard({ onLogout }) {
  const { bride, groom, rsvps } = useWedding()
  const [tab, setTab] = useState('rsvp')
  const [unreadChats, setUnreadChats] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [, setSearchParams] = useSearchParams()

  const attending = rsvps.filter(r => r.attending === 'yes').length

  // Query unread chats count in real-time
  useEffect(() => {
    const q = query(collection(db, 'chats'), where('unread_admin', '==', true))
    const unsub = onSnapshot(q, (snap) => {
      setUnreadChats(snap.size)
    }, (err) => console.error(err))
    return unsub
  }, [])

  return (
    <div className="admin-shell">
      {/* Mobile Header Bar */}
      <div className="admin-mobile-header">
        <button 
          className="admin-mobile-menu-toggle" 
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
        <span className="admin-mobile-header-title">{groom} &amp; {bride} Admin</span>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="admin-sidebar-backdrop" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-logo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>{groom} &amp; {bride}</h1>
              <p>Admin Dashboard</p>
            </div>
            <button 
              className="admin-sidebar-close" 
              onClick={() => setSidebarOpen(false)}
              style={{ display: 'none', background: 'none', border: 'none', color: 'var(--a-muted)', fontSize: '1.25rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>

        <nav className="admin-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`admin-nav-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => { setTab(t.id); setSidebarOpen(false); setSearchParams({}); }}
            >
              <span className="icon">{t.icon}</span>
              {t.label}
              
              {t.id === 'rsvp' && rsvps.length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'rgba(201,169,110,0.2)', color: 'var(--a-accent)', borderRadius: 99, padding: '0.1rem 0.55rem', fontSize: '0.72rem', fontWeight: 600 }}>
                  {rsvps.length}
                </span>
              )}

              {t.id === 'messages' && unreadChats > 0 && (
                <span style={{ marginLeft: 'auto', background: '#e07070', color: 'white', borderRadius: 99, padding: '0.1rem 0.55rem', fontSize: '0.72rem', fontWeight: 600 }}>
                  {unreadChats}
                </span>
              )}
            </button>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid var(--a-border)', margin: '1rem 0' }} />

          <a href="/" target="_blank" className="admin-nav-btn" style={{ textDecoration: 'none', color: 'var(--a-muted)' }} onClick={() => setSidebarOpen(false)}>
            <span className="icon">↗</span>
            View Live Site
          </a>
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <div style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'rgba(126,200,154,0.08)', border: '1px solid rgba(126,200,154,0.15)', borderRadius: 6 }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--a-success)', marginBottom: '0.15rem', fontWeight: 500 }}>● Live</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--a-muted)' }}>{attending} guests confirmed</p>
          </div>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={() => { sessionStorage.removeItem('wedding_admin'); onLogout(); setSidebarOpen(false); setSearchParams({}); }}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {tab === 'info'     && <InfoTab />}
        {tab === 'images'   && <ImagesTab />}
        {tab === 'rsvp'     && <RSVPTab />}
        {tab === 'guests'   && <GuestsTab />}
        {tab === 'messages' && <MessagesTab />}
        {tab === 'strips'   && <StripsTab />}
      </main>
    </div>
  )
}
