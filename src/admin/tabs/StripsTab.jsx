import { useState, useEffect } from 'react'
import { db, storage } from '../../firebase'
import { collection, doc, query, onSnapshot, orderBy, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'

export default function StripsTab() {
  const [strips, setStrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterName, setFilterName] = useState('')

  // Read guest photostrips in real-time
  useEffect(() => {
    const q = query(collection(db, 'photostrips'), orderBy('created_at', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setStrips(list)
      setLoading(false)
    }, (err) => {
      console.error('Failed to fetch strips:', err)
      setLoading(false)
    })

    return unsub
  }, [])

  // Delete a photostrip (Firestore + Storage cleanup)
  const handleDelete = async (strip) => {
    if (!confirm(`Are you sure you want to delete the photo strip by "${strip.guest_name || 'Guest'}"? This action cannot be undone.`)) return
    
    try {
      // 1. Delete document from Firestore
      await deleteDoc(doc(db, 'photostrips', strip.id))
      
      // 2. Delete file from Firebase Storage if path exists
      if (strip.storage_path) {
        const fileRef = ref(storage, strip.storage_path)
        await deleteObject(fileRef)
      }
      alert('Photo strip successfully deleted.')
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  // Filter list by guest name search
  const filteredStrips = strips.filter(s => 
    (s.guest_name || '').toLowerCase().includes(filterName.toLowerCase()) ||
    (s.barcode_id || '').toLowerCase().includes(filterName.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="admin-page-title" style={{ margin: 0 }}>Photo Strips Manager</h2>
          <p className="admin-page-sub" style={{ margin: '0.2rem 0 0 0' }}>View, download, or moderate guest photostrips uploaded from the reception photobooth app.</p>
        </div>
        
        {/* Search filter input */}
        <input
          type="text"
          className="admin-input"
          placeholder="Search by guest name or barcode..."
          value={filterName}
          onChange={e => setFilterName(e.target.value)}
          style={{ width: '280px', height: '40px', padding: '0 0.85rem' }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--a-muted)' }}>
          Loading wedding photostrips gallery...
        </div>
      ) : filteredStrips.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--a-muted)', padding: '5rem 0', background: 'var(--a-surface)', border: '1px solid var(--a-border)', borderRadius: '8px' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', opacity: 0.3 }}>🎞</span>
          <p>{strips.length === 0 ? 'No guest photostrips have been taken yet.' : 'No photo strips match your search filter.'}</p>
        </div>
      ) : (
        /* Strips Grid Panel */
        <div className="admin-grid-strips" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '1.5rem',
          overflowY: 'auto',
          flex: 1
        }}>
          {filteredStrips.map(strip => (
            <div key={strip.id} style={{
              background: 'var(--a-surface)',
              border: '1px solid var(--a-border)',
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {/* Thumbnail Container */}
              <div 
                onClick={() => window.open(strip.image_url, '_blank')}
                style={{ 
                  width: '100%', 
                  aspectRatio: '1/3', 
                  borderRadius: '4px', 
                  overflow: 'hidden', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  background: '#090b0e'
                }}
              >
                <img 
                  src={strip.image_url} 
                  alt={`Strip by ${strip.guest_name}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>

              {/* Text Info */}
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h4 style={{ margin: '0 0 0.15rem 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--a-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {strip.guest_name || 'Guest'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--a-accent)' }}>
                  ID: {strip.barcode_id || 'AR-2026'}
                </p>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.65rem', color: 'var(--a-muted)' }}>
                  {strip.created_at ? new Date(strip.created_at.toMillis()).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.4rem', width: '100%', marginTop: '0.25rem' }}>
                <a 
                  href={strip.image_url} 
                  download={`rex_aira_strip_${strip.guest_name}.png`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="admin-btn admin-btn-ghost admin-btn-sm" 
                  style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px', fontSize: '0.72rem' }}
                >
                  📥 Save
                </a>
                <button 
                  onClick={() => handleDelete(strip)}
                  className="admin-btn admin-btn-danger admin-btn-sm" 
                  style={{ flex: 1, height: '30px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
