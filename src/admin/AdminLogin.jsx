import { useState } from 'react'
import { useWedding } from '../context/WeddingContext'
import './admin.css'

export default function AdminLogin({ onLogin }) {
  const { adminPassword } = useWedding()
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    if (pass === adminPassword) {
      sessionStorage.setItem('wedding_admin', '1')
      onLogin()
    } else {
      setError('Incorrect password. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--a-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '2.5rem', fontWeight: 300, color: 'var(--a-accent)', marginBottom: '0.25rem' }}>
            Admin
          </div>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--a-muted)' }}>
            Wedding E-Invitation
          </p>
        </div>

        <form onSubmit={submit} style={{ background: 'var(--a-surface)', border: '1px solid var(--a-border)', borderRadius: 10, padding: '2.5rem' }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--a-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
            Enter admin password to continue
          </p>

          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-pass">Password</label>
            <input
              id="admin-pass"
              type="password"
              className="admin-input"
              value={pass}
              onChange={e => { setPass(e.target.value); setError('') }}
              placeholder="••••••••••"
              autoFocus
            />
            {error && (
              <p style={{ color: 'var(--a-danger)', fontSize: '0.78rem', marginTop: '0.5rem' }}>{error}</p>
            )}
          </div>

          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--a-muted)' }}>
          Default password: <code style={{ color: 'var(--a-accent)', background: 'rgba(201,169,110,0.1)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>admin2026</code>
        </p>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="/" style={{ fontSize: '0.75rem', color: 'var(--a-muted)', textDecoration: 'none' }}>
            ← Back to wedding site
          </a>
        </div>
      </div>
    </div>
  )
}
